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
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetAttemptByTestAndUserMutation,
  useCreateAttemptMutation,
  useSubmitTestMutation,
  useGetQuestionsByTestIdMutation,
  useGetTestByTestIdMutation,
  // useUpdateTestPoolMutation,
} from "../../services/testApi";
import { useLogStudySessionMutation } from "../../services/StudyStatsApi";

const TestMultipleChoice = () => {
  const navigate = useNavigate();
  const { id: testId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState();
  const [attemptId, setAttemptId] = useState();
  const [date, setDate] = useState(null);
  const [test, setTest] = useState(null);

  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState(
    Array(questions?.data?.length).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(null); // thời gian làm bài tính bằng phút
  const [isPaused, setIsPaused] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false); // State để quản lý trạng thái loading khi submit
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading khi load test

  const completedCount = answersP.filter((a) => a !== null).length;
  const percent = Math.round((completedCount / answersP.length) * 100);

  useEffect(() => {
    startTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  useEffect(() => {
    const fetchTestAndSetDuration = async () => {
      if (testId && timeLeft === null) {
        try {
          const res = await getTestByTestId(testId).unwrap();
          setTest(res);
          const durationMin = res?.data?.durationMin;
          if (durationMin && durationMin > 0) {
            setTimeLeft(durationMin * 60);
          }
        } catch (error) {
          console.error("Error fetching test:", error);
        }
      }
    };

    fetchTestAndSetDuration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  // Gọi API

  const [getAttemptByTestAndUserTrigger] = useGetAttemptByTestAndUserMutation();
  const [createAttemptTrigger] = useCreateAttemptMutation();
  const [submitTestTrigger] = useSubmitTestMutation();
  const [getQuestionsByTestIdTrigger] = useGetQuestionsByTestIdMutation();
  const [getTestByTestId] = useGetTestByTestIdMutation();
  const [logStudySession] = useLogStudySessionMutation();

  const startTest = async () => {
    try {
      setLoading(true);
      const res = await getQuestionsByTestIdTrigger(testId).unwrap();
      setQuestions(res);
      setAnswersP(Array(res?.data?.length).fill(null));

      let resAttempt;

      try {
        resAttempt = await getAttemptByTestAndUserTrigger({
          testId: testId,
          userId: user?._id,
        }).unwrap();
        setAttemptId(resAttempt?.data[0]?._id);

        const now = new Date();
        const isoString = now.toISOString();
        setDate(isoString);
      } catch (error) {
        console.log("No attempt info found:", error);
      }
      if (!resAttempt?.data?.length > 0) {
        try {
          const resStartAttempt = await createAttemptTrigger({
            testId: testId,
            maxAttempts: 10000,
          }).unwrap();
          setAttemptId(resStartAttempt.data._id);

          const now = new Date();
          const isoString = now.toISOString();
          setDate(isoString);
        } catch (error) {
          console.log("No attempt info found:", error);
        }
      }
    } catch (error) {
      console.error("Error starting test:", error);
    } finally {
      setLoading(false);
    }
  };

  // Đếm ngược thời gian (giữ nguyên)
  useEffect(() => {
    // Nếu hết giờ → nộp bài
    if (timeLeft === null) {
      return;
    }

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    // Nếu chưa hết giờ và không tạm dừng → chạy timer
    if (timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused]);

  const handleChange = (e) => {
    const newAnswers = [...answersP];
    const selectedOptionText = e.target.value;
    const selectedOption = questions?.data[current].options.find(
      (opt) => opt.optionText === selectedOptionText
    );
    newAnswers[current] = selectedOption?._id || null;
    setAnswersP(newAnswers);
  };

  const handleNext = () =>
    setCurrent((c) => Math.min(c + 1, questions?.data.length - 1));
  const handleBack = () => setCurrent((c) => Math.max(c - 1, 0));
  const handleJump = (idx) => setCurrent(idx);

  function formatTime(s) {
    // console.log("Formatting time:", s); // Bỏ log này nếu lỗi NaN đã biến mất
    if (s === null || isNaN(s) || s < 0) return "00:00";
    const m = Math.floor(s / 60);
    const sec = s % 60; // Thêm số 0 phía trước nếu cần

    const formattedM = String(m).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");

    return `${formattedM} : ${formattedSec}`;
  }

  // --- HÀM SUBMIT GIẢ ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsPaused((prev) => !prev);
    const formattedAnswers = answersP.map((selectedOptionId, index) => ({
      questionId: questions?.data[index]._id,
      selectedOptionId: selectedOptionId,
    }));

    // lấy thời gian làm bài
    const past = new Date(date);
    const now = new Date();
    const day = new Date().getDate();

    const diffMs = now - past;

    const diffSeconds = Math.floor(diffMs / 1000);

    console.log("Logging study session with:", {
      exercises: testId,
      durationSeconds: diffSeconds,
      day,
    });
    await logStudySession({
      day,
      exercises: testId,
      durationSeconds: diffSeconds,
    }).unwrap();

    console.log("FE payload:", {
      attemptId,
      answers: formattedAnswers,
      testId,
      startTime: date,
    });

    const answers = formattedAnswers;
    const startTime = date;

    let response = null;
    try {
      response = await submitTestTrigger({
        attemptId,
        answers,
        testId,
        startTime,
      }).unwrap();
    } catch (error) {
      alert(
        "Có lỗi xảy ra khi gửi dữ liệu!",
        error.data?.message || error.message
      );
      setIsSubmitting(false);
    }

    console.log("Simulated API response:", response);

    if (response) {
      navigate(`/test/${testId}/result`, {
        state: { resultData: response },
      });
    }

    setIsSubmitting(false);
  };

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

  // ...bên trong component của bạn

  // ✅ BƯỚC 1: Di chuyển các hook ra ngoài và gọi chúng ở cấp cao nhất.
  const [tipIndex, setTipIndex] = useState(0);
  const [submissionTipIndex, setSubmissionTipIndex] = useState(0);

  useEffect(() => {
    // ✅ BƯỚC 2: Đặt điều kiện bên trong useEffect để chỉ chạy interval khi cần.
    let intervalId = null;

    if (loading || !questions) {
      intervalId = setInterval(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % learningTips.length);
      }, 3000);
    }

    console.log("useEffect chạy lại", { loading, questions });

    // Dọn dẹp interval khi component unmount hoặc khi loading kết thúc.
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [learningTips.length, loading, questions]); // Thêm dependencies để useEffect chạy lại khi state thay đổi.

  // useEffect cho submission tips
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

  if (loading || !questions) {
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
            {/* ...Nội dung Skeleton giữ nguyên... */}
            <Skeleton
              variant="text"
              sx={{ fontSize: "2rem", bgcolor: "grey.200" }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 2, mt: 2, bgcolor: "grey.200" }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 2, mt: 1, bgcolor: "grey.200" }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 2, mt: 1, bgcolor: "grey.200" }}
            />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{ borderRadius: 2, mt: 1, bgcolor: "grey.200" }}
            />
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

  // Loading screen for submission
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

  return (
    <Box className="min-h-screen bg-gray-50 px-2 pt-0 pb-8">
      <Box className="max-w-6xl mx-auto">
        {/* Header */}
        <Box className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
          <Typography variant="h6" fontWeight={700} color="#22223b">
            {test?.data.title || "Multiple Choice Test"}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 5 * 60 ? "error" : "primary"}
            className="font-semibold flex items-center"
            sx={{ fontSize: 16 }}
          />
        </Box>

        {/* ✅ Bọc Grid trong Box để căn ngang hoàn hảo */}
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            {/* Cột trái - Câu hỏi (2/3 chiều rộng) */}
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
                      {current + 1}. {questions?.data[current]?.questionText}
                    </Typography>

                    {/* Danh sách đáp án */}
                    <RadioGroup
                      value={
                        answersP[current]
                          ? questions?.data[current].options.find(
                              (opt) => opt._id === answersP[current]
                            )?.optionText || ""
                          : ""
                      }
                      onChange={handleChange}
                    >
                      {questions?.data[current].options.map((opt, idx) => (
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
                        disabled={current === questions?.data.length - 1}
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
                        "Submit"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Cột phải - Sidebar (1/3 chiều rộng) */}
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
                      {completedCount} / {10} completed
                    </span>
                  </Typography>

                  <Box
                    className="grid grid-cols-5 gap-2 mb-3"
                    sx={{ flexShrink: 0 }}
                  >
                    {questions?.data.map((q, idx) => {
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

                  {/* Thanh tiến độ */}
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

export default TestMultipleChoice;
