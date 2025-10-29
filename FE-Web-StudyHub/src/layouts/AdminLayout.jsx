import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  EmojiEvents as CertificateIcon,
  Quiz as TestIcon,
  RateReview as ReviewIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    {
      text: "Certificate",
      icon: <CertificateIcon />,
      path: "/admin/certificate",
    },
    { text: "Test", icon: <TestIcon />, path: "/admin/test" },
    { text: "Review", icon: <ReviewIcon />, path: "/admin/review" },
    { text: "Course", icon: <MenuBookIcon />, path: "/admin/course" },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 64,
            boxSizing: "border-box",
            transition: "width 0.3s",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
            minHeight: 64,
          }}
        >
          {open && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1976d2" }}
              >
                Admin Dashboard
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                System Management
              </Typography>
            </Box>
          )}
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor: isActive(item.path)
                    ? "#1976d2"
                    : "transparent",
                  color: isActive(item.path) ? "#ffffff" : "#666",
                  "&:hover": {
                    backgroundColor: isActive(item.path)
                      ? "#1565c0"
                      : "#f5f5f5",
                  },
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: isActive(item.path) ? "#ffffff" : "#666",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? drawerWidth : 64}px)`,
          transition: "width 0.3s",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
