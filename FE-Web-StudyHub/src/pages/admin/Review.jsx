import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Rating,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterAltOutlined,
  FilterAltOffOutlined,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useGetAdminReviewStatsQuery,
  useGetAllReviewsQuery,
} from "../../services/reviewApi";

const Review = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const itemsPerPage = 5;

  // Fetch reviews data from API
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetAllReviewsQuery();

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetAdminReviewStatsQuery();

  // Get reviews from API response
  const reviews = useMemo(
    () =>
      reviewsData?.reviews?.map((review) => ({
        id: review._id,
        rating: review.rating,
        courseName: review.course?.title || "Unknown Course",
        reviewerName: review.user?.fullName || "Anonymous",
        reviewerEmail: review.user?.email || "N/A",
        reviewDate: new Date(review.createdAt).toISOString().split("T")[0],
        content: review.content,
      })) || [],
    [reviewsData]
  );

  // Get stats from API
  const overallRating = statsData?.stats?.averageRating || 0;
  const totalReviews = statsData?.stats?.totalReviews || 0;
  const ratingCounts = statsData?.stats?.ratingDistribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setFilterRating("all");
    setStartDate(null);
    setEndDate(null);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating === parseInt(filterRating);

    // Filter by date range
    let matchesDate = true;
    if (startDate || endDate) {
      const reviewDate = new Date(review.reviewDate);
      if (startDate && endDate) {
        matchesDate = reviewDate >= startDate && reviewDate <= endDate;
      } else if (startDate) {
        matchesDate = reviewDate >= startDate;
      } else if (endDate) {
        matchesDate = reviewDate <= endDate;
      }
    }

    return matchesSearch && matchesRating && matchesDate;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  // Show loading state
  if (reviewsLoading || statsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading reviews...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (reviewsError || statsError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Typography variant="h6" color="error">
          Error loading reviews. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
        >
          Review Management
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Monitor and manage course reviews and ratings
        </Typography>
      </Box>

      {/* Overall Rating Summary Card */}
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left side - Overall Rating */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 200,
                borderRight: { md: "1px solid #e5e7eb" },
                pr: { md: 4 },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Overall Rating
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                {overallRating.toFixed(1)}
              </Typography>
              <Rating
                value={overallRating}
                precision={0.1}
                readOnly
                size="large"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on {totalReviews} reviews
              </Typography>
            </Box>

            {/* Right side - Rating Breakdown */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Rating Distribution
              </Typography>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star] || 0;
                const percentage =
                  totalReviews > 0
                    ? ((count / totalReviews) * 100).toFixed(0)
                    : 0;
                return (
                  <Box
                    key={star}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 80,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        {star}
                      </Typography>
                      <Rating value={1} max={1} readOnly size="small" />
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        height: 8,
                        backgroundColor: "#e5e7eb",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${percentage}%`,
                          backgroundColor:
                            star >= 4
                              ? "#10b981"
                              : star === 3
                              ? "#f59e0b"
                              : "#ef4444",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 60, fontWeight: 600 }}
                    >
                      {count} ({percentage}%)
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          mb: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Search and Filter Bar */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full mb-2"
          >
            <TextField
              fullWidth
              placeholder="Search reviews by course or reviewer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                minWidth: 220,
              }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                displayEmpty
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFilter((v) => !v)}
              sx={{ textTransform: "none", fontWeight: 600, minWidth: 100 }}
              startIcon={
                !showFilter ? <FilterAltOutlined /> : <FilterAltOffOutlined />
              }
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearAll}
              sx={{ textTransform: "none", minWidth: 100 }}
            >
              Clear All
            </Button>
            <Typography
              variant="body2"
              color="#64748b"
              sx={{ minWidth: 100, textAlign: "center" }}
            >
              {filteredReviews.length} of {reviews.length} reviews
            </Typography>
          </Stack>

          {/* Date Filter Panel */}
          {showFilter && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="body2" color="#64748b" sx={{ mb: 1.5 }}>
                Review Date Range
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={startDate}
                    onChange={(newDate) => {
                      if (newDate) {
                        const date = new Date(newDate);
                        date.setHours(0, 0, 0, 0);
                        setStartDate(date);
                      } else {
                        setStartDate(null);
                      }
                    }}
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={endDate}
                    onChange={(newDate) => {
                      if (newDate) {
                        const date = new Date(newDate);
                        date.setHours(23, 59, 59, 999);
                        setEndDate(date);
                      } else {
                        setEndDate(null);
                      }
                    }}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </LocalizationProvider>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Clear
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Review Cards List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        {paginatedReviews.map((review) => (
          <Card
            key={review.id}
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Rating:
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>

              <Box
                sx={{ mb: 1, display: "flex", alignItems: "baseline", gap: 1 }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Course Name:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {review.courseName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: "#1976d2",
                  }}
                >
                  {review.reviewerName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {review.reviewerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.reviewDate.split("-").reverse().join("-")}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {review.content}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Review Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Review Details
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedReview && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Rating:
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Course Name:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedReview.courseName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    bgcolor: "#1976d2",
                  }}
                >
                  {selectedReview.reviewerName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedReview.reviewerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.reviewerEmail}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedReview.reviewDate}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Review Content:
                </Typography>
                <Typography variant="body1">
                  {selectedReview.content}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Review;
