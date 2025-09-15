import React, { useState } from "react";
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
import { useLocation } from "react-router-dom";

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

const TestResult = () => {
  const location = useLocation();
  const { resultData } = location.state || {};
  const [tab, setTab] = useState(0);

  console.log("Location state:", resultData);

  // Destructuring với giá trị mặc định để tránh undefined
  const {
    total_score = 0,
    total_questions = 0,
    per_question = [],
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
  } = resultData;

  // Tính toán stats với safe checks
  const correctCount = per_question.filter(
    (q) => q && q.correct === true
  ).length;
  const incorrectCount = total_questions - correctCount;
  const scorePercent =
    total_questions > 0 ? Math.round((total_score / total_questions) * 100) : 0;

  const resultStats = {
    score: scorePercent,
    correct: correctCount,
    incorrect: incorrectCount,
    total: total_questions,
    time: 300, // GIẢ LẬP 5 PHÚT - SAU NÀY SẼ THAY LẠI
  };

  // Tạo correctAnswers từ per_question với safe checks
  const correctAnswers = per_question
    .filter((q) => q && q.correct === true)
    .map((q) => ({
      question: `Question ${q.id || "N/A"}`,
      answer: q.expected_answer || "No answer",
      time: 0,
      type: `${q.skill || "Unknown"} - ${q.topic || "Unknown topic"}`,
      explain: q.explain || "No explanation",
    }));

  // Tạo incorrectAnswers từ per_question với safe checks
  const incorrectAnswers = per_question
    .filter((q) => q && q.correct === false)
    .map((q) => ({
      question: `Question ${q.id || "N/A"}`,
      yourAnswer: q.user_answer || "No answer",
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
                Areas for Improvement
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
            <Tab label="Learning Plan" sx={{ textTransform: "none" }} />
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

                {/* Progress Speed */}
                <Card className="mb-4 bg-green-50 border border-green-200">
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <ScheduleIcon color="success" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          Progress Speed
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                          {personalized_plan.progress_speed}
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
                {personalized_plan.weekly_goals &&
                  personalized_plan.weekly_goals.length > 0 && (
                    <>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Weekly Study Plan (
                        {personalized_plan.weekly_goals.length} weeks)
                      </Typography>

                      {personalized_plan.weekly_goals.map((week, idx) => (
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
                            {/* Activities */}
                            {week.activities && week.activities.length > 0 && (
                              <Box sx={{ mb: 3 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                  sx={{ mb: 1 }}
                                >
                                  Activities:
                                </Typography>
                                <List dense>
                                  {week.activities.map((activity, actIdx) => (
                                    <ListItem key={actIdx}>
                                      <ListItemIcon>
                                        <AssignmentIcon
                                          fontSize="small"
                                          color="action"
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={activity} />
                                    </ListItem>
                                  ))}
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

        {/* Action Buttons */}
        <Box className="flex justify-center gap-4 mt-6">
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4, fontWeight: 600, textTransform: "none" }}
          >
            Retake Test
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ px: 4, fontWeight: 600, textTransform: "none" }}
          >
            View All Tests
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ px: 4, fontWeight: 600, textTransform: "none" }}
          >
            Start Learning Plan
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TestResult;
