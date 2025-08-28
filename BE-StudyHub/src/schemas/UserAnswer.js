const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestAttempt",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    selectedOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnswerOption",
    }, // cho MCQ
    answerText: { type: String, trim: true }, // essay/speaking
    isCorrect: { type: Boolean },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
