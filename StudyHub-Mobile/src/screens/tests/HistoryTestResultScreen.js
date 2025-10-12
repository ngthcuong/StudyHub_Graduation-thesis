import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { testApi } from "../../services/testApi";

const HistoryTestResultScreen = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const { testData } = route.params; // lấy params từ route
  console.log("HistoryTestResultScreen props test:", testData);

  const fakeData = {
    per_question: [
      {
        id: 1,
        question:
          "All employees _____ complete the mandatory safety training by the end of the month.",
        correct: true,
        expected_answer: "must",
        user_answer: "must",
        skill: "Grammar",
        topic: "modal verb of obligation, must",
        explain:
          "'Must' expresses a strong obligation. The sentence indicates a requirement for all employees, making 'must' the appropriate modal verb. For example, 'You must wear a helmet in the construction zone.'",
      },
      {
        id: 2,
        question:
          "I _____ help you with the presentation if you're feeling overwhelmed; I have some free time this afternoon.",
        correct: true,
        expected_answer: "can",
        user_answer: "can",
        skill: "Grammar",
        topic: "modal verb of ability, offer of help, can",
        explain:
          "'Can' expresses ability or possibility and is used to offer help. The sentence expresses the speaker's willingness and ability to assist, thus 'can' is the correct choice. For example, 'I can speak Spanish fluently.'",
      },
      {
        id: 3,
        question:
          "You _____ always double-check your work before submitting it to avoid errors.",
        correct: true,
        expected_answer: "should",
        user_answer: "should",
        skill: "Grammar",
        topic: "modal verb of advice, should",
        explain:
          "'Should' is used to give advice or recommendations. The sentence suggests a beneficial action, making 'should' the appropriate modal verb. For example, 'You should visit the museum while you're in town.'",
      },
      {
        id: 4,
        question:
          "The meeting _____ be postponed due to the unexpected absence of the main speaker.",
        correct: false,
        expected_answer: "might",
        user_answer: "might",
        skill: "Grammar",
        topic: "modal verb of possibility, might",
        explain:
          "'Might' expresses a possibility or uncertainty. The sentence suggests that the postponement is a possible outcome, making 'might' the correct modal verb. For example, 'It might rain later today.'",
      },
      {
        id: 5,
        question:
          "The quarterly report _____ been submitted by yesterday, but we encountered technical issues.",
        correct: true,
        expected_answer: "should have",
        user_answer: null,
        skill: "Grammar",
        topic: "past modal of missed obligation, regret, should have",
        explain:
          "'Should have' expresses a past obligation that was not fulfilled, often with a sense of regret. The sentence indicates that the report was supposed to be submitted, but it wasn't, making 'should have' the correct form. For example, 'I should have studied harder for the test.'",
      },
      {
        id: 6,
        question:
          "Customers _____ bring outside food or drinks into the conference hall.",
        correct: false,
        expected_answer: "can't",
        user_answer: null,
        skill: "Grammar",
        topic: "modal verb of prohibition, cannot",
        explain:
          "'Can't' (cannot) expresses a prohibition or something that is not allowed. The sentence clearly states a rule, prohibiting customers from bringing outside items, so 'can't' is correct. 'Might not' expresses possibility and is inappropriate here. For example, 'You can't park here; it's a no-parking zone.'",
      },
      {
        id: 7,
        question:
          "She's been working non-stop for ten hours; she _____ be exhausted.",
        correct: false,
        expected_answer: "must",
        user_answer: null,
        skill: "Grammar",
        topic: "modal verb of deduction, must",
        explain:
          "'Must' is used to express a strong deduction or logical conclusion. Given the context, it's logical to conclude she is exhausted, making 'must' the most appropriate modal verb. For example, 'The lights are off; they must be out.'",
      },
      {
        id: 8,
        question:
          "_____ I use your phone for a moment? Mine has run out of battery.",
        correct: true,
        expected_answer: "May",
        user_answer: null,
        skill: "Grammar",
        topic: "modal verb of permission, may, can",
        explain:
          "'May' is a more formal way to ask for permission. While 'Can' could also be used, 'May' is often preferred in formal settings. For example, 'May I have a glass of water, please?'",
      },
      {
        id: 9,
        question:
          "You _____ submit the report until next Friday, so you have plenty of time.",
        correct: true,
        expected_answer: "don't have to",
        user_answer: null,
        skill: "Grammar",
        topic: "modal verb of lack of necessity, don't have to",
        explain:
          "'Don't have to' expresses a lack of necessity or obligation. The sentence indicates that there is no requirement to submit the report before next Friday. For example, 'You don't have to wash the dishes; I'll do it later.'",
      },
      {
        id: 10,
        question: "If we had left earlier, we _____ missed our flight.",
        correct: false,
        expected_answer: "wouldn't have",
        user_answer: null,
        skill: "Grammar",
        topic:
          "past modal of hypothetical outcome, conditional perfect, would not have",
        explain:
          "'Wouldn't have' is used in the conditional perfect to express a hypothetical outcome in the past. This is a type 3 conditional. If we had left earlier, we wouldn't have missed our flight. For example, 'If I had known, I wouldn't have gone there.'",
      },
    ],
    skill_summary: [{ skill: "Grammar", total: 10, correct: 8, accuracy: 0.7 }],
    weak_topics: [
      "past modal of hypothetical outcome, conditional perfect, would not have",
      "modal verb of prohibition, cannot",
      "past modal of missed obligation, regret, should have",
    ],
    recommendations: [
      "Focus on past modals of obligation and hypothetical outcomes.",
      "Practice identifying the context for different modal verbs.",
      "Review conditional sentences and their structures.",
    ],
    personalized_plan: {
      progress_speed: "Moderate",
      weekly_goals: [
        {
          week: 1,
          topic: "Past Modals",
          description:
            "Review 'should have', 'could have', and 'would have' to express regret, possibility, and hypothetical situations in the past.",
          study_methods: [
            "Grammar exercises",
            "Sentence construction practice",
          ],
          materials: ["Grammar textbooks", "Online quizzes"],
          hours: 3,
        },
        {
          week: 2,
          topic: "Conditional Sentences",
          description:
            "Practice type 3 conditionals to express unreal past situations and their hypothetical results.",
          study_methods: ["Worksheet exercises", "Create example sentences"],
          materials: [
            "Online grammar guides",
            "Conditional sentence worksheets",
          ],
          hours: 3,
        },
        {
          week: 3,
          topic: "Modal Verbs of Prohibition and Necessity",
          description:
            "Review 'can't', 'mustn't', 'don't have to' to express prohibition and lack of necessity.",
          study_methods: ["Complete the sentence", "Speaking drills"],
          materials: ["Flashcards", "Interactive exercises"],
          hours: 3,
        },
      ],
    },
  };

  useEffect(() => {
    setData(fakeData);
  }, [data]);

  if (!data) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Test Review</Text>

      {/* Per Question */}
      <Text style={styles.sectionTitle}>Per Question</Text>
      {data.per_question.map((q) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.questionText}>
            {q.id}. {q.question}
          </Text>
          <Text>Skill: {q.skill}</Text>
          <Text>Topic: {q.topic}</Text>
          <Text>User Answer: {q.user_answer || "Not answered"}</Text>
          <Text>Expected Answer: {q.expected_answer}</Text>
          <Text style={q.correct ? styles.correctText : styles.incorrectText}>
            {q.correct ? "Correct ✅" : "Incorrect ❌"}
          </Text>
          <Text style={styles.explainText}>Explanation: {q.explain}</Text>
        </View>
      ))}

      {/* Skill Summary */}
      <Text style={styles.sectionTitle}>Skill Summary</Text>
      {data.skill_summary.map((s, idx) => (
        <View key={idx} style={styles.card}>
          <Text>Skill: {s.skill}</Text>
          <Text>Total Questions: {s.total}</Text>
          <Text>Correct: {s.correct}</Text>
          <Text>Accuracy: {(s.accuracy * 100).toFixed(0)}%</Text>
        </View>
      ))}

      {/* Weak Topics */}
      <Text style={styles.sectionTitle}>Weak Topics</Text>
      {data.weak_topics.map((topic, idx) => (
        <Text key={idx} style={styles.weakTopic}>
          - {topic}
        </Text>
      ))}

      {/* Recommendations */}
      <Text style={styles.sectionTitle}>Recommendations</Text>
      {data.recommendations.map((rec, idx) => (
        <Text key={idx} style={styles.recommendation}>
          - {rec}
        </Text>
      ))}

      {/* Personalized Plan */}
      <Text style={styles.sectionTitle}>Personalized Plan</Text>
      <Text>Progress Speed: {data.personalized_plan.progress_speed}</Text>
      {data.personalized_plan.weekly_goals.map((week) => (
        <View key={week.week} style={styles.card}>
          <Text style={styles.weekTitle}>
            Week {week.week}: {week.topic}
          </Text>
          <Text>Description: {week.description}</Text>
          <Text>Study Methods: {week.study_methods.join(", ")}</Text>
          <Text>Materials: {week.materials.join(", ")}</Text>
          <Text>Hours: {week.hours}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  questionText: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  correctText: { color: "green", fontWeight: "bold" },
  incorrectText: { color: "red", fontWeight: "bold" },
  explainText: { fontStyle: "italic", color: "#555", marginTop: 4 },
  weakTopic: { color: "#B91C1C", marginBottom: 4 },
  recommendation: { color: "#1E3A8A", marginBottom: 4 },
  weekTitle: { fontWeight: "bold", marginBottom: 4 },
});

export default HistoryTestResultScreen;
