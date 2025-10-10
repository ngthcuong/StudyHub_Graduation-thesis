// models/StudyStats.js

const mongoose = require("mongoose");

const studyStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Đảm bảo mỗi user chỉ có 1 bản ghi thống kê
    },
    // Số bài học hoàn thành
    completedLessons: {
      type: Number,
      default: 0,
    },
    // Chuỗi ngày học liên tục hiện tại
    currentStreak: {
      type: Number,
      default: 0,
    },
    // Chuỗi ngày học liên tục dài nhất
    longestStreak: {
      type: Number,
      default: 0,
    },
    // Ngày cuối cùng người dùng thực hiện một hoạt động học tập.
    lastStudyDate: {
      type: Date,
      default: null,
    },
    // (Không cần totalStudyTimeMinutes ở đây, nó sẽ được tính từ StudyLog)
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyStats", studyStatsSchema);
