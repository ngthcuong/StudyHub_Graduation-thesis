import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FormatQuote, Person } from "@mui/icons-material";
import { useGetReviewsByCourseQuery } from "../services/reviewApi";

const CourseReviews = ({ courseId, maxDisplay = 3 }) => {
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useGetReviewsByCourseQuery(courseId);

  if (!courseId) return null;

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center py-8">
        <CircularProgress />
        <Typography variant="body1" className="ml-2">
          Loading reviews...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-4">
        Failed to load reviews. Please try again later.
      </Alert>
    );
  }

  const reviews = reviewsData?.reviews || [];

  if (reviews.length === 0) {
    return (
      <Alert severity="info" className="my-4">
        No reviews yet. Be the first to review this course!
      </Alert>
    );
  }

  const displayReviews = reviews.slice(0, maxDisplay);

  return (
    <Box className="space-y-4">
      {displayReviews.map((review) => (
        <Card
          key={review._id}
          className="shadow-lg px-2 !rounded-xl hover:!shadow-2xl transition-shadow"
        >
          <CardContent className="p-6">
            {/* Quote icon */}
            <Typography variant="body1" className="mb-4 text-blue-700">
              <FormatQuote />
            </Typography>

            {/* Review content */}
            <Typography
              variant="body1"
              className="!mb-4 text-gray-700 leading-relaxed"
            >
              "{review.content}"
            </Typography>

            {/* Rating */}
            <Box className="flex items-center mb-4">
              <Rating
                value={review.rating}
                readOnly
                size="small"
                className="mr-2"
              />
              <Chip
                label={`${review.rating}/5`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* User info */}
            <Box className="flex items-center gap-3">
              {review.user?.avatar ? (
                <Avatar
                  src={review.user.avatar}
                  alt={review.user.fullName}
                  className="w-10 h-10"
                />
              ) : (
                <Avatar className="w-10 h-10 bg-gray-300">
                  <Person />
                </Avatar>
              )}
              <Box>
                <Typography variant="body1" className="!font-semibold">
                  {review.user?.fullName || "Anonymous User"}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Show total count */}
      {reviews.length > maxDisplay && (
        <Box className="text-center py-4">
          <Typography variant="body2" className="text-gray-600">
            Showing {maxDisplay} of {reviews.length} reviews
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseReviews;
