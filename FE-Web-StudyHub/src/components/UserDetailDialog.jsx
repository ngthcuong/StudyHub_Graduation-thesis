import React, { useState } from "react";
import {
  Box,
  Avatar,
  Chip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";

const UserDetailDialog = ({
  open,
  onClose,
  selectedUser,
  userDetailData,
  userDetailLoading,
  userDetailError,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [coursePage, setCoursePage] = useState(0);
  const [courseRowsPerPage, setCourseRowsPerPage] = useState(5);
  const [testPage, setTestPage] = useState(0);
  const [testRowsPerPage, setTestRowsPerPage] = useState(5);
  const [attemptPage, setAttemptPage] = useState(0);
  const [attemptRowsPerPage, setAttemptRowsPerPage] = useState(5);
  const [certificatePage, setCertificatePage] = useState(0);
  const [certificateRowsPerPage, setCertificateRowsPerPage] = useState(5);

  // Filter states
  const [courseTypeFilter, setCourseTypeFilter] = useState("all");
  const [courseLevelFilter, setCourseLevelFilter] = useState("all");
  const [testExamTypeFilter, setTestExamTypeFilter] = useState("all");
  const [testDifficultyFilter, setTestDifficultyFilter] = useState("all");
  const [attemptStatusFilter, setAttemptStatusFilter] = useState("all");
  const [attemptExamTypeFilter, setAttemptExamTypeFilter] = useState("all");
  const [certificateDateFilter, setCertificateDateFilter] = useState("all");
  const [certificateStatusFilter, setCertificateStatusFilter] = useState("all");

  // Define level options based on exam type
  const getLevelOptions = (examType) => {
    if (examType === "TOEIC") {
      return [
        { value: "all", label: "All Levels" },
        { value: "10-250", label: "10-250" },
        { value: "255-400", label: "255-400" },
        { value: "405-600", label: "405-600" },
        { value: "605-780", label: "605-780" },
        { value: "785-900", label: "785-900" },
        { value: "905-990", label: "905-990" },
      ];
    } else if (examType === "IELTS") {
      return [
        { value: "all", label: "All Levels" },
        { value: "0-3.5", label: "0-3.5" },
        { value: "4.0-5.0", label: "4.0-5.0" },
        { value: "5.5-6.0", label: "5.5-6.0" },
        {
          value: "6.5-7.0",
          label: "6.5-7.0",
        },
        { value: "7.5-8.0", label: "7.5-8.0" },
        { value: "8.5-9.0", label: "8.5-9.0" },
      ];
    } else {
      return [
        { value: "all", label: "All Levels" },
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ];
    }
  };

  // Helper function to filter certificates by date range
  const matchesDateFilter = (certificate, dateFilter) => {
    if (dateFilter === "all") return true;

    const certificateDate = new Date(
      certificate.issuedDate || certificate.createdAt
    );
    const now = new Date();

    switch (dateFilter) {
      case "thisMonth": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return certificateDate >= startOfMonth;
      }
      case "last3Months": {
        const threeMonthsAgo = new Date(
          now.getTime() - 90 * 24 * 60 * 60 * 1000
        );
        return certificateDate >= threeMonthsAgo;
      }
      case "last6Months": {
        const sixMonthsAgo = new Date(
          now.getTime() - 180 * 24 * 60 * 60 * 1000
        );
        return certificateDate >= sixMonthsAgo;
      }
      case "thisYear": {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return certificateDate >= startOfYear;
      }
      case "lastYear": {
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
        return (
          certificateDate >= startOfLastYear && certificateDate <= endOfLastYear
        );
      }
      default:
        return true;
    }
  };

  // Helper function to match course level with filter selection
  const matchesLevelFilter = (course, levelFilter, typeFilter) => {
    if (levelFilter === "all") return true;

    // Check multiple possible level field names
    const courseLevel =
      course.level || course.courseLevel || course.targetLevel;
    const courseScore = course.scoreRange || course.score || course.targetScore;
    const courseBand = course.bandScore || course.band || course.targetBand;

    // Direct string match first (most common case)
    if (courseLevel === levelFilter) {
      return true;
    }

    // For TOEIC courses with score-based filtering
    if (typeFilter === "TOEIC") {
      // If course has scoreRange field
      if (courseScore) {
        const score = parseInt(courseScore);
        if (!isNaN(score)) {
          return checkTOEICRange(score, levelFilter);
        }
      }

      // If course level is a number (score)
      const numericLevel = parseInt(courseLevel);
      if (!isNaN(numericLevel)) {
        return checkTOEICRange(numericLevel, levelFilter);
      }
    }

    // For IELTS courses with band-based filtering
    if (typeFilter === "IELTS") {
      // If course has bandScore field
      if (courseBand) {
        const band = parseFloat(courseBand);
        if (!isNaN(band)) {
          return checkIELTSRange(band, levelFilter);
        }
      }

      // If course level is a number (band)
      const numericLevel = parseFloat(courseLevel);
      if (!isNaN(numericLevel)) {
        return checkIELTSRange(numericLevel, levelFilter);
      }
    }

    return false;
  };

  // Helper function for TOEIC range checking
  const checkTOEICRange = (score, levelFilter) => {
    switch (levelFilter) {
      case "10-250":
        return score >= 10 && score <= 250;
      case "255-400":
        return score >= 255 && score <= 400;
      case "405-600":
        return score >= 405 && score <= 600;
      case "605-780":
        return score >= 605 && score <= 780;
      case "785-900":
        return score >= 785 && score <= 900;
      case "905-990":
        return score >= 905 && score <= 990;
      default:
        return false;
    }
  };

  // Helper function for IELTS range checking
  const checkIELTSRange = (band, levelFilter) => {
    switch (levelFilter) {
      case "0-3.5":
        return band >= 0 && band <= 3.5;
      case "4.0-5.0":
        return band >= 4.0 && band <= 5.0;
      case "5.5-6.0":
        return band >= 5.5 && band <= 6.0;
      case "6.5-7.0":
        return band >= 6.5 && band <= 7.0;
      case "7.5-8.0":
        return band >= 7.5 && band <= 8.0;
      case "8.5-9.0":
        return band >= 8.5 && band <= 9.0;
      default:
        return false;
    }
  };

  // Filter functions for each tab
  const filteredCourses =
    userDetailData?.data?.courses?.filter((course) => {
      // Check type filter - be flexible with field names
      if (courseTypeFilter !== "all") {
        const courseType = course.type || course.courseType || course.examType;
        if (courseType !== courseTypeFilter) {
          return false;
        }
      }

      // Check level filter
      if (!matchesLevelFilter(course, courseLevelFilter, courseTypeFilter)) {
        return false;
      }

      return true;
    }) || [];

  const filteredTests =
    userDetailData?.data?.customTests?.filter((test) => {
      if (testExamTypeFilter !== "all" && test.examType !== testExamTypeFilter)
        return false;
      if (
        testDifficultyFilter !== "all" &&
        test.difficulty !== testDifficultyFilter
      )
        return false;
      return true;
    }) || [];

  const filteredAttempts =
    userDetailData?.data?.testAttempts?.filter((attempt) => {
      if (attemptStatusFilter !== "all") {
        const status = attempt.isPassed ? "pass" : "fail";
        if (status !== attemptStatusFilter) return false;
      }
      if (
        attemptExamTypeFilter !== "all" &&
        attempt.testInfo?.examType !== attemptExamTypeFilter
      )
        return false;
      return true;
    }) || [];

  const filteredCertificates =
    userDetailData?.data?.certificates?.filter((certificate) => {
      // Filter by date range
      if (!matchesDateFilter(certificate, certificateDateFilter)) {
        return false;
      }

      // Filter by certificate status (valid/expired/revoked)
      if (certificateStatusFilter !== "all") {
        if (certificateStatusFilter === "valid" && !certificate.isValid) {
          return false;
        }
        if (certificateStatusFilter === "expired" && certificate.isValid) {
          return false;
        }
      }

      return true;
    }) || [];

  const handleClose = () => {
    setTabValue(0);
    setCoursePage(0);
    setTestPage(0);
    setAttemptPage(0);
    setCertificatePage(0);
    // Reset all filters
    setCourseTypeFilter("all");
    setCourseLevelFilter("all");
    setTestExamTypeFilter("all");
    setTestDifficultyFilter("all");
    setAttemptStatusFilter("all");
    setAttemptExamTypeFilter("all");
    setCertificateDateFilter("all");
    setCertificateStatusFilter("all");
    onClose();
  };

  // Course pagination handlers
  const handleCoursePageChange = (event, newPage) => {
    setCoursePage(newPage);
  };

  const handleCourseRowsPerPageChange = (event) => {
    setCourseRowsPerPage(parseInt(event.target.value, 10));
    setCoursePage(0);
  };

  // Test pagination handlers
  const handleTestPageChange = (event, newPage) => {
    setTestPage(newPage);
  };

  const handleTestRowsPerPageChange = (event) => {
    setTestRowsPerPage(parseInt(event.target.value, 10));
    setTestPage(0);
  };

  // Test attempt pagination handlers
  const handleAttemptPageChange = (event, newPage) => {
    setAttemptPage(newPage);
  };

  const handleAttemptRowsPerPageChange = (event) => {
    setAttemptRowsPerPage(parseInt(event.target.value, 10));
    setAttemptPage(0);
  };

  // Certificate pagination handlers
  const handleCertificatePageChange = (event, newPage) => {
    setCertificatePage(newPage);
  };

  const handleCertificateRowsPerPageChange = (event) => {
    setCertificateRowsPerPage(parseInt(event.target.value, 10));
    setCertificatePage(0);
  };

  // Reset pagination when filters change
  const handleCourseTypeFilterChange = (value) => {
    setCourseTypeFilter(value);
    setCourseLevelFilter("all"); // Reset level filter when type changes
    setCoursePage(0);
  };

  const handleCourseLevelFilterChange = (value) => {
    setCourseLevelFilter(value);
    setCoursePage(0);
  };

  const handleTestExamTypeFilterChange = (value) => {
    setTestExamTypeFilter(value);
    setTestPage(0);
  };

  const handleTestDifficultyFilterChange = (value) => {
    setTestDifficultyFilter(value);
    setTestPage(0);
  };

  const handleAttemptStatusFilterChange = (value) => {
    setAttemptStatusFilter(value);
    setAttemptPage(0);
  };

  const handleAttemptExamTypeFilterChange = (value) => {
    setAttemptExamTypeFilter(value);
    setAttemptPage(0);
  };

  // Clear filter functions
  const clearCourseFilters = () => {
    setCourseTypeFilter("all");
    setCourseLevelFilter("all");
    setCoursePage(0);
  };

  const clearTestFilters = () => {
    setTestExamTypeFilter("all");
    setTestDifficultyFilter("all");
    setTestPage(0);
  };

  const clearAttemptFilters = () => {
    setAttemptStatusFilter("all");
    setAttemptExamTypeFilter("all");
    setAttemptPage(0);
  };

  // Certificate filter handlers
  const handleCertificateDateFilterChange = (value) => {
    setCertificateDateFilter(value);
    setCertificatePage(0);
  };

  const handleCertificateStatusFilterChange = (value) => {
    setCertificateStatusFilter(value);
    setCertificatePage(0);
  };

  const clearCertificateFilters = () => {
    setCertificateDateFilter("all");
    setCertificateStatusFilter("all");
    setCertificatePage(0);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: "70vh",
        },
      }}
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
            User Details
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {userDetailLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : userDetailError ? (
          <Typography color="error">Error loading user details</Typography>
        ) : selectedUser && userDetailData ? (
          <Box>
            {/* User Basic Info */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  src={selectedUser.avatarUrl}
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    bgcolor: "#1976d2",
                  }}
                >
                  {selectedUser.fullName?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedUser.fullName || "Unknown User"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {selectedUser.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Phone: {selectedUser.phone || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* Statistics */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#1976d2" }}
                    >
                      {selectedUser.stats?.purchasedCoursesCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Courses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#10b981" }}
                    >
                      {selectedUser.stats?.completedLessonsCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lessons
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#f59e0b" }}
                    >
                      {selectedUser.stats?.completedTestsCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tests
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#8b5cf6" }}
                    >
                      {Math.round(selectedUser.stats?.totalStudyHours || 0)}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Study Hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 6, sm: 2.4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#f59e0b" }}
                    >
                      {selectedUser.stats?.certificatesEarned || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Certificates
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Tabs for Courses and Tests */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
              >
                <Tab label="Purchased Courses" />
                <Tab label="Custom Tests" />
                <Tab label="Test Attempts" />
                <Tab label="Certificates" />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {tabValue === 0 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Purchased Courses ({filteredCourses.length})
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={courseTypeFilter}
                        label="Type"
                        onChange={(e) =>
                          handleCourseTypeFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="TOEIC">TOEIC</MenuItem>
                        <MenuItem value="IELTS">IELTS</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={courseLevelFilter}
                        label="Level"
                        onChange={(e) =>
                          handleCourseLevelFilterChange(e.target.value)
                        }
                      >
                        {getLevelOptions(courseTypeFilter).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={clearCourseFilters}
                      sx={{ minWidth: "auto", px: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Box>
                {filteredCourses.length > 0 ? (
                  <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              width: "45%",
                            }}
                          >
                            Course
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              width: "15%",
                              textAlign: "center",
                            }}
                          >
                            Type
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              width: "15%",
                              textAlign: "center",
                            }}
                          >
                            Level
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              width: "15%",
                              textAlign: "center",
                            }}
                          >
                            Duration
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              width: "15%",
                              textAlign: "right",
                            }}
                          >
                            Cost
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCourses
                          .slice(
                            coursePage * courseRowsPerPage,
                            coursePage * courseRowsPerPage + courseRowsPerPage
                          )
                          .map((course) => (
                            <TableRow key={course._id} hover>
                              <TableCell sx={{ maxWidth: 300 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {course.thumbnailUrl && (
                                    <Box
                                      component="img"
                                      src={course.thumbnailUrl}
                                      alt={course.title}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        mr: 2,
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        mb: 0.5,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {course.title}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {course.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={course.courseType}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={course.courseLevel}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="body2">
                                  {course.durationHours}h
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: "#10b981" }}
                                >
                                  {course.cost} VND
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredCourses.length}
                      page={coursePage}
                      onPageChange={handleCoursePageChange}
                      rowsPerPage={courseRowsPerPage}
                      onRowsPerPageChange={handleCourseRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 4,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      No courses purchased yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Custom Tests ({filteredTests.length})
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Exam Type</InputLabel>
                      <Select
                        value={testExamTypeFilter}
                        label="Exam Type"
                        onChange={(e) =>
                          handleTestExamTypeFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="TOEIC">TOEIC</MenuItem>
                        <MenuItem value="IELTS">IELTS</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Difficulty</InputLabel>
                      <Select
                        value={testDifficultyFilter}
                        label="Difficulty"
                        onChange={(e) =>
                          handleTestDifficultyFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Levels</MenuItem>
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={clearTestFilters}
                      sx={{ minWidth: "auto", px: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Box>
                {filteredTests.length > 0 ? (
                  <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600, width: "40%" }}>
                            Test Name
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Exam Type
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Questions
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Difficulty
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Created Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTests
                          .slice(
                            testPage * testRowsPerPage,
                            testPage * testRowsPerPage + testRowsPerPage
                          )
                          .map((test) => (
                            <TableRow key={test._id} hover>
                              <TableCell>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                  >
                                    {test.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {test.description}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={test.examType}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {test.numQuestions || 0}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={test.difficulty || "Medium"}
                                  size="small"
                                  color={
                                    test.difficulty === "Easy"
                                      ? "success"
                                      : test.difficulty === "Hard"
                                      ? "error"
                                      : "warning"
                                  }
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="body2">
                                  {new Date(test.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredTests.length}
                      page={testPage}
                      onPageChange={handleTestPageChange}
                      rowsPerPage={testRowsPerPage}
                      onRowsPerPageChange={handleTestRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 4,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      No custom tests created yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Test Attempts ({filteredAttempts.length})
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={attemptStatusFilter}
                        label="Status"
                        onChange={(e) =>
                          handleAttemptStatusFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="pass">Pass</MenuItem>
                        <MenuItem value="fail">Fail</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Exam Type</InputLabel>
                      <Select
                        value={attemptExamTypeFilter}
                        label="Exam Type"
                        onChange={(e) =>
                          handleAttemptExamTypeFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="TOEIC">TOEIC</MenuItem>
                        <MenuItem value="IELTS">IELTS</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={clearAttemptFilters}
                      sx={{ minWidth: "auto", px: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Box>
                {filteredAttempts.length > 0 ? (
                  <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                            Test Name
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Exam Type
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Score
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, textAlign: "center" }}
                          >
                            Attempt Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAttempts
                          .slice(
                            attemptPage * attemptRowsPerPage,
                            attemptPage * attemptRowsPerPage +
                              attemptRowsPerPage
                          )
                          .map((attempt) => (
                            <TableRow key={attempt._id} hover>
                              <TableCell>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                  >
                                    {attempt.testInfo?.title || "Unknown Test"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={attempt.testInfo?.examType || "N/A"}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color:
                                      attempt.score >= 70
                                        ? "#10b981"
                                        : "#ef4444",
                                  }}
                                >
                                  {attempt.score * 10}/100
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={attempt.isPassed ? "Passed" : "Failed"}
                                  size="small"
                                  color={attempt.isPassed ? "success" : "error"}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="body2">
                                  {new Date(
                                    attempt.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredAttempts.length}
                      page={attemptPage}
                      onPageChange={handleAttemptPageChange}
                      rowsPerPage={attemptRowsPerPage}
                      onRowsPerPageChange={handleAttemptRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 4,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      No test attempts found
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Certificates ({filteredCertificates.length})
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Date Range</InputLabel>
                      <Select
                        value={certificateDateFilter}
                        label="Date Range"
                        onChange={(e) =>
                          handleCertificateDateFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="last3Months">Last 3 Months</MenuItem>
                        <MenuItem value="last6Months">Last 6 Months</MenuItem>
                        <MenuItem value="thisYear">This Year</MenuItem>
                        <MenuItem value="lastYear">Last Year</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={certificateStatusFilter}
                        label="Status"
                        onChange={(e) =>
                          handleCertificateStatusFilterChange(e.target.value)
                        }
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="valid">Valid</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={clearCertificateFilters}
                      sx={{ minWidth: "auto", px: 2 }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Box>
                {filteredCertificates.length > 0 ? (
                  <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                          <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                            Certificate Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              width: "15%",
                            }}
                          >
                            Type
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              width: "17%",
                            }}
                          >
                            Issue Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              width: "17%",
                            }}
                          >
                            Expiry Date
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              textAlign: "center",
                              width: "16%",
                            }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCertificates
                          .slice(
                            certificatePage * certificateRowsPerPage,
                            certificatePage * certificateRowsPerPage +
                              certificateRowsPerPage
                          )
                          .map((certificate) => (
                            <TableRow key={certificate._id} hover>
                              <TableCell>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                  >
                                    {certificate.name || "Certificate"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ID:{" "}
                                    {certificate.certificateId ||
                                      certificate._id?.slice(-6)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={certificate.type || "Course"}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="body2">
                                  {certificate.issuedDate
                                    ? new Date(
                                        certificate.issuedDate
                                      ).toLocaleDateString("vi-VN")
                                    : new Date(
                                        certificate.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography variant="body2">
                                  {certificate.expiryDate
                                    ? new Date(
                                        certificate.expiryDate
                                      ).toLocaleDateString("vi-VN")
                                    : "No Expiry"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Chip
                                  label={
                                    certificate.isValid ? "Valid" : "Expired"
                                  }
                                  size="small"
                                  color={
                                    certificate.isValid ? "success" : "error"
                                  }
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredCertificates.length}
                      page={certificatePage}
                      onPageChange={handleCertificatePageChange}
                      rowsPerPage={certificateRowsPerPage}
                      onRowsPerPageChange={handleCertificateRowsPerPageChange}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 4,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      No certificates earned yet
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailDialog;
