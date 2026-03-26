const { getEmbedding } = require("./embeddingService");

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memory`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.addOrUpdate = async (key, value, callback) => {
  try {
    const text = `${key} ${value}`;
    console.log("Generating embedding for:", text);

    const embedding = await getEmbedding(text);

    console.log("Embedding length:", embedding.length); // 👈 debug

    db.run(
      `INSERT INTO memory (key, value, embedding)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET 
       value=excluded.value,
       embedding=excluded.embedding,
       updated_at=CURRENT_TIMESTAMP`,
      [key, value, JSON.stringify(embedding)],
      callback
    );
  } catch (err) {
    console.error("Embedding error:", err); // 👈 IMPORTANT
    callback(err);
  }
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM memory WHERE id=?`, [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};