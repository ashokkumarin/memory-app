const axios = require("axios");

exports.callLLM = async ({ question, context }) => {
  try {
    const prompt = `
You are a helpful assistant.

Use ONLY the provided data to answer.

If answer is not present, say "No data available".

Data:
${context}

Question:
${question}

Answer:
`;

    const res = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
      model: process.env.OLLAMA_LLM_MODEL || "phi3",
      prompt,
      stream: false,
    });

    return res.data.response || "No response from model";
  } catch (err) {
    console.error("LLM ERROR:", err);
    return "Error generating response";
  }
};