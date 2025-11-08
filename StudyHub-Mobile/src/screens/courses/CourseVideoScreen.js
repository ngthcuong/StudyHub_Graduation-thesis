import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// ⭐️ Đã import đúng YoutubeIframe
import YoutubeIframe from "react-native-youtube-iframe";
// Đã loại bỏ import trùng lặp của courseApi
import { courseApi } from "../../services/courseApi";

const CourseVideoScreen = ({ navigation, route }) => {
  const { courseId, lesson } = route.params;
  const [loading, setLoading] = useState(true);
  // videoLinks bây giờ sẽ lưu trữ các Video ID
  const [videoLinks, setVideoLinks] = useState([]);

  useEffect(() => {
    loadLessonVideos();
  }, [lesson]);

  const loadLessonVideos = async () => {
    try {
      setLoading(true);
      // ⭐️ SỬ DỤNG videoIds ĐỂ THU THẬP TẤT CẢ CÁC ID
      const videoIds = [];

      // ⭐️ CHỈ SỬ DỤNG MỘT VÒNG LẶP DUY NHẤT
      for (const part of lesson.parts) {
        try {
          const response = await courseApi.getPartGrammarLessonsById(part._id);
          const content = response?.data?.content || [];

          const partVideoIds = content
            .filter((item) => item.type === "video")
            .map((item) => {
              const originalUrl = item.value;
              if (originalUrl && originalUrl.includes("youtube.com/")) {
                // LOGIC TRÍCH XUẤT VIDEO ID
                const videoIdMatch = originalUrl.match(
                  /(?:v=|\/embed\/|youtu\.be\/)([^"&?\/\s]{11})/
                );
                if (videoIdMatch && videoIdMatch[1]) {
                  return videoIdMatch[1]; // Trả về ID (ví dụ: sXjd9Uy4qDY)
                }
              }
              return null;
            })
            .filter(Boolean);

          videoIds.push(...partVideoIds);
        } catch (error) {
          console.error("Error fetching part:", part._id, error);
        }
      }

      // ⭐️ CẬP NHẬT STATE 1 LẦN DUY NHẤT SAU KHI THU THẬP HẾT
      setVideoLinks(videoIds);
      console.log("All video IDs:", videoIds);
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

  const screenWidth = Dimensions.get("window").width;

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
      {/* Video List */}
      {videoLinks.length > 0 ? (
        // ⭐️ FIX: DÙNG YoutubeIframe và videoId
        videoLinks.map((videoId, index) => (
          <View key={index} style={styles.videoContainer}>
            <YoutubeIframe
              key={index}
              height={250} // Chiều cao cố định
              width={screenWidth - 20}
              videoId={videoId} // Truyền Video ID đã trích xuất
              play={false} // Không tự động phát khi load
              // Cấu hình các tham số để tối giản giao diện
              initialPlayerParams={{
                controls: true,
                modestbranding: true, // Ẩn logo YT lớn
                rel: false, // Tắt video liên quan
                showInfo: false, // Tắt thông tin video
              }}
              // Thêm style nhỏ này để khắc phục flicker trên Android
              webViewStyle={{ opacity: 0.99, minHeight: 1 }}
            />
          </View>
        ))
      ) : (
        <View style={styles.videoContainer}>
          <Ionicons name="videocam" size={60} color="#9CA3AF" />
          <Text style={styles.videoText}>No videos available</Text>
        </View>
      )}

      {/* Lesson Content */}
      <View style={styles.content}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>

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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
  },
  errorText: { fontSize: 18, color: "#EF4444", marginTop: 16 },
  videoContainer: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  content: { padding: 20 },
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
  actionButtons: { marginTop: 24 },
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
