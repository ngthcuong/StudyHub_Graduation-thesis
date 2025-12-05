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
  CircularProgress,
  Skeleton,
  Fade,
  Alert,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {
  useGenerateCustomTestMutation,
  useGetTestByIdMutation,
  useCreateAttemptMutation,
  useSubmitTestMutation,
  useGetQuestionsByAttemptIdMutation,
} from "../../services/testApi";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLogStudySessionMutation } from "../../services/StudyStatsApi";

// Không còn dùng useParams, useLocation, useNavigate từ react-router-dom
// Nên tôi sẽ giả lập chức năng của chúng.

// -------------------------------------------------------------------
// MOCK API FUNCTION & DATA
// -------------------------------------------------------------------

// 1. Dữ liệu từ FE (Đã giả lập và cố định)
const MOCK_PAYLOAD_FORM = {
  timeLimit: 20, // Phút
  numQuestions: 10,
  level: "A1",
  title: "Bài Test Tùy Chỉnh Ngữ Pháp A1",
};

// 2. Dữ liệu Câu hỏi (Mảng câu hỏi thực tế)
const ACTUAL_API_QUESTIONS_DATA = [
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "If you ____ the report by Friday, we will have enough time to review it before the presentation.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "finish",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0d8",
      },
      { optionText: "finished", isCorrect: false, _id: "68f7588ad370ef4d0d9" },
      {
        optionText: "will finish",
        isCorrect: false,
        _id: "68f7588ad370ef4d0da",
      },
      {
        optionText: "had finished",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0db",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Conditionals: Type 1"],
    _id: "68f7588ad37093220ef4d0d7",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText: "The team meeting is scheduled ____ 10:00 AM ____ Monday.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "on, at",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0dd",
      },
      {
        optionText: "at, on",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0de",
      },
      {
        optionText: "in, on",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0df",
      },
      {
        optionText: "at, in",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0e0",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Prepositions: Time"],
    _id: "68f7588ad37093220ef4d0dc",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "If we ____ a larger budget, we could invest in new equipment.",
    questionType: "multiple_choice",
    options: [
      { optionText: "had", isCorrect: true, _id: "68f7588ad37093220ef4d0e2" },
      { optionText: "have", isCorrect: false, _id: "68f7588ad37093220ef4d0e3" },
      {
        optionText: "would have",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0e4",
      },
      {
        optionText: "will have",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0e5",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Conditionals: Type 2"],
    _id: "68f7588ad37093220ef4d0e1",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "Our new office is located ____ the third floor ____ the main building.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "in, at",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0e7",
      },
      {
        optionText: "on, in",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0e8",
      },
      {
        optionText: "at, on",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0e9",
      },
      {
        optionText: "in, on",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0ea",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Prepositions: Place"],
    _id: "68f7588ad37093220ef4d0e6",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "If you ____ your login password three times incorrectly, your account ____ locked.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "enter, is",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0ec",
      },
      {
        optionText: "enter, will be",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0ed",
      },
      {
        optionText: "entered, was",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0ee",
      },
      {
        optionText: "entering, is",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0ef",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Conditionals: Type 1"],
    _id: "68f7588ad37093220ef4d0eb",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "We received several complaints ____ the new software update.",
    questionType: "multiple_choice",
    options: [
      { optionText: "for", isCorrect: false, _id: "68f7588ad37093220ef4d0f1" },
      { optionText: "about", isCorrect: true, _id: "68f7588ad37093220ef4d0f2" },
      { optionText: "on", isCorrect: false, _id: "68f7588ad37093220ef4d0f3" },
      { optionText: "with", isCorrect: false, _id: "68f7588ad37093220ef4d0f4" },
    ],
    points: 1,
    skill: "Vocabulary",
    topic: ["Dependent Prepositions"],
    _id: "68f7588ad37093220ef4d0f0",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "We ____ the project on schedule if the new components ____ delivered by Tuesday.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "will finish, are",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0f6",
      },
      {
        optionText: "finish, are",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0f7",
      },
      {
        optionText: "will finish, were",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0f8",
      },
      {
        optionText: "finish, will be",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0f9",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Conditionals: Type 1"],
    _id: "68f7588ad37093220ef4d0f5",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText: "The package will be shipped ____ New York ____ London.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "from, to",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d0fb",
      },
      {
        optionText: "to, from",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0fc",
      },
      {
        optionText: "with, for",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0fd",
      },
      {
        optionText: "by, at",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d0fe",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Prepositions: Movement/Direction"],
    _id: "68f7588ad37093220ef4d0fa",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "If I ____ more experience in marketing, I ____ for that senior position.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "had, would apply",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d100",
      },
      {
        optionText: "have, will apply",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d101",
      },
      {
        optionText: "had, will apply",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d102",
      },
      {
        optionText: "would have, applied",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d103",
      },
    ],
    points: 1,
    skill: "Grammar",
    topic: ["Conditionals: Type 2"],
    _id: "68f7588ad37093220ef4d0ff",
  },
  {
    testId: "68f755108fc030e6964bca43",
    questionText:
      "The team leader is responsible ____ overseeing the project and delegating tasks ____ team members.",
    questionType: "multiple_choice",
    options: [
      {
        optionText: "for, to",
        isCorrect: true,
        _id: "68f7588ad37093220ef4d105",
      },
      {
        optionText: "with, for",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d106",
      },
      {
        optionText: "of, on",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d107",
      },
      {
        optionText: "about, with",
        isCorrect: false,
        _id: "68f7588ad37093220ef4d108",
      },
    ],
    points: 1,
    skill: "Vocabulary",
    topic: ["Prepositions: Dependent & Usage"],
    _id: "68f7588ad37093220ef4d104",
  },
];

