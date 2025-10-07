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

const MultilExerciseScreen = ({ navigation, route }) => {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [testPool, setTestPool] = useState(null);
  const [idTestPool, setIdTestPool] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    startTest();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.data?.length > 0) {
      handleSubmitTest();
    }
  }, [timeLeft]);

  const startTest = async () => {
    try {
      setLoading(true);

      let attemptInfo = null;

      try {
        // Thử lấy attempt info
        const res = await testApi.getAttemptInfo(user?._id, testId);
        attemptInfo = res;
      } catch (error) {
        if (error.response?.status === 404) {
          const test = await testApi.getTestById(testId);
          console.log("Fetched test:", test.data);

          try {
            const generatedTest = await testApi.generrateTest({
              testId,
              exam_type: test.data.examType,
              topic: test.data.topic,
              question_types: test.data.questionTypes,
              num_questions: test.data.numQuestions,
              score_range: user.currentLevel[test.data.examType],
            });
            console.log("Generated test:", generatedTest);

            const testPoolCreated = await testApi.createTestPool(
              testId,
              `${test.data.examType} ${user.currentLevel[test.data.examType]}`,
              user?._id
            );

            console.log("Created test pool:", testPoolCreated);

            setTestPool(testPoolCreated);
            console.log("Created test pool:", testPoolCreated);
          } catch (genError) {
            console.error(
              "Error while generating test:",
              genError.response?.status,
              genError.response?.data || genError.message
            );
            throw genError; // ném ra để catch bên ngoài
          }
        }
      }

      if (attemptInfo?.attemptInfo?.attemptNumber == 0) {
        const test = await testApi.getTestById(testId);
        const testPoolByLevel = await testApi.getTestPoolByLevel(
          `${test.data.examType} ${user.currentLevel[test.data.examType]}`
        );
        console.log(
          "Fetched test pool by level:",
          testPoolByLevel?.data[0]?._id
        );
        setIdTestPool(testPoolByLevel?.data[0]?._id);
      }

      const [questionsResponse, attemptResponse] = await Promise.all([
        testApi.getTestQuestions(testId),
        testApi.startTestAttempt(
          testPool?.data._id ||
            attemptInfo?.attemptInfo?.testPoolId ||
            idTestPool
        ),
      ]);

      setQuestions(questionsResponse || []);
      setAttemptId(attemptResponse?.data?._id);

      // ⚠️ API questions không có durationMin => gọi getTestById
      const testResponse = await testApi.getTestById(testId);
      const duration = testResponse?.data?.durationMin || 60;

      setTimeLeft(duration * 60);
    } catch (error) {
      console.error("Error starting test:", error);
      Alert.alert("Error", "Failed to start test");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.data?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      // Build mảng answers từ state answers
      const answersPayload = Object.entries(answers).map(
        ([questionId, answerId]) => ({
          questionId,
          selectedOptionId: answerId, // đổi key theo backend
        })
      );

      // Gửi 1 request duy nhất
      await testApi.submitTestAttempt(attemptId, answersPayload, testId);

      navigation.navigate("TestResults", { attemptId });
    } catch (error) {
      console.error("Error submitting test:", error);
      Alert.alert("Error", "Failed to submit test");
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading test...</Text>
      </View>
    );
  }

  if (questions.data?.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = questions.data?.[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion?._id];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {questions?.data?.length}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="time" size={20} color="#EF4444" />
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${
                ((currentQuestionIndex + 1) / questions.data?.length) * 100
              }%`,
            },
          ]}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>
            {currentQuestion?.questionText}
          </Text>
        </View>

        {/* Answer Options */}
        <View style={styles.answersSection}>
          {currentQuestion?.options?.map((option) => (
            <TouchableOpacity
              key={option._id}
              style={[
                styles.answerOption,
                selectedAnswer === option._id && styles.selectedAnswer,
              ]}
              onPress={() =>
                handleAnswerSelect(currentQuestion._id, option._id)
              }
            >
              <View style={styles.answerContent}>
                <View
                  style={[
                    styles.radioButton,
                    selectedAnswer === option._id && styles.selectedRadio,
                  ]}
                >
                  {selectedAnswer === option._id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.answerText,
                    selectedAnswer === option._id && styles.selectedAnswerText,
                  ]}
                >
                  {option?.optionText}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.disabledButton,
          ]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.primaryButton,
            !selectedAnswer && styles.disabledButton,
          ]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === questions.data?.length - 1
              ? "Submit"
              : "Next"}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flex: 1,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  timer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#E5E7EB",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    lineHeight: 26,
  },
  answersSection: {
    marginBottom: 20,
  },
  answerOption: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedAnswer: {
    borderColor: "#3B82F6",
    backgroundColor: "#EBF4FF",
  },
  answerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadio: {
    borderColor: "#3B82F6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 22,
  },
  selectedAnswerText: {
    color: "#1E40AF",
    fontWeight: "500",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#6B7280",
    marginHorizontal: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 8,
  },
});

export default MultilExerciseScreen;
