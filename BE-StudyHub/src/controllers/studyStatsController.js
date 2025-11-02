const StudyStats = require("../models/studyStatsModel");

// ✅ Ghi lại hoạt động học tập trong ngày
const logStudyActivity = async (req, res) => {
  try {
    const { userId, year, month, day, exercises, lessons } = req.body;

    let stats = await StudyStats.findOne({ userId, year, month });

    if (!stats) {
      stats = new StudyStats({ userId, year, month, dailyStats: [] });
    }

    // Tìm xem ngày đó đã có log chưa
    const existingDay = stats.dailyStats.find((d) => d.day === day);

    if (existingDay) {
      existingDay.exercises = exercises || existingDay.exercises;
      existingDay.lessons = lessons || existingDay.lessons;
    } else {
      stats.dailyStats.push({ day, exercises, lessons });
    }

    await stats.save();
    res.status(200).json({ message: "Logged successfully", data: stats });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Lấy thống kê của 1 người dùng theo tháng
const getMonthlyStats = async (req, res) => {
  try {
    const { userId, year, month } = req.params;
    const stats = await StudyStats.findOne({ userId, year, month })
      .populate("dailyStats.exercises")
      .populate("dailyStats.lessons");

    if (!stats)
      return res.status(404).json({ message: "No stats found for this month" });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Xóa toàn bộ thống kê của 1 tháng (nếu cần)
const deleteMonthlyStats = async (req, res) => {
  try {
    const { userId, year, month } = req.params;
    await StudyStats.findOneAndDelete({ userId, year, month });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  logStudyActivity,
  getMonthlyStats,
  deleteMonthlyStats,
};
