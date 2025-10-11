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
  EmojiEvents as CertificateIcon,
  Quiz as QuizIcon,
  Comment as CommentIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const [topCoursesLimit, setTopCoursesLimit] = useState(5);
  const [topTestsLimit, setTopTestsLimit] = useState(5);
  const [topDiscussionsLimit, setTopDiscussionsLimit] = useState(5);

  // Function to truncate long text
  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Mock data cho Review Distribution
  const reviewData = [
    { name: "5 Stars", value: 1523, percentage: 53.5, color: "#10b981" },
    { name: "4 Stars", value: 882, percentage: 31.3, color: "#3b82f6" },
    { name: "3 Stars", value: 321, percentage: 11.3, color: "#f59e0b" },
    { name: "2 Stars", value: 111, percentage: 3.9, color: "#ef4444" },
    { name: "1 Star", value: 10, percentage: 0.35, color: "#991b1b" },
  ];

  const totalReviews = reviewData.reduce((sum, item) => sum + item.value, 0);
  const averageRating = (
    reviewData.reduce((sum, item, index) => {
      const stars = 5 - index;
      return sum + stars * item.value;
    }, 0) / totalReviews
  ).toFixed(1);

  // Mock data cho Top Enrolled Courses
  const allEnrolledCourses = [
    { name: "Full Stack Web Development", enrollments: 1245, color: "#3b82f6" },
    { name: "React & Redux Masterclass", enrollments: 1156, color: "#10b981" },
    { name: "Node.js Complete Guide", enrollments: 987, color: "#f59e0b" },
    { name: "Python for Data Science", enrollments: 876, color: "#8b5cf6" },
    { name: "JavaScript Fundamentals", enrollments: 845, color: "#ec4899" },
    { name: "MongoDB Database Design", enrollments: 756, color: "#06b6d4" },
    { name: "TypeScript Advanced", enrollments: 698, color: "#f97316" },
    { name: "Vue.js Complete Course", enrollments: 645, color: "#84cc16" },
    { name: "Angular Essentials", enrollments: 587, color: "#6366f1" },
    { name: "Docker & Kubernetes", enrollments: 534, color: "#14b8a6" },
    { name: "AWS Cloud Practitioner", enrollments: 489, color: "#f43f5e" },
    { name: "DevOps Fundamentals", enrollments: 423, color: "#a855f7" },
  ];

  // Mock data cho Top Certificate Issued
  const allCertificateCourses = [
    { name: "JavaScript Fundamentals", certificates: 756, color: "#3b82f6" },
    { name: "Python for Data Science", certificates: 698, color: "#10b981" },
    { name: "React & Redux Masterclass", certificates: 645, color: "#f59e0b" },
    { name: "Full Stack Web Development", certificates: 587, color: "#8b5cf6" },
    { name: "Node.js Complete Guide", certificates: 534, color: "#ec4899" },
    { name: "MongoDB Database Design", certificates: 489, color: "#06b6d4" },
    { name: "TypeScript Advanced", certificates: 423, color: "#f97316" },
    { name: "Docker & Kubernetes", certificates: 378, color: "#84cc16" },
    { name: "AWS Cloud Practitioner", certificates: 345, color: "#6366f1" },
    { name: "Vue.js Complete Course", certificates: 312, color: "#14b8a6" },
    { name: "Angular Essentials", certificates: 289, color: "#f43f5e" },
    { name: "DevOps Fundamentals", certificates: 256, color: "#a855f7" },
  ];

  // Mock data cho Top Tests
  const allTopTests = [
    { name: "JavaScript Quiz Pro", attempts: 2345, color: "#3b82f6" },
    { name: "React Hooks Challenge", attempts: 2156, color: "#10b981" },
    { name: "Python Basics Test", attempts: 1987, color: "#f59e0b" },
    { name: "Node.js Assessment", attempts: 1876, color: "#8b5cf6" },
    { name: "HTML & CSS Mastery", attempts: 1765, color: "#ec4899" },
    { name: "TypeScript Advanced Test", attempts: 1654, color: "#06b6d4" },
    { name: "Database Design Quiz", attempts: 1543, color: "#f97316" },
    { name: "API Development Test", attempts: 1432, color: "#84cc16" },
    { name: "Git & GitHub Quiz", attempts: 1321, color: "#6366f1" },
    { name: "Docker Fundamentals", attempts: 1210, color: "#14b8a6" },
    { name: "AWS Services Quiz", attempts: 1098, color: "#f43f5e" },
    { name: "Security Best Practices", attempts: 987, color: "#a855f7" },
  ];

  // Mock data cho Top Discussed Lessons
  const allTopDiscussions = [
    { name: "Introduction to React Hooks", comments: 456, color: "#3b82f6" },
    { name: "Async/Await in JavaScript", comments: 423, color: "#10b981" },
    { name: "RESTful API Design", comments: 398, color: "#f59e0b" },
    { name: "State Management with Redux", comments: 367, color: "#8b5cf6" },
    { name: "Database Normalization", comments: 345, color: "#ec4899" },
    { name: "Authentication & Authorization", comments: 312, color: "#06b6d4" },
    { name: "CSS Grid & Flexbox", comments: 289, color: "#f97316" },
    { name: "Docker Containerization", comments: 267, color: "#84cc16" },
    { name: "Microservices Architecture", comments: 245, color: "#6366f1" },
    { name: "GraphQL Basics", comments: 223, color: "#14b8a6" },
    { name: "Testing with Jest", comments: 201, color: "#f43f5e" },
    { name: "CI/CD Pipeline Setup", comments: 189, color: "#a855f7" },
  ];

  const topEnrolledCourses = allEnrolledCourses.slice(0, topCoursesLimit);
  const topTests = allTopTests.slice(0, topTestsLimit);
  const topDiscussions = allTopDiscussions.slice(0, topDiscussionsLimit);

  // Create display data with truncated names for Y-axis
  const topEnrolledCoursesDisplay = topEnrolledCourses.map((course) => ({
    ...course,
    displayName: truncateText(course.name, 25),
  }));

  const topTestsDisplay = topTests.map((test) => ({
    ...test,
    displayName: truncateText(test.name, 25),
  }));

  const topDiscussionsDisplay = topDiscussions.map((lesson) => ({
    ...lesson,
    displayName: truncateText(lesson.name, 25),
  }));

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Total Reviews
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {totalReviews.toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-green-600 font-semibold"
                >
                  ★ {averageRating} Average
                </Typography>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <AssessmentIcon className="text-blue-600 text-3xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Total Enrollments
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {allEnrolledCourses
                    .reduce((sum, c) => sum + c.enrollments, 0)
                    .toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-green-600 font-semibold"
                >
                  +12% this month
                </Typography>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <SchoolIcon className="text-green-600 text-3xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Certificates Issued
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {allCertificateCourses
                    .reduce((sum, c) => sum + c.certificates, 0)
                    .toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-green-600 font-semibold"
                >
                  +8% this month
                </Typography>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <CertificateIcon className="text-yellow-600 text-3xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-500 mb-1">
                  Test Attempts
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {allTopTests
                    .reduce((sum, t) => sum + t.attempts, 0)
                    .toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-green-600 font-semibold"
                >
                  +15% this month
                </Typography>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <QuizIcon className="text-purple-600 text-3xl" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
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

              <div className="ml-6">
                {/* Legend */}
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

                {/* Average Rating */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <Typography variant="h3" className="font-bold text-gray-800">
                    {averageRating}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Average Rating
                  </Typography>
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
        <Card className="rounded-xl shadow-sm h-full">
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
        </Card>

        {/* Top Discussed Lessons */}
        <Card className="rounded-xl shadow-sm h-full ">
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
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
