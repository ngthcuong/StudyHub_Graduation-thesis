import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  LinearProgress,
  Collapse,
  Button,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FilterAltOutlined,
  FilterAltOffOutlined,
  Add as AddIcon,
} from "@mui/icons-material";
import ModalCreateTest from "../../components/ModalCreateTest";
import { useGetTestStatisticsQuery } from "../../services/testApi";

const Test = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [filteredTests, setFilteredTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theLastTestFilter, setTheLastTestFilter] = useState("All");
  const [customTestFilter, setCustomTestFilter] = useState("All");

  // Fetch test statistics from API
  const {
    data: testStatisticsData,
    isLoading: testsLoading,
    error: testsError,
    refetch,
  } = useGetTestStatisticsQuery();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateTest = () => {
    // Gọi lại API để lấy danh sách tests mới nhất
    refetch();
    closeModal();
  };

  // Get tests data from API
  const tests = useMemo(
    () => testStatisticsData?.data || [],
    [testStatisticsData]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowExpand = (testId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setSortBy("title");
    setTheLastTestFilter("All");
    setCustomTestFilter("All");
  };

  // Filter and sort logic
  React.useEffect(() => {
    let filtered = tests.filter((test) => {
      const matchesSearch =
        test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.examType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || test.examType === categoryFilter;

      const matchesTheLastTest =
        theLastTestFilter === "All" ||
        (theLastTestFilter === "Yes" && test.isTheLastTest === true) ||
        (theLastTestFilter === "No" && test.isTheLastTest !== true);

      const matchesCustomTest =
        customTestFilter === "All" ||
        (customTestFilter === "Custom" &&
          (!test.courseId || test.courseId === "000000000000000000000000")) ||
        (customTestFilter === "Course" &&
          test.courseId &&
          test.courseId !== "000000000000000000000000");

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTheLastTest &&
        matchesCustomTest
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title?.localeCompare(b.title) || 0;
        case "participants":
          return (b.totalParticipants || 0) - (a.totalParticipants || 0);
        case "attempts":
          return (b.totalAttempts || 0) - (a.totalAttempts || 0);
        case "questions":
          return (b.totalQuestions || 0) - (a.totalQuestions || 0);
        default:
          return 0;
      }
    });

    setFilteredTests(filtered);
    setPage(0);
  }, [
    searchTerm,
    categoryFilter,
    sortBy,
    theLastTestFilter,
    customTestFilter,
    tests,
  ]);

  // Show loading state
  if (testsLoading) {
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
      </Box>
    );
  }

  // Show error state
  if (testsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load test statistics. Please try again later.
        </Alert>
      </Box>
    );
  }

  // Calculate total stats
  const totalTests = tests.length;
  const totalParticipants = tests.reduce(
    (sum, test) => sum + test.totalParticipants,
    0
  );
  const totalAttempts = tests.reduce(
    (sum, test) => sum + test.totalAttempts,
    0
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
            >
              Test Management
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Manage all tests, questions, and participant statistics
            </Typography>
          </Box>
          <Tooltip title="Create a new test with custom questions and settings">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openModal}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
                "&:disabled": { backgroundColor: "#ccc" },
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
                minWidth: { xs: "auto", sm: 160 },
              }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                Create New Test
              </Box>
              <Box sx={{ display: { xs: "block", sm: "none" } }}>
                Create Test
              </Box>
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card
          sx={{
            flex: 1,
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
                  Total Tests
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalTests}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#dbeafe",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <QuizIcon sx={{ color: "#1976d2", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
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
                  Total Participants
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalParticipants}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#d1fae5",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <PeopleIcon sx={{ color: "#10b981", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
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
                  Total Attempts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalAttempts}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fef3c7",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <QuizIcon sx={{ color: "#f59e0b", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Table Card */}
      <Card
        sx={{ borderRadius: 3, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Search and Filters */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full mb-4"
          >
            <TextField
              fullWidth
              placeholder="Search tests by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
                minWidth: 220,
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFilter((v) => !v)}
              sx={{ textTransform: "none", fontWeight: 600, minWidth: 100 }}
              startIcon={
                !showFilter ? <FilterAltOutlined /> : <FilterAltOffOutlined />
              }
            >
              Filters
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
              {filteredTests.length} of {tests.length} items
            </Typography>
          </Stack>

          {/* Filters Panel */}
          {showFilter && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                {/* Category Filter */}
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel size="small">Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    size="small"
                  >
                    <MenuItem value="All">All Categories</MenuItem>
                    <MenuItem value="TOEIC">TOEIC</MenuItem>
                    <MenuItem value="IELTS">IELTS</MenuItem>
                  </Select>
                </FormControl>

                {/* The Last Test Filter */}
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel size="small">The Last Test</InputLabel>
                  <Select
                    value={theLastTestFilter}
                    onChange={(e) => setTheLastTestFilter(e.target.value)}
                    label="The Last Test"
                    size="small"
                  >
                    <MenuItem value="All">All Tests</MenuItem>
                    <MenuItem value="Yes">Last Test Only</MenuItem>
                    <MenuItem value="No">Not Last Test</MenuItem>
                  </Select>
                </FormControl>

                {/* Custom Test Filter */}
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel size="small">Test Type</InputLabel>
                  <Select
                    value={customTestFilter}
                    onChange={(e) => setCustomTestFilter(e.target.value)}
                    label="Test Type"
                    size="small"
                  >
                    <MenuItem value="All">All Types</MenuItem>
                    <MenuItem value="Custom">Custom Tests</MenuItem>
                    <MenuItem value="Course">Course Tests</MenuItem>
                  </Select>
                </FormControl>

                {/* Sort By */}
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel size="small">Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    size="small"
                  >
                    <MenuItem value="title">Test Name (A-Z)</MenuItem>
                    <MenuItem value="participants">Total Participants</MenuItem>
                    <MenuItem value="attempts">Total Attempts</MenuItem>
                    <MenuItem value="questions">Total Questions</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          )}

          {/* Table */}
          {filteredTests.length === 0 ? (
            // Empty State
            <Box sx={{ textAlign: "center", py: 8 }}>
              <QuizIcon sx={{ fontSize: 80, color: "#d1d5db", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
                {searchTerm || categoryFilter !== "All"
                  ? "No tests found matching criteria"
                  : "No tests created yet"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", mb: 3 }}>
                {searchTerm || categoryFilter !== "All"
                  ? "Try adjusting search or filter criteria"
                  : "Create first test to get started with managing assessments"}
              </Typography>
              {!searchTerm && categoryFilter === "All" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openModal}
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                    "&:disabled": { backgroundColor: "#ccc" },
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  {"Create First Test"}
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: "#f9fafb", textAlign: "center" }}
                  >
                    <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Test Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Test Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Total Questions
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Total Participants
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Total Attempts
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      The Last Test
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTests
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((test) => (
                      <React.Fragment key={test.id}>
                        {/* Main Row */}
                        <TableRow hover>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleRowExpand(test.id)}
                            >
                              {expandedRows[test.id] ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {test.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={test.examType}
                              size="small"
                              sx={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                test.courseId &&
                                test.courseId !== "000000000000000000000000"
                                  ? "Course Test"
                                  : "Custom Test"
                              }
                              size="small"
                              sx={{
                                backgroundColor:
                                  test.courseId &&
                                  test.courseId !== "000000000000000000000000"
                                    ? "#e0f2fe"
                                    : "#fff3e0",
                                color:
                                  test.courseId &&
                                  test.courseId !== "000000000000000000000000"
                                    ? "#0277bd"
                                    : "#f57c00",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={test.totalQuestions}
                              size="small"
                              sx={{
                                backgroundColor: "#dbeafe",
                                color: "#1976d2",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {test.totalParticipants}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {test.totalAttempts}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={test?.isTheLastTest ? "Yes" : "No"}
                              size="small"
                              sx={{
                                backgroundColor: test?.isTheLastTest
                                  ? "#e8f5e8"
                                  : "#ffeaa7",
                                color: test?.isTheLastTest
                                  ? "#2e7d32"
                                  : "#f57c00",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {/* <IconButton
                              size="small"
                              sx={{
                                color: "#1976d2",
                                "&:hover": { backgroundColor: "#dbeafe" },
                                mr: 0.5,
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton> */}
                            <IconButton
                              size="small"
                              sx={{
                                color: "#f59e0b",
                                "&:hover": { backgroundColor: "#fef3c7" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row - Test Details */}
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={9}
                          >
                            <Collapse
                              in={expandedRows[test.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ my: 1, mx: 6 }}>
                                <Typography
                                  gutterBottom
                                  component="div"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Test Information
                                </Typography>
                                {(test.courseId &&
                                  test.courseId.toString() !==
                                    "000000000000000000000000") ||
                                test.courseId === null ? (
                                  // Custom Test Information
                                  <Box>
                                    {test.creatorInfo ? (
                                      <Table size="small">
                                        <TableBody>
                                          <TableRow>
                                            <TableCell
                                              sx={{
                                                fontWeight: 600,
                                                width: "30%",
                                              }}
                                            >
                                              Creator Name:
                                            </TableCell>
                                            <TableCell>
                                              {test.creatorInfo.fullName}
                                            </TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell
                                              sx={{
                                                fontWeight: 600,
                                                width: "30%",
                                              }}
                                            >
                                              Current Level:
                                            </TableCell>
                                            <TableCell>
                                              <Box
                                                sx={{ display: "flex", gap: 1 }}
                                              >
                                                {test.creatorInfo.currentLevel
                                                  ?.TOEIC && (
                                                  <Chip
                                                    label={`TOEIC: ${test.creatorInfo.currentLevel.TOEIC}`}
                                                    size="small"
                                                    sx={{
                                                      backgroundColor:
                                                        "#dbeafe",
                                                      color: "#1976d2",
                                                      fontWeight: 500,
                                                    }}
                                                  />
                                                )}
                                                {test.creatorInfo.currentLevel
                                                  ?.IELTS && (
                                                  <Chip
                                                    label={`IELTS: ${test.creatorInfo.currentLevel.IELTS}`}
                                                    size="small"
                                                    sx={{
                                                      backgroundColor:
                                                        "#fef3c7",
                                                      color: "#f59e0b",
                                                      fontWeight: 500,
                                                    }}
                                                  />
                                                )}
                                                {!test.creatorInfo.currentLevel
                                                  ?.TOEIC &&
                                                  !test.creatorInfo.currentLevel
                                                    ?.IELTS && (
                                                    <Typography
                                                      variant="body2"
                                                      sx={{ color: "#6b7280" }}
                                                    >
                                                      Not set
                                                    </Typography>
                                                  )}
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "#6b7280" }}
                                      >
                                        Creator information not available
                                      </Typography>
                                    )}
                                  </Box>
                                ) : (
                                  // Course Test Information
                                  <Box>
                                    {test.courseInfo ? (
                                      <Table size="small">
                                        <TableBody>
                                          <TableRow>
                                            <TableCell
                                              sx={{
                                                fontWeight: 600,
                                                width: "30%",
                                              }}
                                            >
                                              Course Name:
                                            </TableCell>
                                            <TableCell>
                                              {test.courseInfo.courseTitle}
                                            </TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell
                                              sx={{
                                                fontWeight: 600,
                                                width: "30%",
                                              }}
                                            >
                                              Lesson Name:
                                            </TableCell>
                                            <TableCell>
                                              {test.courseInfo.lessonTitle}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "#6b7280" }}
                                      >
                                        Course information not available
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {filteredTests.length > 0 && (
            <TablePagination
              component="div"
              count={filteredTests.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal Create Test */}
      <ModalCreateTest
        open={isModalOpen}
        onClose={closeModal}
        onSuccess={handleCreateTest}
      />
    </Box>
  );
};

export default Test;
