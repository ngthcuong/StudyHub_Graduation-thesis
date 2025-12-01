import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookIcon from "@mui/icons-material/Book";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CourseCard from "../../components/CourseCard";
import { useLocation } from "react-router-dom";
import CertificateDetailModal from "../../components/CertificateDetailModal";
import {
  useGetAllCoursesMutation,
  useGetMyCoursesMutation,
} from "../../services/grammarLessonApi";

import { CloseOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  useGetTestByIdMutation,
  useUpdateAttemptMutation,
} from "../../services/testApi";

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

const TestResult = () => {
  const location = useLocation();
  const resultData = location?.state?.resultData;
  const formattedAnswers = location?.state?.formattedAnswers;
  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [test, setTest] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const [getMyCourses] = useGetMyCoursesMutation();
  const [getAllCourses] = useGetAllCoursesMutation();
  const [updateAttempt] = useUpdateAttemptMutation();
  const [getTestById] = useGetTestByIdMutation();

  // Check if certificate exists and show snackbar
  useEffect(() => {
    if (resultData?.certificate) {
      setSnackbarOpen(true);
    }

    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultData]);

  // Kiểm tra nếu không có resultData thì không render gì cả để tránh lỗi
  if (
    !resultData ||
    !resultData.attemptDetail ||
    !resultData.attemptDetail.analysisResult
  ) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading test result or data is missing...</Typography>
      </Box>
    );
  }

  const scoreRanges = {
    "TOEIC 10-250": ["TOEIC 10-250", "TOEIC 255-400"],
    "TOEIC 255-400": ["TOEIC 255-400"],
    "TOEIC 405-600": ["TOEIC 405-600"],
    "TOEIC 605-780": ["TOEIC 605-780"],
    "TOEIC 785-900": ["TOEIC 785-900"],
    "TOEIC 905-990": ["TOEIC 905-990"],
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses().unwrap();

      const resCourse = await getMyCourses(user._id);
      const filteredCourse = res.filter(
        (course2) =>
          !resCourse.data.courses.some((course1) => course1._id === course2._id)
      );

      let recommended = [];
      if (
        resultData.attemptDetail.analysisResult.post_test_level ===
        "Unknown".trim()
      ) {
        recommended = resultData?.attemptDetail.analysisResult.current_level;
      } else {
        recommended = resultData?.attemptDetail.analysisResult.post_test_level;
      }
      const filtered = filteredCourse.filter((course) =>
        scoreRanges[recommended].includes(
          `${course.courseType} ${course.courseLevel}`
        )
      );

      setRecommendedCourses(filtered);

      // update attempt pass
      if (resultData.attemptDetail.totalScore >= 7) {
        await updateAttempt({
          attemptId: resultData.attempt._id,
          updateData: {
            isPassed: true,
          },
        }).unwrap();
      }

      // take test
      const testDetailRes = await getTestById(
        resultData.attempt.testId
      ).unwrap();
      setTest(testDetailRes.data);
    } catch (error) {
      console.error("Error fetching courses for recommendations:", error);
    }
  };

  console.log("Result Data:", resultData.certificate);
  console.log("FormattedAnswers:", formattedAnswers);

  const startTime = new Date(resultData.attemptDetail.startTime);
  const endTime = new Date(resultData.attemptDetail.endTime);
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  // Lấy đối tượng analysisResult từ đúng vị trí của nó
  const analysisResult = resultData.attemptDetail.analysisResult;
  const answers = resultData.attemptDetail.answers;

  // Destructuring với giá trị mặc định để tránh lỗi
  const {
    total_questions = 0,
    per_question: analysisPerQuestion = [],
    skill_summary = [],
    weak_topics = [],
    recommendations = [],
    personalized_plan = {
      overall_goal: "No goal specified",
      progress_speed: "Not determined",
      weekly_goals: [],
      study_methods: [],
      notes: null,
    },
  } = analysisResult;

  // Kết hợp dữ liệu từ `analysisPerQuestion` và `answers` để có đủ thông tin
  const per_question = analysisPerQuestion.map((analysisItem, index) => {
    const answerItem = answers[index] || {};
    return {
      ...analysisItem,
      question: answerItem.questionText || `Question ${analysisItem.id}`, // Lấy văn bản câu hỏi thật
      user_answer: answerItem.selectedOptionText || analysisItem.user_answer, // Lấy câu trả lời của người dùng
    };
  });

  // Tính toán stats với safe checks
  const correctCount = per_question.filter(
    (q) => q && q.correct === true
  ).length;
  const incorrectCount = total_questions - correctCount;
  const scorePercent =
    total_questions > 0
      ? Math.round((correctCount / total_questions) * 100)
      : 0; // Tính % dựa trên số câu đúng

  const resultStats = {
    score: scorePercent,
    correct: correctCount,
    incorrect: incorrectCount,
    total: total_questions,
    time: timeTaken,
  };

  // Tạo correctAnswers từ mảng `per_question` đã được kết hợp
  const correctAnswers = per_question
    .filter((q) => q && q.correct === true)
    .map((q) => ({
      question: q.question, // Sử dụng văn bản câu hỏi thật
      answer: q.expected_answer || "No answer",
      time: 0,
      type: `${q.skill || "Unknown"} - ${q.topic || "Unknown topic"}`,
      explain: q.explain || "No explanation",
    }));

  // Tạo incorrectAnswers từ mảng `per_question` đã được kết hợp
  const incorrectAnswers = per_question
    .filter((q) => q && q.correct === false)
    .map((q) => ({
      question: q.question, // Sử dụng văn bản câu hỏi thật
      yourAnswer: q.user_answer || "No answer", // Sử dụng câu trả lời thật
      correctAnswer: q.expected_answer || "No answer",
      time: 0,
      type: `${q.skill || "Unknown"} - ${q.topic || "Unknown topic"}`,
      explain: q.explain || "No explanation",
    }));

  const avgTime =
    resultStats.total > 0
      ? Math.round(resultStats.time / resultStats.total)
      : 0;

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-2">
      <Box className="max-w-5xl mx-auto">
        <Typography variant="h4" fontWeight={700} color="#22223b" gutterBottom>
          Test Results
        </Typography>
        <Typography variant="subtitle1" color="#64748b" sx={{ mb: 4 }}>
          Here's how you performed on your recent test
        </Typography>

        {/* Thông tin tổng quan */}
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-xl shadow border-t-4 border-green-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="#22c55e" fontWeight={700}>
                  {resultStats.score}%
                </Typography>
                <CheckCircleIcon color="success" />
              </Stack>
              <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                {resultStats.correct} out of {resultStats.total} correct
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-green-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="#22c55e" fontWeight={700}>
                  {resultStats.correct}
                </Typography>
                <CheckCircleIcon color="success" />
              </Stack>
              <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                Questions answered correctly
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-red-300">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="#ef4444" fontWeight={700}>
                  {resultStats.incorrect}
                </Typography>
                <CancelIcon sx={{ color: "#ef4444" }} />
              </Stack>
              <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                Questions answered incorrectly
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-blue-300">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="#2563eb" fontWeight={700}>
                  {formatTime(resultStats.time)}
                </Typography>
                <AccessTimeIcon sx={{ color: "#2563eb" }} />
              </Stack>
              <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                {avgTime}s average per question
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Skill Summary */}
        {skill_summary.length > 0 && (
          <Card className="rounded-xl shadow mb-6">
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Skill Performance
              </Typography>
              {skill_summary.map((skill, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {skill.skill || "Unknown Skill"}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      {skill.correct || 0}/{skill.total || 0} (
                      {skill.accuracy || 0}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={skill.accuracy || 0}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    color={
                      (skill.accuracy || 0) >= 70
                        ? "success"
                        : (skill.accuracy || 0) >= 40
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Weak Topics */}
        {weak_topics.length > 0 && (
          <Card className="rounded-xl shadow mb-6">
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Areas for Improvement (weak topics)
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {weak_topics.map((topic, idx) => (
                  <Chip
                    key={idx}
                    label={topic}
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Card className="rounded-xl shadow mb-6">
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            className="border-b"
            sx={{ px: 2 }}
          >
            <Tab label="Correct Answers" sx={{ textTransform: "none" }} />
            <Tab label="Incorrect Answers" sx={{ textTransform: "none" }} />
            {!test?.isTheLastTest && (
              <Tab label="Learning Plan" sx={{ textTransform: "none" }} />
            )}
          </Tabs>
          <Divider />
          <CardContent>
            {tab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  Questions You Got Right
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                  Great job on these questions! You demonstrated strong
                  knowledge in these areas.
                </Typography>
                {correctAnswers.length > 0 ? (
                  <Stack spacing={2}>
                    {correctAnswers.map((item, idx) => (
                      <Card
                        key={idx}
                        className="border-l-4 border-green-400 bg-green-50"
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography
                              variant="caption"
                              color="#22c55e"
                              fontWeight={700}
                              sx={{ textTransform: "uppercase" }}
                            >
                              Correct
                            </Typography>
                            <Chip
                              label={item.type}
                              color="info"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Stack>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{ mt: 1 }}
                          >
                            {item.question}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            YOUR ANSWER:{" "}
                            <span className="text-green-700 font-semibold">
                              {item.answer}
                            </span>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            EXPLAIN:{" "}
                            <span className="font-medium">{item.explain}</span>
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body1"
                    color="#64748b"
                    textAlign="center"
                    sx={{ py: 4 }}
                  >
                    No correct answers in this test. Keep practicing!
                  </Typography>
                )}
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  Questions to Review
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                  These questions need some attention. Review the correct
                  answers to improve your understanding.
                </Typography>
                {incorrectAnswers.length > 0 ? (
                  <Stack spacing={2}>
                    {incorrectAnswers.map((item, idx) => (
                      <Card
                        key={idx}
                        className="border-l-4 border-red-300 bg-red-50"
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <CancelIcon
                              sx={{ color: "#ef4444" }}
                              fontSize="small"
                            />
                            <Typography
                              variant="caption"
                              color="#ef4444"
                              fontWeight={700}
                            >
                              INCORRECT
                            </Typography>
                            <Chip
                              label={item.type}
                              color="info"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Stack>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{ mt: 1 }}
                          >
                            {item.question}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            YOUR ANSWER:{" "}
                            <span className="text-red-700 font-semibold">
                              {item.yourAnswer}
                            </span>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            CORRECT ANSWER:{" "}
                            <span className="text-green-700 font-semibold">
                              {item.correctAnswer}
                            </span>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            EXPLAIN:{" "}
                            <span className="font-medium">{item.explain}</span>
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body1"
                    color="#64748b"
                    textAlign="center"
                    sx={{ py: 4 }}
                  >
                    All questions were answered correctly!
                  </Typography>
                )}
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Personalized Learning Plan
                </Typography>

                {/* Overall Goal */}
                {personalized_plan.overall_goal && (
                  <Card className="mb-4 bg-blue-50 border border-blue-200">
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <TrendingUpIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Overall Goal
                          </Typography>
                          <Typography variant="body2" color="#64748b">
                            {personalized_plan.overall_goal}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Progress Speed */}
                <Card className="mb-4 bg-green-50 border border-green-200">
                  <CardContent>
                    <Stack direction="column" spacing={2}>
                      {/* Header */}
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <ScheduleIcon color="success" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            Progress Speed
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                personalized_plan?.progress_speed?.category ===
                                "accelerating"
                                  ? "green"
                                  : personalized_plan?.progress_speed
                                      ?.category === "steady"
                                  ? "orange"
                                  : "red",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {personalized_plan?.progress_speed?.category ||
                              "N/A"}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary">
                        {personalized_plan?.progress_speed?.description}
                      </Typography>

                      {/* Trend Section */}
                      <Box
                        sx={{
                          borderLeft: "4px solid #22c55e",
                          pl: 2,
                          py: 1,
                          backgroundColor: "#f9fafb",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          gutterBottom
                        >
                          Performance Trend
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Past Tests:{" "}
                          <strong>
                            {
                              personalized_plan?.progress_speed?.trend
                                ?.past_tests
                            }
                          </strong>
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Accuracy Growth Rate:{" "}
                          <strong>
                            {
                              personalized_plan?.progress_speed?.trend
                                ?.accuracy_growth_rate
                            }
                            %
                          </strong>
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          Consistency Index:{" "}
                          <strong>
                            {
                              personalized_plan?.progress_speed?.trend
                                ?.consistency_index
                            }
                          </strong>
                        </Typography>

                        {/* Strong & Weak Skills */}
                        <Grid container spacing={1} mt={1}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600}>
                              Strong Skills:
                            </Typography>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {personalized_plan?.progress_speed?.trend?.strong_skills
                                ?.slice(0, 5)
                                .map((skill, idx) => (
                                  <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600}>
                              Weak Skills:
                            </Typography>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                              {personalized_plan?.progress_speed?.trend?.weak_skills
                                ?.slice(0, 5)
                                .map((skill, idx) => (
                                  <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Predicted Weeks */}
                      <Typography variant="body2" color="text.secondary">
                        Predicted Weeks to Reach Next Level:{" "}
                        <strong>
                          {
                            personalized_plan?.progress_speed
                              ?.predicted_reach_next_level_weeks
                          }
                        </strong>
                      </Typography>

                      {/* Recommendation */}
                      <Box
                        sx={{
                          mt: 1,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="green"
                        >
                          Recommendation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {personalized_plan?.progress_speed?.recommendation}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* General Recommendations */}
                {recommendations.length > 0 && (
                  <Card className="mb-4">
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                      >
                        General Recommendations
                      </Typography>
                      <List>
                        {recommendations.map((rec, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <BookIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Weekly Study Plan */}
                {personalized_plan?.weekly_goals &&
                  personalized_plan?.weekly_goals?.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Weekly Study Plan (
                        {personalized_plan?.weekly_goals?.length} weeks)
                      </Typography>

                      {personalized_plan?.weekly_goals?.map((week, idx) => (
                        <Accordion key={idx} sx={{ mb: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Chip
                                label={`Week ${week.week || idx + 1}`}
                                color="primary"
                                size="small"
                              />
                              <Typography variant="subtitle1" fontWeight={600}>
                                {week.topic || "No topic specified"}
                              </Typography>
                              <Chip
                                label={`${week.hours || 0}h`}
                                color="secondary"
                                size="small"
                              />
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            {/* Study Methods renamed from "Activities" */}
                            {week.study_methods &&
                              week.study_methods.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    sx={{ mb: 1 }}
                                  >
                                    Activities:
                                  </Typography>
                                  <List dense>
                                    {week.study_methods.map(
                                      (method, methodIdx) => (
                                        <ListItem key={methodIdx}>
                                          <ListItemIcon>
                                            <AssignmentIcon
                                              fontSize="small"
                                              color="action"
                                            />
                                          </ListItemIcon>
                                          <ListItemText primary={method} />
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </Box>
                              )}

                            {/* Materials */}
                            {week.materials && week.materials.length > 0 && (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                  sx={{ mb: 1 }}
                                >
                                  Recommended Materials:
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ flexWrap: "wrap", gap: 1 }}
                                >
                                  {week.materials.map((material, matIdx) => (
                                    <Chip
                                      key={matIdx}
                                      label={material}
                                      variant="outlined"
                                      size="small"
                                      icon={<VideoLibraryIcon />}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </>
                  )}

                {/* Study Methods */}
                {personalized_plan.study_methods &&
                  personalized_plan.study_methods.length > 0 && (
                    <Card className="mt-4">
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{ mb: 2 }}
                        >
                          Recommended Study Methods
                        </Typography>
                        <Grid container spacing={2}>
                          {personalized_plan.study_methods.map(
                            (method, idx) => (
                              <Grid item xs={12} sm={6} key={idx}>
                                <Card variant="outlined" className="h-full">
                                  <CardContent>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <PlayCircleOutlineIcon color="primary" />
                                      <Typography variant="body2">
                                        {method}
                                      </Typography>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                {/* Notes */}
                {personalized_plan.notes && (
                  <Card className="mt-4 bg-yellow-50 border border-yellow-200">
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                      >
                        Important Notes
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        {personalized_plan.notes}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Course Recommendations */}
        <Box className="mt-8">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Recommended Courses for You
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 4 }}>
            Based on your test results, we suggest these courses to help you
            improve.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 3,
            }}
          >
            {recommendedCourses?.map((course, i) => (
              <Card key={course._id}>
                <CourseCard key={i} course={course} variant="market" />
              </Card>
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="flex justify-center gap-4 mt-6">
          {/* <Button
            variant="contained"
            color="primary"
            sx={{ px: 4, fontWeight: 600, textTransform: "none" }}
          >
            Retake Test
          </Button> */}
          <Button
            variant="outlined"
            color="inherit"
            sx={{ px: 4, fontWeight: 600, textTransform: "none" }}
            LinkComponent={"a"}
            href={formattedAnswers ? "/home/exercises" : "/home/courses"}
          >
            {formattedAnswers ? "View All Tests" : "Back to Courses"}
          </Button>
        </Box>

        {/* Certificate Snackbar */}
        {resultData?.certificate && (
          <Snackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
              action={
                <div className="flex items-center">
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setSnackbarOpen(false);
                      setCertificateModalOpen(true);
                    }}
                  >
                    Open
                  </Button>
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setSnackbarOpen(false)}
                  >
                    <CloseOutlined />
                  </IconButton>
                </div>
              }
            >
              You have earned a certificate for this course!
            </Alert>
          </Snackbar>
        )}

        {/* Certificate Detail Modal */}
        <CertificateDetailModal
          open={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          certificate={resultData?.certificate?.certificate}
        />
      </Box>
    </Box>
  );
};

export default TestResult;
