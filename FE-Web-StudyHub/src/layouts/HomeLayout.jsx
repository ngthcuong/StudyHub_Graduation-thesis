import React, { Suspense, useEffect, useState } from "react";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";
import PortraitIcon from "@mui/icons-material/Portrait";
import { Person } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function HomeLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const routePart = currentPath.split("/home/")[1]?.split("/")[0];

    switch (routePart) {
      case "dashboard":
        setActiveTab("dashboard");
        break;
      case "courses":
        setActiveTab("courses");
        break;
      case "exercises":
        setActiveTab("exercises");
        break;
      case "certificates":
        setActiveTab("certificates");
        break;
      case "profile":
        setActiveTab("profile");
        break;
      case "settings":
        setActiveTab("settings");
        break;
      default:
        setActiveTab("dashboard");
        break;
    }
  }, [location.pathname]);

  return (
    <div className="flex ">
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
            onClick={() => {
              setActiveTab("dashboard");
              navigate("/home/dashboard");
            }}
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
            onClick={() => {
              setActiveTab("courses");
              navigate("/home/courses");
            }}
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
            onClick={() => {
              setActiveTab("exercises");
              navigate("/home/exercises");
            }}
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
            onClick={() => {
              setActiveTab("certificates");
              navigate("/home/certificates");
            }}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "certificates"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <EmojiEventsIcon className="w-4 h-4 mr-2" />
            Certificates
          </button>

          <button
            onClick={() => {
              setActiveTab("profile");
              navigate("/home/profile");
            }}
            className={`flex items-center px-5 py-2 rounded-r-md mb-2 ${
              activeTab === "profile"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Person className="w-4 h-4 mr-2" />
            Profile
          </button>

          <button
            onClick={() => {
              setActiveTab("settings");
              navigate("/home/settings");
            }}
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
      <div
        className="ml-64 flex-1 px-6 py-2 flex-col flex"
        fallback={<CircularProgress />}
      >
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
