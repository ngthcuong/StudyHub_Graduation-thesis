import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  EmojiEvents as CertificateIcon,
  Quiz as QuizIcon,
  Comment as CommentIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useGetAdminReviewStatsQuery } from "../../services/reviewApi";
import { useGetCourseStatisticsQuery } from "../../services/courseApi";

const Dashboard = () => {
  const [topCoursesLimit, setTopCoursesLimit] = useState(5);

  // Fetch data from APIs - Call hooks first before any conditions
  const {
    data: reviewStatsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetAdminReviewStatsQuery();

  const {
    data: courseStatsData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCourseStatisticsQuery();

  // Calculate total stats
  const totalCourses = courseStatsData?.data?.totalCourses || 0;
  const totalRevenue = courseStatsData?.data?.totalRevenue || 0;
  const totalStudents = courseStatsData?.data?.totalStudents || 0;
  const totalReviews = reviewStatsData?.stats?.totalReviews || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // PieChart data for review distribution
  const reviewData = React.useMemo(() => {
    const distribution = reviewStatsData?.stats?.ratingDistribution || {};
    const total = reviewStatsData?.stats?.totalReviews || 1;
    return [
      {
        name: "5 Stars",
        value: distribution[5] || 0,
        percentage: ((distribution[5] || 0) / total) * 100,
        color: "#10b981",
      },
      {
        name: "4 Stars",
        value: distribution[4] || 0,
        percentage: ((distribution[4] || 0) / total) * 100,
        color: "#3b82f6",
      },
      {
        name: "3 Stars",
        value: distribution[3] || 0,
        percentage: ((distribution[3] || 0) / total) * 100,
        color: "#f59e0b",
      },
      {
        name: "2 Stars",
        value: distribution[2] || 0,
        percentage: ((distribution[2] || 0) / total) * 100,
        color: "#ef4444",
      },
      {
        name: "1 Star",
        value: distribution[1] || 0,
        percentage: ((distribution[1] || 0) / total) * 100,
        color: "#991b1b",
      },
    ];
  }, [reviewStatsData]);

  // BarChart data for top enrolled courses
  const topEnrolledCourses = React.useMemo(() => {
    const courses = courseStatsData?.data?.courses || [];
    const colors = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#84cc16",
      "#6366f1",
      "#14b8a6",
    ];
    return [...courses]
      .sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0))
      .slice(0, topCoursesLimit)
      .map((course, index) => ({
        name: course.title,
        enrollments: course.totalStudents || 0,
        color: colors[index % colors.length],
        displayName:
          course.title.length > 25
            ? course.title.slice(0, 25) + "..."
            : course.title,
      }));
  }, [courseStatsData, topCoursesLimit]);

  // Show loading state
  if (reviewsLoading || coursesLoading) {
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
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (reviewsError || coursesError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Box>
    );
  }

  // Create display data with truncated names for Y-axis (used in charts below)
  const topEnrolledCoursesDisplay = topEnrolledCourses;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Dashboard Overview
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Monitor your system performance and key metrics
        </Typography>
      </div>

      {/* Summary Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: "0.875rem" }}
                  >
                    Total Courses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalCourses}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#dbeafe",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <SchoolIcon sx={{ color: "#1976d2", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: "0.875rem" }}
                  >
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalRevenue)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#d1fae5",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <AttachMoneyIcon sx={{ color: "#10b981", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: "0.875rem" }}
                  >
                    Total Payments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalStudents}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fef3c7",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <PeopleIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: "0.875rem" }}
                  >
                    Total Reviews
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {totalReviews}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#e0e7ff",
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <AssessmentIcon sx={{ color: "#6366f1", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Distribution */}
        <Card className="rounded-xl shadow-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <AssessmentIcon className="text-blue-600 text-2xl" />
              </div>
              <div>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Review Distribution
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Overall rating breakdown
                </Typography>
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="flex-2/3">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={reviewData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${props.payload.percentage}%`,
                        props.payload.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1/3 ">
                <div className="space-y-3 mb-6">
                  {reviewData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <Typography variant="body2" className="text-gray-700">
                        {item.name}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Enrolled Courses */}
        <Card className="rounded-xl shadow-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <SchoolIcon className="text-green-600 text-2xl" />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    Top Enrolled Courses
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Most popular courses
                  </Typography>
                </div>
              </div>
              <FormControl size="small" className="min-w-[80px]">
                <Select
                  value={topCoursesLimit}
                  onChange={(e) => setTopCoursesLimit(e.target.value)}
                  className="rounded-lg"
                >
                  <MenuItem value={3}>Top 3</MenuItem>
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={8}>Top 8</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topEnrolledCoursesDisplay}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="displayName"
                    type="category"
                    width="auto"
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "enrollments") {
                        return [value, props.payload.name];
                      }
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="enrollments" radius={[0, 8, 8, 0]}>
                    {topEnrolledCoursesDisplay.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Tests */}
        {/* <Card className="rounded-xl shadow-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <QuizIcon className="text-purple-600 text-2xl" />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    Top Tests Attempted
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Most popular tests
                  </Typography>
                </div>
              </div>
              <FormControl size="small" className="min-w-[80px]">
                <Select
                  value={topTestsLimit}
                  onChange={(e) => setTopTestsLimit(e.target.value)}
                  className="rounded-lg"
                >
                  <MenuItem value={3}>Top 3</MenuItem>
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={8}>Top 8</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTestsDisplay} margin={{ bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="displayName"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "attempts") {
                        return [value, props.payload.name];
                      }
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="attempts" radius={[8, 8, 0, 0]}>
                    {topTestsDisplay.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Top Discussed Lessons */}
        {/* <Card className="rounded-xl shadow-sm h-full ">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-pink-100 rounded-lg p-2 mr-3">
                  <CommentIcon className="text-pink-600 text-2xl" />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    Top Discussed Lessons
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Most engaging lessons
                  </Typography>
                </div>
              </div>
              <FormControl size="small" className="min-w-[80px]">
                <Select
                  value={topDiscussionsLimit}
                  onChange={(e) => setTopDiscussionsLimit(e.target.value)}
                  className="rounded-lg"
                >
                  <MenuItem value={3}>Top 3</MenuItem>
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={8}>Top 8</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDiscussionsDisplay} margin={{ bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="displayName"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "comments") {
                        return [value, props.payload.name];
                      }
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="comments" radius={[8, 8, 0, 0]}>
                    {topDiscussionsDisplay.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
