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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { FilterAltOffOutlined, FilterAltOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllTestQuery } from "../../services/testApi";

const typeOptions = ["All Types", "Test", "Assignment"];
const statusOptions = ["All Status", "Completed", "Not Completed"];
const difficultyOptions = ["All Levels", "Easy", "Medium", "Hard"];

const TestList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [showFilter, setShowFilter] = useState(false);

  const { data: tests, isLoading, error } = useGetAllTestQuery();

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    if (!tests?.data) return [];
    return tests?.data.filter((item) => {
      const matchTitle = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = type === "All Types" || item.type === type;
      const matchStatus =
        status === "All Status" ||
        (status === "Completed" && item.completed) ||
        (status === "Not Completed" && !item.completed);
      const matchDifficulty =
        difficulty === "All Levels" || item.difficulty === difficulty;
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
  if (error) {
    return <div>Thong bao loi</div>;
  }

  return (
    <Box className="min-h-fit bg-white py-8 px-6 rounded-xl">
      <Box className="max-w-6xl mx-auto">
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
              <Box className="flex flex-col w-full md:w-auto">
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
              </Box>
            </Stack>
          )}
        </Box>

        {/* Danh sách bài */}
        <List className="rounded-xl">
          {filtered.map((item) => (
            <ListItem
              key={item._id}
              className="flex items-center justify-between !py-4  border rounded-xl mb-5 !shadow-md !bg-white cursor-pointer"
              onClick={() => {
                navigate(`/test/${item._id}`, {
                  state: {
                    testInfor: item,
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
                {item.completed ? (
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
                      {item.title}
                    </Typography>
                    {/* Độ khó */}
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
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
                    </Stack>
                  </Box>
                  {/* Loại bài */}
                  <Chip
                    label={item.examType}
                    color={item.examType === "TOEIC" ? "warning" : "info"}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TestList;
