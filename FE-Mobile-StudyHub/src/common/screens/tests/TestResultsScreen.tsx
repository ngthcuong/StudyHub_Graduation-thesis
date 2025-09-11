import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const summaryCards = [
  {
    id: "score",
    label: "SCORE",
    value: "80%",
    subText: "8 out of 10 correct",
    bgColor: "#D1FAE5", // green-100
    textColor: "#059669", // green-600
    icon: "✓",
  },
  {
    id: "correct",
    label: "CORRECT ANSWERS",
    value: "8",
    subText: "Questions answered correctly",
    bgColor: "#D1FAE5",
    textColor: "#059669",
    icon: "✔",
  },
  {
    id: "incorrect",
    label: "INCORRECT ANSWERS",
    value: "2",
    subText: "Questions answered incorrectly",
    bgColor: "#FECACA",
    textColor: "#B91C1C",
    icon: "✕",
  },
  {
    id: "time",
    label: "TIME TAKEN",
    value: "4m 32s",
    subText: "27s average per question",
    bgColor: "#DBEAFE",
    textColor: "#1D4ED8",
    icon: "⌛",
  },
];

const learningRecommendations = [
  {
    id: "1",
    title: "English Literature Fundamentals",
    description: "Strengthen your knowledge of classic authors and their works",
    difficulty: "Beginner",
    duration: "2 hours",
    tags: ["Shakespeare", "Classic Authors", "Literary Works"],
  },
  {
    id: "2",
    title: "World History Timeline",
    description: "Master important dates and events in world history",
    difficulty: "Intermediate",
    duration: "3 hours",
    tags: ["World War I", "Historical Events", "Timeline Analysis"],
  },
];

const correctAnswers = [
  {
    id: "1",
    question: "Who wrote Romeo and Juliet?",
    answer: "William Shakespeare",
    timeSpent: "23s",
  },
  {
    id: "2",
    question: "In which year did World War II end?",
    answer: "1945",
    timeSpent: "18s",
  },
  {
    id: "3",
    question: "What is the capital of France?",
    answer: "Paris",
    timeSpent: "12s",
  },
  {
    id: "4",
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    timeSpent: "31s",
  },
];

const incorrectAnswers = [
  {
    id: "1",
    question: "Who wrote Romeo and Juliet?",
    answer: "Charles Dickens",
    timeSpent: "30s",
  },
  {
    id: "2",
    question: "In which year did World War II end?",
    answer: "1944",
    timeSpent: "20s",
  },
  {
    id: "3",
    question: "What is the capital of France?",
    answer: "London",
    timeSpent: "15s",
  },
  {
    id: "4",
    question: "Who painted the Mona Lisa?",
    answer: "Vincent van Gogh",
    timeSpent: "28s",
  },
];

export default function TestResultsScreen() {
  const [activeTab, setActiveTab] = useState("recommendations");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Test Results</Text>
      <Text style={styles.subtitle}>
        Here's how you performed on your recent test
      </Text>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {summaryCards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[styles.iconCircle, { backgroundColor: card.bgColor }]}
              >
                <Text style={[styles.iconText, { color: card.textColor }]}>
                  {card.icon}
                </Text>
              </View>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
            <Text style={[styles.cardValue, { color: card.textColor }]}>
              {card.value}
            </Text>
            <Text style={styles.cardSubText}>{card.subText}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "correct" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("correct")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "correct" && styles.activeTabText,
              ]}
            >
              Correct Answers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "incorrect" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("incorrect")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "incorrect" && styles.activeTabText,
              ]}
            >
              Incorrect Answers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "recommendations" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("recommendations")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "recommendations" && styles.activeTabText,
              ]}
            >
              Learning Recommendations
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === "correct" && (
        <View style={styles.tabContent}>
          <Text style={styles.tabMessage}>
            8 questions answered correctly. Good job!
          </Text>

          {correctAnswers.map((item) => (
            <View key={item.id} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.correctText}>✓ CORRECT</Text>
                <Text style={styles.timeText}>
                  Time Spent: {item.timeSpent}
                </Text>
              </View>
              <Text style={styles.questionText}>{item.question}</Text>
              <Text style={styles.userAnswerText}>
                Your Answer: {item.answer}
              </Text>
            </View>
          ))}
        </View>
      )}
      {activeTab === "incorrect" && (
        <View style={styles.tabContent}>
          <Text style={styles.tabMessage}>
            2 questions answered incorrectly. Consider reviewing those topics.
          </Text>

          {incorrectAnswers.map((item) => (
            <View key={item.id} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.incorrectText}>✗ INCORRECT</Text>
                <Text style={styles.timeText}>
                  Time Spent: {item.timeSpent}
                </Text>
              </View>
              <Text style={styles.questionText}>{item.question}</Text>
              <Text style={styles.userAnswerText}>
                Your Answer: {item.answer}
              </Text>
            </View>
          ))}
        </View>
      )}
      {activeTab === "recommendations" && (
        <View style={styles.tabContent}>
          <Text style={styles.recommendationTitle}>
            Recommended Learning Content
          </Text>
          <Text style={styles.recommendationSubtitle}>
            Based on your test results, we recommend focusing on these areas to
            improve your knowledge.
          </Text>

          {learningRecommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationCard}>
              <Text style={styles.recommendationCardTitle}>{rec.title}</Text>
              <Text style={styles.recommendationCardDesc}>
                {rec.description}
              </Text>
              <View style={styles.recommendationTags}>
                <Text
                  style={[
                    styles.tag,
                    { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
                  ]}
                >
                  DIFFICULTY: {rec.difficulty}
                </Text>
                <Text
                  style={[
                    styles.tag,
                    { backgroundColor: "#E5E7EB", color: "#4B5563" },
                  ]}
                >
                  DURATION: {rec.duration}
                </Text>
              </View>
              <View style={styles.recommendationTags}>
                {rec.tags.map((tag, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: "#E5E7EB", color: "#1F2937" },
                    ]}
                  >
                    {tag}
                  </Text>
                ))}
              </View>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Learning</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>Retake Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>View All Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.successButton]}>
          <Text style={styles.successButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginBottom: 30,
    marginTop: 24,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  iconText: { fontSize: 10, fontWeight: "700" },
  cardLabel: { fontSize: 10, fontWeight: "600", color: "#6B7280" },
  cardValue: { fontSize: 20, fontWeight: "700" },
  cardSubText: { fontSize: 10, color: "#6B7280" },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 14, color: "#6B7280" },
  activeTab: { borderBottomColor: "#2563EB" },
  activeTabText: { color: "#2563EB" },
  tabContent: { paddingBottom: 16 },
  tabMessage: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 16,
  },
  recommendationTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  recommendationSubtitle: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  recommendationCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recommendationCardTitle: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  recommendationCardDesc: { fontSize: 12, color: "#374151", marginBottom: 6 },
  recommendationTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 6,
  },
  tag: {
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  startButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryButton: { backgroundColor: "#2563EB" },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 12 },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: { color: "#374151", fontWeight: "600", fontSize: 12 },
  successButton: { backgroundColor: "#16A34A" },
  successButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 12 },
  answerCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  answerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  correctText: { color: "#10B981", fontWeight: "600", fontSize: 12 },
  timeText: { color: "#6B7280", fontSize: 10 },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#111827",
  },
  userAnswerText: { fontSize: 12, color: "#10B981" },
  incorrectText: { color: "#EF4444", fontWeight: "600", fontSize: 12 },
});
