import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import AssessmentScreen from "./AssessmentScreen";

const assessmentsData = [
  { id: 1, title: "Grammar Test", questions: 10 },
  { id: 2, title: "Listening Test", questions: 8 },
  { id: 3, title: "Vocabulary Test", questions: 12 },
  { id: 4, title: "Speaking Test", questions: 5 },
];

const AssessmentListScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <AssessmentScreen />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default AssessmentListScreen;
