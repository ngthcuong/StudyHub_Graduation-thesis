const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

const {
  generateTestController,
} = require("../controllers/generateTestController");

// Submit test
router.post("/", verifyToken, generateTestController);

module.exports = router;
