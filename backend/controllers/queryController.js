const { getEmbedding } = require("../services/embeddingService");
const { cosineSimilarity } = require("../utils/similarity");
const { callLLM } = require("../services/llmService");
const db = require("../db/db");

exports.query = async (req, res) => {
  const { question } = req.body;

  try {
    console.log("QUESTION:", question);

    // 1️⃣ Get query embedding
    const queryEmbedding = await getEmbedding(question);

    if (!queryEmbedding) {
      return res.send({ answer: "Embedding service unavailable" });
    }

    // 2️⃣ Fetch all memory
    db.all(`SELECT * FROM memory`, [], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      if (!rows.length) {
        return res.send({ answer: "No data available" });
      }

      const q = question.toLowerCase();

      // 3️⃣ Score each row (HYBRID)
      const scored = rows
        .filter((row) => row.embedding) // skip old rows
        .map((row) => {
          const emb = JSON.parse(row.embedding);

          // semantic similarity
          const simScore = cosineSimilarity(queryEmbedding, emb);

          // keyword boost
          const key = row.key.toLowerCase();
          const value = row.value.toLowerCase();

          let keywordBoost = 0;

          if (q.includes(key)) keywordBoost += 0.25;
          if (key.includes(q)) keywordBoost += 0.15;
          if (q.includes(value)) keywordBoost += 0.1;

          return {
            ...row,
            score: simScore + keywordBoost,
            simScore,
            keywordBoost,
          };
        });

      if (!scored.length) {
        return res.send({ answer: "No data available" });
      }

      // 4️⃣ Sort & take top K
      const topK = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 1);

      console.log("TOP MATCHES:", topK.map(t => ({
        key: t.key,
        score: t.score.toFixed(3)
      })));

      // 5️⃣ Threshold check (avoid wrong answers)
      if (topK[0].score < 0.6) {
        return res.send({ answer: "No relevant data found" });
      }

      // 6️⃣ Prepare context (LLM-ready)
      const context = topK
        .map((item) => `${item.key}: ${item.value}`)
        .join("\n");

/*       // 👉 CURRENT (no LLM yet)
      return res.send({
        answer: context,
      }); */

      // 🔥 FUTURE (LLM integration)
      const llmResponse = await callLLM({
        question,
        context,
      });

      return res.send({
        answer: llmResponse,
      });

    });

  } catch (err) {
    console.error("QUERY ERROR:", err);
    res.status(500).send(err);
  }
};