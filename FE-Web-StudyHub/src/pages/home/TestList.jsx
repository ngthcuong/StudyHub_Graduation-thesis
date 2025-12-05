import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  InputAdornment,
  List,
  ListItem,
  CircularProgress,
  Tooltip,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  FilterAltOutlined,
  FilterAltOffOutlined,
  Add as AddIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";
import {
  useGetAttemptDetailByUserMutation,
  useDeleteTestMutation,
} from "../../services/testApi";
import ModalCreateCustomTest from "../../components/ModalCreateCustomTest";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

const typeOptions = ["All Types", "Test", "Assignment"];
const statusOptions = ["All Status", "Completed", "Not Completed"];
// const difficultyOptions = ["All Levels", "Easy", "Medium", "Hard"];

const TestList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [showFilter, setShowFilter] = useState(false);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataCreatedTest, setDataCreatedTest] = useState(null);
  // const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [getAttemptDetailByUser] = useGetAttemptDetailByUserMutation();
  const [deleteTest] = useDeleteTestMutation();

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await getAttemptDetailByUser().unwrap();
      const filteredTests = res.data.filter((test) => test.maxAttempts === 3);
      setTests({ data: filteredTests });
    } catch (error) {
      if (error.status === 404) {
        setTests({ data: [], total: 0 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    if (!tests?.data) return [];
    return tests?.data?.filter((item) => {
      const matchTitle = item?.testId?.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = type === "All Types" || item.testId.type === type;
      const matchStatus =
        status === "All Status" ||
        (status === "Completed" && item.isPassed) ||
        (status === "Not Completed" && !item.isPassed);
      const matchDifficulty =
        difficulty === "All Levels" || item.testId.difficulty === difficulty;
      return matchTitle && matchType && matchStatus && matchDifficulty;
    });
  }, [search, type, status, difficulty, tests?.data]);

  // Tính toán pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTests = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, page, itemsPerPage]);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, type, status, difficulty]);

  const handlePageChange = (_event, value) => {
    setPage(value);
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setSearch("");
    setType("All Types");
    setStatus("All Status");
    setDifficulty("All Levels");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  // TODO: Cập nhật UI hiển thị thông báo lỗi
  // if (error) {
  //   return <div>{error}</div>;
  // }

  const openModal = () => {
    setOpen(true);
  };

  const handleDeleteClick = (e, testId, testTitle) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setTestToDelete({ id: testId, title: testTitle });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testToDelete) return;

    try {
      await deleteTest(testToDelete.id).unwrap();
      toast.success(`Test "${testToDelete.title}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setTestToDelete(null);
      fetchTests(); // Refresh the list
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error(
        error?.data?.message || "Failed to delete test. Please try again."
      );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTestToDelete(null);
  };

  return (
    <Box className="min-h-fit bg-white py-8 px-6 rounded-xl">
      <Box className="max-w-6xl mx-auto">
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
              variant="h5"
              fontWeight={700}
              color="#22223b"
              sx={{ mb: 1 }}
            >
              Assignments & Tests
            </Typography>
            <Typography variant="subtitle1" color="#64748b" sx={{ mb: 2 }}>
              Track your progress and complete your learning tasks
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

        {/* Thanh search và filter trigger */}
        <Box className="bg-white rounded-xl shadow p-4 mb-6">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full"
          >
            <TextField
              placeholder="Search assignments and tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
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
              sx={{ minWidth: 220 }}
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
              {filtered.length} items
            </Typography>
          </Stack>

          {/* Bộ lọc chỉ hiện khi showFilter = true */}
          {showFilter && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="flex-end"
              className="mt-4"
            >
              {/* Type */}
              <Box className="flex flex-col w-full md:w-auto">
                <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                  Assignment Type
                </Typography>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  {typeOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {/* Status */}
              <Box className="flex flex-col w-full md:w-auto">
                <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                  Completion Status
                </Typography>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {/* Level */}
              {/* <Box className="flex flex-col w-full md:w-auto">
                <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                  Difficulty Level
                </Typography>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  {difficultyOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </Box> */}
            </Stack>
          )}
        </Box>

        {/* Danh sách bài */}
        <List className="rounded-xl">
          {paginatedTests.map((item) => (
            <ListItem
              key={item.testId._id}
              className="flex items-center justify-between !py-4  border rounded-xl mb-5 !shadow-md !bg-white cursor-pointer"
              onClick={() => {
                navigate(`/test/${item.testId._id}/custom-info`, {
                  state: {
                    testInfor: item.testId,
                    dataCreatedTest: dataCreatedTest,
                    attemptDetail: item,
                  },
                });
              }}
              secondaryAction={
                <Tooltip title="Delete test">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) =>
                      handleDeleteClick(e, item.testId._id, item.testId.title)
                    }
                    sx={{
                      color: "#ef4444",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                className="w-full"
              >
                {/* Hiện trạng thái completion */}
                {item?.isPassed ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <RadioButtonUncheckedIcon color="disabled" />
                )}
                <Box className="flex w-full items-center justify-between">
                  <Box className="flex flex-col flex-1">
                    {/* Tên bài test */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="#22223b"
                      sx={{ mb: 0.5 }}
                    >
                      {item.testId.title}
                    </Typography>

                    {/* Số lần làm bài và điểm */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="#64748b"
                          fontWeight={500}
                        >
                          Attempts:
                        </Typography>
                        <Chip
                          label={`${item.attemptNumber}/${item.maxAttempts}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.75rem",
                            bgcolor: "#e0f2fe",
                            color: "#0284c7",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      {item.score !== undefined && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="#64748b"
                            fontWeight={500}
                          >
                            Score:
                          </Typography>
                          <Chip
                            label={`${item.score}/10`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.75rem",
                              bgcolor: item.score >= 7 ? "#dcfce7" : "#fee2e2",
                              color: item.score >= 7 ? "#16a34a" : "#dc2626",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                  {/* Loại bài */}
                  <Chip
                    label={item.testId.examType}
                    color={
                      item.testId.examType === "TOEIC" ? "warning" : "info"
                    }
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      ml: 2,
                    }}
                  />
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  fontWeight: 600,
                },
                "& .Mui-selected": {
                  backgroundColor: "#1976d2 !important",
                  color: "white",
                },
              }}
            />
          </Box>
        )}
      </Box>
      <ModalCreateCustomTest
        open={open}
        handleClose={() => setOpen(false)}
        onSuccess={(newTestData) => {
          // ✅ newTestData chính là payload_form
          fetchTests();
          setOpen(false);
          setDataCreatedTest(newTestData);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            fontWeight: 700,
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteIcon />
          Delete Test
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the test{" "}
            <strong>"{testToDelete?.title}"</strong>? This action cannot be
            undone and will permanently remove all associated data including
            questions and attempts.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: "#ef4444",
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestList;
