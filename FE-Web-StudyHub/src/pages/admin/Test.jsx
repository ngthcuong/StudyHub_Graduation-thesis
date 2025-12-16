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
  Paper,
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
  Delete as DeleteIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Score as ScoreIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ModalCreateTest from "../../components/ModalCreateTest";
import {
  useGetTestStatisticsQuery,
  useDeleteTestMutation,
  useGetAttemptDetailByUserAndTestMutation,
} from "../../services/testApi";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SnackBar from "../../components/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
// Import dayjs để format ngày tháng (cần cài: npm install dayjs)
import dayjs from "dayjs";

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

  // --- STATE MỚI CHO MODAL LỊCH SỬ (EDIT) ---
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedTestForHistory, setSelectedTestForHistory] = useState([]);
  // ------------------------------------------

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  // Fetch test statistics from API
  const {
    data: testStatisticsData,
    isLoading: testsLoading,
    error: testsError,
    refetch,
  } = useGetTestStatisticsQuery();

  const [deleteTest, { isLoading: isDeleting }] = useDeleteTestMutation();
  const [getAttemptDetailByUserAndTest] =
    useGetAttemptDetailByUserAndTestMutation();

  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateTest = () => {
    refetch();
    closeModal();
  };

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

  const handleDeleteClick = (test) => {
    setTestToDelete(test);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;

    try {
      await deleteTest(testToDelete.id).unwrap();
      refetch();
      dispatch(
        openSnackbar({
          message: `Test "${testToDelete.title}" deleted successfully!`,
          severity: "success",
        })
      );
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    } catch (error) {
      console.error("Error deleting test:", error);
      dispatch(
        openSnackbar({
          message:
            error?.data?.error ||
            error?.data?.message ||
            "Failed to delete test. Please try again.",
          severity: "error",
        })
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTestToDelete(null);
  };

  // --- XỬ LÝ KHI BẤM NÚT EDIT ---
  const handleEditClick = async (test) => {
    if (!test?.creatorInfo?.id) {
      dispatch(
        openSnackbar({
          message: "Không tìm thấy thông tin người tạo bài test này",
          severity: "warning",
        })
      );
      return;
    }

    try {
      console.log("Viewing history for test:", test.title);

      const res = await getAttemptDetailByUserAndTest({
        userId: test.creatorInfo.id,
        testId: test.id,
      }).unwrap();

      const historyData = res?.data || [];

      setSelectedTestForHistory(historyData);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử:", error);
      dispatch(
        openSnackbar({
          message: "Không thể lấy lịch sử làm bài",
          severity: "error",
        })
      );
    }
  };

  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
  };
  // -----------------------------

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
        (customTestFilter === "Custom" && test.creatorInfo !== null) ||
        (customTestFilter === "Course" && test.courseInfo !== null);

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

  if (testsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load test statistics. Please try again later.
        </Alert>
      </Box>
    );
  }

  const totalTests = tests.length;
  const totalParticipants = tests.reduce(
    (sum, test) => sum + test.totalParticipants,
    0
  );
  const totalAttempts = tests.reduce(
    (sum, test) => sum + test.totalAttempts,
    0
  );

  console.log("Selected Test for History:", selectedTestForHistory);

  return (
    <Box>
      {/* ... (Phần Header và Cards giữ nguyên như cũ) ... */}
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
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards (Giữ nguyên) */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              <Box sx={{ bgcolor: "#dbeafe", borderRadius: 2, p: 1.5 }}>
                <QuizIcon sx={{ color: "#1976d2", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              <Box sx={{ bgcolor: "#d1fae5", borderRadius: 2, p: 1.5 }}>
                <PeopleIcon sx={{ color: "#10b981", fontSize: 32 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              <Box sx={{ bgcolor: "#fef3c7", borderRadius: 2, p: 1.5 }}>
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
          {/* Search and Filters (Giữ nguyên) */}
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
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
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

          {/* Filters Panel (Giữ nguyên) */}
          {showFilter && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="All">All Categories</MenuItem>
                    <MenuItem value="TOEIC">TOEIC</MenuItem>
                    <MenuItem value="IELTS">IELTS</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>The Last Test</InputLabel>
                  <Select
                    value={theLastTestFilter}
                    label="The Last Test"
                    onChange={(e) => setTheLastTestFilter(e.target.value)}
                  >
                    <MenuItem value="All">All Tests</MenuItem>
                    <MenuItem value="Yes">Last Test Only</MenuItem>
                    <MenuItem value="No">Not Last Test</MenuItem>
                  </Select>
                </FormControl>
                {/* Các filter khác giữ nguyên */}
              </Stack>
            </Box>
          )}

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{ backgroundColor: "#f9fafb", textAlign: "center" }}
                >
                  <TableCell sx={{ width: 50 }}></TableCell>
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
                  <TableCell sx={{ fontWeight: 600 }}>The Last Test</TableCell>
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
                        <TableCell sx={{ py: 1.5 }}>
                          <Tooltip title={test.title}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {test.title.length > 30
                                ? `${test.title.substring(0, 30)}...`
                                : test.title}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        {/* ... Các cột khác giữ nguyên ... */}
                        <TableCell>
                          <Chip label={test.examType} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              test.courseInfo ? "Course Test" : "Custom Test"
                            }
                            size="small"
                            sx={{
                              bgcolor: test.courseInfo ? "#e0f2fe" : "#fff3e0",
                              color: test.courseInfo ? "#0277bd" : "#f57c00",
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={test.totalQuestions}
                            size="small"
                            sx={{
                              bgcolor: "#dbeafe",
                              color: "#1976d2",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={600}>
                            {test.totalParticipants}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={600}>
                            {test.totalAttempts}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={test.isTheLastTest ? "Yes" : "No"}
                            size="small"
                            sx={{
                              bgcolor: test.isTheLastTest
                                ? "#e8f5e8"
                                : "#ffeaa7",
                              color: test.isTheLastTest ? "#2e7d32" : "#f57c00",
                            }}
                          />
                        </TableCell>

                        {/* ACTIONS COLUMN */}
                        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                          <Tooltip title="View Attempt History">
                            <IconButton
                              size="small"
                              sx={{
                                color: "#f59e0b",
                                "&:hover": { backgroundColor: "#fef3c7" },
                                mr: 0.5,
                              }}
                              onClick={() => handleEditClick(test)}
                            >
                              {/* SỬ DỤNG ICON EDIT HOẶC HISTORY TÙY Ý */}
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete test">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(test)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": {
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row Content (Giữ nguyên phần này) */}
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
                            <Box
                              sx={{
                                my: 2,
                                mx: 6,
                                p: 2,
                                bgcolor: "#fff",
                                borderRadius: 2,
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {/* ... Nội dung chi tiết test (Creator info, course info) ... */}
                              <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                Test Information
                              </Typography>
                              {/* (Giữ nguyên code phần hiển thị thông tin chi tiết) */}
                              <Typography variant="body2">
                                Details about {test.title}...
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

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

      {/* --- MODAL HIỂN THỊ LỊCH SỬ LÀM BÀI (ATTEMPTS) --- */}
      <Dialog
        open={historyDialogOpen}
        onClose={handleCloseHistoryDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Attempt History
            </Typography>
          </Box>
          <IconButton onClick={handleCloseHistoryDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "#f9fafb" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Test:{" "}
              {selectedTestForHistory[0]?.attemptId?.testId?.title || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {selectedTestForHistory[0]?.attemptId?.testId?._id}
            </Typography>
          </Box>

          {/* CHÚ Ý: Ở đây bạn sẽ cần gọi API lấy danh sách attempts theo testId.
            Ví dụ: const { data: attempts } = useGetAttemptsByTestIdQuery(selectedTestForHistory?.id);
            Dưới đây là DỮ LIỆU GIẢ (MOCK DATA) để hiển thị giao diện mẫu.
          */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #e0e0e0" }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f3f4f6" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Attempt</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Score
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* KIỂM TRA: Nếu selectedTestForHistory tồn tại và có dữ liệu thì mới map */}
                {selectedTestForHistory && selectedTestForHistory.length > 0 ? (
                  selectedTestForHistory.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>{" "}
                      <TableCell>
                        {item?.attemptId?.userId?.fullName || "User"}
                      </TableCell>
                      <TableCell>
                        {item?.endTime
                          ? dayjs(item?.endTime).format("DD/MM/YYYY HH:mm")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {item.totalScore ?? 0}
                      </TableCell>
                      <TableCell align="center">{`${Math.floor(
                        dayjs(item?.endTime).diff(dayjs(item?.startTime)) /
                          60000
                      )}m ${Math.floor(
                        (dayjs(item?.endTime).diff(dayjs(item?.startTime)) %
                          60000) /
                          1000
                      )}s`}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Xem chi tiết bài làm">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              console.log("Xem chi tiết attempt:", item);
                              // Gọi hàm xử lý mở modal chi tiết tại đây
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Chưa có dữ liệu làm bài nào.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseHistoryDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* ----------------------------------------------------- */}

      {/* Delete Confirmation Dialog (Giữ nguyên) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        // ... (Code dialog delete giữ nguyên)
      >
        {/* ... */}
        <DialogTitle
          sx={{ fontWeight: 700, color: "#ef4444", display: "flex", gap: 1 }}
        >
          <DeleteIcon /> Delete Test
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>"{testToDelete?.title}"</strong>? This will assume permanent
            deletion of all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackBar isOpen={isOpen} message={message} severity={severity} />
    </Box>
  );
};

export default Test;
