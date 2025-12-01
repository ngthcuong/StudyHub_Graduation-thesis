import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { Button } from "react-native-paper";
// Import icon
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import YoutubePlayer from "react-native-youtube-iframe";

// --- Bảng màu (Dựa trên HTML/Tailwind) ---
const lightColors = {
  primary: "#258cf4",
  background: "#f5f7f8",
  surface: "#ffffff",
  textPrimary: "#111827", // text-gray-900
  textSecondary: "#4b5563", // text-gray-600
  textPrimaryBold: "#1f2937", // text-gray-800
  border: "#e5e7eb", // border-gray-200
  headerFooterBg: "rgba(245, 247, 248, 0.8)", // bg-background-light/80
};

const darkColors = {
  primary: "#258cf4",
  background: "#101922",
  surface: "rgba(16, 25, 34, 0.5)", // bg-background-dark/50
  textPrimary: "#f9fafb", // text-gray-100
  textSecondary: "#9ca3af", // text-gray-400
  textPrimaryBold: "#e5e7eb", // text-gray-200
  border: "#374151", // border-gray-800
  headerFooterBg: "rgba(16, 25, 34, 0.8)", // bg-background-dark/80
};

// --- Component Card Tái sử dụng ---
const LessonCard = ({ imageUri, title, children, colors }) => {
  const cardStyles = createCardStyles(colors);
  return (
    <View style={cardStyles.cardContainer}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={cardStyles.cardImage}
        imageStyle={cardStyles.cardImageStyle}
        resizeMode="cover"
      />
      <View style={cardStyles.cardContent}>
        <Text style={cardStyles.cardTitle}>{title}</Text>
        <View>{children}</View>
      </View>
    </View>
  );
};

// --- Màn hình chính ---
const CourseVideoScreen = ({ navigation, route }) => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  const styles = createStyles(colors);

  const { courseId, lesson } = route.params;

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video đã kết thúc!");
    }
  }, []);

  function getYoutubeVideoId(url) {
    if (!url) {
      return null;
    }
    // Regex để lấy ID từ nhiều định dạng link Youtube
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?#]+)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  }

  const videoId = getYoutubeVideoId(lesson?.videoUrl);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.headerFooterBg}
        translucent={true}
      />

      {/* Top App Bar (Sticky) */}
      <View style={styles.header}>
        {/* ... (Header của bạn) ... */}
        <Text style={styles.headerTitle}>{lesson?.title || "Bài học"}</Text>
        <View style={styles.iconButton} />
      </View>

      {/* Nội dung chính (ScrollView) */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer} // Đảm bảo style này tồn tại
      >
        {/* Media Player */}
        <View style={styles.videoPlayerContainer}>
          {/* --- BƯỚC 2: KIỂM TRA VIDEOID VÀ TRUYỀN VÀO PLAYER --- */}
          {videoId ? (
            <YoutubePlayer
              height={211}
              play={playing}
              videoId={videoId} // Truyền ID đã được trích xuất
              onChangeState={onStateChange}
            />
          ) : (
            // Hiển thị thông báo lỗi nếu không có videoId
            <View
              style={{
                height: 211,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surface,
              }}
            >
              <Text style={{ color: colors.textSecondary }}>
                Không thể tải video.
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>Ghi chú bài học</Text>
          {/* ... (Các LessonCard của bạn) ... */}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.baseButton, styles.completeButton]} // Kết hợp style
        onPress={() => {
          // TODO: Thay bằng logic điều hướng của bạn
          // Ví dụ: navigation.navigate('ExerciseScreen', { lessonId: lesson._id });
          console.log("Hoàn thành bài học!");
        }}
      >
        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Completed</Text>
      </TouchableOpacity>

      {/* Sticky Footer CTA */}
      <View style={styles.footer}>{/* ... (Footer của bạn) ... */}</View>
    </SafeAreaView>
  );
};

// --- StyleSheet cho Màn hình chính ---
const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: StatusBar.currentHeight, // Xử lý status bar
      paddingBottom: 8,
      backgroundColor: colors.headerFooterBg, // backdrop-blur
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: "Lexend-Bold",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 112, // Đảm bảo không bị che bởi footer
    },
    videoPlayer: {
      aspectRatio: 16 / 9,
      backgroundColor: "#111418",
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      width: 64, // size-16
      height: 64,
      borderRadius: 32,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    videoControlsOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "rgba(0, 0, 0, 0.3)", // gradient fallback
    },
    progressBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 16,
    },
    progressElapsed: {
      height: 6,
      flex: 0.25, // Tỷ lệ đã xem
      backgroundColor: "white",
      borderRadius: 3,
    },
    progressHandle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.2)",
      marginLeft: -8, // Nửa chiều rộng
      marginRight: -8,
      zIndex: 1,
    },
    progressRemaining: {
      height: 6,
      flex: 1, // Tỷ lệ còn lại
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      borderRadius: 3,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    timeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "500",
      fontFamily: "Lexend-Medium",
    },
    contentSection: {
      paddingVertical: 16,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: "Lexend-Bold",
      paddingHorizontal: 16,
      paddingBottom: 8,
      paddingTop: 16,
    },
    cardBodyText: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24, // leading-relaxed
      fontFamily: "Lexend-Regular",
    },
    boldText: {
      fontWeight: "600",
      color: colors.textPrimaryBold,
      fontFamily: "Lexend-SemiBold",
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      paddingBottom: 24, // Thêm padding cho vùng an toàn
      backgroundColor: colors.headerFooterBg, // backdrop-blur
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerButtonDisabled: {
      backgroundColor: `${colors.primary}66`, // Tương đương /40 opacity
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    footerButtonTextDisabled: {
      color: "rgba(255, 255, 255, 0.7)", // Tương đương /70 opacity
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Lexend-Bold",
    },
    videoPlayerContainer: {
      borderRadius: 16, // Bo tròn góc (giống LessonCard)
      marginHorizontal: 16, // Căn lề ngang (giống LessonCard)
      marginTop: 16, // Thêm khoảng cách với Header
      overflow: "hidden", // QUAN TRỌNG: Bắt buộc để bo góc video bên trong

      // Copy y hệt style bóng (shadow) từ LessonCard
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
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
      marginBottom: 60,
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

// --- StyleSheet cho Component Card ---
const createCardStyles = (colors) =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16, // rounded-xl
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 8,
      // shadow-[0_2px_8px_rgba(0,0,0,0.05)]
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    cardImage: {
      width: "100%",
      aspectRatio: 2 / 1,
    },
    cardImageStyle: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    cardContent: {
      padding: 16,
      gap: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: "Lexend-Bold",
    },
  });

export default CourseVideoScreen;
