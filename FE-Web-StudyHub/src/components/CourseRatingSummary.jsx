import React from "react";
import { Box, Typography, Rating, Chip } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useGetCourseRatingStatsQuery } from "../services/reviewApi";

const CourseRatingSummary = ({
  courseId,
  variant = "compact", // compact | detailed
  showCount = true,
}) => {
  const {
    data: statsData,
    isLoading,
    error,
  } = useGetCourseRatingStatsQuery(courseId);

  if (!courseId || isLoading || error) return null;

  const stats = statsData?.stats || {
    averageRating: 0,
    totalReviews: 0,
  };

  const { averageRating, totalReviews } = stats;

  if (totalReviews === 0) return null;

  if (variant === "compact") {
    return (
      <Box className="flex items-center gap-1">
        <Rating
          value={averageRating}
          readOnly
          precision={0.1}
          size="small"
          emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography variant="body2" className="text-gray-600 ml-1">
          {averageRating.toFixed(1)}
          {showCount && ` (${totalReviews})`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex items-center gap-2">
      <Rating
        value={averageRating}
        readOnly
        precision={0.1}
        size="medium"
        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      <Box className="flex items-center gap-2">
        <Typography variant="body1" className="font-semibold">
          {averageRating.toFixed(1)}
        </Typography>
        {showCount && (
          <Chip
            label={`${totalReviews} reviews`}
            size="small"
            variant="outlined"
            color="primary"
          />
        )}
      </Box>
    </Box>
  );
};

export default CourseRatingSummary;
