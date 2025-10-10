const mongoose = require("mongoose");
const StudyStats = require("../schemas/studyStats");
const StudyLog = require("../schemas/studyLog");
const dayjs = require("dayjs");

const getStudyStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 🗓 Nhận month & year từ query (VD: /study/stats?month=10&year=2025)
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    // Nếu không có query, mặc định là tháng hiện tại
    const targetMonth = !isNaN(month) ? month : dayjs().month() + 1; // month trong dayjs là 0-index
    const targetYear = !isNaN(year) ? year : dayjs().year();

    const startOfMonth = dayjs(`${targetYear}-${targetMonth}-01`).startOf(
      "month"
    );
    const endOfMonth = startOfMonth.endOf("month");

    // 1️⃣ Lấy toàn bộ log trong tháng đó
    const logs = await StudyLog.find({
      user: userId,
      date: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
    }).sort({ date: 1 });

    if (!logs.length) {
      return res.json({
        message: `No study logs found for ${targetMonth}/${targetYear}`,
        data: {
          completedLessons: 0,
          currentStreak: 0,
          longestStreak: 0,
          studyTimeThisMonth: "0h 0m",
          studyTimeThisMonthMinutes: 0,
          dailyStats: [],
        },
      });
    }

    // 2️⃣ Tính tổng bài học & thời gian học trong tháng
    const completedLessons = new Set(logs.map((l) => l.lesson?.toString()))
      .size;
    const studyTimeThisMonthMinutes = logs.reduce(
      (acc, l) => acc + (l.durationMinutes || 0),
      0
    );
    const hours = Math.floor(studyTimeThisMonthMinutes / 60);
    const minutes = studyTimeThisMonthMinutes % 60;
    const studyTimeThisMonth = `${hours}h ${minutes}m`;

    // 3️⃣ Tính streak trong tháng
    let currentStreak = 0;
    let longestStreak = 0;

    const dates = [
      ...new Set(logs.map((l) => dayjs(l.date).format("YYYY-MM-DD"))),
    ].sort();

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const prev = dayjs(dates[i - 1]);
        const curr = dayjs(dates[i]);
        const diff = curr.diff(prev, "day");

        if (diff === 1) currentStreak++;
        else if (diff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    // 4️⃣ Tổng hợp theo ngày (để hiển thị biểu đồ)
    const dailyStats = [];
    const daysInMonth = endOfMonth.date();
    let cumulativeTime = 0; // 👉 thêm biến tích lũy

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = dayjs(`${targetYear}-${targetMonth}-${d}`).format(
        "YYYY-MM-DD"
      );
      const dayLogs = logs.filter((l) => dayjs(l.date).isSame(dateStr, "day"));

      const totalLessons = new Set(dayLogs.map((l) => l.lesson?.toString()))
        .size;
      const totalTime = dayLogs.reduce(
        (acc, l) => acc + (l.durationMinutes || 0),
        0
      );

      cumulativeTime += totalTime; // 👉 cộng dồn theo ngày

      dailyStats.push({
        date: dateStr,
        completedLessons: totalLessons,
        studyTimeMinutes: totalTime,
        cumulativeStudyTimeMinutes: cumulativeTime, // 👉 thêm trường mới
      });
    }

    // ✅ Trả kết quả
    res.status(200).json({
      message: `Get Study Stats for ${targetMonth}/${targetYear} Successfully`,
      data: {
        month: targetMonth,
        year: targetYear,
        completedLessons,
        currentStreak,
        longestStreak,
        studyTimeThisMonth,
        studyTimeThisMonthMinutes,
        dailyStats,
      },
    });
  } catch (error) {
    console.error("Error getting study stats:", error);
    res.status(500).json({ error: "Failed to get study stats" });
  }
};

// 🧠 Ghi log học tập (khi user hoàn thành 1 bài)
const logStudySession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lessonId, durationMinutes } = req.body;

    if (!lessonId || !durationMinutes) {
      return res
        .status(400)
        .json({ error: "lessonId and durationMinutes are required" });
    }

    // 📝 Tạo log mới
    const newLog = await StudyLog.create({
      user: userId,
      lesson: lessonId,
      durationMinutes,
      date: new Date(),
    });

    res.status(201).json({
      message: "Study session logged successfully",
      data: newLog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log study session" });
  }
};

module.exports = { getStudyStats, logStudySession };
