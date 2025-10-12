import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const AssessmentScreen = ({ navigation, route }) => {
  const { testId } = route.params;
  const [test, setTest] = useState(null);
  const [attemptInfo, setAttemptInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    loadTest();
  }, [testId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      try {
        // Gọi API attemptInfo trước
        const res = await testApi.getAttemptInfo(user?._id, testId);
        console.log("Found attempt info:", res);
        setTest(res); // nếu thành công thì dùng res
      } catch (error) {
        if (error.response?.status === 404) {
          // Nếu là 404 thì fallback sang getTestById
          const response = await testApi.getTestById(testId);
          console.log("Fetched test details:", response);
          setTest(response.data);
        } else {
          // Các lỗi khác vẫn throw để nhảy xuống catch ngoài
          throw error;
        }
      }

      try {
        const res = await testApi.getAttemptByTestAndUser(testId, user?._id);
        setAttemptInfo(res.data[0]);
      } catch (error) {
        console.log("No attempt info found:", error);
      }
    } catch (error) {
      console.error("Error loading test:", error);
      Alert.alert("Error", "Failed to load test details");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    Alert.alert(
      "Start Test",
      "Are you ready to begin this assessment? You cannot pause once started.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: () => navigation.navigate("MultilExercise", { testId }),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading test details...</Text>
      </View>
    );
  }

  if (!test) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Test not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Test Header */}
      <View style={styles.header}>
        <View style={styles.testIcon}>
          <Ionicons name="clipboard" size={60} color="#10B981" />
        </View>
        <Text style={styles.testTitle}>
          {test.title || test.testInfo.title}
        </Text>
        <Text style={styles.testDescription}>
          {test.description || test.testInfo.description}
        </Text>
      </View>

      {/* Test Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Information</Text>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>
            {test.durationMin || test.testInfo.durationMin || "N/A"} minutes
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Questions:</Text>
          <Text style={styles.infoValue}>
            {test.numQuestions || test.testInfo.numQuestions || 0} questions
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="trophy-outline" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Passing Score:</Text>
          <Text style={styles.infoValue}>{test.passingScore || 70}%</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="repeat-outline" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Attempts:</Text>
          <Text style={styles.infoValue}>
            {attemptInfo
              ? `${attemptInfo.attemptNumber || 0}/${
                  attemptInfo.maxAttempts || 3
                }`
              : "0/3"}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Read each question carefully before answering
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              You cannot go back to previous questions once answered
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Make sure you have a stable internet connection
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.instructionText}>
              Submit your answers before the time runs out
            </Text>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartTest}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Test</Text>
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
  testIcon: {
    width: 100,
    height: 100,
    backgroundColor: "#F0FDF4",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  testTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  testDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  instructionsList: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  actionSection: {
    padding: 20,
  },
  startButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AssessmentScreen;
