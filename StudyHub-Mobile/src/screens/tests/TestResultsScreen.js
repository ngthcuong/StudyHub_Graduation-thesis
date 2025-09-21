import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";

const TestResultsScreen = ({ navigation, route }) => {
  const { attemptId } = route.params;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await testApi.getTestResults(attemptId);
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

  const isPassed = results.score >= results.passingScore;
  const scoreColor = isPassed ? "#10B981" : "#EF4444";
  const scoreIcon = isPassed ? "checkmark-circle" : "close-circle";

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
          {results.score}%
        </Text>
        <Text style={styles.scoreDetails}>
          {results.correctAnswers} out of {results.totalQuestions} questions
          correct
        </Text>
      </View>

      {/* Test Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Details</Text>

        <View style={styles.detailItem}>
          <Ionicons name="clipboard" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Test:</Text>
          <Text style={styles.detailValue}>{results.testTitle}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Time Taken:</Text>
          <Text style={styles.detailValue}>{results.timeTaken} minutes</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="trophy" size={20} color="#6B7280" />
          <Text style={styles.detailLabel}>Passing Score:</Text>
          <Text style={styles.detailValue}>{results.passingScore}%</Text>
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
          <Text style={styles.breakdownValue}>{results.correctAnswers}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLeft}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.breakdownLabel}>Incorrect Answers</Text>
          </View>
          <Text style={styles.breakdownValue}>
            {results.totalQuestions - results.correctAnswers}
          </Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownLeft}>
            <Ionicons name="help-circle" size={20} color="#6B7280" />
            <Text style={styles.breakdownLabel}>Total Questions</Text>
          </View>
          <Text style={styles.breakdownValue}>{results.totalQuestions}</Text>
        </View>
      </View>

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
    flex: 1,
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
});

export default TestResultsScreen;
