import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { courseApi } from "../../services/courseApi";

const CoursesListScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [ownedCourses, setOwnedCourses] = useState([]); // Khóa học đã sở hữu
  const [availableCourses, setAvailableCourses] = useState([]); // Chưa sở hữu
  const [filteredCourses, setFilteredCourses] = useState([]); // Dữ liệu hiển thị hiện tại
  const [activeTab, setActiveTab] = useState("available"); // "available" | "owned"
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /** ===============================
   * 🔄 Hàm tải dữ liệu từ API
   ================================ */
  const loadCourses = async () => {
    try {
      setLoading(true);
      // 1️⃣ Lấy danh sách khóa học đã sở hữu
      const myRes = await courseApi.getMyCourses(user._id);
      const owned = myRes?.courses ?? [];

      // 2️⃣ Lấy danh sách tất cả khóa học
      const allRes = await courseApi.getAllCourses();
      const all = Array.isArray(allRes) ? allRes : [];

      // 3️⃣ Lọc ra các khóa học chưa sở hữu
      const ownedIds = new Set(owned.map((c) => c._id?.toString()));
      const available = all.filter(
        (course) => course?._id && !ownedIds.has(course._id.toString())
      );

      // 4️⃣ Cập nhật state
      setOwnedCourses(owned);
      setAvailableCourses(available);

      // 5️⃣ Hiển thị mặc định tab “Chưa sở hữu”
      setFilteredCourses(available);
    } catch (error) {
      console.error("❌ Lỗi khi tải khóa học:", error);
    } finally {
      setLoading(false);
    }
  };

  /** ===============================
   * 📱 Chạy khi mở màn hình
   ================================ */
  useEffect(() => {
    if (user?._id) loadCourses();
  }, [user]);

  /** ===============================
   * 🔁 Kéo để refresh
   ================================ */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  }, []);

  /** ===============================
   * 🔍 Lọc dữ liệu theo tab & search
   ================================ */
  const filterData = useCallback(
    (tab = activeTab, query = searchQuery) => {
      const baseData = tab === "available" ? availableCourses : ownedCourses;
      const filtered = baseData.filter(
        (course) =>
          course?.title?.toLowerCase().includes(query.toLowerCase()) ||
          course?.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    },
    [availableCourses, ownedCourses, activeTab, searchQuery]
  );

  // Chạy lọc mỗi khi thay đổi tab hoặc search
  useEffect(() => {
    filterData(activeTab, searchQuery);
  }, [activeTab, searchQuery, availableCourses, ownedCourses, filterData]);

  /** ===============================
   * 💳 Component hiển thị 1 khóa học
   ================================ */
  const CourseCard = ({ course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() =>
        navigation.navigate("CourseDetail", { courseId: course._id })
      }
    >
      <View style={styles.courseImage}>
        <Ionicons name="book" size={40} color="#3B82F6" />
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.courseDescription} numberOfLines={3}>
          {course.description}
        </Text>

        <View style={styles.courseMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              {course.durationHours || "N/A"}h
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{course.students || 0} học viên</Text>
          </View>
        </View>

        <View style={styles.courseFooter}>
          <Text style={styles.coursePrice}>
            {course.cost ? `${course.cost}đ` : "Miễn phí"}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{course.rating || "4.5"}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  /** ===============================
   * 🚫 Component EmptyState
   ================================ */
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>Không có khóa học</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? "Thử thay đổi từ khóa tìm kiếm."
          : "Hiện chưa có khóa học nào trong danh mục này."}
      </Text>
    </View>
  );

  /** ===============================
   * ⏳ Màn loading
   ================================ */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Đang tải khóa học...</Text>
      </View>
    );
  }

  /** ===============================
   * 🎨 Giao diện chính
   ================================ */
  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🔁 Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "owned" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("owned")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "owned" && styles.activeTabText,
            ]}
          >
            My Courses ({ownedCourses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "available" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "available" && styles.activeTabText,
            ]}
          >
            Explore the market ({availableCourses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📚 Danh sách khóa học */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) =>
          item._id?.toString() || Math.random().toString()
        }
        renderItem={({ item }) => <CourseCard course={item} />}
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 16, color: "#6B7280", marginTop: 8 },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: "#1F2937" },
  listContainer: { padding: 16 },

  // CARD
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  courseImage: {
    width: 60,
    height: 60,
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  courseContent: { flex: 1 },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  courseMeta: { flexDirection: "row", marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  metaText: { fontSize: 12, color: "#6B7280", marginLeft: 4 },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coursePrice: { fontSize: 16, fontWeight: "600", color: "#10B981" },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, color: "#6B7280", marginLeft: 4 },

  // EMPTY
  emptyState: { alignItems: "center", paddingVertical: 64 },
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

  // TABS
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: "#3B82F6",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E40AF",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default CoursesListScreen;
