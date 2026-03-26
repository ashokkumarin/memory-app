const { getEmbedding } = require("../services/embeddingService");
const { cosineSimilarity } = require("../utils/similarity");
const db = require("../db/db");

exports.query = async (req, res) => {
  const { question } = req.body;

  try {
    const queryEmbedding = await getEmbedding(question);

    db.all(`SELECT * FROM memory`, [], (err, rows) => {
      if (err) return res.status(500).send(err);

      let bestMatch = null;
      let bestScore = -1;

      rows.forEach((row) => {
        if (!row.embedding) return;

        const emb = JSON.parse(row.embedding);
        const score = cosineSimilarity(queryEmbedding, emb);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = row;
        }
      });

      if (!bestMatch || bestScore < 0.7) {
        return res.send({ answer: "No data available" });
      }

      return res.send({
        answer: `${bestMatch.key}: ${bestMatch.value}`,
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
};