const axios = require("axios");

exports.getEmbedding = async (text) => {
/*   const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  }); */
  const res = await axios.post(`${process.env.OLLAMA_URL}/api/embeddings`, {
    model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
    prompt: text,
  });

  // const data = await res.json();

  //console.log("Embedding API response:", res.data); // 👈 debug

  return res.data.embedding;
};