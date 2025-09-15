const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const answerOptionController = require("../controllers/answerOptionController");

// Get options by question
router.get(
  "/question/:questionId",
  verifyToken,
  answerOptionController.getOptionsByQuestion
);

// Create option (admin)
router.post(
  "/",
  verifyToken,
  requireAdmin,
  answerOptionController.createAnswerOption
);

// Update option (admin)
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  answerOptionController.updateAnswerOption
);

// Delete option (admin)
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  answerOptionController.deleteAnswerOption
);

module.exports = router;
