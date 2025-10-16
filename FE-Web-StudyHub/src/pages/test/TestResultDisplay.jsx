import React, { useState } from "react";
import { Chip, Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Dữ liệu JSON bạn cung cấp.
// const resultData = {
//   _id: "68f0a15380a4aa38cf07cc39",
//   attemptId: {
//     _id: "68efce441f642fbf77a32473",
//     testPoolId: "68efce271f642fbf77a3243d",
//     userId: {
//       _id: "68cf94ce7781dafadbe1d56e",
//       fullName: "Nguyễn Thành Cương",
//       email: "cuong@gmail.com",
//     },
//     testId: {
//       _id: "68dab116bbc1e78ee5343fdd",
//       title: "TOEIC Grammar Practice - Tag Questions",
//     },
//     attemptNumber: 3,
//     maxAttempts: 3,
//     score: 1,
//     evaluationModel: "gemini",
//     createdAt: "2025-10-15T16:39:32.714Z",
//     updatedAt: "2025-10-16T07:40:03.864Z",
//   },
//   answers: [
//     {
//       questionId: {
//         questionText: "The new marketing strategy seems quite effective, ___?",
//       },
//       selectedOptionText: "doesn't it",
//       isCorrect: true,
//     },
//     {
//       questionId: {
//         questionText:
//           "They haven't finalized the budget for the next quarter yet, ___?",
//       },
//       selectedOptionText: "haven't they",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText: "We should prioritize customer feedback, ___?",
//       },
//       selectedOptionText: "don't we",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText:
//           "The project manager was very optimistic about the deadline, ___?",
//       },
//       selectedOptionText: "did he",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText:
//           "Nobody in the department volunteered for the extra shift, ___?",
//       },
//       selectedOptionText: "did he",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText: "There aren't any further delays expected, ___?",
//       },
//       selectedOptionText: "do they",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText: "The new system will be implemented next month, ___?",
//       },
//       selectedOptionText: "does it",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText:
//           "He has a lot of experience in international finance, ___?",
//       },
//       selectedOptionText: "isn't he",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText: "Everyone attended the mandatory training session, ___?",
//       },
//       selectedOptionText: "did he",
//       isCorrect: false,
//     },
//     {
//       questionId: {
//         questionText:
//           "You can't access the confidential files without authorization, ___?",
//       },
//       selectedOptionText: "don't you",
//       isCorrect: false,
//     },
//   ],
//   analysisResult: {
//     total_score: 1,
//     total_questions: 10,
//     per_question: [
//       {
//         id: 1,
//         question: "The new marketing strategy seems quite effective, ___?",
//         correct: true,
//         expected_answer: "doesn't it",
//         user_answer: "doesn't it",
//         skill: "Grammar",
//         topic:
//           "Tag questions with 'do', Present simple tense, Pronoun 'it', Positive statement, negative tag",
//         explain:
//           "Correct. The statement is positive present simple, so the tag must be negative 'doesn't it'.",
//       },
//       {
//         id: 2,
//         question:
//           "They haven't finalized the budget for the next quarter yet, ___?",
//         correct: false,
//         expected_answer: "have they",
//         user_answer: "haven't they",
//         skill: "Grammar",
//         topic:
//           "Tag questions with 'have' (present perfect), Negative statement, positive tag, Pronoun 'they'",
//         explain:
//           "The statement 'haven't finalized' is negative, so the tag must be positive 'have they'.",
//       },
//       {
//         id: 3,
//         question: "We should prioritize customer feedback, ___?",
//         correct: false,
//         expected_answer: "shouldn't we",
//         user_answer: "don't we",
//         skill: "Grammar",
//         topic:
//           "Tag questions with modal verbs, Modal 'should', Positive statement, negative tag, Pronoun 'we'",
//         explain:
//           "The statement uses the modal 'should', so the tag must also use 'should'. Since the statement is positive, the tag is 'shouldn't we'.",
//       },
//       {
//         id: 4,
//         question:
//           "The project manager was very optimistic about the deadline, ___?",
//         correct: false,
//         expected_answer: "wasn't he",
//         user_answer: "did he",
//         skill: "Grammar",
//         topic:
//           "Tag questions with 'be', Past simple tense, Pronoun 'he', Positive statement, negative tag",
//         explain:
//           "The verb is 'was' (a form of 'be'), so the tag must use 'wasn't'. The statement is positive, requiring a negative tag.",
//       },
//       {
//         id: 5,
//         question:
//           "Nobody in the department volunteered for the extra shift, ___?",
//         correct: false,
//         expected_answer: "did they",
//         user_answer: "did he",
//         skill: "Grammar",
//         topic:
//           "Tag questions with indefinite pronouns, 'Nobody' as subject, Past simple tense, Negative statement, positive tag, Pronoun 'they'",
//         explain:
//           "'Nobody' makes the statement negative and takes a plural pronoun ('they'). Therefore, the tag must be positive: 'did they'.",
//       },
//       {
//         id: 6,
//         question: "There aren't any further delays expected, ___?",
//         correct: false,
//         expected_answer: "are there",
//         user_answer: "do they",
//         skill: "Grammar",
//         topic:
//           "Tag questions with 'there is/are', Present simple tense, Negative statement, positive tag, Pronoun 'there'",
//         explain:
//           "Statements starting with 'There are' use 'there' in the tag. The statement is negative, so the tag is 'are there'.",
//       },
//       {
//         id: 7,
//         question: "The new system will be implemented next month, ___?",
//         correct: false,
//         expected_answer: "won't it",
//         user_answer: "does it",
//         skill: "Grammar",
//         topic:
//           "Tag questions with future simple, Passive voice, Positive statement, negative tag, Pronoun 'it'",
//         explain:
//           "The future simple auxiliary 'will' is used in the statement, so the tag must be 'won't it' (negative of 'will').",
//       },
//       {
//         id: 8,
//         question: "He has a lot of experience in international finance, ___?",
//         correct: false,
//         expected_answer: "doesn't he",
//         user_answer: "isn't he",
//         skill: "Grammar",
//         topic:
//           "Tag questions with 'have' (main verb), Present simple tense, Positive statement, negative tag, Pronoun 'he'",
//         explain:
//           "When 'has' is a main verb (meaning possession), the tag uses 'do/does'. The statement is positive, so the tag is 'doesn't he'.",
//       },
//       {
//         id: 9,
//         question: "Everyone attended the mandatory training session, ___?",
//         correct: false,
//         expected_answer: "didn't they",
//         user_answer: "did he",
//         skill: "Grammar",
//         topic:
//           "Tag questions with indefinite pronouns, 'Everyone' as subject, Past simple tense, Positive statement, negative tag, Pronoun 'they'",
//         explain:
//           "'Everyone' takes a plural pronoun ('they') in the tag. The statement is past simple positive, so the tag is 'didn't they'.",
//       },
//       {
//         id: 10,
//         question:
//           "You can't access the confidential files without authorization, ___?",
//         correct: false,
//         expected_answer: "can you",
//         user_answer: "don't you",
//         skill: "Grammar",
//         topic:
//           "Tag questions with modal verbs, Modal 'can', Negative statement, positive tag, Pronoun 'you'",
//         explain:
//           "The statement uses the modal 'can't' (negative), so the tag must be positive: 'can you'.",
//       },
//     ],
//     weak_topics: [
//       "Tag questions with modal verbs",
//       "Tag questions with indefinite pronouns",
//       "Tag questions with 'have' (main verb)",
//     ],
//     recommendations: [
//       "Review the rules for polarity (positive/negative).",
//       "Focus on matching the auxiliary or modal verb from the main clause.",
//       "Practice special cases like 'everyone', 'nobody', and 'there is/are'.",
//     ],
//     personalized_plan: {
//       weekly_goals: [
//         {
//           week: 1,
//           topic: "Tag Questions - Basic Rules",
//           description:
//             "Focus on polarity and matching auxiliary verbs for simple tenses.",
//           study_methods: [
//             "Review grammar rules.",
//             "Complete targeted exercises.",
//           ],
//           materials: ["English Grammar in Use", "British Council website."],
//           hours: 3,
//         },
//         {
//           week: 2,
//           topic: "Tag Questions - Special Cases",
//           description:
//             "Learn rules for indefinite pronouns ('everyone'), 'there is/are', and 'have' as a main verb.",
//           study_methods: [
//             "Study examples for special cases.",
//             "Practice specific exercises.",
//           ],
//           materials: [
//             "TOEIC grammar guides.",
//             "Advanced English grammar websites.",
//           ],
//           hours: 3,
//         },
//         {
//           week: 3,
//           topic: "Tag Questions - Mixed Practice",
//           description:
//             "Consolidate all rules with mixed practice and listening exercises.",
//           study_methods: [
//             "Take comprehensive quizzes.",
//             "Listen to English conversations.",
//           ],
//           materials: ["TOEIC practice tests.", "Grammar workbooks."],
//           hours: 2,
//         },
//       ],
//     },
//   },
// };

// Component để hiển thị kết quả
const TestResultDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state;
  const { attemptId, analysisResult } = attempt;
  const [activeTab, setActiveTab] = useState("weakTopics"); // State để quản lý tab đang hoạt động

  if (!analysisResult) {
    return <div style={styles.container}>Loading results...</div>;
  }

  const {
    total_score,
    total_questions,
    per_question,
    weak_topics,
    recommendations,
    personalized_plan,
  } = analysisResult;

  const accuracy =
    total_questions > 0
      ? ((total_score / total_questions) * 100).toFixed(0)
      : 0;

  return (
    <div style={styles.container}>
      <Box className="w-full max-w-3xl ">
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 24,
            color: "#2563eb",
          }}
        >
          Back
        </Button>
      </Box>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>{attemptId.testId.title}</h1>
        <p style={styles.studentInfo}>
          <i
            className="fas fa-user-graduate"
            style={{ marginRight: "8px" }}
          ></i>
          <strong>Student:</strong> {attemptId.userId.fullName}
        </p>
      </header>

      {/* Score Summary Card */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          <i className="fas fa-chart-bar" style={{ marginRight: "10px" }}></i>
          Overall Performance
        </h2>
        <div style={styles.scoreContainer}>
          <div style={styles.scoreCircle}>
            <span
              style={styles.score}
            >{`${total_score}/${total_questions}`}</span>
            <span style={styles.accuracy}>Accuracy: {accuracy}%</span>
          </div>
          <div style={styles.summaryText}>
            <p>
              You answered{" "}
              <strong>
                {total_score} out of {total_questions} questions
              </strong>{" "}
              correctly.
            </p>
            <p>
              Let's dive into the details to understand your strengths and areas
              for improvement!
            </p>
          </div>
        </div>
      </section>

      {/* Question by Question Analysis */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          <i className="fas fa-search" style={{ marginRight: "10px" }}></i>
          Detailed Question Analysis
        </h2>
        {per_question.map((item, index) => (
          <div
            key={item.id}
            style={{
              ...styles.questionCard,
              ...(item.correct ? styles.correct : styles.incorrect),
            }}
          >
            <p style={styles.questionText}>
              <strong style={{ color: item.correct ? "#28a745" : "#dc3545" }}>
                Question {index + 1}:
              </strong>{" "}
              {item.question}
            </p>
            <p style={styles.answerDisplay}>
              <strong>Your Answer:</strong>{" "}
              <span style={styles.userAnswer}>{item.user_answer}</span>{" "}
              {item.correct ? (
                <i
                  className="fas fa-check-circle"
                  style={{ color: "#28a745" }}
                ></i>
              ) : (
                <i
                  className="fas fa-times-circle"
                  style={{ color: "#dc3545" }}
                ></i>
              )}
            </p>
            {!item.correct && (
              <p style={styles.answerDisplay}>
                <strong>Correct Answer:</strong>{" "}
                <span style={styles.correctAnswer}>{item.expected_answer}</span>
              </p>
            )}
            <div style={styles.explanation}>
              <strong>💡 Explanation:</strong> {item.explain}
            </div>
          </div>
        ))}
      </section>

      {/* Weak Topics and Recommendations - Revamped with Tabs */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          <i className="fas fa-lightbulb" style={{ marginRight: "10px" }}></i>
          Areas for Improvement & Recommendations
        </h2>
        <div style={styles.tabsContainer}>
          <div style={styles.tabButtons}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "weakTopics" && styles.activeTabButton),
              }}
              onClick={() => setActiveTab("weakTopics")}
            >
              <i
                className="fas fa-exclamation-triangle"
                style={{ marginRight: "8px" }}
              ></i>
              Weak Topics
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "recommendations" && styles.activeTabButton),
              }}
              onClick={() => setActiveTab("recommendations")}
            >
              <i
                className="fas fa-graduation-cap"
                style={{ marginRight: "8px" }}
              ></i>
              Recommendations
            </button>
          </div>
          <div style={styles.tabContent}>
            {activeTab === "weakTopics" && (
              <div>
                <h3 style={styles.tabContentTitle}>Focus on these areas:</h3>
                <ul style={styles.list}>
                  {weak_topics.map((topic, index) => (
                    <li key={index}>
                      <i
                        className="fas fa-minus-circle"
                        style={{ marginRight: "8px", color: "#dc3545" }}
                      ></i>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "recommendations" && (
              <div>
                <h3 style={styles.tabContentTitle}>Here's how to improve:</h3>
                <ul style={styles.list}>
                  {recommendations.map((rec, index) => (
                    <li key={index}>
                      <i
                        className="fas fa-check-circle"
                        style={{ marginRight: "8px", color: "#28a745" }}
                      ></i>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Personalized Plan */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          <i
            className="fas fa-calendar-alt"
            style={{ marginRight: "10px" }}
          ></i>
          Personalized Study Plan
        </h2>
        {personalized_plan.weekly_goals.map((week, index) => (
          <div key={index} style={styles.weekCard}>
            <h3 style={styles.weekTitle}>
              <i
                className="fas fa-bookmark"
                style={{ marginRight: "8px", color: "#17a2b8" }}
              ></i>
              Week {week.week}: {week.topic}
            </h3>
            <p style={styles.weekDescription}>
              <strong>Description:</strong> {week.description}
            </p>
            <h4>
              <i
                className="fas fa-book-open"
                style={{ marginRight: "8px", color: "#6f42c1" }}
              ></i>
              Study Methods:
            </h4>
            <ul style={styles.list}>
              {week.study_methods.map((method, i) => (
                <li key={i}>
                  <i
                    className="fas fa-caret-right"
                    style={{ marginRight: "8px", color: "#007bff" }}
                  ></i>
                  {method}
                </li>
              ))}
            </ul>
            <h4>
              <i
                className="fas fa-atlas"
                style={{ marginRight: "8px", color: "#fd7e14" }}
              ></i>
              Materials:
            </h4>
            <ul style={styles.list}>
              {week.materials.map((material, i) => (
                <li key={i}>
                  <i
                    className="fas fa-caret-right"
                    style={{ marginRight: "8px", color: "#007bff" }}
                  ></i>
                  {material}
                </li>
              ))}
            </ul>
            <p style={styles.hours}>
              <i className="fas fa-clock" style={{ marginRight: "8px" }}></i>
              <strong>Estimated Time:</strong> {week.hours} hours
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

// CSS-in-JS để tạo kiểu cho component
const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    maxWidth: "950px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#eef2f6",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    color: "#333",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 18px",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#34495e",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1em",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    marginBottom: "30px",
    // Thêm hover effect
    // ':hover': {
    //   transform: 'translateY(-2px)',
    //   boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
    // }
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    background: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
    padding: "30px 20px",
    borderRadius: "15px",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  mainTitle: {
    fontSize: "2.8em",
    marginBottom: "10px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  studentInfo: {
    fontSize: "1.1em",
    opacity: "0.9",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0",
  },
  sectionTitle: {
    fontSize: "1.8em",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
  },
  scoreContainer: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  scoreCircle: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    border: "8px solid #66b3ff",
    flexShrink: 0,
    color: "#000",
    fontWeight: "bold",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    position: "relative",
  },
  score: {
    fontSize: "3.2em",
    fontWeight: "800",
    color: "#0a4b87",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    lineHeight: "1.2",
  },
  accuracy: {
    fontSize: "1.2em",
    color: "#0a4b87",
    textAlign: "center",
    width: "100%",
  },
  summaryText: {
    lineHeight: "1.8",
    fontSize: "1.1em",
    color: "#555",
  },
  questionCard: {
    padding: "20px",
    margin: "20px 0",
    borderRadius: "12px",
    borderLeft: "8px solid",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  correct: {
    backgroundColor: "#e6ffed",
    borderColor: "#52c41a",
  },
  incorrect: {
    backgroundColor: "#fff0f6",
    borderColor: "#ff4d4f",
  },
  questionText: {
    fontWeight: "600",
    marginBottom: "12px",
    fontSize: "1.1em",
    lineHeight: "1.6",
  },
  answerDisplay: {
    fontSize: "1em",
    marginBottom: "8px",
  },
  userAnswer: {
    fontWeight: "bold",
    backgroundColor: "#f0f2f5",
    padding: "5px 10px",
    borderRadius: "6px",
    marginRight: "8px",
    color: "#34495e",
  },
  correctAnswer: {
    fontWeight: "bold",
    color: "#28a745",
    backgroundColor: "#e6ffe6",
    padding: "5px 10px",
    borderRadius: "6px",
  },
  explanation: {
    marginTop: "15px",
    fontSize: "0.95em",
    color: "#555",
    lineHeight: "1.7",
    backgroundColor: "#fdfdfd",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #eee",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
  },
  tabsContainer: {
    marginTop: "20px",
  },
  tabButtons: {
    display: "flex",
    marginBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
  },
  tabButton: {
    padding: "12px 20px",
    cursor: "pointer",
    backgroundColor: "#f0f2f5",
    border: "none",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    marginRight: "5px",
    fontWeight: "600",
    color: "#6c757d",
    fontSize: "1em",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#2575fc",
    color: "#ffffff",
    boxShadow: "0 -3px 8px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
    zIndex: 1,
  },
  tabContent: {
    backgroundColor: "#fdfdfd",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
    border: "1px solid #e0e0e0",
  },
  tabContentTitle: {
    fontSize: "1.4em",
    color: "#2c3e50",
    marginBottom: "15px",
    borderBottom: "1px dashed #e9ecef",
    paddingBottom: "10px",
  },
  list: {
    paddingLeft: "25px",
    lineHeight: "1.8",
    listStyleType: "none",
  },
  weekCard: {
    backgroundColor: "#f7f9fc",
    padding: "25px",
    margin: "20px 0",
    borderRadius: "12px",
    border: "1px solid #e0e7ee",
    boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
  },
  weekTitle: {
    marginTop: 0,
    color: "#0d6efd",
    fontSize: "1.4em",
    fontWeight: "600",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
  },
  weekDescription: {
    fontSize: "1em",
    color: "#555",
    marginBottom: "15px",
  },
  hours: {
    textAlign: "right",
    fontStyle: "italic",
    color: "#777",
    marginTop: "20px",
    fontSize: "0.95em",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
};

export default TestResultDisplay;
