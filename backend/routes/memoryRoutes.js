const express = require("express");
const router = express.Router();
const controller = require("../controllers/memoryController");

router.post("/", controller.addOrUpdate);
router.get("/", controller.getAll);
router.delete("/:id", controller.delete);

module.exports = router;