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

const TestResultsScreen = ({ navigation, route }) => {
  const { result } = route.params; // ✅ dữ liệu truyền qua navigation
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    if (result) {
      loadResults();
    }
  }, [result]);

  const loadResults = async () => {
    try {
      setLoading(true);
      console.log("Result from route params:", result);

      // ✅ Gán dữ liệu trực tiếp từ result
      setResults(result);
      setTest(result?.attemptDetail || null);
      setGrade(result?.attemptDetail?.analysisResult || null);
    } catch (error) {
      console.error("Error loading results:", error);
      Alert.alert("Error", "Failed to load test results");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeTest = () => {
    navigation.navigate("Assessment", {
      testId: results?.attempt?.testId,
    });
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

  // ✅ Trích xuất dữ liệu từ result
  const { attempt, attemptDetail, summary } = results;
  const totalQuestions = summary?.answered || 0;
  const correctAnswers = attemptDetail?.analysisResult?.total_score || 0;
  const score = attempt?.score || 0;

  const isPassed = score >= 7; // ví dụ đạt >=7 là qua
  const scoreColor = isPassed ? "#10B981" : "#EF4444";
  const scoreIcon = isPassed ? "checkmark-circle" : "close-circle";

  const start = new Date(attempt?.startTime);
  const end = new Date(attempt?.endTime);
  const diffMs = end - start;
  const diffSec = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffSec / 60);
  const seconds = diffSec % 60;

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
          {isPassed ? "🎉 Congratulations!" : "💪 Keep trying!"}
        </Text>
        <Text style={styles.resultSubtitle}>
          {isPassed ? "You passed the test!" : "You need to improve your score"}
        </Text>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Your Score</Text>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreDetails}>
          {correctAnswers} out of {totalQuestions} questions correct
        </Text>
      </View>

      {/* Test Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Details</Text>

        <View style={styles.detailItem}>
          <Ionicons name="clipboard" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Test ID:</Text>
          <Text style={styles.detailValue}>{attempt?.testId || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {minutes} phút {seconds} giây
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Completed:</Text>
          <Text style={styles.detailValue}>
            {new Date(attempt?.endTime).toLocaleString()}
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
      </View>

      {/* Graded Analysis (AI feedback) */}
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
    per_question = [],
    personalized_plan = {},
    recommendations = [],
    skill_summary = [],
    total_score = 0,
    weak_topics = [],
  } = data;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Evaluation Summary</Text>
      <Text>Total Score: {total_score}</Text>
      {skill_summary.length > 0 && (
        <Text>Accuracy: {skill_summary[0]?.accuracy}%</Text>
      )}

      <Text style={styles.sectionTitle}>Weak Topics</Text>
      {weak_topics.map((topic, i) => (
        <Text key={i}>- {topic}</Text>
      ))}

      <Text style={styles.sectionTitle}>Recommendations</Text>
      {recommendations.map((r, i) => (
        <Text key={i}>• {r}</Text>
      ))}

      {personalized_plan?.materials && (
        <>
          <Text style={styles.sectionTitle}>Personalized Plan</Text>
          <Text>Materials: {personalized_plan.materials.join(", ")}</Text>
          <Text>Progress: {personalized_plan.progress_speed}</Text>
        </>
      )}
    </View>
  );
};

// (Giữ nguyên styles của bạn ở đây)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    width: "100%",
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
    width: "100%",
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
