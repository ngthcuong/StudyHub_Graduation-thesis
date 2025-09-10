import {
  Button,
  Container,
  Avatar,
  Badge,
  Box,
  MenuItem,
  Menu,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardOutlined,
  LogoutOutlined,
  PersonOutline,
  SettingsOutlined,
} from "@mui/icons-material";
import { logout } from "../redux/slices/auth";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (user) {
    // Đã đăng nhập
    return (
      <header className="border-b border-gray-200 bg-white">
        <Container maxWidth="lg" className="pb-2 pt-3">
          <Box className="flex items-center justify-between">
            <Box>
              <div className="font-bold text-2xl mb-1">
                Welcome back, {user.fullName}!
              </div>
              <div className="text-gray-500 text-base">
                Ready to continue your English learning journey?
              </div>
            </Box>
            <Box className="flex items-center gap-6">
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <NotificationsNoneIcon sx={{ fontSize: 28 }} />
              </Badge>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    bgcolor: "#2563eb",
                    width: 40,
                    height: 40,
                    fontWeight: 700,
                    fontSize: 22,
                    cursor: "pointer",
                  }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setAnchorEl(null);
                    }}
                  >
                    <PersonOutline sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      setAnchorEl(null);
                    }}
                  >
                    <DashboardOutlined sx={{ mr: 1 }} /> Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/settings");
                      setAnchorEl(null);
                    }}
                  >
                    <SettingsOutlined sx={{ mr: 1 }} /> Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      setAnchorEl(null);
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <LogoutOutlined sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Container>
      </header>
    );
  }

  // Chưa đăng nhập
  return (
    <header className="border-b border-gray-200">
      <Container
        maxWidth="lg"
        className="flex items-center justify-between py-4"
      >
        <div className="font-bold text-2xl">Logo</div>
        <nav className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Courses
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            About us
          </a>
          <Button
            variant="outlined"
            className="!rounded-lg px-4 py-1 ml-2"
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
          <Button
            variant="contained"
            className="!rounded-lg px-4 py-1 ml-2"
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
