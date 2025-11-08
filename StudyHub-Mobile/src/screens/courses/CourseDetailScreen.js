import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { courseApi } from "../../services/courseApi";
import { getMockCourseById } from "../../mock";

const CourseDetailScreen = ({ navigation, route }) => {
  const { courseId } = route.params;
  console.log("CourseDetailScreen courseId:", courseId);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      // Sử dụng mock data thay vì API calls
      const mockCourse = getMockCourseById("1");

      const res = await courseApi.getGrammarCoursesById(courseId);
      setLessons(res);

      if (mockCourse) {
        // setCourse(mockCourse);
        // setLessons(mockCourse.lessons || []);
        setEnrolled(mockCourse.isEnrolled || false);
      } else {
        Alert.alert("Error", "Course not found");
      }

      try {
        const resCourse = await courseApi.getCourseById(courseId);
        setCourse(resCourse);
      } catch (error) {
        console.error("Error fetching grammar courses:", error);
      }
    } catch (error) {
      console.error("Error loading course details:", error);
      Alert.alert("Error", "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourseDetails();
    setRefreshing(false);
  };

  const handleEnroll = async () => {
    try {
      // await courseApi.enrollCourse(courseId);
      // setEnrolled(true);
      Alert.alert("Success", "Successfully enrolled in the course!");
    } catch (error) {
      Alert.alert("Error", "Failed to enroll in the course");
    }
  };

  const LessonItem = ({ lesson, index }) => (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() =>
        navigation.navigate("CourseVideo", {
          courseId,
          lesson,
        })
      }
    >
      <View style={styles.lessonNumber}>
        <Text style={styles.lessonNumberText}>{index + 1}</Text>
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          {/* <Text style={styles.lessonDuration}>{15 || "N/A"}</Text> */}
          <View style={styles.lessonType}>
            <Ionicons
              name={
                lesson.type === "video"
                  ? "play-circle-outline"
                  : "document-text-outline"
              }
              size={14}
              color="#6B7280"
            />
            <Text style={styles.lessonTypeText}>
              {lesson.type === "video"
                ? "Video"
                : lesson.type === "test"
                ? "Practice Test"
                : "Lesson"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.lessonStatus}>
        {lesson.isCompleted ? (
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        ) : (
          <Ionicons name="play-circle-outline" size={24} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Course Header */}
      <View style={styles.header}>
        <View style={styles.courseImage}>
          <Ionicons name="book" size={60} color="#3B82F6" />
        </View>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseDescription}>{course.description}</Text>

        <View style={styles.courseMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>{course.durationHours || "N/A"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              {course.studentsCount || 0} students
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.metaText}>{course.review || "4.5"}</Text>
          </View>
        </View>

        {/* Course Progress (if enrolled) */}
        {enrolled && course.progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Course Progress</Text>
              <Text style={styles.progressPercentage}>{course.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${course.progress}%` }]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Course Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="book-outline" size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{lessons?.total || 0}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="library-outline" size={24} color="#10B981" />
            <Text style={styles.statNumber}>
              {lessons.data.flatMap((item) => item.parts).length || 0}
            </Text>
            <Text style={styles.statLabel}>Vocabulary</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>
              {lessons.data.flatMap((item) => item.parts).length || 0}
            </Text>
            <Text style={styles.statLabel}>Grammar Points</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={24} color="#EF4444" />
            <Text style={styles.statNumber}>{"70%" || "N/A"}</Text>
            <Text style={styles.statLabel}>Target Score</Text>
          </View>
        </View>
      </View>

      {/* Course Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Course</Text>
        <Text style={styles.courseInfo}>
          {course.detailedDescription || course.description}
        </Text>
      </View>

      {/* Lessons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons ({lessons.data.length})</Text>
        {lessons.data.length > 0 ? (
          lessons.data.map((lesson, index) => (
            <LessonItem key={lesson._id} lesson={lesson} index={index} />
          ))
        ) : (
          <View style={styles.emptyLessons}>
            <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyLessonsText}>No lessons available</Text>
          </View>
        )}
      </View>

      {/* Enroll Button */}
      {!enrolled && (
        <View style={styles.enrollSection}>
          <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
            <Text style={styles.enrollButtonText}>
              {course.price ? `Enroll for $${course.price}` : "Enroll for Free"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {enrolled && (
        <View style={styles.enrolledSection}>
          <View style={styles.enrolledBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.enrolledText}>Enrolled</Text>
          </View>
        </View>
      )}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginTop: 16,
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  courseImage: {
    width: 100,
    height: 100,
    backgroundColor: "#EBF4FF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  courseMeta: {
    flexDirection: "row",
    justifyContent: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
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
  courseInfo: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lessonNumber: {
    width: 32,
    height: 32,
    backgroundColor: "#EBF4FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: "#6B7280",
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  lessonType: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  lessonTypeText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  lessonStatus: {
    marginLeft: 16,
  },
  progressSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyLessons: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyLessonsText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  enrollSection: {
    padding: 20,
  },
  enrollButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  enrolledSection: {
    padding: 20,
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  enrolledText: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default CourseDetailScreen;
