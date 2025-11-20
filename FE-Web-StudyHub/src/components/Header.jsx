import {
  Button,
  Container,
  Avatar,
  Box,
  MenuItem,
  Menu,
  Divider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  DashboardOutlined,
  LogoutOutlined,
  PersonOutline,
  SettingsOutlined,
  Verified,
  ArrowBack,
} from "@mui/icons-material";
import { logout } from "../redux/slices/auth";

const Header = ({ title, subtitle, disableBack = false, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);

  const isHomePage = location.pathname.startsWith("/home");
  const showBackButton = !isHomePage && !!user && !disableBack;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    const historyIndex = window.history.state?.idx ?? 0;
    if (historyIndex > 0) {
      navigate(-1);
    } else {
      navigate("/home/dashboard");
    }
  };

  if (user) {
    // Đã đăng nhập
    return (
      <header className="border rounded-lg border-gray-200 bg-white mb-3 max-w-6xl w-full mx-auto">
        <Container maxWidth="lg" className="pb-2 pt-3">
          <Box className="flex items-center justify-between">
            <Box>
              {showBackButton ? (
                <Button
                  variant="text"
                  size="large"
                  onClick={handleBack}
                  startIcon={<ArrowBack fontSize="large" />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 20,
                    px: 0,
                  }}
                >
                  Back
                </Button>
              ) : (
                <>
                  <div className="font-bold text-2xl mb-1">
                    {title ? title : `Welcome back, ${user.fullName}!`}
                  </div>
                  <div className="text-gray-500 text-base">
                    {subtitle ||
                      "Ready to continue your English learning journey?"}
                  </div>
                </>
              )}
            </Box>
            <Box className="flex items-center gap-6">
              {showBackButton && (
                <Typography variant="h6" fontWeight={600}>
                  {user.fullName}
                </Typography>
              )}
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
                      navigate("/home/profile");
                      setAnchorEl(null);
                    }}
                  >
                    <PersonOutline sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/home/dashboard");
                      setAnchorEl(null);
                    }}
                  >
                    <DashboardOutlined sx={{ mr: 1 }} /> Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/verify-certificate");
                      setAnchorEl(null);
                    }}
                  >
                    <Verified sx={{ mr: 1 }} /> Verify Certificate
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/home/settings");
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
    <header className="border rounded-lg border-gray-200 bg-white mb-3">
      <Container
        maxWidth="lg"
        className="flex items-center justify-between py-4"
      >
        <div className="font-bold text-2xl">Logo</div>
        <nav className="flex items-center gap-8">
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="/course" className="text-gray-700 hover:text-blue-600">
            Courses
          </a>
          <a
            href="/verify-certificate"
            className="text-gray-700 hover:text-blue-600"
          >
            Verify Certificate
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
