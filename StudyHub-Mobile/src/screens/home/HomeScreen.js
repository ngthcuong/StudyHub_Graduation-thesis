import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { studyApi } from "../../services/studyApi";
import { courseApi } from "../../services/courseApi";
import { mockMyCourses, mockTests, mockUser } from "../../mock";

const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({});
  const [recentCourses, setRecentCourses] = useState([]);
  // const [upcomingTests, setUpcomingTests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Sử dụng mock data thay vì API calls
      setRecentCourses(mockMyCourses.slice(0, 3));
      // setUpcomingTests(
      //   mockTests.filter((test) => test.isAvailable).slice(0, 3)
      // );

      const resCourses = await courseApi.getMyCourses(user?._id);
      setRecentCourses(resCourses?.courses);
      // Fetch recent courses from API
      const now = new Date();

      // Lấy năm (4 chữ số)
      const currentYear = now.getFullYear(); // Ví dụ: 2025

      // Lấy tháng (0-11, nên cần +1)
      const currentMonth = now.getMonth() + 1;

      const res = await studyApi.getStudyStats(currentYear, currentMonth);
      console.log("Dashboard Stats API Response:", res?.data?.dailyStats); // Giữ lại log để debug
      setStats(res?.summary);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ icon, title, value, color = "#3B82F6" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const CourseCard = ({ course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() =>
        navigation.navigate("Courses", {
          screen: "CourseDetail",
          params: { courseId: course.id },
        })
      }
    >
      <View style={styles.courseImage}>
        <Ionicons name="book" size={32} color="#3B82F6" />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
        {/* <Text style={styles.courseProgress}>
          Progress: {course.progress || 0}%
        </Text> */}
      </View>
    </TouchableOpacity>
  );

  const TestCard = ({ test }) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() =>
        navigation.navigate("Tests", {
          screen: "Assessment",
          params: { testId: test.id },
        })
      }
    >
      <View style={styles.testIcon}>
        <Ionicons name="clipboard" size={24} color="#10B981" />
      </View>
      <View style={styles.testInfo}>
        <Text style={styles.testTitle} numberOfLines={2}>
          {test.title}
        </Text>
        <Text style={styles.testDuration}>
          Duration: {test.duration} minutes
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.fullName || "Student"}!
        </Text>
        <Text style={styles.subtitleText}>Continue your learning journey</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Learning Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="book"
            title="Completed Lessons"
            value={`${stats?.completedLessons ?? 0} Lessons`}
            color="#3B82F6"
          />
          <StatCard
            icon="flame"
            title="Current Streak"
            value={`${stats?.currentStreak ?? 0} days`}
            color="#F59E0B"
          />
          <StatCard
            icon="trophy"
            title="Longest Streak"
            value={`${stats?.longestStreak ?? 0} days`}
            color="#10B981"
          />
          <StatCard
            icon="time"
            title="Study Time"
            value={`${formatSeconds(stats?.studyTimeThisMonth ?? 0)}`}
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Recent Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentCourses?.length > 0 ? (
          recentCourses?.map((course) => (
            <CourseCard key={course?._id} course={course} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No courses yet</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate("Courses")}
            >
              <Text style={styles.browseButtonText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Upcoming Tests */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tests</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Tests")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcomingTests.length > 0 ? (
          upcomingTests.map((test) => <TestCard key={test.id} test={test} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No upcoming tests</Text>
          </View>
        )}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  statsSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  courseImage: {
    width: 60,
    height: 60,
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  courseProgress: {
    fontSize: 14,
    color: "#6B7280",
  },
  testCard: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  testIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  testDuration: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HomeScreen;
