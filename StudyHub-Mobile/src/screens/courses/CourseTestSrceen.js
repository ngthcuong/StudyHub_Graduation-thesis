import React, { useEffect, useMemo, useState } from "react";
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

const CourseTestScreen = ({ navigation, route }) => {
  const { lesson } = route.params;

  const [tests, setTests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [difficulty, setDifficulty] = useState("All Levels");

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);

      setTests(lesson.exercises || []);
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

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    if (!tests?.data) return [];
    return tests?.data?.filter((item) => {
      const matchTitle = item?.testId?.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchType = type === "All Types" || item.testId.type === type;
      const matchStatus =
        status === "All Status" ||
        (status === "Completed" && item.testId.completed) ||
        (status === "Not Completed" && !item.testId.completed);
      const matchDifficulty =
        difficulty === "All Levels" || item.testId.difficulty === difficulty;
      return matchTitle && matchType && matchStatus && matchDifficulty;
    });
  }, [search, type, status, difficulty, tests?.data]);

  const TestCard = ({ test }) => {
    return (
      <TouchableOpacity
        style={styles.testCard}
        onPress={() =>
          navigation.navigate("Tests", {
            screen: "Assessment",
            params: { testId: test?._id },
          })
        }
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
              <Text style={styles.metaText}>{test.durationMin} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="help-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.metaText}>{test.numQuestions} questions</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  console.log("Rendering CourseTestScreen with tests:", lesson.exercises || []);

  return (
    <View style={styles.container}>
      <FlatList
        data={lesson.exercises || []}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <TestCard test={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

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

export default CourseTestScreen;
