import React, { useState } from "react";
import BookIcon from "@mui/icons-material/Book";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StreamIcon from "@mui/icons-material/Stream";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HeaderHome from "./HeaderHome";
import DailyLessonsChart from "../../components/DailyLessonsChart";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("lessons");
  return (
    <div className="flex-1">
      {/* Welcome Card */}
      <HeaderHome />

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
            <p className="text-lg font-bold text-gray-800">59 Lessons</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <CalendarMonthIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Current Streak</h3>
            <p className="text-lg font-bold text-gray-800">0 days</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <StreamIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Longest Streak</h3>
            <p className="text-lg font-bold text-gray-800">5 days</p>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow">
            <AccessTimeIcon className="mx-auto mb-2 text-blue-500" />
            <h3 className="text-sm text-gray-600">Study Time This Month</h3>
            <p className="text-lg font-bold text-gray-800">10h 10m</p>
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
          <DailyLessonsChart />
        </div>
      </div>
    </div>
  );
}
