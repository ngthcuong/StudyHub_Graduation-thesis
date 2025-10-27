import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip,
  Stack,
  CircularProgress,
  TextField,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

// -------------------------------------------------------------------
// MOCK DATA FIB
// -------------------------------------------------------------------
const MOCK_PAYLOAD_FORM = {
  timeLimit: 20, // phút
  numQuestions: 5,
  level: "A1",
  title: "Bài Test Tùy Chỉnh Ngữ Pháp A1",
};

const MOCK_QUESTIONS = [
  {
    questionText:
      "If you ____ the report by Friday, we will have enough time to review it.",
  },
  {
    questionText: "The team meeting is scheduled ____ 10:00 AM ____ Monday.",
  },
  {
    questionText:
      "If we ____ a larger budget, we could invest in new equipment.",
  },
  {
    questionText:
      "Our new office is located ____ the third floor ____ the main building.",
  },
  {
    questionText: "If I ____ more experience, I ____ for the senior position.",
  },
];

const learningTips = [
  "Tip: Read carefully before filling blanks.",
  "Tip: Think about grammar rules.",
  "Tip: Check your answers before submitting.",
  "Tip: Use flashcards to remember new words.",
];

// -------------------------------------------------------------------

const FillInBlankTest = () => {
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState(
    MOCK_QUESTIONS.map((q) =>
      q.questionText
        .split("____")
        .slice(0, -1)
        .map(() => "")
    )
  );
  const [timeLeft, setTimeLeft] = useState(MOCK_PAYLOAD_FORM.timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const actualQuestionCount = questions.length;
  const completedCount = answersP.filter((blanks) =>
    blanks.every((b) => b.trim() !== "")
  ).length;
  const percent = Math.round((completedCount / actualQuestionCount) * 100);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle FIB input
  const handleChange = (value, blankIndex) => {
    const newAnswers = [...answersP];
    newAnswers[current][blankIndex] = value;
    setAnswersP(newAnswers);
  };

  const handleNext = () =>
    setCurrent((c) => Math.min(c + 1, actualQuestionCount - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));
  const handleJump = (idx) => setCurrent(idx);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")} : ${String(sec).padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    console.log("Submitted Answers:", answersP);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const currentQuestion = questions[current];

  return (
    <Box className="min-h-screen bg-gray-50 px-4 py-6">
      <Box className="max-w-4xl mx-auto">
        {/* Header */}
        <Box className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
          <Typography variant="h6" fontWeight={700}>
            {MOCK_PAYLOAD_FORM.title}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 5 * 60 ? "error" : "primary"}
          />
        </Box>

        {/* Question */}
        <Card className="rounded-xl shadow p-4 mb-4">
          <Typography variant="subtitle1" fontWeight={600}>
            {current + 1}.{" "}
            {currentQuestion.questionText.split("____").map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <TextField
                    size="small"
                    value={answersP[current]?.[i] || ""}
                    onChange={(e) => handleChange(e.target.value, i)}
                    sx={{ width: 140, mx: 1 }}
                  />
                )}
              </React.Fragment>
            ))}
          </Typography>
        </Card>

        {/* Navigation */}
        <Box
          className="flex justify-between mt-6 gap-2"
          sx={{ flexShrink: 0, mt: 4 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={current === 0}
              onClick={handleBack}
              sx={{ textTransform: "none", width: 100 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={current === actualQuestionCount - 1}
              sx={{ textTransform: "none", width: 100 }}
            >
              Next
            </Button>
          </Box>

          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none", width: 160 }}
            onClick={handleSubmit}
            disabled={isSubmitting || answersP.some((a) => a === null)}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit Exercise"
            )}
          </Button>
        </Box>

        {/* Sidebar */}
        <Box className="mb-4">
          <Typography>
            Completed: {completedCount} / {actualQuestionCount}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 10, borderRadius: 5, mt: 1 }}
          />
        </Box>

        {/* Tip */}
        <Typography sx={{ color: "#7f8c8d", mt: 2 }}>
          {learningTips[tipIndex]}
        </Typography>
      </Box>
    </Box>
  );
};

export default FillInBlankTest;
