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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Dữ liệu mẫu
const resultStats = {
  score: 80,
  correct: 8,
  incorrect: 2,
  total: 10,
  time: 272, // giây
};

const correctAnswers = [
  {
    question: "What is the past tense of 'go'?",
    answer: "went",
    time: 15,
    type: "Grammar, Past Tense",
  },
  {
    question: "Choose the correct article: ___ umbrella",
    answer: "an",
    time: 12,
    type: "Grammar, Articles",
  },
  {
    question: "What is the opposite of 'expensive'?",
    answer: "cheap",
    time: 18,
    type: "Vocabulary, Antonyms",
  },
  {
    question: "Which word means 'to make something better'?",
    answer: "improve",
    time: 20,
    type: "Vocabulary, Meaning",
  },
  {
    question: "Complete the sentence: She ___ to school every day.",
    answer: "goes",
    time: 22,
    type: "Grammar, Present Simple",
  },
  {
    question: "What is the plural form of 'child'?",
    answer: "children",
    time: 14,
    type: "Grammar, Plurals",
  },
  {
    question: "Choose the correct preposition: I'm afraid ___ spiders.",
    answer: "of",
    time: 19,
    type: "Grammar, Prepositions",
  },
  {
    question: "What is the comparative form of 'good'?",
    answer: "better",
    time: 16,
    type: "Grammar, Comparatives",
  },
];

const incorrectAnswers = [
  {
    question: "What is the past participle of 'eat'?",
    yourAnswer: "ate",
    correctAnswer: "eaten",
    time: 25,
    type: "Grammar, Past Participle",
  },
  {
    question: "Choose the correct conditional: If it rains, I ___ at home.",
    yourAnswer: "will stayed",
    correctAnswer: "will stay",
    time: 30,
    type: "Grammar, Conditionals",
  },
];

const recommendations = [
  {
    title: "English Grammar Basics",
    desc: "Master fundamental grammar rules including tenses and articles",
    difficulty: "Beginner",
    duration: "2 hours",
    topics: ["Tenses", "Articles", "Prepositions"],
  },
  {
    title: "Essential English Vocabulary",
    desc: "Build your vocabulary with commonly used words and phrases",
    difficulty: "Intermediate",
    duration: "3 hours",
    topics: ["Common Words", "Phrasal Verbs", "Collocations"],
  },
];

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

const TestResult = () => {
  const [tab, setTab] = useState(0);
  const avgTime = Math.round(resultStats.time / resultStats.total);

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
            <Tab
              label="Learning Recommendations"
              sx={{ textTransform: "none" }}
            />
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
                <Stack spacing={2}>
                  {correctAnswers.map((item, idx) => (
                    <Card
                      key={idx}
                      className="border-l-4 border-green-400 bg-green-50"
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography
                            variant="caption"
                            color="#22c55e"
                            fontWeight={700}
                            sx={{ textTransform: "uppercase" }}
                          >
                            Correct
                          </Typography>
                          {item.type.split(",").map((type, index) => (
                            <Chip
                              key={index}
                              label={type.trim()}
                              color="info"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          ))}
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
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
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
                <Stack spacing={2}>
                  {incorrectAnswers.map((item, idx) => (
                    <Card
                      key={idx}
                      className="border-l-4 border-red-300 bg-red-50"
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
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
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Recommended Learning Content
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                  Based on your test results, we recommend focusing on these
                  areas to improve your knowledge:
                </Typography>
                <Grid container spacing={2}>
                  {recommendations.map((rec, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                      <Card className="bg-white border shadow-sm">
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                          >
                            {rec.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#64748b"
                            sx={{ mb: 1 }}
                          >
                            {rec.desc}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <Chip
                              label={rec.difficulty}
                              color={
                                rec.difficulty === "Beginner"
                                  ? "primary"
                                  : "warning"
                              }
                              size="small"
                            />
                            <Chip
                              label={`Duration: ${rec.duration}`}
                              color="default"
                              size="small"
                            />
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mb: 2, flexWrap: "wrap" }}
                          >
                            {rec.topics.map((topic, i) => (
                              <Chip
                                key={i}
                                label={topic}
                                variant="outlined"
                                color="info"
                                size="small"
                              />
                            ))}
                          </Stack>

                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                              textTransform: "none",
                            }}
                          >
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Nút điều hướng */}
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
            Continue Learning
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TestResult;
