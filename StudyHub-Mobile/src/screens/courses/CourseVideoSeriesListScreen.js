import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme, // Hook để phát hiện dark mode
} from "react-native";
// Import icon
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// --- Bảng màu cho Light/Dark Mode ---
// Dựa trên các màu "primary", "background-light", "surface-dark", v.v. trong HTML
const lightColors = {
  primary: "#258cf4",
  background: "#f5f7f8",
  surface: "#ffffff",
  textPrimary: "#111418",
  textSecondary: "#60758a",
  border: "#dbe0e6",
  success: "#22c55e",
};

const darkColors = {
  primary: "#258cf4",
  background: "#101922",
  surface: "#1e293b",
  textPrimary: "#f5f7f8",
  textSecondary: "#9fb3c8",
  border: "#334155",
  success: "#22c55e",
};

// --- Component Card Video (Tái sử dụng) ---
const VideoListItem = ({
  title,
  duration,
  thumbnailUri,
  status,
  colors,
  navigation,
  courseId,
  lesson,
}) => {
  const isCompleted = status === "completed";
  const iconName = isCompleted ? "checkmark-circle" : "play-circle";
  const iconColor = isCompleted ? colors.success : colors.primary;
  const iconBgColor = isCompleted
    ? `${colors.success}33` // 33 là ~20% opacity
    : `${colors.primary}33`;

  // Dùng `createStyles` để style cũng có thể nhận `colors`
  const itemStyles = createItemStyles(colors);

  // <<< THÊM HÀM NÀY ĐỂ XỬ LÝ SỰ KIỆN NHẤN >>>
  const handlePress = () => {
    // Log ra tiêu đề của video khi nhấn
    navigation.navigate("CourseVideo", {
      courseId,
      lesson,
    });

    // Bạn cũng có thể log các thông tin khác nếu muốn
    // console.log("Item data:", { title, duration, status });
  };

  return (
    <TouchableOpacity
      style={[itemStyles.itemContainer, { backgroundColor: colors.surface }]}
      onPress={handlePress} // <<< THÊM PROP NÀY VÀO ĐÂY
    >
      {/* Phần bên trái: Hình + Text */}
      <View style={itemStyles.leftContainer}>
        <Image source={{ uri: thumbnailUri }} style={itemStyles.thumbnail} />
        <View style={itemStyles.textContainer}>
          <Text
            style={[itemStyles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={itemStyles.durationContainer}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={colors.textSecondary}
            />
            <Text
              style={[itemStyles.durationText, { color: colors.textSecondary }]}
            >
              {duration}
            </Text>
          </View>
        </View>
      </View>

      {/* Phần bên phải: Icon Trạng thái */}
      <View style={itemStyles.statusIconContainer}>
        <View
          style={[
            itemStyles.statusIconBackground,
            { backgroundColor: iconBgColor },
          ]}
        >
          {/* <MaterialIcons name={iconName} size={16} color={iconColor} /> */}
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- Màn hình chính ---
const CourseVideoSeriesListScreen = ({ navigation }) => {
  const { courseId, lesson } = useRoute().params;

  const videoParts = lesson.parts.filter(
    (part) => part.contentType === "video"
  );

  // Gán lại nếu muốn cập nhật data
  const updatedData = {
    ...lesson,
    parts: videoParts,
  };

  // Tự động phát hiện theme của hệ thống
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  // Tạo styles động dựa trên theme
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* TopAppBar */}
      <View style={styles.topAppBar}>
        {/* <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons
            name="arrow_back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity> */}
        <Text style={styles.appBarTitle}>Bài 3: Giao tiếp nhà hàng</Text>
        {/* Thêm 1 View trống để căn giữa tiêu đề */}
        <View style={styles.iconButton} />
      </View>

      {/* Nội dung chính (có thể cuộn) */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* HeaderImage */}
        <View style={styles.paddingContainer}>
          <ImageBackground
            source={{ uri: "https://picsum.photos/seed/restaurant/400/218" }} // Thay thế link ảnh
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
            resizeMode="cover"
          />
        </View>

        {/* ProgressBar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Hoàn thành 1/3 video</Text>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* BodyText */}
        <Text style={styles.bodyText}>
          Trong bài học này, bạn sẽ học các từ vựng và mẫu câu cần thiết để tự
          tin giao tiếp khi gọi món, thanh toán và tương tác với nhân viên tại
          nhà hàng.
        </Text>

        {/* Video List */}
        {updatedData.parts.length > 0 && (
          <View style={styles.videoListContainer}>
            {updatedData.parts.map((part, index) => (
              <VideoListItem
                key={part._id}
                title={`Video ${index + 1}: ${part.title}`}
                duration=""
                thumbnailUri="https://picsum.photos/seed/vocab/140/140" // Thay thế link ảnh
                status="completed"
                colors={colors}
                navigation={navigation}
                courseId={courseId}
                lesson={part}
              />
            ))}
          </View>
        )}

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
          {/* <TouchableOpacity
            style={[styles.baseButton, styles.completeButton]} // Kết hợp style
            onPress={handleMarkCompleted}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Mark as Completed</Text>
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.videoListContainer}>
          <VideoListItem
            title="Video 1: Từ vựng gọi món"
            duration="4:30 phút"
            thumbnailUri="https://picsum.photos/seed/vocab/140/140" // Thay thế link ảnh
            status="completed"
            colors={colors}
          />
          <VideoListItem
            title="Video 2: Mẫu câu gọi món"
            duration="5:15 phút"
            thumbnailUri="https://picsum.photos/seed/ordering/140/140" // Thay thế link ảnh
            status="pending"
            colors={colors}
          />
          <VideoListItem
            title="Video 3: Thanh toán"
            duration="3:50 phút"
            thumbnailUri="https://picsum.photos/seed/payment/140/140" // Thay thế link ảnh
            status="pending"
            colors={colors}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- StyleSheet cho Màn hình chính ---
// Dùng hàm để truyền `colors` vào
const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface, // Nền của app bar
    },
    container: {
      flex: 1,
      backgroundColor: colors.background, // Nền của nội dung
    },
    scrollContentContainer: {
      paddingBottom: 24, // Thêm padding dưới đáy ScrollView
    },
    topAppBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      paddingBottom: 8,
      backgroundColor: colors.surface,
      // shadow-sm
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconButton: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: -12, // Bù trừ cho padding của button
    },
    appBarTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      fontFamily: "Lexend-Bold", // Thêm font nếu bạn đã import
    },
    paddingContainer: {
      padding: 16,
      paddingBottom: 12, // Giảm padding-bottom
    },
    headerImage: {
      width: "100%",
      minHeight: 218,
      justifyContent: "flex-end",
      overflow: "hidden", // Cần thiết cho borderRadius trên ImageBackground
    },
    headerImageStyle: {
      borderRadius: 16, // rounded-xl
    },
    progressSection: {
      paddingHorizontal: 16,
      gap: 12,
    },
    progressText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.textPrimary,
      fontFamily: "Lexend-Medium",
    },
    progressBarBackground: {
      height: 8,
      borderRadius: 9999, // rounded-full
      backgroundColor: colors.border,
    },
    progressBarFill: {
      height: 8,
      borderRadius: 9999,
      backgroundColor: colors.success,
      width: "33%",
    },
    bodyText: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.textPrimary,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      lineHeight: 24, // Dễ đọc hơn
      fontFamily: "Lexend-Regular",
    },
    videoListContainer: {
      paddingHorizontal: 16,
      gap: 8, // Tương đương gap-2
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
      marginBottom: 60,
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

// --- StyleSheet cho Component VideoListItem ---
const createItemStyles = (colors) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8, // rounded-lg
      minHeight: 72,
      // shadow-sm
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 2,
    },
    leftContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      flex: 1, // Quan trọng để chiếm không gian
    },
    thumbnail: {
      width: 56, // size-14
      height: 56, // size-14
      borderRadius: 8, // rounded-lg
      aspectRatio: 1,
    },
    textContainer: {
      flex: 1, // Cho phép text co giãn và ngắt dòng
      justifyContent: "center",
      gap: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      fontFamily: "Lexend-Medium",
    },
    durationContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    durationText: {
      fontSize: 14,
      fontWeight: "400",
      fontFamily: "Lexend-Regular",
    },
    statusIconContainer: {
      // shrink-0 (mặc định trong RN)
    },
    statusIconBackground: {
      width: 28, // size-7
      height: 28, // size-7
      borderRadius: 9999, // rounded-full
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default CourseVideoSeriesListScreen;
