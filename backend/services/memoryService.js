const db = require("../db/db"); // ✅ FIX

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memory`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.addOrUpdate = async (key, value) => {
  const { getEmbedding } = require("./embeddingService");

  const text = `Key: ${key}. Value: ${value}. This is a stored memory.`;
  const embedding = await getEmbedding(text);

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO memory (key, value, embedding)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET 
       value=excluded.value,
       embedding=excluded.embedding,
       updated_at=CURRENT_TIMESTAMP`,
      [key, value, JSON.stringify(embedding)],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM memory WHERE id=?`, [id], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};