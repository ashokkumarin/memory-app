const express = require("express");
const router = express.Router();
const controller = require("../controllers/queryController");

router.post("/", controller.query);

module.exports = router;