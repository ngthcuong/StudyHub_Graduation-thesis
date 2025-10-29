import {
  AccessTime,
  MoreVert,
  RateReview,
  Info,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalCreateReview from "./ModalCreateReview";
import CourseRatingSummary from "./CourseRatingSummary";

const CourseCard = ({ course, variant = "market" }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReviewClick = (event) => {
    event?.stopPropagation();
    setReviewModalOpen(true);
    handleMenuClose();
  };

  const handleDetailsClick = (event) => {
    event?.stopPropagation();
    navigate(`/course/${course._id}`);
    handleMenuClose();
  };

  const handleReviewModalClose = (event) => {
    event?.stopPropagation();
    setReviewModalOpen(false);
  };

  const handleCardClick = () => {
    // Only navigate if modal is not open and no menu is open
    if (!reviewModalOpen && !anchorEl) {
      navigate(`/course/${course._id}`);
    }
  };

  return (
    <Card
      key={course.id}
      className="bg-white border border-gray-200 !rounded-xl hover:!shadow-2xl transition-shadow cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <div className="h-48 w-full relative">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        {/* Menu Button for owned variant */}
        {variant === "owned" && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            }}
          >
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ padding: "4px" }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        )}
      </div>

      <CardContent className="p-6">
        {/* Category and Duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <Typography variant="body2" className="text-gray-600 font-medium">
              {course.courseType}
            </Typography>
          </div>
          <div className="flex items-center space-x-2">
            <AccessTime />
            <Typography variant="body2" className="text-gray-600">
              {course.durationHours} hours
            </Typography>
          </div>
        </div>

        {/* Course Title */}
        <Typography
          variant="subtitle1"
          className="!font-black text-black !mb-1 "
        >
          {course.title}
        </Typography>

        {/* Course Rating Summary */}
        <Box className="mb-2">
          <CourseRatingSummary
            courseId={course.id || course._id}
            variant="compact"
            showCount={true}
          />
        </Box>

        {/* Course Description */}
        {/* <Typography variant="body2" className="text-gray-600 ">
          {course.description}
        </Typography> */}

        {/* Progress with label */}
        {variant === "owned" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* thanh tiến trình */}
            {/* <LinearProgress
              variant="determinate"
              value={10}
              sx={{
                height: 8,
                borderRadius: 5,
                flex: 1,
                background: "#e0e7ef",
                "& .MuiLinearProgress-bar": { background: "#22c55e" },
              }}
            />
            <Typography variant="body2" fontWeight={600}>
              {10}%
            </Typography> */}
          </Box>
        )}

        {/* Instructor and Pricing */}
        {variant === "market" && (
          <div className="flex items-center gap-2 justify-end mt-2">
            {/* <Typography
              variant="body1"
              className="text-gray-600 line-through text-sm"
            >
              ${course.originalPrice}
            </Typography> */}
            <Typography variant="h6" className="!font-bold text-teal-600">
              {course.cost}đ
            </Typography>
          </div>
        )}
      </CardContent>

      {/* Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleReviewClick(e);
          }}
        >
          <ListItemIcon>
            <RateReview fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rate Course</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDetailsClick(e);
          }}
        >
          <ListItemIcon>
            <Info fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          <ListItemText>Close Menu</ListItemText>
        </MenuItem>
      </Menu>

      {/* Review Modal */}
      <ModalCreateReview
        open={reviewModalOpen}
        onClose={handleReviewModalClose}
        course={{
          id: course._id,
          name: course.title,
        }}
        isUpdate={false}
      />
    </Card>
  );
};

export default CourseCard;
