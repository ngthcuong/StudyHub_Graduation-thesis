const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const userAnswerController = require("../controllers/userAnswerController");

// Submit single answer
router.post("/", verifyToken, userAnswerController.submitAnswer);

// Submit multiple answers
router.post(
  "/submit-many",
  verifyToken,
  userAnswerController.submitManyAnswers
);

// Get answers for attempt
router.get("/attempt/:attemptId", userAnswerController.getAnswersByAttempt);

// Get answers for user
// router.get("/user/:userId", userAnswerController.getAnswersByUser);

// Update answer (admin or teacher maybe)
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  userAnswerController.updateUserAnswer
);

// Delete answer
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  userAnswerController.deleteUserAnswer
);

module.exports = router;
