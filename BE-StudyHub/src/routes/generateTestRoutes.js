const express = require("express");
const router = express.Router();

const {
  generateTestController,
} = require("../controllers/generateTestController");

// Submit test
router.post("/", generateTestController);

module.exports = router;
