const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    questionText: { type: String, required: true }, // nội dung câu hỏi

    questionType: {
      type: String,
      enum: ["mcq", "fill_blank", "essay", "speaking"],
      required: true,
    },

    // Chỉ dùng cho MCQ
    options: [
      {
        optionText: { type: String, required: true }, // ví dụ: "Paris"
        isCorrect: { type: Boolean, default: false }, // true nếu là đáp án đúng
      },
    ],

    audioUrl: { type: String, trim: true }, // listening
    imageUrl: { type: String, trim: true }, // hình minh họa
    points: { type: Number, default: 1 },
    descriptions: { type: String, trim: true }, // mô tả chi tiết cho câu hỏi hình ảnh

    skill: {
      type: String,
      enum: [
        "Grammar",
        "Vocabulary",
        "Reading",
        "Listening",
        "Speaking",
        "Writing",
      ],
    },
    topic: [{ type: String, trim: true }],
    tag: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
