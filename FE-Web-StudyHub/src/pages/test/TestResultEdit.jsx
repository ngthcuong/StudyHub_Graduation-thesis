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
  TextField,
  MenuItem,
  Avatar,
  Paper,
  Autocomplete,
} from "@mui/material";
// Icons
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
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import SpeedIcon from "@mui/icons-material/Speed";
import TimelineIcon from "@mui/icons-material/Timeline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import { CloseOutlined } from "@mui/icons-material";

// Components & Services
import { useLocation } from "react-router-dom";
import CertificateDetailModal from "../../components/CertificateDetailModal";
import {
  useGetAllCoursesMutation,
  useGetMyCoursesMutation,
} from "../../services/grammarLessonApi";
import { useSelector } from "react-redux";
import {
  useGetTestByIdMutation,
  useUpdateAttemptMutation,
  useUpdateAttemptDetailMutation,
} from "../../services/testApi";
import dayjs from "dayjs"; // Đảm bảo đã cài dayjs

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

const TestResultEdit = () => {
  const location = useLocation();
  const rawResultData = location?.state?.resultData;
  const formattedAnswers = location?.state?.formattedAnswers;

  const [tab, setTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [test, setTest] = useState(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [resultData, setResultData] = useState(rawResultData);
  const [editFormData, setEditFormData] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const [getMyCourses] = useGetMyCoursesMutation();
  const [getAllCourses] = useGetAllCoursesMutation();
  const [updateAttempt] = useUpdateAttemptMutation();
  const [getTestById] = useGetTestByIdMutation();
  const [updateAttemptDetail] = useUpdateAttemptDetailMutation();

  // --- Functions ---
  const scoreRanges = {
    "TOEIC 10-250": ["TOEIC 10-250", "TOEIC 255-400"],
    "TOEIC 255-400": ["TOEIC 255-400"],
    "TOEIC 405-600": ["TOEIC 405-600"],
    "TOEIC 605-780": ["TOEIC 605-780"],
    "TOEIC 785-900": ["TOEIC 785-900"],
    "TOEIC 905-990": ["TOEIC 905-990"],
  };

  const fetchCourses = async () => {
    if (!resultData?.analysisResult) return;
    try {
      const res = await getAllCourses().unwrap();
      const resCourse = await getMyCourses(user._id);
      const myCoursesList = resCourse?.data?.courses || [];
      const filteredCourse = res.filter(
        (course2) =>
          !myCoursesList.some((course1) => course1._id === course2._id)
      );

      let recommended = [];
      const analysis = resultData.analysisResult;
      if (analysis.post_test_level === "Unknown".trim()) {
        recommended = analysis.current_level;
      } else {
        recommended = analysis.post_test_level;
      }
      const validRanges = scoreRanges[recommended] || [];
      const filtered = filteredCourse.filter((course) =>
        validRanges.includes(`${course.courseType} ${course.courseLevel}`)
      );
      setRecommendedCourses(filtered);

      const testIdToFetch =
        resultData.attemptId?.testId?._id || resultData.attemptId?.testId;
      if (testIdToFetch) {
        const testDetailRes = await getTestById(testIdToFetch).unwrap();
        setTest(testDetailRes.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditFormData(resultData.analysisResult);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (section, value, field = null) => {
    setEditFormData((prev) => {
      // 1. Xử lý update cho các trường nằm ngay ở root (như weak_topics)
      if (section === "root") {
        return {
          ...prev,
          [value.key]: value.val,
        };
      }

      // 2. Logic cũ cho personalized_plan
      const newPlan = { ...prev.personalized_plan };

      if (section === "progress_speed") {
        newPlan.progress_speed = {
          ...newPlan.progress_speed,
          [field]: value,
        };
      } else if (section === "direct") {
        newPlan[value.key] = value.val;
      }

      return {
        ...prev,
        personalized_plan: newPlan,
      };
    });
  };

  const handleSaveChanges = async () => {
    try {
      // 1. Tạo biến chứa dữ liệu mới nhất ngay tại đây
      const updatedAnalysisResult = editFormData;

      // Tạo object resultData mới bằng cách gộp data cũ và data mới sửa
      const newResultData = {
        ...resultData,
        analysisResult: updatedAnalysisResult,
      };

      // Payload cho API 1
      const updatePayload = { analysisResult: updatedAnalysisResult };
      const targetAttemptId = resultData.attemptId._id;

      // Gọi API 1 (Update Attempt)
      await updateAttempt({
        attemptId: targetAttemptId,
        updateData: updatePayload,
      }).unwrap();

      // Cập nhật State (để UI hiển thị)
      setResultData(newResultData);

      // Log ra biến cục bộ mới tạo (sẽ thấy giá trị mới)
      console.log("New resultData:", newResultData);

      // Gọi API 2 (Update Attempt Detail)
      // ✅ SỬA: Dùng newResultData thay vì resultData (vì resultData vẫn là cũ)
      const attemptDetail = await updateAttemptDetail({
        attemptDetailId: resultData?._id, // ID thì không đổi nên dùng cái cũ được
        updateData: newResultData, // Dùng data mới nhất vừa tạo
      }).unwrap();

      console.log("Attempt detail updated:", attemptDetail);

      setIsEditing(false);
      setSnackbarMessage("Feedback updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving changes:", error);
      setSnackbarMessage("Failed to save changes.");
      setSnackbarOpen(true);
    }
  };

  // 1. Sửa nội dung của một material cụ thể
  const handleMaterialChange = (weekIdx, matIdx, field, value) => {
    setEditFormData((prev) => {
      const newPlan = { ...prev.personalized_plan };
      const newGoals = [...(newPlan.weekly_goals || [])];

      // Copy mảng materials của tuần đó
      const newMaterials = [...(newGoals[weekIdx].materials || [])];

      // Đảm bảo phần tử đang sửa là một object (đề phòng dữ liệu cũ là string)
      let currentMat = newMaterials[matIdx];
      if (typeof currentMat === "string") {
        currentMat = { title: currentMat, url: "" };
      }

      // Cập nhật
      newMaterials[matIdx] = {
        ...currentMat,
        [field]: value,
      };

      newGoals[weekIdx].materials = newMaterials;
      newPlan.weekly_goals = newGoals;
      return { ...prev, personalized_plan: newPlan };
    });
  };

  // 2. Thêm một dòng material mới
  const handleAddMaterial = (weekIdx) => {
    setEditFormData((prev) => {
      const newPlan = { ...prev.personalized_plan };
      const newGoals = [...newPlan.weekly_goals];
      const newMaterials = [...(newGoals[weekIdx].materials || [])];

      newMaterials.push({ title: "", url: "" }); // Thêm object rỗng

      newGoals[weekIdx].materials = newMaterials;
      newPlan.weekly_goals = newGoals;
      return { ...prev, personalized_plan: newPlan };
    });
  };

  // 3. Xóa một material
  const handleRemoveMaterial = (weekIdx, matIdx) => {
    setEditFormData((prev) => {
      const newPlan = { ...prev.personalized_plan };
      const newGoals = [...newPlan.weekly_goals];
      const newMaterials = [...(newGoals[weekIdx].materials || [])];

      newMaterials.splice(matIdx, 1); // Xóa phần tử tại index

      newGoals[weekIdx].materials = newMaterials;
      newPlan.weekly_goals = newGoals;
      return { ...prev, personalized_plan: newPlan };
    });
  };

  const handleWeeklyGoalChange = (index, field, value) => {
    setEditFormData((prev) => {
      const newPlan = { ...prev.personalized_plan };
      const newGoals = [...(newPlan.weekly_goals || [])];

      newGoals[index] = {
        ...newGoals[index],
        [field]: value,
      };

      newPlan.weekly_goals = newGoals;
      return { ...prev, personalized_plan: newPlan };
    });
  };

  useEffect(() => {
    if (resultData?.certificate) {
      setSnackbarMessage("You have earned a certificate for this course!");
      setSnackbarOpen(true);
    }
    fetchCourses();
    if (resultData?.analysisResult) {
      setEditFormData(resultData.analysisResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawResultData]);

  if (!resultData || !resultData.analysisResult) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  // --- Data Preparation ---
  const analysisResult = isEditing ? editFormData : resultData.analysisResult;
  const answers = resultData.answers || [];
  const studentInfo = resultData.attemptId?.userId || {};
  const testInfo = resultData.attemptId?.testId || {};

  const {
    total_questions = 0,
    per_question: analysisPerQuestion = [],
    skill_summary = [],
    weak_topics = [],
    recommendations = [],
    personalized_plan = {},
  } = analysisResult;

  const startTime = new Date(resultData.startTime);
  const endTime = new Date(resultData.endTime);
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  let per_question = analysisPerQuestion.map((item, idx) => ({
    ...item,
    question: answers[idx]?.questionText || `Question ${item.id}`,
    user_answer: answers[idx]?.selectedOptionText || item.user_answer,
  }));

  if (!(per_question.length > 0 && "correct" in per_question[0])) {
    per_question = per_question.map((q) => ({
      ...q,
      correct:
        (q.user_answer || "").trim().toLowerCase() ===
        (q.expected_answer || "").trim().toLowerCase(),
    }));
  }

  const correctCount = per_question.filter((q) => q.correct).length;
  const incorrectCount = total_questions - correctCount;
  const scorePercent =
    total_questions > 0
      ? Math.round((correctCount / total_questions) * 100)
      : 0;

  const resultStats = {
    score: scorePercent,
    correct: correctCount,
    incorrect: incorrectCount,
    total: total_questions,
    time: timeTaken,
  };

  let counterAnswer = 0;
  const correctAnswers = per_question
    .filter((q) => q.correct)
    .map((q) => {
      let ans = formattedAnswers ? formattedAnswers[counterAnswer++] : null;
      return {
        ...q,
        answer: q.expected_answer || ans?.userAnswerText || "No answer",
        type: `${q.skill} - ${q.topic}`,
      };
    });

  const incorrectAnswers = per_question
    .filter((q) => !q.correct)
    .map((q) => {
      let ans = formattedAnswers ? formattedAnswers[counterAnswer++] : null;
      return {
        ...q,
        yourAnswer:
          q.user_answer === "No Answer"
            ? ans?.userAnswerText
            : q.user_answer || "No Answer",
        correctAnswer: q.expected_answer,
        type: `${q.skill} - ${q.topic}`,
      };
    });

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-2">
      <Box className="max-w-5xl mx-auto">
        {/* --- 1. HEADER CHI TIẾT --- */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main" }}>
                {studentInfo.fullName ? studentInfo.fullName.charAt(0) : "S"}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {testInfo.title || "Unknown Test"}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  mt={0.5}
                  color="text.secondary"
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2">
                      {studentInfo.fullName || "Unknown User"}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">
                      {studentInfo.email || "No Email"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
            <Box textAlign="right">
              <Chip
                icon={<CalendarTodayIcon />}
                label={`Submitted: ${dayjs(resultData.submittedAt).format(
                  "DD/MM/YYYY HH:mm"
                )}`}
                variant="outlined"
              />
            </Box>
          </Stack>
        </Paper>

        {/* --- 2. STATS CARDS (Giữ nguyên) --- */}
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="rounded-xl shadow border-t-4 border-green-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="#22c55e" fontWeight={700}>
                  {resultStats.score}%
                </Typography>
                <CheckCircleIcon color="success" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Score Percentage
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-blue-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {resultStats.correct}/{resultStats.total}
                </Typography>
                <AssignmentIcon color="primary" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Correct Answers
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-orange-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" color="warning.main" fontWeight={700}>
                  {formatTime(resultStats.time)}
                </Typography>
                <AccessTimeIcon color="warning" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Time Taken
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow border-t-4 border-purple-400">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  color="secondary.main"
                  fontWeight={700}
                >
                  {analysisResult.post_test_level || "N/A"}
                </Typography>
                <SchoolIcon color="secondary" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Estimated Level
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* --- 3. SKILL & TABS --- */}
        <Card className="rounded-xl shadow mb-6">
          <Tabs
            value={tab}
            onChange={(_, v) => {
              if (isEditing && v !== 2) {
                alert("Please save changes before switching tabs.");
                return;
              }
              setTab(v);
            }}
            indicatorColor="primary"
            textColor="primary"
            className="border-b"
            sx={{ px: 2 }}
          >
            <Tab label="Correct Answers" sx={{ textTransform: "none" }} />
            <Tab label="Incorrect Answers" sx={{ textTransform: "none" }} />
            {!test?.isTheLastTest && (
              <Tab
                label="Detailed Learning Plan (Edit)"
                sx={{ textTransform: "none" }}
              />
            )}
          </Tabs>
          <Divider />
          <CardContent>
            {tab === 0 && (
              <Box>
                {correctAnswers.map((item, idx) => (
                  <Card
                    key={idx}
                    className="mb-2 border-l-4 border-green-400 bg-green-50"
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight={600}>
                        {item.question}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        Answer: {item.answer}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {correctAnswers.length === 0 && (
                  <Typography align="center">No correct answers.</Typography>
                )}
              </Box>
            )}
            {tab === 1 && (
              <Box>
                {incorrectAnswers.map((item, idx) => (
                  <Card
                    key={idx}
                    className="mb-2 border-l-4 border-red-300 bg-red-50"
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight={600}>
                        {item.question}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="error.main"
                        fontWeight={600}
                      >
                        Your: {item.yourAnswer}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        Correct: {item.correctAnswer}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        {item.explain}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {incorrectAnswers.length === 0 && (
                  <Typography align="center">
                    Great job! No incorrect answers.
                  </Typography>
                )}
              </Box>
            )}

            {/* --- TAB 2: LEARNING PLAN (EDITABLE) --- */}
            {tab === 2 && (
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Personalized Assessment
                  </Typography>
                  <Button
                    variant={isEditing ? "contained" : "outlined"}
                    color={isEditing ? "success" : "primary"}
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={isEditing ? handleSaveChanges : handleEditToggle}
                  >
                    {isEditing ? "Save Feedback" : "Edit Feedback"}
                  </Button>
                </Stack>

                {/* Level Comparison */}
                <Card variant="outlined" sx={{ mb: 3, bgcolor: "#f8fafc" }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Level Transition Assessment
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Chip
                        label={`Current: ${
                          analysisResult.current_level || "N/A"
                        }`}
                      />
                      <ArrowForwardIcon color="action" />
                      <Chip
                        label={`Post-Test: ${
                          analysisResult.post_test_level || "N/A"
                        }`}
                        color="primary"
                      />
                    </Stack>
                  </CardContent>
                </Card>

                {/* Overall Goal */}
                <Card className="mb-4 bg-blue-50 border border-blue-200">
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <TrendingUpIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Overall Goal
                        </Typography>
                        {isEditing ? (
                          /* --- CHẾ ĐỘ SỬA: Dùng Autocomplete (Tags Input) --- */
                          <Autocomplete
                            multiple
                            freeSolo
                            options={[]} // Có thể để rỗng để cho phép nhập tự do
                            value={weak_topics || []}
                            onChange={(event, newValue) => {
                              // newValue là mảng các string mới sau khi thêm/xóa
                              handleInputChange("root", {
                                key: "weak_topics",
                                val: newValue,
                              });
                            }}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  size="small"
                                  color="error" // Giữ màu đỏ để cảnh báo
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                placeholder="Type a topic and press Enter..."
                                sx={{ mt: 1, bgcolor: "white" }}
                              />
                            )}
                          />
                        ) : (
                          /* --- CHẾ ĐỘ XEM (Giữ nguyên như cũ) --- */
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ mt: 1 }}
                          >
                            {weak_topics?.map((topic, index) => (
                              <Chip
                                key={index}
                                label={topic}
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            ))}
                            {(!weak_topics || weak_topics.length === 0) && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No weak topics identified.
                              </Typography>
                            )}
                          </Stack>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Progress & Trend (Hiển thị chi tiết từ JSON) */}
                <Card className="mb-4 bg-green-50 border border-green-200">
                  <CardContent>
                    <Stack direction="row" spacing={2} mb={2}>
                      <SpeedIcon color="success" />
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Progress & Trends
                        </Typography>

                        {/* Category Select */}
                        <Box mt={1} display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={600}>
                            Status:
                          </Typography>
                          {isEditing ? (
                            <TextField
                              select
                              size="small"
                              sx={{ bgcolor: "white", minWidth: 150 }}
                              value={
                                personalized_plan?.progress_speed?.category ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "progress_speed",
                                  e.target.value,
                                  "category"
                                )
                              }
                            >
                              <MenuItem value="accelerating">
                                Accelerating
                              </MenuItem>
                              <MenuItem value="steady">Steady</MenuItem>
                              <MenuItem value="declining">Declining</MenuItem>
                            </TextField>
                          ) : (
                            <Chip
                              label={
                                personalized_plan?.progress_speed?.category
                              }
                              color={
                                personalized_plan?.progress_speed?.category ===
                                "accelerating"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          )}
                        </Box>

                        {/* Trend Metrics (Read-only Visualization) */}
                        <Box
                          mt={2}
                          p={1.5}
                          bgcolor="rgba(255,255,255,0.6)"
                          borderRadius={1}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            AI ANALYTICS
                          </Typography>
                          <Grid container spacing={2} mt={0.5}>
                            <Grid item xs={4}>
                              <Typography variant="caption" display="block">
                                Growth Rate
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {
                                  personalized_plan?.progress_speed?.trend
                                    ?.accuracy_growth_rate
                                }
                                %
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="caption" display="block">
                                Consistency
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {
                                  personalized_plan?.progress_speed?.trend
                                    ?.consistency_index
                                }
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="caption" display="block">
                                Est. Weeks to Level Up
                              </Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {
                                  personalized_plan?.progress_speed
                                    ?.predicted_reach_next_level_weeks
                                }{" "}
                                weeks
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Editable Description */}
                        <Box mt={2}>
                          <Typography variant="subtitle2">
                            Assessment Description:
                          </Typography>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              multiline
                              minRows={2}
                              size="small"
                              sx={{ mt: 0.5, bgcolor: "white" }}
                              value={
                                personalized_plan?.progress_speed
                                  ?.description || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "progress_speed",
                                  e.target.value,
                                  "description"
                                )
                              }
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {personalized_plan?.progress_speed?.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Editable Recommendation */}
                        <Box
                          mt={2}
                          p={1.5}
                          bgcolor="#f0fdf4"
                          borderRadius={1}
                          border="1px solid #bbf7d0"
                        >
                          <Typography variant="subtitle2" color="green">
                            Key Recommendation:
                          </Typography>
                          {isEditing ? (
                            <TextField
                              fullWidth
                              multiline
                              minRows={2}
                              size="small"
                              sx={{ mt: 0.5, bgcolor: "white" }}
                              value={
                                personalized_plan?.progress_speed
                                  ?.recommendation || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "progress_speed",
                                  e.target.value,
                                  "recommendation"
                                )
                              }
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {
                                personalized_plan?.progress_speed
                                  ?.recommendation
                              }
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="mt-4 bg-yellow-50 border border-yellow-200">
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      Teacher Notes
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        size="small"
                        sx={{ bgcolor: "white" }}
                        placeholder="Add notes..."
                        value={personalized_plan?.notes || ""}
                        onChange={(e) =>
                          handleInputChange("direct", {
                            key: "notes",
                            val: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {personalized_plan?.notes || "No notes available."}
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Weekly Goals (List View) */}
                <Box mt={4}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Weekly Plan Detail
                  </Typography>
                  {personalized_plan?.weekly_goals?.map((week, idx) => (
                    <Accordion key={idx} defaultExpanded={idx === 0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {isEditing ? (
                          /* --- CHẾ ĐỘ SỬA HEADER (Topic & Hours) --- */
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ width: "100%", pr: 2 }}
                            onClick={(e) => e.stopPropagation()} // Ngăn click input làm đóng mở accordion
                          >
                            <Typography fontWeight={600} sx={{ minWidth: 60 }}>
                              Week {week.week}:
                            </Typography>
                            <TextField
                              size="small"
                              placeholder="Topic"
                              value={week.topic}
                              onChange={(e) =>
                                handleWeeklyGoalChange(
                                  idx,
                                  "topic",
                                  e.target.value
                                )
                              }
                              sx={{ flex: 1, bgcolor: "white" }}
                            />
                            <TextField
                              size="small"
                              type="number"
                              label="Hours"
                              value={week.hours}
                              inputProps={{ min: 1 }}
                              onKeyDown={(e) => {
                                if (e.key === "-" || e.key === "e") {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                const val = e.target.value;

                                // Nếu user xóa sạch ô input (rỗng), cho phép rỗng để họ gõ số mới
                                if (val === "") {
                                  handleWeeklyGoalChange(idx, "hours", "");
                                  return;
                                }

                                const numVal = Number(val);

                                // Nếu nhập 0 hoặc số âm (dù đã chặn phím nhưng cứ check cho chắc) -> ép về 1
                                if (numVal < 1) {
                                  handleWeeklyGoalChange(idx, "hours", 1);
                                } else {
                                  handleWeeklyGoalChange(idx, "hours", numVal);
                                }
                              }}
                              sx={{ width: 80, bgcolor: "white" }}
                            />
                          </Stack>
                        ) : (
                          /* --- CHẾ ĐỘ XEM HEADER --- */
                          <Typography fontWeight={600}>
                            Week {week.week}: {week.topic} ({week.hours}h)
                          </Typography>
                        )}
                      </AccordionSummary>

                      <AccordionDetails>
                        {isEditing ? (
                          /* === CHẾ ĐỘ SỬA: Danh sách Input (Title + URL) === */
                          <Stack spacing={1}>
                            {week.materials?.map((mat, matIdx) => {
                              // Chuẩn hóa data: nếu data cũ là string thì coi như là title
                              const titleVal =
                                typeof mat === "string"
                                  ? mat
                                  : mat?.title || "";
                              const urlVal =
                                typeof mat === "string" ? "" : mat?.url || "";

                              return (
                                <Stack
                                  key={matIdx}
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <TextField
                                    size="small"
                                    placeholder="Material Title (e.g. Grammar Book)"
                                    value={titleVal}
                                    onChange={(e) =>
                                      handleMaterialChange(
                                        idx,
                                        matIdx,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    sx={{ flex: 1, bgcolor: "white" }}
                                  />
                                  <TextField
                                    size="small"
                                    placeholder="URL (https://...)"
                                    value={urlVal}
                                    onChange={(e) =>
                                      handleMaterialChange(
                                        idx,
                                        matIdx,
                                        "url",
                                        e.target.value
                                      )
                                    }
                                    sx={{ flex: 1, bgcolor: "white" }}
                                  />
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveMaterial(idx, matIdx)
                                    }
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Stack>
                              );
                            })}

                            {/* Nút thêm mới */}
                            <Button
                              startIcon={<AddCircleOutlineIcon />}
                              size="small"
                              sx={{
                                alignSelf: "flex-start",
                                textTransform: "none",
                              }}
                              onClick={() => handleAddMaterial(idx)}
                            >
                              Add Material
                            </Button>
                          </Stack>
                        ) : (
                          /* === CHẾ ĐỘ XEM: Hiển thị Chip có Link === */
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            mb={1}
                            mt={0.5}
                          >
                            {week.materials?.map((m, i) => {
                              // Xử lý hiển thị an toàn dù m là string hay object
                              const label =
                                typeof m === "string" ? m : m?.title;
                              const link =
                                typeof m === "string" ? null : m?.url;

                              return (
                                <Chip
                                  key={i}
                                  label={label}
                                  size="small"
                                  icon={link ? <LinkIcon /> : <BookIcon />}
                                  variant="outlined"
                                  clickable={!!link}
                                  color={link ? "primary" : "default"}
                                  onClick={() => {
                                    if (link) window.open(link, "_blank");
                                  }}
                                />
                              );
                            })}
                            {(!week.materials ||
                              week.materials.length === 0) && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                None
                              </Typography>
                            )}
                          </Stack>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Certificate Modal & Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>
        <CertificateDetailModal
          open={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          certificate={resultData?.certificate?.certificate}
        />
      </Box>
    </Box>
  );
};

export default TestResultEdit;
