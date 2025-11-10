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

  const handleClose = () => {
    setTabValue(0);
    setCoursePage(0);
    setTestPage(0);
    setAttemptPage(0);
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
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Purchased Courses ({userDetailData.data.courses?.length || 0})
                </Typography>
                {userDetailData.data.courses?.length > 0 ? (
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
                        {userDetailData.data.courses
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
                      count={userDetailData.data.courses?.length || 0}
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
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Custom Tests ({userDetailData.data.customTests?.length || 0})
                </Typography>
                {userDetailData.data.customTests?.length > 0 ? (
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
                        {userDetailData.data.customTests
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
                      count={userDetailData.data.customTests?.length || 0}
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
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Test Attempts ({userDetailData.data.testAttempts?.length || 0}
                  )
                </Typography>
                {userDetailData.data.testAttempts?.length > 0 ? (
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
                        {userDetailData.data.testAttempts
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
                      count={userDetailData.data.testAttempts?.length || 0}
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
