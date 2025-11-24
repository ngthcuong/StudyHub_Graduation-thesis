import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Rating,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  X,
  FormatQuote,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  DashboardOutlined,
  LogoutOutlined,
  PersonOutline,
  SettingsOutlined,
  Verified,
} from "@mui/icons-material";
import Footer from "../components/Footer";
import LecturerImage from "../assets/lecture.png";
import StudentImage from "../assets/student.png";
import CourseRecommend from "./course/CourseRecommend";
import {
  useGetAllReviewsQuery,
  useGetAdminReviewStatsQuery,
} from "../services/reviewApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/auth";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetAllReviewsQuery();
  const { data: statsData, isLoading: isLoadingStats } =
    useGetAdminReviewStatsQuery();

  const allReviews = reviewsData?.reviews || [];
  const testimonials = allReviews
    .filter((review) => review.rating === 5)
    .slice(0, 10);

  const reviewStats = statsData?.stats || {};

  const calculateSatisfactionRate = () => {
    if (!reviewStats.ratingDistribution) return 0;
    const { ratingDistribution, totalReviews } = reviewStats;
    const satisfiedCount =
      (ratingDistribution[4] || 0) + (ratingDistribution[5] || 0);
    return totalReviews > 0
      ? Math.round((satisfiedCount / totalReviews) * 100)
      : 0;
  };

  const stats = [
    {
      value: reviewStats?.averageRating
        ? reviewStats.averageRating.toFixed(1)
        : "0.0",
      label: "Average Rating",
      icon: true,
    },
    {
      value: reviewStats?.totalReviews
        ? reviewStats.totalReviews.toLocaleString()
        : "0",
      label: "Total Reviews",
    },
    {
      value: `${calculateSatisfactionRate()}%`,
      label: "Satisfaction Rate",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      {user ? (
        // Đã đăng nhập
        <header className="border rounded-lg border-gray-200 bg-white mb-3 max-w-6xl w-full mx-auto">
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
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "U"}
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
      ) : (
        // Chưa đăng nhập
        <header className="border rounded-lg border-gray-200 bg-white mb-3">
          <Container
            maxWidth="lg"
            className="flex items-center justify-between py-4"
          >
            <div className="font-bold text-2xl">StudyHub</div>
            <nav className="flex items-center gap-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="/courses" className="text-gray-700 hover:text-blue-600">
                Courses
              </a>
              <a
                href="/verify-certificate"
                className="text-gray-700 hover:text-blue-600"
              >
                Verify Certificate
              </a>
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Contact
              </a>
              <a href="/" className="text-gray-700 hover:text-blue-600">
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
      )}

      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                className="font-bold mb-4"
                sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}
              >
                <span className="text-blue-700 font-bold">Studying</span> Online
                is
                <br />
                now much easier
              </Typography>
              <Typography variant="h6" className="mb-6 text-gray-700 !mt-6">
                StudyHub is an interesting platform that will teach you in more
                an interactive way
              </Typography>
              <Box className="flex gap-4 mt-8">
                <Button
                  variant="contained"
                  size="large"
                  className="rounded-md px-6 py-2 text-white "
                  sx={{
                    textTransform: "none",
                  }}
                  onClick={() => navigate("/home")}
                >
                  Get started
                </Button>
                {/* <Button
                  variant="outlined"
                  size="large"
                  className="rounded-md px-6 py-2"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Learn more
                </Button> */}
              </Box>
            </Grid>

            {/* Right Side */}
            <Grid item size={{ xs: 12, md: 6 }} className={"w-full"}>
              <Box className="relative flex items-center">
                <img
                  src={LecturerImage}
                  alt="Lecturer"
                  className="rounded-xl w-48 h-56 object-cover shadow-lg absolute left-16 top-12"
                />
                <div className="bg-blue-100 rounded-full w-56 h-56 absolute right-0 top-0 -z-10"></div>
                <img
                  src={StudentImage}
                  alt="Student"
                  className="rounded-xl w-40 h-48 object-cover shadow-lg absolute right-8 top-0"
                />
                <div className="h-64"></div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h4" className="!font-bold text-center !mb-8">
            How it works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                1. Find Your Course
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Browse through our extensive library of courses across various
                categories.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                2. Enroll & Pay
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Choose your preferred course and complete the enrollment process
                securely.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                3. Learn & Grow
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Access course materials, complete assignments, and earn your
                certificate.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        {/* Title and Navigation Buttons */}
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              mb: 2,
            }}
          >
            <Typography variant="h4" className="!font-bold ">
              What our students say about us
            </Typography>
            {!isLoadingReviews && testimonials.length > 3 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  className="!bg-gray-200 !rounded-sm w-16 h-fit"
                  size="small"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 3))}
                  disabled={currentIndex === 0}
                >
                  <KeyboardArrowLeft />
                </Button>
                <Button
                  className="!bg-gray-200 !rounded-sm w-16 h-fit"
                  size="small"
                  onClick={() =>
                    setCurrentIndex(
                      Math.min(testimonials.length - 3, currentIndex + 3)
                    )
                  }
                  disabled={currentIndex >= testimonials.length - 3}
                >
                  <KeyboardArrowRight />
                </Button>
              </Box>
            )}
            {!isLoadingReviews && testimonials.length > 0 && (
              <Typography variant="caption" className="text-gray-500 mt-2">
                Showing {testimonials.length} five-star reviews
              </Typography>
            )}
          </Box>

          {/* Reviews List */}
          {isLoadingReviews ? (
            <Box className="flex justify-center items-center py-12">
              <CircularProgress />
            </Box>
          ) : testimonials.length === 0 ? (
            <Box className="text-center py-12">
              <Typography variant="body1" className="text-gray-500">
                No 5-star reviews available yet. Be the first to share your
                experience!
              </Typography>
            </Box>
          ) : (
            <Box className="grid gap-4 grid-cols-1 sm:grid-cols-3 relative overflow-hidden pb-0.5">
              {testimonials
                .slice(currentIndex, currentIndex + 3)
                .map((review, idx) => (
                  <Card
                    key={review._id || idx}
                    className="min-w-[320px] shadow-lg px-2"
                  >
                    <CardContent>
                      <Box className="flex items-center justify-between mb-3">
                        <FormatQuote className="text-blue-700" />
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography
                        variant="body1"
                        className="!mb-4 line-clamp-4"
                      >
                        "{review.content}"
                      </Typography>
                      <Box className="flex items-center gap-2">
                        <Avatar
                          src={review.user?.avatar}
                          alt={review.user?.fullName || "User"}
                          className="w-10 h-10"
                        >
                          {review.user?.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            className="!font-semibold"
                          >
                            {review.user?.fullName || "Anonymous"}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {review.course?.title || "Course"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </Container>
      </section>

      <CourseRecommend />

      {/* Statistics */}
      <section className="py-10 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h4" className="!font-bold !mb-6 text-center">
            Course Review Statistics
          </Typography>
          {isLoadingStats ? (
            <Box className="flex justify-center items-center py-12">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {stats.map((stat, idx) => (
                <Grid item size={{ xs: 12, md: 3 }} key={idx}>
                  <Card className="shadow-sm text-center h-full">
                    <CardContent>
                      <Typography variant="h5" className="!font-semibold mb-2">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {stat.label}
                      </Typography>
                      {stat.icon && (
                        <Rating
                          name="average-rating"
                          value={parseFloat(stat.value)}
                          readOnly
                          precision={0.1}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-teal-300 to-blue-200">
        <Container maxWidth="md">
          <Box className="text-center">
            <Typography variant="h4" className="!font-bold !mb-2 text-gray-800">
              Ready to Join Our Learning Community?
            </Typography>
            <Typography variant="body1" className="!mb-4 text-gray-700">
              Start your learning journey today and become part of our success
              stories
            </Typography>
            <Button
              onClick={() => navigate("/courses")}
              variant="contained"
              sx={{
                textTransform: "none",
              }}
              className="!bg-white !text-gray-700 !font-semibold px-6 py-2 rounded-md shadow hover:bg-blue-50"
            >
              Browse Courses
            </Button>
          </Box>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
