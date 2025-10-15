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
  useUpdateTestPoolMutation,
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

  useEffect(() => {
    startTest();
  }, [testId]);

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
  const [updateTestPoolTrigger] = useUpdateTestPoolMutation();

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
              console.log("❌ Test pool đã sử dụng tối đa.");
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
                console.log("🆕 Created new test pool:", newTestPool);

                try {
                  const newQuestions = await generateTestQuestionsTrigger({
                    testId,
                    exam_type: test?.data?.examType,
                    topic: test?.data?.topic,
                    question_types: test?.data?.questionTypes,
                    num_questions: 10,
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

  // Lấy dữ liệu từ object mock thay vì location.state

  const [current, setCurrent] = useState(0);
  const [answersP, setAnswersP] = useState(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(15); // thời gian tính bằng phút
  const [isSubmitting, setIsSubmitting] = useState(false); // State để quản lý trạng thái loading khi submit
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái loading khi load test

  const completedCount = answersP.filter((a) => a !== null).length;
  const percent = Math.round((completedCount / 10 || 0) * 100);

  // --- Vô hiệu hóa các hook gọi API ---
  // const [submitTest, { isLoading: isLoadingSubmit }] = useSubmitTestMutation();
  // const [getTestResult, { isLoading: isLoadingGetResult }] = useGetTestResultMutation();
  // const [saveAnswers, { isLoading: isLoadingSaveAnswers }] = useSaveAnswersMutation();

  // Đếm ngược thời gian (giữ nguyên)
  useEffect(() => {
    if (timeLeft <= 0) {
      // Tự động nộp bài khi hết giờ
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const timeInSeconds = prevTime * 60;
        const newTimeInSeconds = timeInSeconds - 1;
        return newTimeInSeconds / 60;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const formatTime = (m) => {
    if (m <= 0) return "00:00";
    const minutes = Math.floor(m);
    const seconds = Math.round((m - minutes) * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // --- HÀM SUBMIT GIẢ ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formattedAnswers = answersP.map((selectedOptionId, index) => ({
      questionId: questions.data.data[index]._id,
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

    if (testPool.createdBy._id !== user._id) {
      try {
        const updateData = {
          usageCount: testPool?.usageCount + 1,
        };

        const updatedPool = await updateTestPoolTrigger({
          poolId: testPool?._id,
          updateData,
        }).unwrap();
        console.log("Test pool updated:", updatedPool);
      } catch (error) {
        console.log("Error updating test pool:", error);
      }
    }

    if (response) {
      navigate(`/test/${testId}/result`, {
        state: { resultData: response },
      });
    }

    setIsSubmitting(false);
  };

  if (!questions) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography>No questions available</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Typography>Loading test...</Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-2">
      <Box className="max-w-6xl mx-auto">
        <Box className="bg-white rounded-xl shadow p-4 mb-6 flex justify-between">
          <Typography variant="h6" fontWeight={700} color="#22223b">
            {test?.data.title || "Multiple Choice Test"}
          </Typography>
          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 1 ? "error" : "primary"} // Đổi màu khi gần hết giờ
            className="font-semibold flex items-center"
            sx={{ fontSize: 16 }}
          />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8.5}>
            <Card className="rounded-xl shadow">
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="#22223b"
                  sx={{ mb: 2 }}
                >
                  {current + 1}. {questions.data.data[current].questionText}
                </Typography>
                <RadioGroup
                  value={
                    answersP[current]
                      ? questions.data.data[current].options.find(
                          (opt) => opt._id === answersP[current]
                        )?.optionText || ""
                      : ""
                  }
                  onChange={handleChange}
                >
                  {questions.data.data[current].options.map((opt, idx) => (
                    <Box
                      key={opt._id || idx}
                      className="mb-3 border rounded-lg px-4 py-2 flex items-center hover:border-blue-400 transition"
                      sx={{
                        borderColor:
                          answersP[current] === opt._id ? "#2563eb" : "#e5e7eb",
                        background:
                          answersP[current] === opt._id ? "#f0f7ff" : "#fff",
                      }}
                    >
                      <FormControlLabel
                        value={opt.optionText}
                        control={<Radio color="primary" />}
                        label={
                          <Typography fontWeight={500}>
                            {opt.optionText}
                          </Typography>
                        }
                        className="w-full"
                      />
                    </Box>
                  ))}
                </RadioGroup>
                <Box className="flex justify-between mt-6 gap-2">
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={current === 0}
                      onClick={handleBack}
                      sx={{ textTransform: "none" }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={current === 10 - 1}
                      sx={{ textTransform: "none" }}
                    >
                      Next
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "none" }}
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Card className="rounded-xl shadow mb-4">
              <CardContent>
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
                <Box className="grid grid-cols-5 gap-2 mb-3">
                  {questions.data.data.map((q, idx) => {
                    let color = "#e5e7eb"; // default: chưa làm
                    if (answersP[idx] !== null) color = "#22c55e"; // completed
                    if (idx === current) color = "#2563eb"; // current
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
  );
};

export default TestMultipleChoice;
