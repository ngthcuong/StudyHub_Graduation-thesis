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
import { courseApi } from "../../services/courseApi";
import { mockMyCourses } from "../../mock";

const MyCoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      // Sử dụng mock data thay vì API call
      setCourses(mockMyCourses);
    } catch (error) {
      console.error("Error loading my courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyCourses();
    setRefreshing(false);
  };

  const CourseCard = ({ course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() =>
        navigation.navigate("CourseDetail", { courseId: course.id })
      }
    >
      <View style={styles.courseImage}>
        <Ionicons name="book" size={32} color="#3B82F6" />
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.courseProgress}>
          Progress: {course.progress || 0}%
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${course.progress || 0}%` }]}
          />
        </View>
      </View>
      <View style={styles.courseStatus}>
        {course.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        ) : (
          <Ionicons name="play-circle" size={24} color="#3B82F6" />
        )}
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>No enrolled courses</Text>
      <Text style={styles.emptyStateText}>
        Start your learning journey by enrolling in a course
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("Courses")}
      >
        <Text style={styles.browseButtonText}>Browse Courses</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
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
  courseCard: {
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
  courseImage: {
    width: 60,
    height: 60,
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  courseProgress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  courseStatus: {
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
    marginBottom: 24,
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

export default MyCoursesScreen;
