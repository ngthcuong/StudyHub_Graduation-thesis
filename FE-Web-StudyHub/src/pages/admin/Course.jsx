import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import {
  Search,
  TrendingUp,
  School,
  AttachMoney,
  People,
  Clear,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useGetCourseStatisticsQuery } from "../../services/courseApi";
import { useGetPaymentStatisticsQuery } from "../../services/paymentApi";

const Course = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("totalStudents");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch course and payment statistics from API
  const {
    data: courseStatisticsData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCourseStatisticsQuery();

  const { isLoading: paymentsLoading, error: paymentsError } =
    useGetPaymentStatisticsQuery();

  // Get courses data from API
  const courses = useMemo(
    () => courseStatisticsData?.data?.courses || [],
    [courseStatisticsData]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCourseTypeColor = (type) => {
    switch (type) {
      case "TOEIC":
        return "primary";
      case "IELTS":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setCourseTypeFilter("All");
    setSortBy("totalStudents");
  };

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        courseTypeFilter === "All" || course.courseType === courseTypeFilter;
      return matchesSearch && matchesType;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "totalRevenue":
          return b.totalRevenue - a.totalRevenue;
        case "totalStudents":
          return b.totalStudents - a.totalStudents;
        case "cost":
          return b.cost - a.cost;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, courseTypeFilter, sortBy, courses]);

  // Show loading state
  if (coursesLoading || paymentsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading course statistics...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (coursesError || paymentsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="error">
          Error loading course statistics. Please try again.
        </Typography>
      </Box>
    );
  }

  // Calculate total stats
  const totalCourses = courseStatisticsData?.data?.totalCourses || 0;
  const totalRevenue = courseStatisticsData?.data?.totalRevenue || 0;
  const totalStudents = courseStatisticsData?.data?.totalStudents || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 1, fontWeight: "bold" }}
        >
          Course Management Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Manage all tests, questions, and participant statistics
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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
                    sx={{ mb: 1 }}
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
                  <School sx={{ color: "#1976d2", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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
                    sx={{ mb: 1 }}
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
                  <AttachMoney sx={{ color: "#10b981", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
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
                    sx={{ mb: 1 }}
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
                  <People sx={{ color: "#f59e0b", fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <TextField
              label="Search courses"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel size="small">Course Type</InputLabel>
              <Select
                value={courseTypeFilter}
                onChange={(e) => setCourseTypeFilter(e.target.value)}
                label="Course Type"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="TOEIC">TOEIC</MenuItem>
                <MenuItem value="IELTS">IELTS</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel size="small">Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="totalStudents">Students Count</MenuItem>
                <MenuItem value="totalRevenue">Revenue</MenuItem>
                <MenuItem value="title">Course Title</MenuItem>
                <MenuItem value="cost">Course Price</MenuItem>
              </Select>
            </FormControl>

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
              color="text.secondary"
              sx={{ ml: "auto", fontWeight: 500 }}
            >
              {filteredCourses.length} of {courses.length} courses
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
          >
            Course Details ({filteredCourses.length} courses)
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Course
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                    Level
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Students
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Revenue
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "#374151" }}
                  >
                    Created
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course, index) => (
                    <TableRow
                      hover
                      key={index}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f9fafb",
                        },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{ width: 40, height: 40, mr: 2 }}
                            src={course.thumbnailUrl}
                          >
                            <ImageIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: "#1f2937" }}
                            >
                              {course.title}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={course.courseType}
                          color={getCourseTypeColor(course.courseType)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#374151" }}>
                        {course.courseLevel}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#374151", fontWeight: 500 }}
                      >
                        {formatCurrency(course.cost)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1f2937" }}
                        >
                          {course.totalStudents}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#10b981" }}
                        >
                          {formatCurrency(course.totalRevenue)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#6b7280" }}>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCourses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Course;
