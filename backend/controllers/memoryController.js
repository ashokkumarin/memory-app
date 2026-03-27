const service = require("../services/memoryService");

exports.addOrUpdate = async (req, res) => {
  const { key, value } = req.body;

  try {
    await service.addOrUpdate(key, value);
    res.send({ success: true });
  } catch (err) {
    console.error("ADD/UPDATE ERROR:", err);
    res.status(500).send(err.message || err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.send(data);
  } catch (err) {
    console.error("GET /memory error:", err);
    res.status(500).send(err);
  }
};

exports.delete = async (req, res) => {
  try {
    await service.delete(req.params.id);
    res.send({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send(err.message || err);
  }
};

