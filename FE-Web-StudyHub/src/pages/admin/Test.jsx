import React, { useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

const Test = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  // Mock data cho tests với levels
  const tests = [
    {
      id: 1,
      title: "JavaScript Fundamentals Quiz",
      category: "Programming",
      totalQuestions: 75,
      totalParticipants: 456,
      totalAttempts: 1042,
      status: "Active",
      levels: [
        {
          level: "Easy",
          questionCount: 25,
          participants: 156,
          totalAttempts: 342,
          avgScore: 85,
        },
        {
          level: "Medium",
          questionCount: 30,
          participants: 200,
          totalAttempts: 450,
          avgScore: 75,
        },
        {
          level: "Hard",
          questionCount: 20,
          participants: 100,
          totalAttempts: 250,
          avgScore: 62,
        },
      ],
    },
    {
      id: 2,
      title: "React Hooks Assessment",
      category: "Framework",
      totalQuestions: 60,
      totalParticipants: 328,
      totalAttempts: 789,
      status: "Active",
      levels: [
        {
          level: "Easy",
          questionCount: 20,
          participants: 128,
          totalAttempts: 289,
          avgScore: 78,
        },
        {
          level: "Medium",
          questionCount: 25,
          participants: 150,
          totalAttempts: 350,
          avgScore: 68,
        },
        {
          level: "Hard",
          questionCount: 15,
          participants: 50,
          totalAttempts: 150,
          avgScore: 58,
        },
      ],
    },
    {
      id: 3,
      title: "Node.js Basic Test",
      category: "Backend",
      totalQuestions: 55,
      totalParticipants: 545,
      totalAttempts: 1212,
      status: "Active",
      levels: [
        {
          level: "Easy",
          questionCount: 20,
          participants: 245,
          totalAttempts: 512,
          avgScore: 82,
        },
        {
          level: "Medium",
          questionCount: 20,
          participants: 200,
          totalAttempts: 450,
          avgScore: 72,
        },
        {
          level: "Hard",
          questionCount: 15,
          participants: 100,
          totalAttempts: 250,
          avgScore: 65,
        },
      ],
    },
    {
      id: 4,
      title: "MongoDB Database Quiz",
      category: "Database",
      totalQuestions: 50,
      totalParticipants: 298,
      totalAttempts: 687,
      status: "Active",
      levels: [
        {
          level: "Easy",
          questionCount: 15,
          participants: 98,
          totalAttempts: 187,
          avgScore: 80,
        },
        {
          level: "Medium",
          questionCount: 20,
          participants: 120,
          totalAttempts: 300,
          avgScore: 71,
        },
        {
          level: "Hard",
          questionCount: 15,
          participants: 80,
          totalAttempts: 200,
          avgScore: 63,
        },
      ],
    },
    {
      id: 5,
      title: "HTML & CSS Mastery",
      category: "Web Design",
      totalQuestions: 70,
      totalParticipants: 612,
      totalAttempts: 1478,
      status: "Active",
      levels: [
        {
          level: "Easy",
          questionCount: 25,
          participants: 312,
          totalAttempts: 678,
          avgScore: 88,
        },
        {
          level: "Medium",
          questionCount: 25,
          participants: 200,
          totalAttempts: 500,
          avgScore: 85,
        },
        {
          level: "Hard",
          questionCount: 20,
          participants: 100,
          totalAttempts: 300,
          avgScore: 75,
        },
      ],
    },
    {
      id: 6,
      title: "TypeScript Advanced",
      category: "Programming",
      totalQuestions: 45,
      totalParticipants: 187,
      totalAttempts: 456,
      status: "Draft",
      levels: [
        {
          level: "Easy",
          questionCount: 15,
          participants: 87,
          totalAttempts: 156,
          avgScore: 70,
        },
        {
          level: "Medium",
          questionCount: 15,
          participants: 60,
          totalAttempts: 180,
          avgScore: 62,
        },
        {
          level: "Hard",
          questionCount: 15,
          participants: 40,
          totalAttempts: 120,
          avgScore: 55,
        },
      ],
    },
  ];

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "#d1fae5", color: "#10b981" };
      case "Medium":
        return { bg: "#fef3c7", color: "#f59e0b" };
      case "Hard":
        return { bg: "#fee2e2", color: "#ef4444" };
      default:
        return { bg: "#e5e7eb", color: "#6b7280" };
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search tests by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Test Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Total Questions
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Total Participants
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Total Attempts
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
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
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {test.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={test.category}
                            size="small"
                            sx={{
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
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
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {test.totalParticipants}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {test.totalAttempts}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={test.status}
                            size="small"
                            sx={{
                              backgroundColor:
                                test.status === "Active"
                                  ? "#d1fae5"
                                  : "#f3f4f6",
                              color:
                                test.status === "Active"
                                  ? "#10b981"
                                  : "#6b7280",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            sx={{
                              color: "#1976d2",
                              "&:hover": { backgroundColor: "#dbeafe" },
                              mr: 0.5,
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
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

                      {/* Expanded Row - Levels Detail */}
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={8}
                        >
                          <Collapse
                            in={expandedRows[test.id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 2 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{ fontWeight: 600, mb: 2 }}
                              >
                                Level Details
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Level
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600 }}
                                      align="center"
                                    >
                                      Questions
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600 }}
                                      align="center"
                                    >
                                      Participants
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: 600 }}
                                      align="center"
                                    >
                                      Attempts
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Avg Score
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {test.levels.map((level, index) => {
                                    const diffColor = getDifficultyColor(
                                      level.level
                                    );
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <Chip
                                            label={level.level}
                                            size="small"
                                            sx={{
                                              backgroundColor: diffColor.bg,
                                              color: diffColor.color,
                                              fontWeight: 600,
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Chip
                                            label={level.questionCount}
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
                                            {level.participants}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                          <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600 }}
                                          >
                                            {level.totalAttempts}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ width: 120 }}>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 0.5,
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                sx={{ fontWeight: 600 }}
                                              >
                                                {level.avgScore}%
                                              </Typography>
                                            </Box>
                                            <LinearProgress
                                              variant="determinate"
                                              value={level.avgScore}
                                              sx={{
                                                height: 6,
                                                borderRadius: 1,
                                                backgroundColor: "#e5e7eb",
                                                "& .MuiLinearProgress-bar": {
                                                  backgroundColor:
                                                    level.avgScore >= 80
                                                      ? "#10b981"
                                                      : level.avgScore >= 60
                                                      ? "#3b82f6"
                                                      : "#f59e0b",
                                                  borderRadius: 1,
                                                },
                                              }}
                                            />
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
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
          <TablePagination
            component="div"
            count={filteredTests.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Test;
