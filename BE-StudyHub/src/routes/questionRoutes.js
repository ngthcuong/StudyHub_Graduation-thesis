const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const questionController = require("../controllers/questionController");

// Create question (admin)
router.post("/", verifyToken, requireAdmin, questionController.createQuestion);

// ✅ Create multiple questions (admin)
router.post(
  "/bulk",
  verifyToken,
  requireAdmin,
  questionController.createManyQuestions
);

// Get questions by test
router.get("/test/:testId", questionController.getQuestionsByTest);

//Get question by ID
router.get("/:questionId", questionController.getQuestionById);

// Update question
router.put(
  "/:questionId",
  verifyToken,
  requireAdmin,
  questionController.updateQuestionById
);

// Delete question
router.delete(
  "/:questionId",
  verifyToken,
  requireAdmin,
  questionController.deleteQuestionById
);

module.exports = router;
