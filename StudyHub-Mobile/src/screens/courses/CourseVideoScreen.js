import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { courseApi } from "../../services/courseApi";

const CourseVideoScreen = ({ navigation, route }) => {
  const { courseId, lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [courseId, lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getLessonById(courseId, lessonId);
      setLesson(response.data);
    } catch (error) {
      console.error("Error loading lesson:", error);
      Alert.alert("Error", "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await courseApi.markLessonCompleted(courseId, lessonId);
      Alert.alert("Success", "Lesson marked as completed!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to mark lesson as completed");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Video Placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="play-circle" size={80} color="#3B82F6" />
          <Text style={styles.videoText}>Video Player</Text>
          <Text style={styles.videoSubtext}>
            {lesson.videoUrl || "Video content will be displayed here"}
          </Text>
        </View>
      </View>

      {/* Lesson Content */}
      <View style={styles.content}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>

        {/* Lesson Materials */}
        {lesson.materials && lesson.materials.length > 0 && (
          <View style={styles.materialsSection}>
            <Text style={styles.sectionTitle}>Materials</Text>
            {lesson.materials.map((material, index) => (
              <TouchableOpacity key={index} style={styles.materialItem}>
                <Ionicons name="document-text" size={20} color="#3B82F6" />
                <Text style={styles.materialText}>{material.name}</Text>
                <Ionicons name="download" size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Lesson Notes */}
        {lesson.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{lesson.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleMarkCompleted}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  videoContainer: {
    backgroundColor: "#000000",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    alignItems: "center",
  },
  videoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  videoSubtext: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  lessonDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  materialsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  materialText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
  },
  actionButtons: {
    marginTop: 24,
  },
  completeButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default CourseVideoScreen;
