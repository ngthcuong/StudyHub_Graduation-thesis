import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputAdornment,
  Chip,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FilterAltOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { useGetListAttemptMutation } from "../../services/testApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const examTypeOptions = ["All Types", "TOEIC", "IELTS"];
const statusOptions = ["All Status", "Passed", "Failed"];

const TestResults = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [examType, setExamType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [showFilter, setShowFilter] = useState(false);
  const [completedTests, setCompletedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [getListAttempt] = useGetListAttemptMutation();

  const fetchCompletedTests = async () => {
    try {
      setIsLoading(true);
      const response = await getListAttempt().unwrap();

      if (!response.data || !Array.isArray(response.data)) {
        setCompletedTests([]);
        return;
      }

      const mapped = response.data.map((item, index) => {
        const totalScore = item.analysisResult?.total_score || 0;
        const totalQuestions = item.analysisResult?.total_questions || 1;
        const scorePercent =
          totalQuestions > 0
            ? Math.round((totalScore / totalQuestions) * 100)
            : 0;

        const uniqueKey = `${item.attemptId}_${index}`;
        const completedAt = item.submittedAt || new Date().toISOString();

        return {
          id: uniqueKey,
          attemptId: item.attemptId,
          title: item.testTitle,
          score: scorePercent,
          passingScore: 70,
          completedAt: completedAt,
          skill: item.skill,
          level: item.level,
          examType: item.examType,
          duration: item.durationMin,
          fullResultData: item,
        };
      });

      const sorted = mapped.sort((a, b) => {
        return new Date(b.completedAt) - new Date(a.completedAt);
      });

      setCompletedTests(sorted);
    } catch (error) {
      console.error("Error loading completed tests:", error);
      setCompletedTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter data
  const filtered = useMemo(() => {
    return completedTests.filter((item) => {
      const matchTitle =
        item.title?.toLowerCase()?.includes(search.toLowerCase()) ?? true;
      const matchExamType =
        examType === "All Types" || item.examType === examType;
      const matchStatus =
        status === "All Status" ||
        (status === "Passed" && item.score >= item.passingScore) ||
        (status === "Failed" && item.score < item.passingScore);

      // Filter by date range
      let matchDate = true;
      if (startDate || endDate) {
        const itemDate = new Date(item.completedAt);
        if (startDate && endDate) {
          matchDate = itemDate >= startDate && itemDate <= endDate;
        } else if (startDate) {
          matchDate = itemDate >= startDate;
        } else if (endDate) {
          matchDate = itemDate <= endDate;
        }
      }

      return matchTitle && matchExamType && matchStatus && matchDate;
    });
  }, [search, examType, status, startDate, endDate, completedTests]);

  // Calculate pagination
  const paginatedTests = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, page, rowsPerPage]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
  }, [search, examType, status, startDate, endDate]);

  // Pagination handlers
  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearAll = () => {
    setSearch("");
    setExamType("All Types");
    setStatus("All Status");
    setStartDate(null);
    setEndDate(null);
  };

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="min-h-fit bg-white py-8 px-6 rounded-xl">
      <Box className="max-w-6xl mx-auto">
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#22223b"
            sx={{ mb: 1 }}
          >
            Test Results
          </Typography>
          <Typography variant="subtitle1" color="#64748b" sx={{ mb: 2 }}>
            View your completed test results and track your progress
          </Typography>
        </Box>

        {/* Search and filter bar */}
        <Box className="bg-white rounded-xl shadow p-4 mb-6">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            className="w-full"
          >
            <TextField
              placeholder="Search test results..."
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
              {filtered.length} of {completedTests.length} results
            </Typography>
          </Stack>

          {/* Filter section */}
          {showFilter && (
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="flex-start"
              className="mt-4"
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                {/* Exam Type */}
                <Box className="flex flex-col w-full md:w-auto">
                  <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                    Exam Type
                  </Typography>
                  <Select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    size="small"
                    sx={{ minWidth: 140 }}
                  >
                    {examTypeOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Status */}
                <Box className="flex flex-col w-full md:w-auto">
                  <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                    Status
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
              </Stack>

              {/* Date Range Filter */}
              <Box className="flex flex-col w-full">
                <Typography variant="body2" color="#64748b" sx={{ mb: 0.5 }}>
                  Completed Date Range
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="From Date"
                      value={startDate}
                      onChange={(newDate) => {
                        if (newDate) {
                          const date = new Date(newDate);
                          date.setHours(0, 0, 0, 0);
                          setStartDate(date);
                          if (endDate && endDate < date) {
                            setEndDate(null);
                          }
                        } else {
                          setStartDate(null);
                        }
                      }}
                      format="dd/MM/yyyy"
                      maxDate={endDate || new Date()}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <DatePicker
                      label="To Date"
                      value={endDate}
                      onChange={(newDate) => {
                        if (newDate) {
                          const date = new Date(newDate);
                          date.setHours(23, 59, 59, 999);
                          setEndDate(date);
                        } else {
                          setEndDate(null);
                        }
                      }}
                      format="dd/MM/yyyy"
                      minDate={startDate || undefined}
                      maxDate={new Date()}
                      slotProps={{
                        textField: {
                          size: "small",
                          error: startDate && endDate && endDate < startDate,
                          helperText:
                            startDate && endDate && endDate < startDate
                              ? "To Date must be after From Date"
                              : "",
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    sx={{ textTransform: "none", minWidth: 100 }}
                  >
                    Clear dates
                  </Button>
                </Stack>
              </Box>
            </Stack>
          )}
        </Box>

        {/* Results list */}
        {paginatedTests.length === 0 ? (
          <Box className="text-center py-16">
            <Typography variant="h6" color="#64748b" sx={{ mb: 2 }}>
              No test results found
            </Typography>
            <Typography variant="body2" color="#9CA3AF">
              Complete a test to see your results here
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {paginatedTests.map((item) => {
              const isPassed = item.score >= item.passingScore;
              const scoreColor = isPassed ? "#10B981" : "#EF4444";

              return (
                <Box
                  key={item.id}
                  onClick={() => {
                    if (!item.attemptId) {
                      alert("Cannot view this result. Attempt ID is missing.");
                      return;
                    }

                    const attemptData = {
                      ...item.fullResultData,
                      testTitle: item.title,
                    };

                    navigate(`/attempt/${item.attemptId}`, {
                      state: {
                        attempt: attemptData,
                        analysisResult: item.fullResultData?.analysisResult,
                      },
                    });
                  }}
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                    paddingRight: 2.5,
                    paddingTop: 2.5,
                    paddingBottom: 2.5,
                    border: "1px solid #E5E7EB",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    {/* Score badge */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 80,
                      }}
                    >
                      {isPassed ? (
                        <CheckCircleIcon
                          sx={{ fontSize: 20, color: scoreColor }}
                        />
                      ) : (
                        <CancelIcon sx={{ fontSize: 20, color: scoreColor }} />
                      )}
                      <Typography
                        // variant="h6"
                        fontWeight={700}
                        sx={{ color: scoreColor, mt: 0.5, fontSize: 18 }}
                      >
                        {item.score}%
                      </Typography>
                    </Box>

                    {/* Test content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        // variant="h6"
                        fontWeight={600}
                        color="#1F2937"
                        sx={{ mb: 0.5, fontSize: 16 }}
                      >
                        {item.title || "Untitled Test"}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                        {item.skill && (
                          <Chip
                            label={item.skill.toUpperCase()}
                            // size="small"
                            sx={{
                              backgroundColor: "#E0F2F1",
                              color: "#004D40",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        )}
                        {item.level && (
                          <Chip
                            label={item.level}
                            // size="small"
                            sx={{
                              backgroundColor: "#F3E5F5",
                              color: "#4A148C",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        )}
                        {item.examType && (
                          <Chip
                            label={item.examType}
                            // size="small"
                            sx={{
                              backgroundColor: "#FFF3E0",
                              color: "#E65100",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        )}
                      </Stack>

                      <Typography variant="body2" color="#6B7280">
                        Completed:{" "}
                        {new Date(item.completedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </Typography>
                    </Box>

                    {/* Status badge */}
                    <Box>
                      <Chip
                        label={isPassed ? "PASSED" : "FAILED"}
                        color={isPassed ? "success" : "error"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: "12px",
                          // height: 20,
                          minWidth: 70,
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filtered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                "& .MuiTablePagination-toolbar": {
                  fontSize: "1rem",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "1rem",
                },
                "& .MuiTablePagination-displayedRows": {
                  fontSize: "1rem",
                },
                "& .MuiTablePagination-select": {
                  fontSize: "1rem",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TestResults;
