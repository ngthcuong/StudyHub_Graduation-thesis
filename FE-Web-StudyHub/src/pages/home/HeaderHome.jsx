import { useState, useRef, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function HeaderHome() {
  const [isOpenAvatar, setIsOpenAvatar] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "course", text: "New lesson available in English Grammar" },
    { id: 2, type: "system", text: "System maintenance scheduled tomorrow" },
    { id: 3, type: "course", text: "You have an upcoming test on Friday" },
  ]);

  const avatarRef = useRef(null);
  const notiRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        notiRef.current &&
        !notiRef.current.contains(event.target)
      ) {
        setIsOpenAvatar(false);
        setIsOpenNoti(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm mở thông báo
  const handleOpenNotifications = () => {
    setIsOpenNoti(!isOpenNoti);
    setIsOpenAvatar(false);

    // Khi click chuông → reset thông báo
    if (notifications.length > 0) {
      setNotifications([]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center justify-between relative">
      {/* Bên trái */}
      <div>
        <h2 className="text-2xl font-semibold">Welcome back, Sarah!</h2>
        <p className="text-gray-600">
          Ready to continue your English learning journey?
        </p>
      </div>

      {/* Bên phải */}
      <div className="flex items-center space-x-4">
        {/* Nút chuông */}
        <div className="relative" ref={notiRef}>
          <IconButton color="inherit" onClick={handleOpenNotifications}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {isOpenNoti && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                Notifications
              </h3>

              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  No new notifications 🎉
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((noti) => (
                    <div
                      key={noti.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <span
                        className={`mr-2 px-2 py-0.5 rounded text-xs ${
                          noti.type === "course"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {noti.type === "course" ? "Course" : "System"}
                      </span>
                      {noti.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative" ref={avatarRef}>
          <img
            src="https://fastly.picsum.photos/id/50/4608/3072.jpg?hmac=E6WgCk6MBOyuRjW4bypT6y-tFXyWQfC_LjIBYPUspxE"
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
            onClick={() => {
              setIsOpenAvatar(!isOpenAvatar);
              setIsOpenNoti(false);
            }}
          />

          {isOpenAvatar && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <a
                href="#profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <PersonIcon className="inline mr-2" />
                Personal Info
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <SettingsIcon className="inline mr-2" />
                Settings
              </a>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => alert("Logged out")}
              >
                <LogoutIcon className="inline mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
