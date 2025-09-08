import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import AssessmentScreen from "./AssessmentScreen";

const assessmentsData = [
  {
    id: 1,
    title: "Grammar Test",
    description: "Test your grammar skills",
    questions: 10,
    time: "30",
    allowed: 2,
    type: "Multiple Choice",
  },
  {
    id: 2,
    title: "Listening Test",
    description: "Test your listening skills",
    questions: 8,
    time: "30",
    allowed: 2,
    type: "Multiple Choice",
  },
];

const AssessmentListScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {assessmentsData.map((assessment) => (
        <AssessmentScreen
          key={assessment.id}
          title={assessment.title}
          description={`This is the description for ${assessment.title}`}
          quantity={assessment.questions}
          time={assessment.time}
          allowed={assessment.allowed}
          type={assessment.type}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default AssessmentListScreen;
