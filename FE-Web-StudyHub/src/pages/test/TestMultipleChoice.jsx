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
  useGetTestByIdMutation,
  useGetTestPoolByLevelMutation,
  useGetTestPoolByTestIdAndLevelMutation,
  useGetTestAttemptsByTestIdMutation,
  useGetAttemptByTestAndUserMutation,
  useCreateAttemptMutation,
  useGetAttemptInfoMutation,
  useCreateTestPoolMutation,
  useGenerateTestQuestionsMutation,
  useSubmitTestMutation,
  // useUpdateTestPoolMutation,
} from "../../services/testApi";

const TestMultipleChoice = () => {
  const navigate = useNavigate();
  const { id: testId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [testPool, setTestPool] = useState(null);
  const [questions, setQuestions] = useState();
  const [attemptId, setAttemptId] = useState();
  const [date, setDate] = useState(null);
  const [test, setTest] = useState(null);

  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(null); // thời gian làm bài tính bằng phút
  const [isPaused, setIsPaused] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false); // State để quản lý trạng thái loading khi submit
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading khi load test

  const completedCount = answersP.filter((a) => a !== null).length;
  const percent = Math.round((completedCount / 10 || 0) * 100);

  useEffect(() => {
    startTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  useEffect(() => {
    // Chỉ chạy khi test đã được load lần đầu và có durationMin
    const durationMin = test?.data?.durationMin;
    if (durationMin && durationMin > 0 && timeLeft === null) {
      setTimeLeft(durationMin * 60); // Đặt giá trị chính xác bằng giây (ví dụ: 30 * 60 = 1800)
    }
  }, [test, timeLeft]);

  // Gọi API
  const [getTestByIdTrigger] = useGetTestByIdMutation();
  const [getTestPoolByLevelTrigger] = useGetTestPoolByLevelMutation();
  const [getTestPoolByTestIdAndLevelTrigger] =
    useGetTestPoolByTestIdAndLevelMutation();
  const [getTestAttemptsByTestIdTrigger] = useGetTestAttemptsByTestIdMutation();
  const [getAttemptByTestAndUserTrigger] = useGetAttemptByTestAndUserMutation();
  const [createAttemptTrigger] = useCreateAttemptMutation();
  const [getAttemptInfoTrigger] = useGetAttemptInfoMutation();
  const [createTestPoolTrigger] = useCreateTestPoolMutation();
  const [generateTestQuestionsTrigger] = useGenerateTestQuestionsMutation();
  const [submitTestTrigger] = useSubmitTestMutation();
  // const [updateTestPoolTrigger] = useUpdateTestPoolMutation();

  const startTest = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const isoString = now.toISOString();
      setDate(isoString);

      const test = await getTestByIdTrigger(testId).unwrap();
      setTest(test);
      const userLevel = `${test?.data?.examType} ${
        user?.currentLevel?.[test?.data?.examType]
      }`;

      try {
        const bylevel = await getTestPoolByLevelTrigger({
          level: userLevel,
        }).unwrap();
        console.log("✅ Found test pools by level:", bylevel);
        const testByLevel = bylevel.data.find(
          (pool) => pool.baseTestId === testId
        );

        console.log("✅ Found test:", testByLevel);
        setTestPool(testByLevel);

        try {
          const testPool = await getTestPoolByTestIdAndLevelTrigger({
            testId: testId, // string, ID của test
            exam_type: test?.data?.examType, // string, ví dụ "TOEIC"
            score_range: user?.currentLevel?.[test?.data?.examType], // string, ví dụ "550-650"
            createdBy: user?._id, // string, ID của user
          }).unwrap();

          setTestPool(testPool);

          setQuestions({ data: testPool });

          try {
            const attemptByTestPool = await getTestAttemptsByTestIdTrigger({
              testPoolId: testByLevel?._id,
              userId: user?._id,
            }).unwrap();

            setAttemptId(attemptByTestPool?.data[0]?._id);
            console.log("✅ Found attempt by test pool:", attemptByTestPool);
            if (!attemptByTestPool?.data?.length === 0) {
              try {
                const attempt = await createAttemptTrigger({
                  testPoolId: testPool?.testPoolId,
                  testId: testId,
                }).unwrap();
                setAttemptId(attempt?.data?._id);
                console.log("🆕 Created attempt:", attempt);
              } catch (error) {
                console.log("❌ Lỗi khi tạo attempt:", error);
              }
            }
          } catch (error) {
            console.log("❌ Lỗi khi tạo attempt:", error);
          }
        } catch (error) {
          if (error.status === 404) {
            if (testByLevel?.usageCount !== testByLevel?.maxReuse) {
              const testPoolin = await getTestPoolByTestIdAndLevelTrigger({
                testId: testId, // string, ID của test
                exam_type: test?.data?.examType, // string, ví dụ "TOEIC"
                score_range: user?.currentLevel?.[test?.data?.examType], // string, ví dụ "550-650"
                createdBy: testByLevel?.createdBy?._id, // string, ID của user
              }).unwrap();
              setQuestions({ data: testPoolin });

              try {
                const attemptInfo = await getAttemptByTestAndUserTrigger({
                  testId: testId,
                  userId: user?._id,
                }).unwrap();
                if (
                  attemptInfo?.data?.length > 0 &&
                  attemptInfo?.data[0]?.attemptNumber <
                    attemptInfo?.data[0]?.maxAttempts
                ) {
                  setAttemptId(attemptInfo?.data[0]?._id);
                  console.log("✅ Found existing attempt:", attemptInfo);
                } else {
                  try {
                    const attempt = await createAttemptTrigger({
                      testPoolId: testByLevel?._id,
                      testId: testId,
                    }).unwrap();
                    setAttemptId(attempt?.data?._id);
                    console.log("🆕 Created attempt:", attempt);
                  } catch (error) {
                    console.log("❌ Lỗi khi tạo attempt:", error);
                  }
                }
              } catch (error) {
                console.log("❌ Lỗi khi lấy thông tin attempt:", error);
              }
            } else {
              console.log("⚠️ Test pool đã đạt giới hạn sử dụng");
              try {
                const newTestPool = await createTestPoolTrigger({
                  baseTestId: testId,
                  level: userLevel,
                  createdBy: user?._id,
                  usageCount: 0,
                  maxReuse: 10,
                  status: "active",
                }).unwrap();
                console.log("🆕 Created new test pool:", newTestPool);

                try {
                  const newQuestions = await generateTestQuestionsTrigger({
                    testId,
                    exam_type: test?.data?.examType,
                    topic: test?.data?.topic,
                    question_types: test?.data?.questionTypes,
                    num_questions: test?.data?.numQuestions,
                    score_range: user?.currentLevel?.[test?.data?.examType],
                  }).unwrap();
                  setQuestions(newQuestions);
                  console.log("🧠 Created questions:", newQuestions);

                  try {
                    const attemptInfo = await getAttemptByTestAndUserTrigger({
                      testId,
                      userId: user?._id,
                    }).unwrap();
                    if (attemptInfo?.data?.length > 0) {
                      setAttemptId(attemptInfo?.data[0]?._id);
                      console.log("✅ Found existing attempt:", attemptInfo);
                    } else {
                      console.log("🚫 No existing attempt found");
                    }
                  } catch (error) {
                    console.log("❌ Error creating attempt:", error);
                  }
                  try {
                    const attempt = await createAttemptTrigger({
                      testPoolId: newTestPool?.data?._id,
                      testId: testId,
                    }).unwrap();
                    console.log("🆕 Created attempt:", attempt);
                    setAttemptId(attempt?.data?._id);
                    console.log("🆕 Created attempt:", attempt);
                  } catch (error) {
                    console.log("❌ Error fetching attempt info:", error);
                  }
                } catch (error) {
                  console.log("❌ Error generating questions:", error);
                }
              } catch (error) {
                console.log("❌ Error creating test pool:", error);
              }
            }
          }
        }
      } catch (error) {
        if (error.status === 404) {
          console.log(
            "⚠️ Không tìm thấy test phù hợp — thử lấy attempt info..."
          );
          try {
            const testInfo = await getAttemptInfoTrigger({
              testId,
              userId: user?._id,
            }).unwrap();
            console.log("✅ Found attempt info:", testInfo);
          } catch (attemptError) {
            if (attemptError.status === 404) {
              try {
                const newTestPool = await createTestPoolTrigger({
                  baseTestId: testId,
                  level: userLevel,
                  createdBy: user?._id,
                  usageCount: 0,
                  maxReuse: 10,
                  status: "active",
                }).unwrap();
                setTestPool(newTestPool.data);
                console.log("🆕 Created new test pool:", newTestPool);

                try {
                  const newQuestions = await generateTestQuestionsTrigger({
                    testId,
                    exam_type: test?.data?.examType,
                    topic: test?.data?.topic,
                    question_types: test?.data?.questionTypes,
                    num_questions: test?.data?.numQuestions,
                    score_range: user?.currentLevel?.[test?.data?.examType],
                  }).unwrap();
                  setQuestions(newQuestions);
                  console.log("🧠 Created questions:", newQuestions);

                  try {
                    const attemptInfo = await getAttemptByTestAndUserTrigger({
                      testId,
                      userId: user?._id,
                    }).unwrap();
                    if (attemptInfo?.data?.length > 0) {
                      setAttemptId(attemptInfo?.data[0]?._id);
                      console.log("✅ Found existing attempt:", attemptInfo);
                    } else {
                      console.log("🚫 No existing attempt found");
                    }
                  } catch (error) {
                    console.log("❌ Error creating attempt:", error);
                  }
                  try {
                    const attempt = await createAttemptTrigger({
                      testPoolId: newTestPool?.data?._id,
                      testId: testId,
                    }).unwrap();
                    setAttemptId(attempt?.data?._id);
                    console.log("🆕 Created attempt:", attempt);
                  } catch (error) {
                    console.log("❌ Error fetching attempt info:", error);
                  }
                } catch (error) {
                  console.log("❌ Error generating questions:", error);
                }
              } catch (error) {
                console.log("❌ Error creating test pool:", error);
              }
            }
          }
        } else {
          throw error;
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
    const selectedOption = questions.data.data[current].options.find(
      (opt) => opt.optionText === selectedOptionText
    );
    newAnswers[current] = selectedOption?._id || null;
    setAnswersP(newAnswers);
  };

  const handleNext = () => setCurrent((c) => Math.min(c + 1, 10 - 1));
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
      questionId: questions?.data?.data[index]._id,
      selectedOptionId: selectedOptionId,
    }));

    console.log("FE payload:", {
      attemptId,
      answers: formattedAnswers,
      testId,
      startTime: date,
    });

    const answers = formattedAnswers;
    const startTime = date;

    const response = await submitTestTrigger({
      attemptId,
      answers,
      testId,
      startTime,
    }).unwrap();

    console.log("Simulated API response:", response);

    console.log("Test pool before update:", testPool);

    // if (
    //   testPool?.createdBy?._id !== user._id ||
    //   testPool?.createdBy !== user._id
    // ) {
    //   try {
    //     const updateData = {
    //       usageCount: testPool?.usageCount + 1,
    //     };

    //     const updatedPool = await updateTestPoolTrigger({
    //       poolId: testPool?._id,
    //       updateData,
    //     }).unwrap();
    //     console.log("Test pool updated:", updatedPool);
    //   } catch (error) {
    //     console.log("Error updating test pool:", error);
    //   }
    // }

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

  // ...bên trong component của bạn

  // ✅ BƯỚC 1: Di chuyển các hook ra ngoài và gọi chúng ở cấp cao nhất.
  const [tipIndex, setTipIndex] = useState(0);

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
                      {current + 1}.{" "}
                      {questions?.data?.data[current].questionText}
                    </Typography>

                    {/* Danh sách đáp án */}
                    <RadioGroup
                      value={
                        answersP[current]
                          ? questions?.data?.data[current].options.find(
                              (opt) => opt._id === answersP[current]
                            )?.optionText || ""
                          : ""
                      }
                      onChange={handleChange}
                    >
                      {questions?.data?.data[current].options.map(
                        (opt, idx) => (
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
                        )
                      )}
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
                        disabled={current === 10 - 1}
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
