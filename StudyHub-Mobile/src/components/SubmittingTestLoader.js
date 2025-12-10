import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";

const SubmittingTestLoader = () => {
  // 1. State quản lý index của câu nhắc (Tip)
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // 2. Animated Value cho thanh tiến trình (dùng useRef để giữ giá trị không bị reset khi render lại)
  const progress = useRef(new Animated.Value(0)).current;

  const submissionTips = [
    "Analyzing your answers...",
    "Calculating your score...",
    "Generating personalized recommendations...",
    "Creating your study plan...",
    "Almost done! Preparing your results...",
    "Great job! Finalizing your test results...",
  ];

  useEffect(() => {
    // --- LOGIC 1: Đổi Tip mỗi 4 giây ---
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % submissionTips.length);
    }, 4000);

    // --- LOGIC 2: Chạy thanh Progress trong 28 giây ---
    // Chạy đến 95% rồi dừng lại chờ API thực (tránh chạy lố 100% khi chưa xong)
    Animated.timing(progress, {
      toValue: 0.95,
      duration: 28000, // 28 giây
      useNativeDriver: false, // width không hỗ trợ native driver
    }).start();

    // Cleanup khi component unmount
    return () => clearInterval(tipInterval);
  }, []);

  // Biến đổi giá trị 0-1 thành chiều rộng %
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submitting Your Test</Text>

      <ActivityIndicator
        size={60}
        color="#059669"
        style={{ marginVertical: 20 }}
      />

      {/* --- HIỂN THỊ TIP THAY ĐỔI --- */}
      {submissionTips.length > 0 && (
        <View style={styles.tipContainer}>
          <Text style={styles.tip}>
            Did you know? {submissionTips[currentTipIndex]}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Processing results...</Text>

        {/* Thanh Progress Bar */}
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth }, // Gắn biến width vào đây
            ]}
          />
        </View>

        <Text style={styles.cardSubtitle}>
          Estimated time: 20-30 seconds. Please do not close the app.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#059669",
    textAlign: "center",
    marginBottom: 10,
  },
  tipContainer: {
    height: 60,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  tip: {
    fontSize: 15,
    fontWeight: "500",
    color: "#047857",
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    width: "100%",
    marginVertical: 15,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 5,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default SubmittingTestLoader;
