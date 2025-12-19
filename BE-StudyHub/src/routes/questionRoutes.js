const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const questionController = require("../controllers/questionController");

// ==========================================
// 1. STATIC ROUTES (Các đường dẫn cố định)
// ==========================================

// Create question (admin)
router.post("/", verifyToken, requireAdmin, questionController.createQuestion);

// ✅ Create multiple questions (admin)
router.post("/bulk", questionController.createManyQuestions);

// ✅ Update multiple questions
// QUAN TRỌNG: Dòng này bắt buộc phải nằm TRÊN dòng router.put("/:questionId", ...)
router.put("/update-bulk", verifyToken, questionController.updateManyQuestions);

// Filter questions
router.post("/filter", questionController.getQuestionsByTestLevelAndCreator);

// ==========================================
// 2. SPECIFIC PREFIX ROUTES (Có tiền tố test/attempt)
// ==========================================

// Get questions by test
router.get("/test/:testId", questionController.getQuestionsByTest);

// GET /questions/attempt/:attemptId
router.get("/attempt/:attemptId", questionController.getQuestionsByAttemptId);

// ==========================================
// 3. DYNAMIC ID ROUTES (Các đường dẫn tham số - Đặt cuối cùng)
// ==========================================
// Lưu ý: Mọi thứ khớp với /... sẽ được coi là :questionId nếu xuống đến đây

// Get question by ID
router.get("/:questionId", questionController.getQuestionById);

// Update question by ID
router.put("/:questionId", verifyToken, questionController.updateQuestionById);

// Delete question by ID
router.delete(
  "/:questionId",
  verifyToken,
  questionController.deleteQuestionById
);

module.exports = router;
