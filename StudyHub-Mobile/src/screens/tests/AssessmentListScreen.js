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
import { mockTests } from "../../mock";

const AssessmentListScreen = ({ navigation }) => {
  const [tests, setTests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  // Chuyển đổi từ object backend sang object giống fake data
  const mapTestFromApi = (apiTest) => {
    return {
      id: apiTest._id,
      title: apiTest.title,
      description: apiTest.description,
      duration: apiTest.durationMin,
      totalQuestions: apiTest.numQuestions,
      passingScore: 80, // backend chưa có, bạn gán mặc định
      difficulty:
        apiTest.difficulty === "medium" ? "Intermediate" : apiTest.difficulty,
      category: "TOEIC", // backend chưa có, bạn set tạm
      attempts: 0, // backend chưa có
      maxAttempts: 3, // backend chưa có
      lastScore: null,
      bestScore: null,
      isCompleted: false,
      isAvailable: true,
      createdAt: apiTest.createdAt,
      questions: [], // backend chưa trả về trong getTests, cần gọi getTestQuestions sau
    };
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      // Sử dụng mock data thay vì API call
      const response = await testApi.getTests();
      const mappedTests = response.data.map(mapTestFromApi);
      setTests(mappedTests);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTests();
    setRefreshing(false);
  };

  const TestCard = ({ test }) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() => navigation.navigate("Assessment", { testId: test.id })}
    >
      <View style={styles.testIcon}>
        <Ionicons name="clipboard" size={32} color="#10B981" />
      </View>
      <View style={styles.testContent}>
        <Text style={styles.testTitle} numberOfLines={2}>
          {test.title}
        </Text>
        <Text style={styles.testDescription} numberOfLines={3}>
          {test.description}
        </Text>
        <View style={styles.testMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{test.duration || "N/A"} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              {test.questionsCount || 0} questions
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.testStatus}>
        {test.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        ) : (
          <Ionicons name="play-circle" size={24} color="#3B82F6" />
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="clipboard-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>No tests available</Text>
      <Text style={styles.emptyStateText}>
        Check back later for new assessments
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TestCard test={item} />}
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
    backgroundColor: "#F9FAFB",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#F0FDF4",
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
    marginBottom: 8,
  },
  testDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  testMeta: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  testStatus: {
    marginLeft: 16,
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

export default AssessmentListScreen;
