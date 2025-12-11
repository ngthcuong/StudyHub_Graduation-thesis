import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";
import SubmittingTestLoader from "../../components/SubmittingTestLoader";
import TestingLoader from "../../components/TestingLoader";

const FillExerciseCustomScreen = ({ navigation, route }) => {
  const testId = route.params?.testId;
  const payloadForm = route.params?.payloadForm;
  const attemptDetail = route.params?.attemptDetail;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersP, setAnswersP] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [test, setTest] = useState(null);
  const [date, setDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fakeData = {
    data: [
      {
        __v: 0,
        _id: "693b1cf07bcdba5190a0ab18",
        attemptId: "693b1ce77bcdba5190a0aaf7",
        createdAt: "2025-12-11T19:35:12.842Z",
        createdBy: "68d51f533c4f697b5d7b45b1",
        description:
          "The hint '(extremely tired)' requires a word that means feeling very weary or worn out.",
        level: { current: "B2", target: "C1" },
        options: ["exhausted", "energetic", "busy", "relaxed"],
        points: 10,
        questionText:
          "After working overtime for three days straight, I felt completely _______ (extremely tired).",
        questionType: "fill_blank",
        skill: "Vocabulary",
        tag: ["toeic", "vocabulary", "tiredness"],
        testId: "693b1cc07bcdba5190a0aa85",
        topic: ["Word Choice"],
        updatedAt: "2025-12-11T19:35:12.842Z",
      },
      {
        __v: 0,
        _id: "693b1d0101cdba5190a0ab19",
        attemptId: "693b1ce77bcdba5190a0aaf7",
        createdAt: "2025-12-11T19:35:20.842Z",
        createdBy: "68d51f533c4f697b5d7b45b1",
        description:
          "Choose the correct tense based on the signal word 'currently'.",
        level: { current: "B1", target: "B2" },
        options: ["is studying", "studies", "studied", "was studying"],
        points: 10,
        questionText:
          "She ______ English to prepare for her upcoming exam (currently).",
        questionType: "fill_blank",
        skill: "Grammar",
        tag: ["present continuous", "grammar"],
        testId: "693b1cc07bcdba5190a0aa85",
        topic: ["Tenses"],
        updatedAt: "2025-12-11T19:35:20.842Z",
      },
      {
        __v: 0,
        _id: "693b1d0a7bcdba5190a0ab20",
        attemptId: "693b1ce77bcdba5190a0aaf7",
        createdAt: "2025-12-11T19:35:27.842Z",
        createdBy: "68d51f533c4f697b5d7b45b1",
        description: "Vocabulary question related to emotions.",
        level: { current: "A2", target: "B1" },
        options: ["nervous", "calm", "brave", "excited"],
        points: 5,
        questionText: "Before the presentation, he felt extremely _______.",
        questionType: "multiple_choice",
        skill: "Vocabulary",
        tag: ["feelings", "emotions"],
        testId: "693b1cc07bcdba5190a0aa85",
        topic: ["Emotions"],
        updatedAt: "2025-12-11T19:35:27.842Z",
      },
      {
        __v: 0,
        _id: "693b1d147bcdba5190a0ab21",
        attemptId: "693b1ce77bcdba5190a0aaf7",
        createdAt: "2025-12-11T19:35:34.842Z",
        createdBy: "68d51f533c4f697b5d7b45b1",
        description: "Choose the correct preposition.",
        level: { current: "B1", target: "B2" },
        options: ["in", "on", "at", "for"],
        points: 5,
        questionText: "The meeting will start ___ 9 AM.",
        questionType: "multiple_choice",
        skill: "Grammar",
        tag: ["prepositions"],
        testId: "693b1cc07bcdba5190a0aa85",
        topic: ["Prepositions"],
        updatedAt: "2025-12-11T19:35:34.842Z",
      },
      {
        __v: 0,
        _id: "693b1d1f7bcdba5190a0ab22",
        attemptId: "693b1ce77bcdba5190a0aaf7",
        createdAt: "2025-12-11T19:35:40.842Z",
        createdBy: "68d51f533c4f697b5d7b45b1",
        description: "Reading comprehension question.",
        level: { current: "B2", target: "C1" },
        options: ["because", "although", "however", "therefore"],
        points: 10,
        questionText: "He was tired; _______, he continued working.",
        questionType: "multiple_choice",
        skill: "Reading",
        tag: ["connectors", "logic"],
        testId: "693b1cc07bcdba5190a0aa85",
        topic: ["Connectors"],
        updatedAt: "2025-12-11T19:35:40.842Z",
      },
    ],
    message: "Test generated and questions saved successfully",
  };

  useEffect(() => {
    if (payloadForm || attemptDetail) {
      startTest();
      // Test();
    }
  }, [payloadForm, attemptDetail]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmitTest();
    }
  }, [timeLeft]);

  const Test = () => {
    try {
      setLoading(true);
      const testId = payloadForm?.testId;
      const maxAttempts = 3;

      setAttemptId("693b1ce77bcdba5190a0aaf7");
      try {
        setTest("0000000000000000000000");
        try {
          const now = new Date();
          const isoString = now.toISOString();
          setDate(isoString);

          setAnswersP(
            fakeData?.data?.map((q) =>
              q?.questionText
                .split(/_+/g)
                .slice(0, -1)
                .map(() => "")
            )
          );

          setQuestions({ data: fakeData });
          setLoading(false);
        } catch (error) {
          console.log("🚨 Error fetching test questions:", error);
        }
      } catch (error) {
        console.log("🚨 Error parsing start test response:", error);
      }
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

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
      setAnswersP(
        res?.data?.map((q) =>
          q.questionText
            .split(/_+/g)
            .slice(0, -1)
            .map(() => "")
        )
      );
      setTest(attemptDetail?.testId);
      setAttemptId(attemptDetail?._id);
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const testId = payloadForm?.testId;
        const maxAttempts = 3;

        console.log("Starting test with:", { testId, maxAttempts });

        const attemptRes = await testApi.startTestAttempt(testId, maxAttempts);
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
              question_ratio: "Gap-fill",
              numQuestions: payloadForm?.numQuestions,
              timeLimit: payloadForm?.timeLimit,
            });

            const now = new Date();
            const isoString = now.toISOString();
            setDate(isoString);

            setAnswersP(
              res?.data?.map((q) =>
                q?.questionText
                  .split(/_+/g)
                  .slice(0, -1)
                  .map(() => "")
              )
            );

            console.log("🚀 Custom Test Questions:", res);
            setQuestions({ data: res });
            setLoading(false);
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

  const handleAnswerChange = (value, blankIndex) => {
    const newAnswers = [...answersP];
    newAnswers[currentQuestionIndex][blankIndex] = value;
    setAnswersP(newAnswers);
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
    setIsSubmitting(true);
    const formattedAnswers = questions?.data?.data?.map((question, index) => {
      const userAnswer = (answersP[index]?.[0] || "").trim().toLowerCase();

      const matchedOption = question.options.find(
        (opt) => opt.optionText.trim().toLowerCase() === userAnswer
      );

      return {
        questionId: question._id,
        selectedOptionId: matchedOption ? matchedOption._id : null,
        userAnswerText: matchedOption ? null : userAnswer || "",
      };
    });

    try {
      const answers = formattedAnswers.map((item) => {
        const { userAnswerText: _userAnswerText, ...rest } = item;
        return rest;
      });

      const startTime = date;
      const testId = payloadForm?.testId || attemptDetail?.testId?._id;

      // Submit the attempt
      const response = await testApi.submitTestAttempt({
        attemptId,
        answers,
        testId,
        startTime,
      });

      if (response) {
        setIsSubmitting(false);
      }

      navigation.navigate("TestResults", {
        attemptId,
        resultData: response,
        formattedAnswers: formattedAnswers,
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsSubmitting(false);
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

  if (isSubmitting) {
    return <SubmittingTestLoader />;
  }

  if (loading || !questions || !test) {
    return <TestingLoader loading questions={questions} test={test} />;
  }

  if (questions?.data?.data?.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = questions?.data?.data[currentQuestionIndex];
  const currentAnswer = answersP[currentQuestion?._id] || "";
  const parts = currentQuestion?.questionText?.split(/_+/g) || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of{" "}
            {questions?.data?.data?.length}
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
                ((currentQuestionIndex + 1) / questions?.data?.data?.length) *
                100
              }%`,
            },
          ]}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Question */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            {currentQuestionIndex + 1}.
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {/* text của câu hỏi */}
                <Text style={{ fontSize: 16 }}>{part}</Text>

                {/* input chèn vào giữa */}
                {i < parts.length - 1 && (
                  <TextInput
                    value={answersP[currentQuestionIndex]?.[i] || ""}
                    onChangeText={(text) => handleAnswerChange(text, i)}
                    placeholder="..."
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      minWidth: 80,
                      marginHorizontal: 4,
                      borderRadius: 6,
                      fontSize: 16,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
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
          style={[styles.navButton, styles.primaryButton]}
          onPress={handleNextQuestion}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestionIndex === questions?.data?.data?.length - 1
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
  answerSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
    minHeight: 100,
  },
  instructionsSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 60,
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

export default FillExerciseCustomScreen;
