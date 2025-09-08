import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function MultilExerciseScreen() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 8;

  const options = ["has been", "have been", "was", "were"];

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>StudyHub</Text>
          <View style={styles.headerRight}>
            <View style={styles.timer}>
              <Text style={styles.timerIcon}>⏱️</Text>
              <Text>3:55</Text>
            </View>
            <View style={styles.exerciseBadge}>
              <Text style={styles.exerciseText}>
                Exercise {currentQuestion} of {totalQuestions}
              </Text>
            </View>
          </View>
        </View>

        {/* Test title */}
        <View style={styles.testTitle}>
          <Text style={styles.testTitleText}>
            Test 01: Present Perfect Tense
          </Text>
        </View>

        {/* Question & Options */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {currentQuestion}. She _____ to Paris three times this year.
          </Text>

          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOption(option)}
              style={[
                styles.optionButton,
                selectedOption === option && styles.optionSelected,
              ]}
            >
              <Text
                style={
                  selectedOption === option
                    ? styles.optionTextSelected
                    : styles.optionText
                }
              >
                {option}
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
              disabled={!selectedOption}
              style={[
                styles.button,
                { backgroundColor: selectedOption ? "#22c55e" : "#9ca3af" },
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
              {currentQuestion} / {totalQuestions} completed
            </Text>
          </View>

          <View style={styles.questionDots}>
            {Array.from({ length: totalQuestions }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i + 1 < currentQuestion
                        ? "#10b981"
                        : i + 1 === currentQuestion
                        ? "#3b82f6"
                        : "#e5e7eb",
                  },
                ]}
              >
                <Text style={styles.dotText}>{i + 1}</Text>
              </View>
            ))}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentQuestion / totalQuestions) * 100}%` },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                {/* Circle */}
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#10b981", // xanh lá
                    marginRight: 6,
                  }}
                />
                {/* Label */}
                <Text style={{ fontSize: 12, color: "#111827" }}>
                  Completed
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                {/* Circle */}
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#3b82f6", // xanh dương
                    marginRight: 6,
                  }}
                />
                {/* Label */}
                <Text style={{ fontSize: 12, color: "#111827" }}>Current</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 4,
                }}
              >
                {/* Circle */}
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#e5e7eb", // xám
                    marginRight: 6,
                  }}
                />
                {/* Label */}
                <Text style={{ fontSize: 12, color: "#111827" }}>
                  Not answered
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timerIcon: {
    color: "#6b7280",
    marginRight: 4,
  },
  exerciseBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  exerciseText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  testTitle: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  testTitleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
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
  optionSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  optionText: {
    color: "#111827",
  },
  optionTextSelected: {
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  progressSubTitle: {
    color: "#6b7280",
    fontSize: 12,
  },
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
  dotText: {
    color: "#fff",
    fontWeight: "600",
  },
  progressBarWrapper: {
    marginTop: 8,
  },
  progressBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
  },
});
