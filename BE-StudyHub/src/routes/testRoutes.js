const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const testController = require("../controllers/testController");

// Admin creates test
router.post("/", verifyToken, requireAdmin, testController.createTest);

// Get all tests
router.get("/", verifyToken, testController.getAllTests);

// Get test detail
router.get("/:testId", verifyToken, testController.getTestById);

// Update test (admin)
router.put(
  "/:testId",
  verifyToken,
  requireAdmin,
  testController.updateTestById
);

// Delete test (admin)
router.delete(
  "/:testId",
  verifyToken,
  requireAdmin,
  testController.deleteTestById
);

module.exports = router;
