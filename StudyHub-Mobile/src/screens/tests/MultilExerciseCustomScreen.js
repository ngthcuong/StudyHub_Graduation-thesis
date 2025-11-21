import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { testApi } from "../../services/testApi";
import TestingLoader from "../../components/TestingLoader";
import SubmittingTestLoader from "../../components/SubmittingTestLoader";

const MultilExerciseCustomScreen = ({ navigation }) => {
  const route = useRoute();
  const payloadForm = route.params?.payloadForm;
  const attemptDetail = route.params?.attemptDetail;

  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersP, setAnswersP] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 5); // 5 phút
  const [loadingResult, setLoadingResult] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [test, setTest] = useState(null);
  const [loadingTest, setLoadingTest] = useState(true);
  const [date, setDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⚙️ MOCK DATA QUESTIONS
  const mockQuestions = [
    {
      _id: "q1",
      questionText: "What is the capital of France?",
      options: [
        { _id: "a1", optionText: "Berlin" },
        { _id: "a2", optionText: "Madrid" },
        { _id: "a3", optionText: "Paris" },
        { _id: "a4", optionText: "Rome" },
      ],
    },
    {
      _id: "q2",
      questionText:
        "Choose the correct tense: 'She ___ to the office every day.'",
      options: [
        { _id: "b1", optionText: "go" },
        { _id: "b2", optionText: "goes" },
        { _id: "b3", optionText: "gone" },
        { _id: "b4", optionText: "going" },
      ],
    },
    {
      _id: "q3",
      questionText: "Which word is a synonym of 'happy'?",
      options: [
        { _id: "c1", optionText: "sad" },
        { _id: "c2", optionText: "joyful" },
        { _id: "c3", optionText: "angry" },
        { _id: "c4", optionText: "tired" },
      ],
    },
  ];

  // 🔹 Giả lập fetch test
  useEffect(() => {
    if (payloadForm || attemptDetail) {
      startTest();
    }
  }, [payloadForm, attemptDetail]);

  const startTest = async () => {
    if (
      attemptDetail &&
      attemptDetail?.attemptNumber < attemptDetail?.maxAttempts
    ) {
      const now = new Date();
      const isoString = now.toISOString();
      setDate(isoString);

      const res = await testApi.getQuestionsByAttemptId(attemptDetail?._id);
      setQuestions({ data: res });
      setTest(attemptDetail?.testId);
      setAttemptId(attemptDetail?._id);
      setLoadingTest(false);
    } else {
      try {
        setLoadingTest(true);
        const testPoolId = "000000000000000000000000";
        const testId = payloadForm?.testId;
        const maxAttempts = 3;

        const attemptRes = await testApi.startTestAttempt(
          testPoolId,
          testId,
          maxAttempts
        );
        console.log("🚀 Test Attempt Response:", attemptRes);
        setAttemptId(attemptRes?.data?._id || null);
        try {
          const testRes = await testApi.getTestById(testId);
          setTest(testRes);
          try {
            const res = await testApi.createCustomTest({
              testId: payloadForm?.testId,
              testAttemptId: attemptRes?.data?._id,
              level: payloadForm?.level,
              toeicScore: payloadForm?.toeicScore,
              weakSkills: payloadForm?.weakSkills,
              exam_type: "TOEIC",
              topics: payloadForm?.topics,
              difficulty: payloadForm?.difficulty,
              question_ratio: "MCQ",
              numQuestions: payloadForm?.numQuestions,
              timeLimit: payloadForm?.timeLimit,
            });

            const now = new Date();
            const isoString = now.toISOString();
            setDate(isoString);

            console.log("🚀 Custom Test Questions:", res);
            setQuestions(res);
            setLoadingTest(false);
          } catch (error) {
            console.log("🚨 Error fetching test questions:", error);
          }
        } catch (error) {
          console.log("🚨 Error parsing start test response:", error);
        }
      } catch (error) {
        console.error("Error starting test:", error);
      }
    }
  };

  // ⏰ Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitTest();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswersP((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.data?.data?.length - 1) {
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
    console.log("Submitting Test with answers:", answersP);

    setLoadingResult(true);
    setIsSubmitting(true);

    const formattedAnswers = Object.entries(answersP).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    try {
      const startTime = date;
      const testId = payloadForm?.testId || attemptDetail?.testId?._id;

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // if (!questions.data) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text style={styles.loadingText}>Loading mock questions...</Text>
  //     </View>
  //   );
  // }

  const currentQuestion = questions?.data?.data[currentQuestionIndex];
  const selectedAnswer = answersP[currentQuestion?._id];

  if (loadingTest || !questions || !test) {
    return (
      <TestingLoader loading={loadingTest} questions={questions} test={test} />
    );
  }

  if (isSubmitting) {
    return <SubmittingTestLoader />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {questions?.data?.data?.length}
        </Text>
        <View style={styles.headerRight}>
          <Ionicons name="time" size={18} color="#EF4444" />
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
                ((currentQuestionIndex + 1) / questions?.data?.data?.length) *
                100
              }%`,
            },
          ]}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>
            {currentQuestion?.questionText}
          </Text>
        </View>

        <View style={styles.answersSection}>
          {currentQuestion?.options.map((option) => (
            <TouchableOpacity
              key={option?._id}
              style={[
                styles.answerOption,
                selectedAnswer === option?._id && styles.selectedAnswer,
              ]}
              onPress={() =>
                handleAnswerSelect(currentQuestion?._id, option?._id)
              }
            >
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === option?._id && styles.selectedAnswerText,
                ]}
              >
                {option?.optionText}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
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
                {currentQuestionIndex === questions?.data?.data?.length - 1
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#6B7280" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  questionCounter: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  timer: { fontSize: 16, fontWeight: "600", color: "#EF4444", marginLeft: 8 },
  progressContainer: { height: 4, backgroundColor: "#E5E7EB" },
  progressBar: { height: "100%", backgroundColor: "#3B82F6" },
  content: { padding: 20 },
  questionSection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionText: { fontSize: 18, fontWeight: "500", color: "#1F2937" },
  answersSection: { marginBottom: 20 },
  answerOption: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedAnswer: { borderColor: "#3B82F6", backgroundColor: "#EBF4FF" },
  answerText: { fontSize: 16, color: "#1F2937" },
  selectedAnswerText: { color: "#1E40AF", fontWeight: "600" },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFF",
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
    marginBottom: 30,
  },
  primaryButton: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  disabledButton: { opacity: 0.5 },
  navButtonText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 8,
  },
  primaryButtonText: { fontSize: 16, color: "#FFF", fontWeight: "600" },
});

export default MultilExerciseCustomScreen;
