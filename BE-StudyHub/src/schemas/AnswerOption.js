const mongoose = require("mongoose");

const answerOptionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnswerOption", answerOptionSchema);
