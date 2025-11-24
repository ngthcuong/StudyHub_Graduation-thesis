import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar, // Thêm StatusBar để kiểm soát thanh trạng thái
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { testApi } from "../../services/testApi";

// --- Component Chính ---

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
      const response = await testApi.getCompletedTests();
      // console.log("Completed Tests API Response:", response); // Giữ lại log để debug

      if (!response.data || !Array.isArray(response.data)) {
        return;
      }

      const mapped = response.data.map((item, index) => {
        // <-- LẤY INDEX TỪ HÀM MAP
        // Lấy thông tin score từ analysisResult (tên chuẩn xác hơn)
        const totalScore = item.analysisResult?.total_score || 0;
        const totalQuestions = item.analysisResult?.total_questions || 1;

        const scorePercent =
          totalQuestions > 0
            ? Math.round((totalScore / totalQuestions) * 100)
            : 0;

        // FIX LỖI TRÙNG LẶP KEY: Sử dụng index để đảm bảo key duy nhất
        const uniqueKey = `${item.attemptId}_${index}`;

        // SỬA: Lấy submittedAt nếu có, nếu không lấy thời điểm hiện tại (Fallback)
        const completedAt = item.submittedAt || new Date().toISOString();

        return {
          id: uniqueKey, // <-- Key duy nhất (attemptId + index)
          title: item.testTitle,
          score: scorePercent,
          passingScore: 70, // Giữ nguyên
          completedAt: completedAt,
          skill: item.skill,
          level: item.level,
          examType: item.examType,
          duration: item.durationMin,

          fullResultData: item,
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
    const isPassed = test.score >= test.passingScore;
    const scoreColor = isPassed ? "#10B981" : "#EF4444";
    const iconName = isPassed ? "checkmark-circle" : "close-circle";

    return (
      <TouchableOpacity
        style={styles.testCard}
        onPress={() =>
          navigation.navigate("TestResults", {
            resultData: test.fullResultData,
          })
        }
      >
        {/* Vùng Icon & Điểm */}
        <View style={styles.scoreBadge}>
          <Ionicons name={iconName} size={28} color={scoreColor} />
          <Text style={[styles.testScore, { color: scoreColor, fontSize: 18 }]}>
            {test.score}%
          </Text>
        </View>

        {/* Nội dung Bài Test */}
        <View style={styles.testContent}>
          <Text style={styles.testTitle} numberOfLines={2}>
            {test.title}
          </Text>

          <View style={styles.metaRow}>
            {/* Thẻ Skill */}
            <View style={[styles.tag, { backgroundColor: "#E0F2F1" }]}>
              <Text style={[styles.tagText, { color: "#004D40" }]}>
                {test.skill?.toUpperCase()}
              </Text>
            </View>

            {/* Thẻ Level */}
            <View style={[styles.tag, { backgroundColor: "#F3E5F5" }]}>
              <Text style={[styles.tagText, { color: "#4A148C" }]}>
                {test.level} ({test.examType})
              </Text>
            </View>
          </View>

          <Text style={styles.testMetaText}>
            completed: {new Date(test.completedAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>

        {/* Mũi tên Điều hướng */}
        <View style={styles.testStatus}>
          <Ionicons
            name="chevron-forward" // Dùng chevron-forward cho mũi tên đơn giản
            size={24}
            color="#9CA3AF"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="stats-chart-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>There are no tests yet</Text>
      <Text style={styles.emptyStateText}>
        Please take a test to see your progress here.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <FlatList
        data={completedTests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CompletedTestCard test={item} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// --- Stylesheet Đã Tinh Chỉnh ---

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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  scoreBadge: {
    // Vùng hiển thị icon và % điểm
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  tag: {
    // Style chung cho Skill và Level
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  testMetaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  testScore: {
    // Chỉ hiển thị % điểm trong Score Badge
    fontWeight: "bold",
    marginTop: 2,
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
    paddingHorizontal: 30,
  },
});

export default CompletedTestsScreen;
