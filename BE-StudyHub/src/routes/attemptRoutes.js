const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const attemptController = require("../controllers/attemptController");

// Start attempt
router.post("/", verifyToken, attemptController.startAttempt);

// Submit attempt (by attemptId)
router.post("/:attemptId/submit", attemptController.submitAttempt);

// Get attempt by id
router.get("/:attemptId", attemptController.getAttemptById);

// Get attempts by user
router.get("/user/:userId", attemptController.getAttemptsByUser);

// GET /attempts/test/:testId
router.get("/test/:testId", attemptController.getAttemptByTest);

module.exports = router;
