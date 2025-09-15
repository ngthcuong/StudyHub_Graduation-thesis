import React, { useState } from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";
import PortraitIcon from "@mui/icons-material/Portrait";
import Dashboard from "../pages/home/Dashboard";
import Courses from "../pages/home/Courses";
import Exercises from "../pages/home/Exercises";
import Achievements from "../pages/home/Achievements";
import Settings from "../pages/home/Settings";
import CourseList from "../pages/course/CourseList";
import TestList from "../pages/test/TestList";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "courses":
        return <CourseList />;
      case "exercises":
        return <TestList />;
      case "achievements":
        return <Achievements />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-white h-screen fixed top-0 left-0 shadow-md py-5 z-50">
        <h2 className="flex items-center text-xl font-semibold mb-6 px-5">
          <PortraitIcon className="w-8 h-8 mr-2 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">StudyHub</span>
            <span className="text-xs text-gray-500">Student Portal</span>
          </div>
        </h2>

        <nav className="flex flex-col">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "dashboard"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <HomeFilledIcon className="w-4 h-4 mr-2" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "courses"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DriveFileMoveIcon className="w-4 h-4 mr-2" />
            My Courses
          </button>

          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "exercises"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DescriptionIcon className="w-4 h-4 mr-2" />
            Exercises
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "achievements"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <EmojiEventsIcon className="w-4 h-4 mr-2" />
            Achievements
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-5 py-2 rounded-r-md ${
              activeTab === "settings"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </button>
        </nav>
      </div>

      {/* Nội dung hiển thị */}
      <div className="ml-64 flex-1 p-6">{renderContent()}</div>
    </div>
  );
}
