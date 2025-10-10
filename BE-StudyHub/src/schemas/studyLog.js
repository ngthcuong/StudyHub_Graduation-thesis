// models/StudyLog.js

const mongoose = require("mongoose");

const studyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Thời lượng học trong phiên (tính bằng phút)
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson", // Hoặc bất kỳ model bài học nào của bạn
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyLog", studyLogSchema);
