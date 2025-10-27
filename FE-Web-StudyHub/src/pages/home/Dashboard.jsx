import React, { useState, useEffect } from "react";
import BookIcon from "@mui/icons-material/Book";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StreamIcon from "@mui/icons-material/Stream";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DailyLessonsChart from "../../components/DailyLessonsChart";
import DailyStudyTimeChart from "../../components/DailyStudyTimeChart";
import { useGetStudyStatsQuery } from "../../services/StudyStatsApi";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("lessons");

  const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
  const currentYear = new Date().getFullYear();

  const { data, isLoading } = useGetStudyStatsQuery(
    { month: currentMonth, year: currentYear },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    }
  );

  function normalizeTimeString(str) {
    const match = str?.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
    if (!match) return str; // không đúng format thì trả lại nguyên

    let hours = parseInt(match[1]);
    let minutes = parseInt(match[2]);
    let seconds = parseInt(match[3]);

    // Chuẩn hóa lại thời gian
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${hours}h ${minutes}m`; // bỏ giây luôn
  }

  useEffect(() => {
    if (data) {
      console.log("✅ Dữ liệu mới nhất:", data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1">
      {/* Welcome Card */}

      {/* Overview Cards */}
      <div className="bg-white p-6 rounded-xl shadow-md  mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Learning Overview
        </h2>
        <p className="text-sm text-gray-600">
          Track your learning progress over the past 30 days
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          <div className="text-center p-4 rounded-lg bg-white shadow">
            <BookIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Completed Lessons</h3>
            <p className="text-lg font-bold text-gray-800">
              {data?.data?.completedLessons || 0} Lessons
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <CalendarMonthIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Current Streak</h3>
            <p className="text-lg font-bold text-gray-800">
              {data?.data?.currentStreak || 0} days
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <StreamIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Longest Streak</h3>
            <p className="text-lg font-bold text-gray-800">
              {data?.data?.longestStreak || 0} days
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <AccessTimeIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Study Time This Month</h3>
            <p className="text-lg font-bold text-gray-800">
              {normalizeTimeString(data?.data?.studyTimeThisMonth) || "0h 0m"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              activeTab === "lessons"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Completed Lessons
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              activeTab === "time"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Study Time
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {activeTab === "lessons"
              ? "Daily Lessons Completed"
              : "Daily Study Time"}
          </h3>
          {activeTab === "lessons" ? (
            <DailyLessonsChart data={data?.data?.dailyStats} />
          ) : (
            <DailyStudyTimeChart data={data?.data?.dailyStats} />
          )}
        </div>
      </div>
    </div>
  );
}
