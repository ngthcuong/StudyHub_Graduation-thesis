import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";
import SubmittingTestLoader from "../../components/SubmittingTestLoader";

const sampleQuestions = [
  {
    _id: "q1",
    questionText: "What is the capital of France?",
    options: [
      { _id: "a1", optionText: "Paris" },
      { _id: "a2", optionText: "London" },
      { _id: "a3", optionText: "Rome" },
      { _id: "a4", optionText: "Berlin" },
    ],
  },
  {
    _id: "q2",
    questionText: "Which language is used for web development?",
    options: [
      { _id: "b1", optionText: "Python" },
      { _id: "b2", optionText: "JavaScript" },
      { _id: "b3", optionText: "C++" },
      { _id: "b4", optionText: "Rome" },
    ],
  },
];

const MultilExerciseScreen = ({ navigation, route }) => {
  const { testId } = route.params;
  const user = useSelector((state) => state.auth.user);

  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersP, setAnswersP] = useState({});
  const [date, setDate] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempt, setAttempt] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answersP[currentQuestion?._id];

  useEffect(() => {
    start();
  }, [testId]);

  const start = async () => {
    try {
      const res = await testApi.getQuestionByTestId(testId);
      setQuestions(res.data);

      let resAttempt;
      try {
        resAttempt = await testApi.getAttemptByTestAndUser({
          testId,
          userId: user._id,
        });
        console.log("Loaded existing attempt:", resAttempt);
        setAttempt(resAttempt.data);
      } catch (error) {
        console.log("No attempt info found:", error);
      }

      if (!resAttempt && !resAttempt.data && res.data.length === 0) {
        try {
          const resStartAttempt = await testApi.startTestAttempt(testId, 10000);
          console.log("Started test attempt:", resStartAttempt);
          setAttempt(resStartAttempt.data);

          const now = new Date();
          const isoString = now.toISOString();
          setDate(isoString);
        } catch (error) {
          console.log("No attempt info found:", error);
        }
      }
    } catch (error) {
      console.error("Error loading test:", error);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswersP((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // kết thúc test

      handleSubmitTest();
    }
  };

  const handleSubmitTest = async () => {
    console.log("Test submitted with answers:", answersP);

    setLoadingResult(true);
    setIsSubmitting(true);

    const formattedAnswers = Object.entries(answersP).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    try {
      const attemptId = attempt?._id;
      const startTime = date;

      console.log("Submitting Test with data:", {
        attemptId,
        answers: formattedAnswers,
        testId,
        startTime,
      });

      const response = await testApi.submitTestAttempt({
        attemptId,
        answers: formattedAnswers,
        testId,
        startTime,
      });

      console.log("🚀 Test Submission Response:", response);

      if (response) {
        navigation.navigate("TestResults", {
          resultData: response,
          formattedAnswers: formattedAnswers,
        });
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setIsSubmitting(false);
      setLoadingResult(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  if (isSubmitting) {
    return <SubmittingTestLoader />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Questions */}
      <ScrollView style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>
            {currentQuestion?.questionText}
          </Text>
        </View>

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
                  {option.optionText}
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
            (!selectedAnswer || loadingResult) && styles.disabledButton,
          ]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer || loadingResult}
        >
          {loadingResult ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  questionCounter: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  content: { flex: 1, padding: 20 },
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
  answersSection: { marginBottom: 20 },
  answerOption: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedAnswer: { borderColor: "#3B82F6", backgroundColor: "#EBF4FF" },
  answerContent: { flexDirection: "row", alignItems: "center" },
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
  selectedRadio: { borderColor: "#3B82F6" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  answerText: { flex: 1, fontSize: 16, color: "#1F2937", lineHeight: 22 },
  selectedAnswerText: { color: "#1E40AF", fontWeight: "500" },
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
  primaryButton: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  disabledButton: { opacity: 0.5 },
  navButtonText: { fontSize: 16, color: "#6B7280", marginHorizontal: 8 },
  primaryButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 8,
  },
});

export default MultilExerciseScreen;