const learningTips = [
  "Did you know? 'Bookkeeper' has three consecutive double letters.",
  "Quick Tip: Use flashcards to remember new vocabulary.",
  "Getting your brain ready for a challenge...",
  "Remember to read the entire question carefully before answering.",
  "Fun Fact: 'I am' is the shortest complete sentence in English.",
  "Almost there... Good luck!",
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

const TestMultipleChoiceCustom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const [day, setDay] = useState(null);

  const { payloadForm, attemptDetail } = location.state || {};
  const routeTestId = payloadForm?.testId;

  const [generateCustomTest] = useGenerateCustomTestMutation();
  const [getTestById] = useGetTestByIdMutation();
  const [createAttempt] = useCreateAttemptMutation();
  const [submitTestTrigger] = useSubmitTestMutation();
  const [getQuestionsByAttemptId] = useGetQuestionsByAttemptIdMutation();
  const [logStudySession] = useLogStudySessionMutation();

  const start = async () => {
    if (
      attemptDetail &&
      attemptDetail?.attemptNumber < attemptDetail?.maxAttempts
    ) {
      try {
        const now = new Date();
        const isoString = now.toISOString();
        setDate(isoString);

        const res = await getQuestionsByAttemptId(attemptDetail?._id).unwrap();
        setQuestions({ data: res });
        setData({ data: res });
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

            const res = await generateCustomTest({
              testId: payloadForm?.testId,
              testAttemptId: attemptRes?.data?._id,
              level: payloadForm?.level,
              toeicScore: payloadForm?.toeicScore,
              weakSkills: payloadForm?.weakSkills,
              exam_type: "TOEIC",
              topics: payloadForm?.topics,
              difficulty: payloadForm?.difficulty,
              question_ratio: "MCQ",
              numQuestions: payloadForm?.numQuestions,
              timeLimit: payloadForm?.timeLimit,
            }).unwrap();
            console.log("Generated Custom Test Data:", res);
            setData(res);
            setQuestions(res);
            setLoading(false);

            // lấy ngày hiện tại
            const d = new Date().getDate();
            setDay(d);
          } catch (error) {
            console.error("Error setting test data:", error);
          }
        } catch (error) {
          console.error("Error fetching test by ID:", error);
        }
      } catch (error) {
        console.error("Error generating custom test:", error);
      }
    }
  };

  useEffect(() => {
    start();
  }, []);

  // KHỞI TẠO DỮ LIỆU TEST NGAY LẬP TỨC
  const numQuestionsInTest = data?.data?.data?.length;
  // const timeLimitInMinutes = MOCK_PAYLOAD_FORM.timeLimit;
  // const testTitle = MOCK_PAYLOAD_FORM?.title;

  const [questions, setQuestions] = useState();
  const [attemptId, setAttemptId] = useState("");
  const [test, setTest] = useState();

  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (test?.durationMin) {
      const duration = test.durationMin;
      setTimeLeft(duration * 60);
    }
  }, [test]);

  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState(
    Array(numQuestionsInTest).fill(null)
  );

  const [isPaused, setIsPaused] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const [submissionTipIndex, setSubmissionTipIndex] = useState(0);

  const actualQuestionCount = numQuestionsInTest;

  const completedCount = answersP.filter((a) => a !== null).length;
  const percent = Math.round((completedCount / actualQuestionCount) * 100);

  // -------------------------------------------------------------------
  // USE EFFECTS
  // -------------------------------------------------------------------
  // Logic đếm ngược thời gian (Giữ nguyên)
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    if (timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused]);

  // Logic Tips khi Loading (Đã bị loại bỏ vì loading = false)
  // Nếu muốn xem tips, bạn có thể đặt setLoading(true) trong useEffect đầu tiên
  // và gọi setTimeout để setQuestions, setTest sau đó.

  const handleChange = (e) => {
    const newAnswers = [...answersP];
    const selectedOptionText = e.target.value;
    const selectedOption = questions.data.data[current].options.find(
      (opt) => opt.optionText === selectedOptionText
    );
    newAnswers[current] = selectedOption?._id || null;
    setAnswersP(newAnswers);
  };

  const handleNext = () =>
    setCurrent((c) => Math.min(c + 1, actualQuestionCount - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));
  const handleJump = (idx) => setCurrent(idx);

  function formatTime(s) {
    if (s === null || isNaN(s) || s < 0) return "00 : 00";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const formattedM = String(m).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");
    return `${formattedM} : ${formattedSec}`;
  }

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsPaused(true);

    const formattedAnswers = answersP.map((selectedOptionId, index) => ({
      questionId: questions?.data?.data[index]._id,
      selectedOptionId: selectedOptionId,
    }));

    // const past = new Date(date);
    // const now = new Date();

    // const diffMs = now - past;

    // const diffSeconds = Math.floor(diffMs / 1000);

    // console.log("Logging study session with:", {
    //   exercises: attemptDetail?.testId?._id,
    //   durationSeconds: diffSeconds,
    //   day,
    // });
    // await logStudySession({
    //   day,
    //   exercises: attemptDetail?.testId?._id,
    //   durationSeconds: diffSeconds,
    // }).unwrap();

    try {
      const answers = formattedAnswers;
      const startTime = date;
      const testId = payloadForm?.testId || attemptDetail?.testId?._id;

      const response = await submitTestTrigger({
        attemptId,
        answers,
        testId,
        startTime,
      }).unwrap();

      if (response) {
        navigate(`/test/${testId}/result`, {
          state: { resultData: response, formattedAnswers: formattedAnswers },
        });
      }
    } catch (error) {
      console.log("Error during submission:", error);
      alert(
        "Có lỗi xảy ra khi gửi dữ liệu!",
        error.data?.message || error.message
      );
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
      setIsPaused(false);
    }
  };

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

  // -------------------------------------------------------------------
  // GIAO DIỆN RENDERING
  // -------------------------------------------------------------------

  // Dòng code này sẽ KHÔNG bao giờ chạy vì payloadForm có sẵn
  if (!payloadForm && !attemptDetail) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" variant="filled">
          Unable to load the test. Missing test configuration data. Please
          create the test again.
        </Alert>
      </Box>
    );
  }

  // Dòng code này sẽ KHÔNG bao giờ chạy vì loading = false và data có sẵn
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

  const currentQuestion = questions.data.data[current];

  // -------------------------------------------------------------------
  // GIAO DIỆN CHÍNH
  // -------------------------------------------------------------------
  return (
    <Box className="min-h-screen bg-gray-50 px-2 pt-0 pb-8">
      <Box className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
          <Typography variant="h6" fontWeight={700} color="#22223b">
            {test?.title}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 5 * 60 ? "error" : "primary"}
            className="font-semibold flex items-center"
            sx={{ fontSize: 16 }}
          />
        </Box>

        {/* Nội dung chính */}
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            {/* Cột trái - Câu hỏi */}
            <Grid item size={{ xs: 12, md: 8.5 }}>
              <Card
                className="rounded-xl shadow-sm"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  {/* Câu hỏi */}
                  <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="#22223b"
                      sx={{
                        mb: 2,
                        maxHeight: 80,
                        overflowY: "auto",
                        lineHeight: 1.4,
                        scrollbarWidth: "thin",
                      }}
                    >
                      {current + 1}. {currentQuestion.questionText}
                    </Typography>

                    {/* Danh sách đáp án */}
                    <RadioGroup
                      value={
                        answersP[current]
                          ? currentQuestion.options.find(
                              (opt) => opt._id === answersP[current]
                            )?.optionText || ""
                          : ""
                      }
                      onChange={handleChange}
                    >
                      {currentQuestion.options.map((opt, idx) => (
                        <Box
                          key={opt._id || idx}
                          className="mb-3 border rounded-lg px-4 py-2 flex items-center hover:border-blue-400 transition"
                          sx={{
                            borderColor:
                              answersP[current] === opt._id
                                ? "#2563eb"
                                : "#e5e7eb",
                            background:
                              answersP[current] === opt._id
                                ? "#f0f7ff"
                                : "#fff",
                            height: 56,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            value={opt.optionText}
                            control={<Radio color="primary" />}
                            label={
                              <Typography
                                fontWeight={500}
                                noWrap
                                sx={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  width: "100%",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {opt.optionText}
                              </Typography>
                            }
                            className="w-full"
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  </Box>

                  {/* Nút điều hướng */}
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
                      disabled={
                        isSubmitting || answersP.some((a) => a === null)
                      }
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Exercise"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Cột phải - Sidebar */}
            <Grid item size={{ xs: 12, md: 3.5 }}>
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
                      {completedCount} / {actualQuestionCount} completed
                    </span>
                  </Typography>

                  <Box
                    className="grid grid-cols-5 gap-2 mb-3"
                    sx={{ flexShrink: 0 }}
                  >
                    {/* Render các nút câu hỏi dựa trên số lượng câu hỏi thực tế */}
                    {questions.data.data.map((q, idx) => {
                      let color = "#e5e7eb";
                      if (answersP[idx] !== null) color = "#22c55e";
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
                            lineHeight: "normal",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            background: color,
                            color: color === "#e5e7eb" ? "#22223b" : "#fff",
                            boxShadow: "none",
                            border: "1px solid transparent",
                            borderColor:
                              color === "#e5e7eb" ? "#cbd5e1" : "transparent",
                            transition:
                              "background 0.2s ease, opacity 0.2s ease, border-color 0.2s ease",
                            "&:hover": {
                              background: color,
                              opacity: 0.9,
                            },
                          }}
                        >
                          {idx + 1}
                        </Button>
                      );
                    })}
                  </Box>

                  {/* Thanh tiến độ và Legend giữ nguyên */}
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
                        "& .MuiLinearProgress-bar": {
                          background: "#22c55e",
                        },
                      }}
                    />
                  </Box>

                  {/* Legend */}
                  <Stack
                    direction="row"
                    spacing={2}
                    className="mt-2"
                    flexWrap="wrap"
                  >
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
      </Box>
    </Box>
  );
};

export default TestMultipleChoiceCustom;
