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
  Fade,
  Skeleton,
  TextField,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateAttemptMutation,
  useGenerateCustomTestMutation,
  useGetQuestionsByAttemptIdMutation,
  useGetTestByIdMutation,
  useSubmitTestMutation,
} from "../../services/testApi";
import { useLogStudySessionMutation } from "../../services/StudyStatsApi";

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

const submissionTips = [
  "Analyzing your answers...",
  "Calculating your score...",
  "Generating personalized recommendations...",
  "Creating your study plan...",
  "Almost done! Preparing your results...",
  "Great job! Finalizing your test results...",
];

// -------------------------------------------------------------------

const FillInBlankTest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [date, setDate] = useState(null);

  const { payloadForm, attemptDetail } = location.state || {};

  const [generateCustomTest] = useGenerateCustomTestMutation();
  const [getTestById] = useGetTestByIdMutation();
  const [createAttempt] = useCreateAttemptMutation();
  const [submitTestTrigger] = useSubmitTestMutation();
  const [getQuestionsByAttemptId] = useGetQuestionsByAttemptIdMutation();
  const [logStudySession] = useLogStudySessionMutation();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState([]);

  const [timeLeft, setTimeLeft] = useState(MOCK_PAYLOAD_FORM.timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [test, setTest] = useState(null);
  const [submissionTipIndex, setSubmissionTipIndex] = useState(0);
  const [day, setDay] = useState(null);

  const routeTestId = payloadForm?.testId;

  useEffect(() => {
    const fetchData = async () => {
      if (
        attemptDetail &&
        attemptDetail?.attemptNumber < attemptDetail?.maxAttempts
      ) {
        try {
          const now = new Date();
          const isoString = now.toISOString();
          setDate(isoString);

          const res = await getQuestionsByAttemptId(
            attemptDetail?._id
          ).unwrap();
          console.log("Fetched questions for existing attempt:", res);
          setQuestions(res?.data);
          setAnswersP(
            res?.data?.map((q) =>
              q.questionText
                .split(/_+/g)
                .slice(0, -1)
                .map(() => "")
            )
          );
          setTest(attemptDetail?.testId);
          setAttemptId(attemptDetail?._id);
          setLoading(false);

          // lấy ngày hiện tại
          const d = new Date().getDate();
          setDay(d);
        } catch (error) {
          console.error("Error resuming existing attempt:", error);
        }
      } else {
        try {
          setLoading(true);

          const attemptRes = await createAttempt({
            testPoolId: "000000000000000000000000",
            testId: payloadForm?.testId,
            maxAttempts: 3,
          }).unwrap();
          setAttemptId(attemptRes?.data?._id);
          try {
            const testRes = await getTestById(routeTestId).unwrap();
            setTest(testRes);
            try {
              const now = new Date();
              const isoString = now.toISOString();
              setDate(isoString);

              let typeQuestion = "MCQ";
              if (payloadForm?.questionType === "FIB") {
                typeQuestion = "Gap-fill";
              }

              const res = await generateCustomTest({
                testId: payloadForm?.testId,
                testAttemptId: attemptRes?.data?._id,
                level: payloadForm?.level,
                toeicScore: payloadForm?.toeicScore,
                weakSkills: payloadForm?.weakSkills,
                exam_type: "TOEIC",
                topics: payloadForm?.topics,
                difficulty: payloadForm?.difficulty,
                question_ratio: typeQuestion,
                numQuestions: payloadForm?.numQuestions,
                timeLimit: payloadForm?.timeLimit,
              }).unwrap();
              console.log("Generated custom test:", res);
              setQuestions(res?.data?.data);
              setAnswersP(
                res?.data?.data?.map((q) =>
                  q.questionText
                    .split(/_+/g)
                    .slice(0, -1)
                    .map(() => "")
                )
              );
              setLoading(false);
              // lấy ngày hiện tại
              const d = new Date().getDate();
              setDay(d);
            } catch (error) {
              console.error("Error setting test data:", error);
            }
          } catch (error) {
            console.error("Error fetching questions by attempt ID:", error);
          }
        } catch (error) {
          console.error("Error generating test:", error);
        }
      }
    };

    fetchData();
  }, [payloadForm]);

  const actualQuestionCount = questions?.length;
  const completedCount = answersP?.filter((blanks) =>
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

  // for submit tips
  useEffect(() => {
    let submissionIntervalId = null;

    if (isSubmitting) {
      submissionIntervalId = setInterval(() => {
        setSubmissionTipIndex(
          (prevIndex) => (prevIndex + 1) % submissionTips.length
        );
      }, 2000); // Thay đổi tip mỗi 2 giây cho submission
    }

    return () => {
      if (submissionIntervalId) {
        clearInterval(submissionIntervalId);
      }
    };
  }, [submissionTips.length, isSubmitting]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formattedAnswers = questions.map((question, index) => {
      const userAnswer = (answersP[index]?.[0] || "").trim().toLowerCase();

      const matchedOption = question.options.find(
        (opt) => opt.optionText.trim().toLowerCase() === userAnswer
      );

      return {
        questionId: question._id,
        selectedOptionId: matchedOption ? matchedOption._id : null,
        userAnswerText: matchedOption ? null : userAnswer || "",
      };
    });

    try {
      const answers = formattedAnswers.map((item) => {
        const { userAnswerText: _userAnswerText, ...rest } = item;
        return rest;
      });

      console.log("Submitting answers:", answers);

      const startTime = date;
      const testId = payloadForm?.testId || attemptDetail?.testId?._id;

      const response = await submitTestTrigger({
        attemptId,
        answers,
        testId,
        startTime,
      }).unwrap();

      if (response) {
        // const past = new Date(startTime);
        // const now = new Date();

        // const diffMs = now - past;

        // const diffSeconds = Math.floor(diffMs / 1000);

        // await logStudySession({
        //   day,
        //   exercises: attemptDetail?.testId?._id,
        //   durationSeconds: diffSeconds,
        // }).unwrap();

        navigate(`/test/${testId}/result`, {
          state: { resultData: response, formattedAnswers: formattedAnswers },
        });
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("ERROR submitting test:", error.data?.message || error.message);
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
  };

  if (isSubmitting) {
    return (
      <Box
        className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            width: "100%",
            maxWidth: "600px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#059669" }}>
            Submitting Your Test
          </Typography>

          <CircularProgress
            size={60}
            sx={{
              color: "#059669",
              animation: "pulse 2s infinite",
            }}
          />

          <Fade in={true} timeout={1000} key={submissionTipIndex}>
            <Typography
              variant="h6"
              sx={{
                color: "#047857",
                minHeight: "48px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {submissionTips[submissionTipIndex]}
            </Typography>
          </Fade>

          <Box sx={{ width: "100%", pt: 2 }}>
            <Card
              sx={{ p: 3, bgcolor: "white", borderRadius: 3, boxShadow: 3 }}
            >
              <Stack spacing={2}>
                <Typography variant="body1" color="#374151" fontWeight={600}>
                  Your test is being processed...
                </Typography>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#d1fae5",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#059669",
                      animation: "pulse 1.5s ease-in-out infinite",
                    },
                  }}
                />
                <Typography variant="body2" color="#6b7280">
                  Please wait while we analyze your answers and prepare your
                  personalized results.
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Box>
    );
  }

  const currentQuestion = questions[current];

  if (loading || !questions || !test) {
    return (
      <Box
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "600px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#34495e" }}>
            Preparing Your Test
          </Typography>

          <Fade in={true} timeout={1000} key={tipIndex}>
            <Typography
              sx={{
                color: "#7f8c8d",
                minHeight: "48px",
              }}
            >
              {learningTips[tipIndex]}
            </Typography>
          </Fade>

          <Box sx={{ width: "100%", pt: 2 }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "2rem", bgcolor: "grey.200" }}
            />
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={50}
                  sx={{ borderRadius: 2, mt: 1, bgcolor: "grey.200" }}
                />
              ))}
            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 3 }}>
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                sx={{ borderRadius: 2, bgcolor: "grey.200" }}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  }

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
            {currentQuestion?.questionText
              ?.split(/_+/g)
              ?.map((part, i, arr) => (
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
