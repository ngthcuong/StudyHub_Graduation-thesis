import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import questionApi from "../../../api/questionApi";

type RouteParams = {
  testId: string;
  title: string;
  description: string;
  quantity: number;
  time: number;
  allowed: boolean;
  type: string;
  questionTypes: any; // Nếu có type cụ thể thì thay thế
};

export default function MultilExerciseScreen() {
  const route = useRoute<{ params: RouteParams }>();
  const { testId, title, description, quantity, time } = route.params;

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0); // index bắt đầu từ 0
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Gọi API lấy câu hỏi
  const fetchQuestions = async () => {
    try {
      const res = await questionApi.getQuestionsByTest(testId);
      console.log("Questions:", res.data);
      setQuestions(res.data.data);
    } catch (error: any) {
      console.error("Error fetching questions:", error.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // thay đổi kiểu lưu
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  // chọn đáp án
  // thay vì lưu optionText → lưu option._id
  const handleSelectOption = (qIndex: number, optionId: string) => {
    setAnswers({ ...answers, [qIndex]: optionId });
  };

  // đánh dấu câu completed khi bấm Next
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const formattedAnswers = Object.keys(answers).map((qIndex) => {
      const question = questions[parseInt(qIndex)];
      return {
        questionId: question._id, // id câu hỏi
        selectedOptionId: answers[parseInt(qIndex)], // id của option đã chọn
      };
    });

    const payload = { answers: formattedAnswers };

    console.log("Submit payload:", JSON.stringify(payload, null, 2));
    // testResultApi.submit(payload) nếu bạn muốn gửi lên server
  };

  const question = questions[currentQuestion];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>StudyHub</Text>
          <View style={styles.headerRight}>
            <View style={styles.timer}>
              <Text style={styles.timerIcon}>⏱️</Text>
              <Text>{time} min</Text>
            </View>
            <View style={styles.exerciseBadge}>
              <Text style={styles.exerciseText}>
                Exercise {currentQuestion + 1} of {questions.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Test title */}
        <View style={styles.testTitle}>
          <Text style={styles.testTitleText}>{title}</Text>
        </View>

        {/* Question & Options */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {currentQuestion + 1}. {question.questionText}
          </Text>

          {question.options?.map((option: any, index: number) => (
            <TouchableOpacity
              key={option._id || index}
              onPress={() => handleSelectOption(currentQuestion, option._id)}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option._id &&
                  styles.optionSelected,
              ]}
            >
              <Text
                style={
                  answers[currentQuestion] === option._id
                    ? styles.optionTextSelected
                    : styles.optionText
                }
              >
                {option.optionText}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.button, { backgroundColor: "#3b82f6" }]}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={Object.keys(answers).length === 0}
              onPress={handleSubmit}
              style={[
                styles.button,
                {
                  backgroundColor:
                    Object.keys(answers).length > 0 ? "#22c55e" : "#9ca3af",
                },
              ]}
            >
              <Text style={styles.buttonText}>Submit Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Questions Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Questions</Text>
            <Text style={styles.progressSubTitle}>
              {currentQuestion + 1} / {questions.length} completed
            </Text>
          </View>

          <View style={styles.questionDots}>
            {questions.map((_, i) => {
              let bgColor = "#e5e7eb"; // default = not answered
              if (i === currentQuestion) {
                bgColor = "#3b82f6"; // current
              } else if (answers[i]) {
                bgColor = "#10b981"; // completed
              }

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCurrentQuestion(i)}
                  style={[styles.dot, { backgroundColor: bgColor }]}
                >
                  <Text style={styles.dotText}>{i + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      (Object.keys(answers).length / questions.length) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <View style={styles.labelRow}>
                <View style={[styles.circle, { backgroundColor: "#10b981" }]} />
                <Text style={styles.labelText}>Completed</Text>
              </View>
              <View style={styles.labelRow}>
                <View style={[styles.circle, { backgroundColor: "#3b82f6" }]} />
                <Text style={styles.labelText}>Current</Text>
              </View>
              <View style={styles.labelRow}>
                <View style={[styles.circle, { backgroundColor: "#e5e7eb" }]} />
                <Text style={styles.labelText}>Not answered</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#111827" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timerIcon: { color: "#6b7280", marginRight: 4 },
  exerciseBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  exerciseText: { fontSize: 12, fontWeight: "600", color: "#1d4ed8" },
  testTitle: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  testTitleText: { fontSize: 14, fontWeight: "500", color: "#1f2937" },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionSelected: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  optionText: { color: "#111827" },
  optionTextSelected: { color: "#fff" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
  progressCard: { backgroundColor: "#fff", borderRadius: 8, padding: 16 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressTitle: { fontWeight: "600", color: "#111827" },
  progressSubTitle: { color: "#6b7280", fontSize: 12 },
  questionDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dotText: { color: "#fff", fontWeight: "600" },
  progressBarWrapper: { marginTop: 8 },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#10b981" },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  labelRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  circle: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  labelText: { fontSize: 12, color: "#111827" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
