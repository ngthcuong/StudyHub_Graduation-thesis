import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AssessmentScreen from "./AssessmentScreen";
import testApi from "../../../api/testApi";

interface Assessment {
  _id: string;
  title: string;
  description: string;
  numQuestions: number;
  durationMin: number;
  skill: string;
  questionTypes?: string[];
}

const AssessmentListScreen = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await testApi.getAllTests();
        setAssessments(res.data.data); // ✅ lấy mảng tests từ field data
      } catch (err: any) {
        console.error("Failed to fetch assessments:", err);
        setError("Could not load assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading assessments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {assessments.map((assessment) => (
        <AssessmentScreen
          key={assessment._id}
          testId={assessment._id}
          title={assessment.title}
          description={assessment.description}
          quantity={assessment.numQuestions}
          time={assessment.durationMin.toString()}
          allowed={2} // ✅ tạm set cứng vì backend chưa có field allowed
          type={assessment.skill}
          questionTypes={assessment.questionTypes}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AssessmentListScreen;
