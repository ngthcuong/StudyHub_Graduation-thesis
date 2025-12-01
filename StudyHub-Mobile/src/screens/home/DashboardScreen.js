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

const DashboardScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalTests: 0,
    passedTests: 0,
    averageScore: 0,
    studyStreak: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setDashboardData({
        totalCourses: 12,
        completedCourses: 8,
        totalTests: 25,
        passedTests: 20,
        averageScore: 85,
        studyStreak: 7,
      });

      setRecentActivity([
        {
          id: 1,
          type: "course",
          title: "Completed React Native Basics",
          time: "2 hours ago",
          icon: "book",
          color: "#10B981",
        },
        {
          id: 2,
          type: "test",
          title: "Passed JavaScript Quiz",
          time: "1 day ago",
          icon: "checkmark-circle",
          color: "#3B82F6",
        },
        {
          id: 3,
          type: "course",
          title: "Started Advanced React",
          time: "2 days ago",
          icon: "play-circle",
          color: "#F59E0B",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, icon, color = "#3B82F6" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: activity.color + "20" },
        ]}
      >
        <Ionicons name={activity.icon} size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Track your learning progress</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <StatCard
            title="Courses"
            value={`${dashboardData.completedCourses}/${dashboardData.totalCourses}`}
            subtitle="Completed"
            icon="book"
            color="#3B82F6"
          />
          <StatCard
            title="Tests"
            value={`${dashboardData.passedTests}/${dashboardData.totalTests}`}
            subtitle="Passed"
            icon="clipboard"
            color="#10B981"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Average Score"
            value={`${dashboardData.averageScore}%`}
            subtitle="Overall"
            icon="trophy"
            color="#F59E0B"
          />
          <StatCard
            title="Study Streak"
            value={`${dashboardData.studyStreak} days`}
            subtitle="Current"
            icon="flame"
            color="#EF4444"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Courses")}
          >
            <Ionicons name="book" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Browse Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Tests")}
          >
            <Ionicons name="clipboard" size={24} color="#10B981" />
            <Text style={styles.actionText}>Take Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No recent activity</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  statsSection: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#1F2937",
    marginTop: 8,
    textAlign: "center",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  activityTime: {
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
  },
});

export default DashboardScreen;
