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
  Pagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FilterAltOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { useGetListAttemptMutation } from "../../services/testApi";

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

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

      setCompletedTests(mapped);
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

      return matchTitle && matchExamType && matchStatus;
    });
  }, [search, examType, status, completedTests]);

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTests = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, page, itemsPerPage]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [search, examType, status]);

  const handlePageChange = (_event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setSearch("");
    setExamType("All Types");
    setStatus("All Status");
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
              alignItems="flex-end"
              className="mt-4"
            >
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
                          sx={{ fontSize: 24, color: scoreColor }}
                        />
                      ) : (
                        <CancelIcon sx={{ fontSize: 24, color: scoreColor }} />
                      )}
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: scoreColor, mt: 0.5 }}
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
                        sx={{ mb: 0.5, fontSize: 18 }}
                      >
                        {item.title || "Untitled Test"}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                        {item.skill && (
                          <Chip
                            label={item.skill.toUpperCase()}
                            size="small"
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
                            size="small"
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
                            size="small"
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
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </Box>

                    {/* Status badge */}
                    <Box>
                      <Chip
                        label={isPassed ? "PASSED" : "FAILED"}
                        color={isPassed ? "success" : "error"}
                        sx={{
                          fontWeight: 700,
                          fontSize: "12px",
                          height: 32,
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
    </Box>
  );
};

export default TestResults;
