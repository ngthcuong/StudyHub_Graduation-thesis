import React from "react";
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { useGetCourseRatingStatsQuery } from "../services/reviewApi";

const CourseRatingStats = ({ courseId }) => {
  const {
    data: statsData,
    isLoading,
    error,
  } = useGetCourseRatingStatsQuery(courseId, {
    skip: !courseId,
  });

  console.log(statsData);

  if (!courseId) return null;

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center py-4">
        <CircularProgress size={24} />
        <Typography variant="body2" className="ml-2">
          Loading ratings...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-2">
        Failed to load rating statistics.
      </Alert>
    );
  }

  const stats = statsData?.stats || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const { averageRating, totalReviews, ratingDistribution } = stats;

  if (totalReviews === 0) {
    return (
      <Paper className="p-4 bg-gray-50">
        <Typography variant="body2" className="text-gray-600 text-center">
          No ratings yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="p-4 bg-gray-50">
      <Box className="space-y-4">
        {/* Overall Rating */}
        <Box className="text-center">
          <Typography variant="h4" className="font-bold text-gray-800">
            {averageRating.toFixed(1)}
          </Typography>
          <Rating
            value={averageRating}
            readOnly
            precision={0.1}
            className="my-2"
            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Typography variant="body2" className="text-gray-600">
            Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Rating Distribution */}
        <Box className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <Box key={rating} className="flex items-center gap-2">
                <Typography variant="body2" className="w-4 text-sm">
                  {rating}
                </Typography>
                <Star className="text-yellow-500" fontSize="small" />
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  className="flex-1 h-2 rounded"
                  sx={{
                    backgroundColor: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#fbbf24",
                    },
                  }}
                />
                <Typography variant="body2" className="w-8 text-sm text-right">
                  {count}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseRatingStats;
