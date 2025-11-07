import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";
import CreateTestModal from "../../components/CreateTestModal";

const AssessmentListScreen = ({ navigation }) => {
  const [tests, setTests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  // Map dữ liệu backend
  const mapTestFromApi = (apiTest) => {
    const test = apiTest?.testId;
    return {
      id: apiTest._id,
      title: test?.title || "Untitled Test",
      description: test?.description || "No description available.",
      duration: test?.durationMin || 0,
      totalQuestions: test?.numQuestions || 0,
      passingScore: test?.passingScore || 7,
      difficulty: test?.skill || "Unknown",
      category: test?.examType || "Unknown",
      attempts: apiTest?.attemptNumber || 0,
      maxAttempts: apiTest?.maxAttempts || 3,
      score: apiTest?.score || 0,
      isCompleted: apiTest?.isPassed || false,
      createdAt: apiTest?.createdAt,
    };
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await testApi.getAttemptDetailByUser();
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
            <Text style={styles.metaText}>{test.duration} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{test.totalQuestions} questions</Text>
          </View>
        </View>
      </View>
      <View style={styles.testStatus}>
        {test.isCompleted ? (
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
        Create your first test using the button below
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
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
      {/* Nút tạo mới */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.createButtonText}>Create New Test</Text>
      </TouchableOpacity>

      <CreateTestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          console.log("Test created:", data);
          // 👉 Bạn có thể gọi API tạo test ở đây, ví dụ:
          // await testApi.createTest(data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
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
    elevation: 3,
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
