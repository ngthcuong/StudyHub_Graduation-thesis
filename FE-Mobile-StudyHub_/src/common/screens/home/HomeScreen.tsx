import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "../../components/Header";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Header />

      {/* Lời chào */}
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>Chào Nguyễn Văn An!</Text>
        <Text style={styles.greetingSubtitle}>
          Trình độ hiện tại: Intermediate
        </Text>
      </View>

      {/* Thanh tiến độ */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>Đã hoàn thành 20/50 bài học</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "40%" }]} />
        </View>
      </View>

      {/* Các mục học chính */}
      <View style={styles.mainSections}>
        <TouchableOpacity style={styles.mainBtn}>
          <Text style={styles.mainBtnText}>📚 Học từ vựng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtn}>
          <Text style={styles.mainBtnText}>🎧 Bài tập nghe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtn}>
          <Text style={styles.mainBtnText}>💬 Hội thoại thực hành</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => navigation.navigate("TestResults" as never)}
        >
          <Text style={styles.mainBtnText}>📝 Kiểm tra nhanh</Text>
        </TouchableOpacity>
      </View>

      {/* Gợi ý bài học tiếp theo */}
      <View style={styles.nextLessonSection}>
        <Text style={styles.nextLessonLabel}>
          Bài học tiếp theo bạn nên học:
        </Text>
        <View style={styles.nextLessonBox}>
          <Text style={styles.nextLessonTitle}>Unit 5: Daily Activities</Text>
          <TouchableOpacity style={styles.nextLessonBtn}>
            <Text style={styles.nextLessonBtnText}>Bắt đầu học</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thông báo và tin tức */}
      <View style={styles.notifications}>
        <Text style={styles.notificationsTitle}>📢 Thông báo mới</Text>
        <View style={styles.notificationsList}>
          <Text style={styles.notificationItem}>
            • Khóa học giao tiếp mở đơn đăng ký đến 30/06
          </Text>
          <Text style={styles.notificationItem}>
            • Mẹo học từ vựng hiệu quả: Lập danh sách từ mỗi ngày
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "#f9f9f9",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#3355FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconBtn: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer", // note: cursor only applies in web version (Expo web)
  },
  icon: {
    fontSize: 20,
    color: "white",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
  },
  avatarText: {
    fontWeight: "bold",
    lineHeight: 32,
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
  greeting: {
    paddingVertical: 16,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  greetingSubtitle: {
    color: "#555",
  },
  progressSection: {
    paddingBottom: 16,
  },
  progressText: {
    marginBottom: 8,
  },
  progressBarBg: {
    backgroundColor: "#ddd",
    borderRadius: 12,
    height: 12,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
  },
  mainSections: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  mainBtn: {
    flexBasis: "48%", // 2 buttons per row with some gap
    padding: 20,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: {
    fontWeight: "600",
    fontSize: 16,
  },
  nextLessonSection: {
    marginBottom: 16,
  },
  nextLessonLabel: {
    marginBottom: 8,
  },
  nextLessonBox: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextLessonTitle: {
    fontWeight: "600",
  },
  nextLessonBtn: {
    backgroundColor: "#3355FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  nextLessonBtnText: {
    color: "white",
  },
  notifications: {
    backgroundColor: "#fff8e1",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  notificationsTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  notificationsList: {
    paddingLeft: 16,
  },
  notificationItem: {
    color: "#555",
    marginBottom: 4,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
