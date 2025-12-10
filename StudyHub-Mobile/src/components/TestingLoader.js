import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";

const TestingLoader = ({ loading, questions, test }) => {
  const [tipIndex, setTipIndex] = useState(0);

  // 1. Animation cho thanh Progress
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 2. Animation cho hiệu ứng nhấp nháy của Skeleton (Pulse)
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  // 3. Animation cho chữ (Fade In/Out)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const learningTips = [
    "Reviewing grammar patterns...",
    "Selecting appropriate questions...",
    "Focusing on your weak skills...",
    "Calibrating difficulty level...",
    "Almost ready! Finalizing test structure...",
  ];

  // --- LOGIC 1: Xử lý Animation ---
  useEffect(() => {
    if (loading || !questions || !test) {
      // A. Chạy Progress Bar trong 28 giây (đến 95%)
      Animated.timing(progressAnim, {
        toValue: 0.95,
        duration: 28000,
        useNativeDriver: false,
      }).start();

      // B. Chạy hiệu ứng Skeleton "thở" (Lặp vô hạn)
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // C. Đổi Tip mỗi 5 giây
      const interval = setInterval(() => {
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Đổi text
          setTipIndex((prev) => (prev + 1) % learningTips.length);
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [loading, questions, test]);

  // Biến đổi width cho progress bar
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (loading || !questions || !test) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Preparing Your Test</Text>

        {/* --- Thanh Progress Bar --- */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>

        <ActivityIndicator
          size="large"
          color="#059669"
          style={{ marginTop: 30 }}
        />
        <Text style={styles.waitText}>Estimated time: 20-30s</Text>

        <Animated.Text style={[styles.tip, { opacity: fadeAnim }]}>
          {learningTips[tipIndex]}
        </Animated.Text>

        {/* --- Skeleton UI có hiệu ứng nhấp nháy --- */}
        <View style={styles.skeletonContainer}>
          {/* Question Title Skeleton */}
          <Animated.View
            style={[styles.skeletonText, { opacity: pulseAnim }]}
          />

          {/* Options Skeleton */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Animated.View
              key={i}
              style={[styles.skeletonBox, { opacity: pulseAnim }]}
            />
          ))}

          {/* Button Skeleton */}
          <Animated.View
            style={[styles.buttonSkeleton, { opacity: pulseAnim }]}
          />
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d1fae5", // Màu nền xanh nhạt (giống file trước)
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#059669", // Màu chữ xanh đậm
    marginBottom: 15,
    textAlign: "center",
  },
  // Style cho thanh Progress Bar
  progressTrack: {
    width: "80%",
    height: 6,
    backgroundColor: "#a7f3d0", // Màu track nhạt
    borderRadius: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#059669", // Màu bar chạy
    borderRadius: 3,
  },
  tip: {
    fontSize: 15,
    color: "#047857",
    textAlign: "center",
    height: 24, // Cố định chiều cao để tránh giật layout
    marginBottom: 20,
    fontStyle: "italic",
    fontWeight: "500",
  },
  waitText: {
    marginTop: 10,
    fontSize: 12,
    color: "#047857",
    opacity: 0.8,
  },
  skeletonContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff", // Card màu trắng chứa skeleton
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  skeletonText: {
    height: 24,
    backgroundColor: "#E5E7EB", // Màu xám cho skeleton
    borderRadius: 6,
    width: "90%",
    marginBottom: 20,
  },
  skeletonBox: {
    height: 45,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    width: "100%",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonSkeleton: {
    alignSelf: "flex-end",
    height: 40,
    width: 100,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 15,
  },
});

export default TestingLoader;
