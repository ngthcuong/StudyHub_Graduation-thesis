import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions, // ⭐️ Loại bỏ, không cần thiết nữa
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";
import { courseApi } from "../../services/courseApi";

const CourseVideoScreen = ({ navigation, route }) => {
  const { courseId, lesson } = route.params;
  const [loading, setLoading] = useState(true);
  const [videoParts, setVideoParts] = useState([]);

  useEffect(() => {
    // ⭐️ Đảm bảo 'lesson' tồn tại trước khi load
    if (lesson) {
      loadLessonVideos();
    } else {
      setLoading(false);
    }
  }, [lesson]);

  const loadLessonVideos = async () => {
    try {
      setLoading(true);
      const videos = [];

      for (const part of lesson.parts) {
        try {
          const response = await courseApi.getPartGrammarLessonsById(part._id);
          const partData = response.data;

          if (partData.contentType === "video" && partData.videoUrl) {
            const videoIdMatch = partData.videoUrl.match(
              /(?:v=|\/embed\/|youtu\.be\/)([^"&?\/\s]{11})/
            );
            if (videoIdMatch && videoIdMatch[1]) {
              videos.push({
                videoId: videoIdMatch[1],
                title: partData.title || "Video Part", // ⭐️ Đảm bảo luôn có title
              });
            }
          }
        } catch (error) {
          console.error("Error fetching part:", part._id, error);
        }
      }
      setVideoParts(videos);
    } catch (error) {
      console.error("Error loading lesson videos:", error);
      Alert.alert("Error", "Failed to load lesson videos");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await courseApi.markLessonCompleted(courseId, lesson._id);
      Alert.alert("Success", "Lesson marked as completed!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to mark lesson as completed");
    }
  };

  // ⭐️ Trạng thái Loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  // ⭐️ Trạng thái Lỗi / Không có bài học
  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }

  // ⭐️ Giao diện chính
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent} // ⭐️ Dùng contentContainerStyle để padding
    >
      {/* 1. Phần tiêu đề bài học */}
      <View style={styles.headerContainer}>
        <Text style={styles.lessonTitle}>
          {lesson.title || "Lesson"} {/* ⭐️ Hiển thị tiêu đề bài học */}
        </Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
      </View>

      {/* 2. Danh sách video */}
      {videoParts.length > 0 ? (
        videoParts.map((video, index) => (
          <View key={index} style={styles.videoCard}>
            <View style={styles.videoWrapper}>
              <YoutubeIframe
                height={220} // ⭐️ Chiều cao cố định cho video
                videoId={video.videoId}
                play={false}
                initialPlayerParams={{
                  controls: true,
                  modestbranding: true,
                  rel: false,
                  showInfo: false,
                }}
                webViewStyle={{ opacity: 0.99, minHeight: 1 }}
              />
            </View>
            <Text style={styles.videoTitleText}>{video.title}</Text>
          </View>
        ))
      ) : (
        // ⭐️ Placeholder khi không có video
        <View style={styles.noVideoCard}>
          <Ionicons name="videocam-off-outline" size={40} color="#9CA3AF" />
          <Text style={styles.noVideoText}>No videos for this lesson</Text>
        </View>
      )}

      {/* 3. Nút hoàn thành */}
      <View style={styles.actionContainer}>
        {/* ⭐️ NÚT LÀM BÀI TẬP (MỚI) ⭐️ */}
        <TouchableOpacity
          style={[styles.baseButton, styles.exerciseButton]} // Kết hợp style
          onPress={() => {
            // TODO: Thay bằng logic điều hướng của bạn
            // Ví dụ: navigation.navigate('ExerciseScreen', { lessonId: lesson._id });
            navigation.navigate("CourseTest", {
              lesson: lesson,
            });
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Làm bài tập</Text>
        </TouchableOpacity>

        {/* ⭐️ Nút hoàn thành (GIỮ NGUYÊN) ⭐️ */}
        <TouchableOpacity
          style={[styles.baseButton, styles.completeButton]} // Kết hợp style
          onPress={handleMarkCompleted}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// 🎨 Bảng StyleSheet mới
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // ⭐️ Màu nền xám nhạt
  },
  scrollContent: {
    padding: 16, // ⭐️ Padding chung cho toàn bộ nội dung
    paddingBottom: 40, // ⭐️ Thêm padding
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: { fontSize: 16, color: "#6B7280" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginTop: 16,
    textAlign: "center",
  },

  // ⭐️ Header (Tiêu đề bài học)
  headerContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },

  // ⭐️ Video Card (Mỗi video là 1 card)
  videoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden", // ⭐️ Để bo góc cả YoutubeIframe
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoWrapper: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden", // ⭐️ Quan trọng để bo góc video
  },
  videoTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // ⭐️ Placeholder khi không có video
  noVideoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginBottom: 24,
  },
  noVideoText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 12,
  },

  // ⭐️ Nút hoàn thành
  completeButton: {
    backgroundColor: "#10B981", // Màu xanh lá cây
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16, // ⭐️ Thêm margin
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // nút
  actionContainer: {
    marginTop: 16,
    paddingHorizontal: 8, // Thêm chút padding nếu cần
  },

  // ⭐️ Style CHUNG cho các nút
  baseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16, // Khoảng cách giữa 2 nút
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },

  // ⭐️ Nút làm bài tập (MỚI)
  exerciseButton: {
    backgroundColor: "#3B82F6", // Màu xanh dương
    shadowColor: "#3B82F6",
  },

  // ⭐️ Nút hoàn thành (Cập nhật)
  completeButton: {
    backgroundColor: "#10B981", // Màu xanh lá cây
    shadowColor: "#10B981",
  },

  // ⭐️ Đổi tên "completeButtonText" thành "buttonText"
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default CourseVideoScreen;
