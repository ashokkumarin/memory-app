const service = require("../services/memoryService");

exports.addOrUpdate = async (req, res) => {
  const { key, value } = req.body;

  service.addOrUpdate(key, value, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
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

exports.delete = (req, res) => {
  service.delete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
};

