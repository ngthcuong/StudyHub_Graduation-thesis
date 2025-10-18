import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Backdrop,
} from "@mui/material";
import { Star, StarBorder, Close } from "@mui/icons-material";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../services/reviewApi";

const ModalCreateReview = ({
  open,
  onClose,
  course,
  existingReview = null,
  isUpdate = false,
}) => {
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [hasReviewedBefore, setHasReviewedBefore] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;

  // Set initial values when modal opens
  useEffect(() => {
    if (open) {
      if (existingReview) {
        setRating(existingReview.rating || 5);
        setReviewContent(existingReview.content || "");
        setHasReviewedBefore(true);
      } else {
        setRating(5);
        setReviewContent("");
        setHasReviewedBefore(false);
      }
    }
  }, [open, existingReview]);

  const handleSubmit = async () => {
    if (!course?.id) {
      setSnackbar({
        open: true,
        message: "Invalid course information",
        severity: "error",
      });
      return;
    }

    if (reviewContent.trim().length === 0) {
      setSnackbar({
        open: true,
        message: "Please enter review content",
        severity: "error",
      });
      return;
    }

    try {
      const reviewData = {
        courseId: course.id,
        rating: rating,
        content: reviewContent.trim(),
      };

      if (isUpdate && existingReview) {
        await updateReview({
          id: existingReview.id,
          reviewData,
        }).unwrap();
      } else {
        await createReview(reviewData).unwrap();
      }

      setSnackbar({
        open: true,
        message: isUpdate
          ? "Review updated successfully!"
          : "Review created successfully!",
        severity: "success",
      });

      // Reset form và đóng modal sau khi thành công
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSnackbar({
        open: true,
        message:
          error?.data?.message || "An error occurred while creating the review",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setRating(5);
    setReviewContent("");
    setHasReviewedBefore(false);
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "rounded-xl shadow-2xl",
        }}
      >
        {/* Loading Backdrop */}
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: "absolute",
          }}
          open={isLoading}
        >
          <div className="flex flex-col items-center gap-3">
            <CircularProgress color="inherit" size={40} />
            <Typography variant="body2">
              {isUpdate ? "Updating review..." : "Creating review..."}
            </Typography>
          </div>
        </Backdrop>

        <DialogTitle className="flex items-center justify-between p-6 border-b border-gray-200">
          <Typography variant="h5" className="font-semibold text-gray-800">
            {isUpdate ? "Update Review" : "Course Review"}
          </Typography>
          <Button
            onClick={handleClose}
            className="min-w-0 p-1 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {/* Thông báo đã đánh giá */}
          {hasReviewedBefore && !isUpdate && (
            <Alert severity="info" className="mb-4">
              You have already reviewed this course. You can update your review.
            </Alert>
          )}

          {/* Tên khóa học */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Typography variant="subtitle2" className="text-gray-600 mb-1">
              Course Name
            </Typography>
            <Typography variant="body1" className="font-medium text-gray-800">
              {course?.name || "Loading..."}
            </Typography>
          </Box>

          {/* Đánh giá sao */}
          <Box>
            <Typography
              variant="subtitle1"
              className="font-medium text-gray-800 mb-3"
            >
              Star Rating
            </Typography>
            <Box className="flex items-center gap-2">
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 1);
                }}
                size="large"
                icon={<Star fontSize="inherit" />}
                emptyIcon={<StarBorder fontSize="inherit" />}
                disabled={isLoading}
                className="text-yellow-500"
              />
              <Typography variant="body2" className="text-gray-600 ml-2">
                ({rating}/5 stars)
              </Typography>
            </Box>
          </Box>

          {/* Nội dung đánh giá */}
          <Box>
            <Typography
              variant="subtitle1"
              className="font-medium text-gray-800 mb-3"
            >
              Review Content
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Share your experience about this course..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              disabled={isLoading}
              inputProps={{ maxLength: 500 }}
              helperText={`${reviewContent.length}/500 characters`}
              variant="outlined"
              className="bg-white"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#3b82f6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions className="p-6 pt-0 gap-3">
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isLoading}
            className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || reviewContent.trim().length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              "&:disabled": {
                backgroundColor: "#9ca3af",
              },
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <CircularProgress size={16} color="inherit" />
                {isUpdate ? "Updating..." : "Creating..."}
              </div>
            ) : isUpdate ? (
              "Update Review"
            ) : (
              "Create Review"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          className="font-medium"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModalCreateReview;
