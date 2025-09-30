import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";

const TestResultsScreen = ({ navigation, route }) => {
  const { attemptId } = route.params;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await testApi.getTestResults(attemptId);
      const test = await testApi.getTestById(
        response.data.attempt.testPoolId.baseTestId
      );

      const gradeTest = await testApi.gradeTest(
        response.data.attempt.testPoolId.baseTestId,
        response.data.attempt._id
      );

      setGrade(gradeTest.data);
      setTest(test.data);
      setResults(response.data);
    } catch (error) {
      console.error("Error loading results:", error);
      Alert.alert("Error", "Failed to load test results");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeTest = () => {
    navigation.navigate("Assessment", { testId: results.testId });
  };

  const handleBackToTests = () => {
    navigation.navigate("AssessmentList");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  if (!results) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Results not found</Text>
      </View>
    );
  }

  const isPassed = results.attempt?.score >= (results?.passingScore || 0);
  const scoreColor = isPassed ? "#10B981" : "#EF4444";
  const scoreIcon = isPassed ? "checkmark-circle" : "close-circle";

  const correctAnswers = results.answers?.filter((a) => a.isCorrect).length;
  const totalQuestions = results.answers?.length;

  // Chuyển sang Date

  const startTime = results.attempt?.startTime;
  const endTime = results.attempt?.endTime;

  const start = new Date(startTime);
  const end = new Date(endTime);

  const diffMs = end - start; // mili giây
  const diffSec = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffSec / 60);
  const seconds = diffSec % 60;

  console.log("Time taken (s):", grade);

  return (
    <ScrollView style={styles.container}>
      {/* Results Header */}
      <View style={styles.header}>
        <View
          style={[styles.resultIcon, { backgroundColor: scoreColor + "20" }]}
        >
          <Ionicons name={scoreIcon} size={60} color={scoreColor} />
        </View>
        <Text style={styles.resultTitle}>
          {isPassed ? "Congratulations!" : "Better luck next time!"}
        </Text>
        <Text style={styles.resultSubtitle}>
          {isPassed ? "You passed the test!" : "You need to improve your score"}
        </Text>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Your Score</Text>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>
          {results.attempt.score}
        </Text>
        <Text style={styles.scoreDetails}>
          {correctAnswers} out of {totalQuestions} questions correct
        </Text>
      </View>

      {/* Test Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Details</Text>

        <View style={styles.detailItem}>
          <Ionicons name="clipboard" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Test:</Text>
          <Text style={styles.detailValue}>{test ? test.title : "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Time:</Text>
          <Text
            style={styles.detailValue}
          >{`     ${minutes} phút ${seconds} giây`}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="trophy" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Passing Score:</Text>
          <Text style={styles.detailValue}>
            {results?.passingScore || "70"}%
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Completed:</Text>
          <Text style={styles.detailValue}>
            {new Date(results.completedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Performance Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Breakdown</Text>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLeft}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.breakdownLabel}>Correct Answers</Text>
          </View>
          <Text style={styles.breakdownValue}>{correctAnswers}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLeft}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.breakdownLabel}>Incorrect Answers</Text>
          </View>
          <Text style={styles.breakdownValue}>
            {totalQuestions - correctAnswers}
          </Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLeft}>
            <Ionicons name="help-circle" size={20} color="#6B7280" />
            <Text style={styles.breakdownLabel}>Total Questions</Text>
          </View>
          <Text style={styles.breakdownValue}>{totalQuestions}</Text>
        </View>
      </View>

      {/* Graded */}
      {grade && <QuizResult data={grade} />}

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {!isPassed && (
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={handleRetakeTest}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retakeButtonText}>Retake Test</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={handleBackToTests}>
          <Ionicons name="list" size={20} color="#3B82F6" />
          <Text style={styles.backButtonText}>Back to Tests</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const QuizResult = ({ data }) => {
  const {
    per_question,
    personalized_plan,
    recommendations,
    skill_summary,
    total_score,
    weak_topics,
  } = data;

  return (
    <View style={styles.container}>
      {/* Tóm tắt điểm số */}
      <View style={styles.summary}>
        <Text style={styles.title}>Kết quả bài kiểm tra</Text>
        <Text>Tổng điểm: {total_score}/10</Text>
        <Text>Độ chính xác: {skill_summary[0].accuracy}%</Text>
      </View>

      {/* Danh sách câu hỏi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết câu hỏi</Text>
        <FlatList
          data={per_question}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.questionItem}>
              <Text>ID: {item.id}</Text>
              <Text>Topic: {item.topic}</Text>
              <Text>User Answer: {item.user_answer}</Text>
              <Text>Expected: {item.expected_answer}</Text>
              <Text style={item.correct ? styles.correct : styles.incorrect}>
                {item.correct ? "Đúng" : "Sai"}
              </Text>
              {item.explain ? <Text>Giải thích: {item.explain}</Text> : null}
            </View>
          )}
        />
      </View>

      {/* Kế hoạch học tập */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kế hoạch học tập</Text>
        <Text>Materials: {personalized_plan.materials?.join(", ")}</Text>
        <Text>Progress Speed: {personalized_plan.progress_speed}</Text>
      </View>

      {/* Khuyến nghị */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khuyến nghị</Text>
        <FlatList
          data={recommendations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>- {item}</Text>}
        />
      </View>

      {/* Điểm yếu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Điểm yếu</Text>
        <FlatList
          data={weak_topics}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>- {item}</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginTop: 16,
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  resultIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  scoreCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreDetails: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  breakdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  breakdownLabel: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  actionSection: {
    padding: 20,
  },
  retakeButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  retakeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  backButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
  },
  answer: {
    fontSize: 14,
    color: "green",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },

  summary: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  correct: {
    color: "green",
  },
  incorrect: {
    color: "red",
  },
});

export default TestResultsScreen;
