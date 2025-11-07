import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";

const TestingLoader = ({ loading, questions, test }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const learningTips = [
    "Review grammar patterns regularly to strengthen memory.",
    "Focus on your weak skills for faster improvement.",
    "Try to read English texts aloud to improve pronunciation.",
    "Practice listening daily — even short clips help!",
  ];

  useEffect(() => {
    if (loading || !questions || !test) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % learningTips.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [loading, questions, test]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tipIndex]);

  if (loading || !questions || !test) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Preparing Your Test</Text>

        <Animated.Text style={[styles.tip, { opacity: fadeAnim }]}>
          {learningTips[tipIndex]}
        </Animated.Text>

        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonText} />
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.skeletonBox} />
          ))}
          <View style={styles.buttonSkeleton} />
        </View>

        <ActivityIndicator
          size="large"
          color="#4F46E5"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0EAFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 12,
    textAlign: "center",
  },
  tip: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    minHeight: 40,
    marginBottom: 24,
  },
  skeletonContainer: {
    width: "90%",
    alignItems: "center",
  },
  skeletonText: {
    height: 30,
    backgroundColor: "#d9d9d9",
    borderRadius: 6,
    width: "80%",
    marginBottom: 10,
  },
  skeletonBox: {
    height: 50,
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    width: "100%",
    marginVertical: 6,
  },
  buttonSkeleton: {
    alignSelf: "flex-end",
    height: 40,
    width: 100,
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    marginTop: 12,
  },
});

export default TestingLoader;
