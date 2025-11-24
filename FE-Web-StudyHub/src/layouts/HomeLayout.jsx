import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Person } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoStudyHub from "../assets/Logo.jpg";

export default function HomeLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
      default:
        setActiveTab("dashboard");
        break;
    }
  }, [location.pathname]);

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className="w-64 bg-white h-screen fixed top-0 left-0 shadow-md py-5 z-50 flex flex-col">
        <div className="flex items-center mb-1 justify-center">
          <img
            src={LogoStudyHub}
            alt="StudyHub Logo"
            className="w-1/2 bg-cover cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="flex flex-col flex-1">
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
            Courses
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
        </nav>
        {/* Logout Button */}
        <button
          onClick={() => {
            dispatch({ type: "auth/logout" });
            navigate("/login", { replace: true });
          }}
          className="flex items-center px-5 py-2 rounded-r-md text-red-600 hover:bg-red-50 mt-auto mb-2"
        >
          <LogoutIcon className="w-4 h-4 mr-2" />
          Logout
        </button>
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
