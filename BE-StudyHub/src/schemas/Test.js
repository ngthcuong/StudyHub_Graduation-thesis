const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    topic: {
      type: String,
      required: true,
      trim: true,
    }, // chủ điểm bài kiểm tra
    skill: {
      type: String,
      enum: [
        "reading",
        "listening",
        "speaking",
        "writing",
        "vocabulary",
        "grammar",
      ],
      required: true,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    durationMin: { type: Number, required: true }, // thời gian làm bài (phút)
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }, // liên kết test với course
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // teacher/admin
    numQuestions: { type: Number, default: 10 }, // số lượng câu hỏi
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questionTypes: [
      {
        type: String,
        enum: ["multiple_choice", "fill_in_blank", "rearrange", "essay"],
        required: true,
      },
    ],
    examType: {
      type: String,
      enum: ["TOEIC", "IELTS"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
