import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useNavigate } from "react-router-dom";

// Mock Data
const questions = [
  {
    question: "She ____ to Paris three times this year.",
    options: ["has been", "have been", "was", "were"],
  },
  {
    question: "They ____ their homework before dinner.",
    options: ["finish", "have finished", "finishes", "finished"],
  },
  {
    question: "I ____ him since last year.",
    options: ["didn't see", "haven't seen", "don't see", "wasn't seeing"],
  },
  {
    question: "We ____ in this city for ten years.",
    options: ["lived", "have lived", "live", "are living"],
  },
  {
    question: "____ you ever ____ sushi?",
    options: ["Did / eat", "Have / eaten", "Do / eat", "Are / eating"],
  },
  {
    question: "He ____ his keys, so he can't open the door.",
    options: ["lost", "has lost", "loses", "is losing"],
  },
  {
    question: "They ____ to the new house yet.",
    options: ["didn't move", "haven't moved", "don't move", "aren't moving"],
  },
  {
    question: "We ____ our project already.",
    options: ["finish", "have finished", "finished", "are finishing"],
  },
  {
    question: "We ____ our project already.",
    options: ["finish", "have finished", "finished", "are finishing"],
  },
  {
    question: "We ____ our project already.",
    options: ["finish", "have finished", "finished", "are finishing"],
  },
];

const totalQuestions = questions.length;
const testName = "Test 01: Present Perfect Tense";
const testDuration = 15 * 60;

const TestMultipleChoice = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));
  const [timeLeft, setTimeLeft] = useState(testDuration);

  const completedCount = answers.filter((a) => a !== null).length;
  const percent = Math.round((completedCount / totalQuestions) * 100);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () =>
    setCurrent((c) => Math.min(c + 1, totalQuestions - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));
  const handleJump = (idx) => setCurrent(idx);

  // Định dạng thời gian mm:ss
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-2">
      <Box className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Typography variant="h5" fontWeight={700} color="#1e293b">
            StudyHub
          </Typography>
          <Box className="flex items-center gap-2">
            <Chip
              icon={<AccessTimeOutlinedIcon />}
              label={formatTime(timeLeft)}
              color="primary"
              className="font-semibold flex items-center"
              sx={{
                fontSize: 16,
              }}
            />
            <Chip
              label={`Exercise ${current + 1} of ${totalQuestions}`}
              color="primary"
              variant="outlined"
              className="flex items-center"
              sx={{
                fontSize: 16,
              }}
            />
          </Box>
        </Box> */}
        {/* Tên bài kiểm tra */}
        <Box className="bg-white rounded-xl shadow p-4 mb-6 flex justify-between">
          <Typography variant="h6" fontWeight={700} color="#22223b">
            {testName}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color="primary"
            className="font-semibold flex items-center"
            sx={{
              fontSize: 16,
            }}
          />
        </Box>
        <Grid container spacing={3}>
          {/* Câu hỏi và đáp án */}
          <Grid item size={{ xs: 12, md: 8.5 }}>
            <Card className="rounded-xl shadow">
              <CardContent>
                {/* Câu hỏi */}
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#22223b"
                  sx={{ mb: 2 }}
                >
                  {current + 1}. {questions[current].question}
                </Typography>
                {/* Đáp án */}
                <RadioGroup
                  value={answers[current] || ""}
                  onChange={handleChange}
                >
                  {questions[current].options.map((opt, idx) => (
                    <Box
                      key={idx}
                      className="mb-3 border rounded-lg px-4 py-2 flex items-center hover:border-blue-400 transition"
                      sx={{
                        borderColor:
                          answers[current] === opt ? "#2563eb" : "#e5e7eb",
                        background:
                          answers[current] === opt ? "#f0f7ff" : "#fff",
                      }}
                    >
                      <FormControlLabel
                        value={opt}
                        control={<Radio color="primary" />}
                        label={<Typography fontWeight={500}>{opt}</Typography>}
                        className="w-full"
                      />
                    </Box>
                  ))}
                </RadioGroup>
                <Box className="flex justify-between mt-6 gap-2">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={current === 0}
                      onClick={handleBack}
                      sx={{
                        textTransform: "none",
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={current === totalQuestions - 1}
                      sx={{
                        textTransform: "none",
                      }}
                    >
                      Next
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    color="success"
                    //   disabled={completedCount < totalQuestions}
                    sx={{
                      textTransform: "none",
                    }}
                    onClick={() => navigate("/result")}
                  >
                    Submit Exercise
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Ma trận câu hỏi và tiến độ */}
          <Grid item size={{ xs: 12, md: 3.5 }}>
            <Card className="rounded-xl shadow mb-4">
              <CardContent>
                {/* Tiêu đề và Số lượng câu hỏi đã hoàn thành */}
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#22223b"
                  sx={{ mb: 1 }}
                >
                  Questions
                  <span className="ml-2 text-gray-500 text-sm font-normal">
                    {completedCount} / {totalQuestions} completed
                  </span>
                </Typography>

                {/* Ma trận các câu hỏi */}
                <Box className="grid grid-cols-5 gap-2 mb-3">
                  {questions.map((q, idx) => {
                    let color = "#e5e7eb"; // default
                    if (answers[idx] !== null) color = "#22c55e"; // xanh lá completed
                    if (idx === current) color = "#2563eb"; // xanh dương current
                    return (
                      <Button
                        key={idx}
                        variant="contained"
                        size="small"
                        onClick={() => handleJump(idx)}
                        sx={{
                          minWidth: 0,
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: color,
                          color: color === "#e5e7eb" ? "#22223b" : "#fff",
                          fontWeight: 700,
                          boxShadow: "none",
                          border:
                            color === "#e5e7eb" ? "1px solid #cbd5e1" : "none",
                        }}
                      >
                        {idx + 1}
                      </Button>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="#64748b"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {percent}%
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2 mb-2">
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      flex: 1,
                      background: "#e0e7ef",
                      "& .MuiLinearProgress-bar": { background: "#22c55e" },
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={2} className="mt-2">
                  <Box className="flex items-center gap-1">
                    <Button
                      size="small"
                      sx={{
                        minWidth: 0,
                        width: 20,
                        height: 20,
                        background: "#22c55e",
                        color: "#fff",
                        borderRadius: "50%",
                        p: 0,
                        boxShadow: "none",
                        "&:hover": { background: "#22c55e" },
                      }}
                    >
                      {" "}
                    </Button>
                    <Typography variant="caption" color="#22c55e">
                      Completed
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-1">
                    <Button
                      size="small"
                      sx={{
                        minWidth: 0,
                        width: 20,
                        height: 20,
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "50%",
                        p: 0,
                        boxShadow: "none",
                        "&:hover": { background: "#2563eb" },
                      }}
                    >
                      {" "}
                    </Button>
                    <Typography variant="caption" color="#2563eb">
                      Current
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-1">
                    <Button
                      size="small"
                      sx={{
                        minWidth: 0,
                        width: 20,
                        height: 20,
                        background: "#e5e7eb",
                        color: "#22223b",
                        borderRadius: "50%",
                        p: 0,
                        boxShadow: "none",
                        border: "1px solid #cbd5e1",
                        "&:hover": { background: "#e5e7eb" },
                      }}
                    >
                      {" "}
                    </Button>
                    <Typography variant="caption" color="#64748b">
                      Not answered
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TestMultipleChoice;
