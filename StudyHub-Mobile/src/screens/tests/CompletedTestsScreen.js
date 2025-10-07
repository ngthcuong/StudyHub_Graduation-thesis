import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";

const CompletedTestsScreen = ({ navigation }) => {
  const [completedTests, setCompletedTests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedTests();
  }, []);

  const loadCompletedTests = async () => {
    try {
      setLoading(true);
      const response = await testApi.getCompletedTests(); // ✅ gọi API thật
      console.log("Completed Tests Data:", response.data);

      // Map dữ liệu backend sang format UI
      const mapped = response.data.map((item) => {
        const totalQuestions = item.answers?.length || 1;
        const scorePercent = Math.round(
          (item.totalScore / totalQuestions) * 100
        );
        return {
          id: item.attemptId,
          title: item.testTitle,
          score: scorePercent,
          passingScore: 70, // có thể set mặc định hoặc lấy từ test info
          completedAt: item.submittedAt,
          skill: item.skill,
          level: item.level,
          examType: item.examType,
          duration: item.durationMin,
        };
      });

      setCompletedTests(mapped);
    } catch (error) {
      console.error("Error loading completed tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCompletedTests();
    setRefreshing(false);
  };

  const CompletedTestCard = ({ test }) => {
    console.log("Rendering test:", test);
    const isPassed = test.score >= test.passingScore;
    const scoreColor = isPassed ? "#10B981" : "#EF4444";
    const iconName = isPassed ? "checkmark-circle" : "close-circle";

    return (
      <TouchableOpacity
        style={styles.testCard}
        onPress={() => navigation.navigate("HistoryTest", { testData: test })}
      >
        <View style={styles.testIcon}>
          <Ionicons name={iconName} size={32} color={scoreColor} />
        </View>

        <View style={styles.testContent}>
          <Text style={styles.testTitle} numberOfLines={2}>
            {test.title}
          </Text>
          <Text style={styles.testMetaText}>
            {test.examType?.toUpperCase()} • {test.skill} • Level {test.level}
          </Text>
          <Text style={styles.testMetaText}>
            Completed: {new Date(test.completedAt).toLocaleDateString("en-GB")}
          </Text>
          <View style={styles.testScoreContainer}>
            <Text style={[styles.testScore, { color: scoreColor }]}>
              {test.score}%
            </Text>
            <Text style={styles.passingScore}>
              (Pass: {test.passingScore}%)
            </Text>
          </View>
        </View>

        <View style={styles.testStatus}>
          <Ionicons name="arrow-forward-circle" size={24} color="#3B82F6" />
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>No completed tests yet</Text>
      <Text style={styles.emptyStateText}>
        Take some assessments to see your progress here.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading completed tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CompletedTestCard test={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
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
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  listContainer: {
    padding: 16,
  },
  testCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  testMetaText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  testScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  testScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passingScore: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  testStatus: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default CompletedTestsScreen;
