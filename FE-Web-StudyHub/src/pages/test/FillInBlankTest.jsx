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
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

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

  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [test, setTest] = useState(null);
  const [submissionTipIndex, setSubmissionTipIndex] = useState(0);
  const [day, setDay] = useState(null);

  const routeTestId = payloadForm?.testId;

  useEffect(() => {
    const hasInitialized = localStorage.getItem("test_initialized");

    if (!hasInitialized) {
      // Chạy lần đầu tiên
      fetchData();

      // đánh dấu đã chạy
      localStorage.setItem("test_initialized", "true");
    } else {
      console.log("Đã chạy trước đó → Không chạy lại start()");
    }
  }, [payloadForm]);

  const fetchData = async () => {
    if (
      attemptDetail &&
      attemptDetail?.attemptNumber < attemptDetail?.maxAttempts
    ) {
      try {
        const now = new Date();
        const isoString = now.toISOString();
        setDate(isoString);

        const res = await getQuestionsByAttemptId(attemptDetail?._id).unwrap();
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
            setQuestions(res?.data);
            setAnswersP(
              res?.data?.map((q) =>
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
  console.log("Test data updated:", test?.data?.durationMin);
  useEffect(() => {
    if (test?.data?.durationMin) {
      const duration = test?.data?.durationMin;

      setTimeLeft(duration * 60);
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

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

  function formatTime(s) {
    if (s === null || isNaN(s) || s < 0) return "00 : 00";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    const formattedM = String(m).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");
    return `${formattedM} : ${formattedSec}`;
  }

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

        localStorage.removeItem("test_initialized");
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

                {/* --- PHẦN ĐƯỢC CHỈNH SỬA TẠI ĐÂY --- */}
                <Box>
                  <Typography variant="body2" color="#6b7280" gutterBottom>
                    Please wait while we analyze your answers and prepare your
                    personalized results.
                  </Typography>

                  {/* Dòng thông báo thời gian mới thêm vào */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#059669",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mt: 1,
                      bgcolor: "#ecfdf5", // Nền xanh nhạt
                      py: 1,
                      borderRadius: 1,
                    }}
                  >
                    <HourglassBottomIcon sx={{ fontSize: 20 }} /> Estimated
                    process time: 20-30 seconds
                  </Typography>
                </Box>
                {/* --- KẾT THÚC PHẦN CHỈNH SỬA --- */}
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

          {/* --- PHẦN THÊM VÀO: THÔNG BÁO THỜI GIAN --- */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.5)", // Nền trắng mờ
              backdropFilter: "blur(4px)", // Hiệu ứng mờ đục
              border: "1px solid",
              borderColor: "indigo.100",
              borderRadius: 3,
              px: 3,
              py: 1,
            }}
          >
            <HourglassBottomIcon
              sx={{
                color: "#4f46e5", // Màu Indigo cho hợp theme
                fontSize: 20,
                animation: "spin 3s linear infinite", // Xoay nhẹ nếu muốn
              }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#4338ca" }}
            >
              Estimated wait time: 20-30 seconds
            </Typography>
          </Box>
          {/* ------------------------------------------- */}

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
            {test?.title || test?.data?.title}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 5 * 60 ? "error" : "primary"}
          />
        </Box>

        {/* Nội dung chính */}
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 8.5 }}>
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // Ngăn việc xuống dòng hoặc submit form ngoài ý muốn

                                // Kiểm tra: Nếu chưa phải câu cuối cùng thì nhảy sang câu tiếp theo
                                if (current < (questions?.length || 0) - 1) {
                                  handleJump(current + 1);
                                }
                              }
                            }}
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
                  disabled={
                    isSubmitting ||
                    answersP.some((a) => {
                      // 1. Kiểm tra null hoặc undefined
                      if (a === null || a === undefined) return true;

                      // 2. Kiểm tra trường hợp mảng chứa chuỗi rỗng ([""]) - Lỗi bạn đang gặp
                      if (Array.isArray(a) && (a.length === 0 || a[0] === ""))
                        return true;

                      // 3. Kiểm tra trường hợp chuỗi rỗng ("")
                      if (typeof a === "string" && a.trim() === "") return true;

                      // Đã có câu trả lời hợp lệ
                      return false;
                    })
                  }
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Exercise"
                  )}
                </Button>
              </Box>
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
                    {questions?.map((q, idx) => {
                      let color = "#e5e7eb"; // Mặc định Xám

                      const val = answersP[idx];

                      // 1. Kiểm tra cơ bản: Không null, không undefined
                      let hasAnswer = val !== null && val !== undefined;

                      // 2. Kiểm tra sâu hơn (Fix lỗi của bạn):
                      // Nếu là mảng (ví dụ [""]) và phần tử đầu tiên rỗng -> Coi như chưa làm
                      if (hasAnswer && Array.isArray(val) && val[0] === "") {
                        hasAnswer = false;
                      }
                      // Nếu là chuỗi (ví dụ "") -> Coi như chưa làm
                      if (
                        hasAnswer &&
                        typeof val === "string" &&
                        val.trim() === ""
                      ) {
                        hasAnswer = false;
                      }

                      // 3. Áp dụng màu
                      if (hasAnswer) {
                        color = "#22c55e"; // Xanh lá (Đã làm)
                      }
                      if (idx === current) {
                        color = "#2563eb"; // Xanh dương (Đang chọn)
                      }

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

export default FillInBlankTest;
