import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBack, ArrowForward, Send } from "@mui/icons-material";

const mockQuestions = [
  {
    _id: "q1",
    questionText: "She _____ to school every day.",
    hint: "think of the present simple tense of 'go'",
  },
  {
    _id: "q2",
    questionText: "They have been living here _____ 2010.",
    hint: "use a preposition for time start",
  },
  {
    _id: "q3",
    questionText: "If it _____ tomorrow, we will cancel the trip.",
    hint: "think of 'rain' in the present simple",
  },
  {
    _id: "q4",
    questionText: "I have never _____ such a beautiful sunset.",
    hint: "use the past participle of 'see'",
  },
];

const FillInBlankTest = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(mockQuestions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = mockQuestions[current];

  const completedCount = useMemo(
    () => answers.filter((a) => a.trim() !== "").length,
    [answers]
  );

  const percent = Math.round((completedCount / mockQuestions.length) * 100);

  const handleChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const formattedAnswers = answers.map((ans, i) => ({
      questionId: mockQuestions[i]._id,
      answerText: ans.trim(),
    }));
    console.log("✅ Submitted answers:", formattedAnswers);
  };

  const handleNext = () => {
    if (current < mockQuestions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleJump = (idx) => setCurrent(idx);

  return (
    <Box
      sx={{
        p: 4,
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={3} color="primary">
        🧠 Fill-in-the-Blank Test
      </Typography>

      <Grid container spacing={3}>
        {/* Cột câu hỏi */}
        <Grid item xs={12} md={8.5}>
          <Paper
            component={motion.div}
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Question {current + 1} of {mockQuestions.length}
            </Typography>

            <Typography variant="subtitle1" fontWeight={500} mb={2}>
              {currentQuestion?.questionText
                .split("_____")
                .map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <TextField
                        size="small"
                        value={answers[current] || ""}
                        onChange={(e) => handleChange(e.target.value)}
                        sx={{
                          width: 180,
                          mx: 1,
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#e5e7eb" },
                            "&:hover fieldset": { borderColor: "#2563eb" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#2563eb",
                            },
                          },
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
            </Typography>

            {currentQuestion?.hint && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontStyle: "italic" }}
              >
                💡 Hint: {currentQuestion?.hint}
              </Typography>
            )}
          </Paper>

          {/* Nút điều hướng */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handlePrev}
              disabled={current === 0}
            >
              Previous
            </Button>

            {current === mockQuestions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                endIcon={<Send />}
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? "Submitted" : "Submit"}
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Grid>

        {/* Cột điều hướng câu hỏi */}
        <Grid item xs={12} md={3.5}>
          <Card
            className="rounded-xl shadow-sm"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#22223b"
                sx={{ mb: 1 }}
              >
                Questions
                <span className="ml-2 text-gray-500 text-sm font-normal">
                  {completedCount} / {mockQuestions.length} completed
                </span>
              </Typography>

              {/* Nút số câu hỏi */}
              <Box
                className="grid grid-cols-5 gap-2 mb-3"
                sx={{ flexShrink: 0 }}
              >
                {mockQuestions.map((q, idx) => {
                  let color = "#e5e7eb";
                  if (answers[idx].trim() !== "") color = "#22c55e";
                  if (idx === current) color = "#2563eb";

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
                        fontWeight: 700,
                        background: color,
                        color: color === "#e5e7eb" ? "#22223b" : "#fff",
                        boxShadow: "none",
                        border: "1px solid transparent",
                        borderColor:
                          color === "#e5e7eb" ? "#cbd5e1" : "transparent",
                        "&:hover": { background: color, opacity: 0.9 },
                      }}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </Box>

              {/* Thanh tiến độ */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="#64748b" fontWeight={700}>
                  Progress
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {percent}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  background: "#e0e7ef",
                  "& .MuiLinearProgress-bar": {
                    background: "#22c55e",
                  },
                }}
              />

              {/* Legend */}
              <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                <Box className="flex items-center gap-1">
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#22c55e",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#22c55e" }}>
                    Completed
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1">
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#2563eb",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#2563eb" }}>
                    Current
                  </Typography>
                </Box>
                <Box className="flex items-center gap-1">
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#e5e7eb",
                      border: "1px solid #cbd5e1",
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Not answered
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FillInBlankTest;
