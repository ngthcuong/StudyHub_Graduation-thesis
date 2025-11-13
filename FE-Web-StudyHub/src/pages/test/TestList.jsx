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
  useGetMyTestsMutation,
  useGetAttemptDetailByUserMutation,
} from "../../services/testApi";
import ModalCreateCustomTest from "../../components/ModalCreateCustomTest";
import { useEffect } from "react";

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

  const [getMyTests] = useGetMyTestsMutation();
  const [getAttemptDetailByUser] = useGetAttemptDetailByUserMutation();

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
  }, [getMyTests]);

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
        (status === "Completed" && item.testId.completed) ||
        (status === "Not Completed" && !item.testId.completed);
      const matchDifficulty =
        difficulty === "All Levels" || item.testId.difficulty === difficulty;
      return matchTitle && matchType && matchStatus && matchDifficulty;
    });
  }, [search, type, status, difficulty, tests?.data]);

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

  console.log("Data created test in TestList:", filtered);

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
              {filtered.length} of {tests?.total || 0} items
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
          {filtered.map((item) => (
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
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                className="w-full"
              >
                {/* Hiện trạng thái completion */}
                {item?.attemptNumber === item?.maxAttempts ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <RadioButtonUncheckedIcon color="disabled" />
                )}
                <Box className="flex w-full items-center">
                  <Box className="flex justify-between w-full flex-col">
                    {/* Tên bài test */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="#22223b"
                    >
                      {item.testId.title}
                    </Typography>
                    {/* Độ khó */}
                    {/* <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={400}
                        color="#22223b"
                      >
                        Level:
                      </Typography>
                      <Chip
                        label={item.difficulty}
                        color="primary"
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                        }}
                      />
                    </Stack> */}
                  </Box>
                  {/* Loại bài */}
                  <Chip
                    label={item.testId.examType}
                    color={
                      item.testId.examType === "TOEIC" ? "warning" : "info"
                    }
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
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
    </Box>
  );
};

export default TestList;
