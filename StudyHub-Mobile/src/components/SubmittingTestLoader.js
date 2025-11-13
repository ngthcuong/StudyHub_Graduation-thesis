import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
} from "react-native";

const SubmittingTestLoader = () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get("window").width - 40; // padding 20 x2

  const submissionTips = [
    "Analyzing your answers...",
    "Calculating your score...",
    "Generating personalized recommendations...",
    "Creating your study plan...",
    "Almost done! Preparing your results...",
    "Great job! Finalizing your test results...",
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submitting Your Test</Text>

      <ActivityIndicator
        size={60}
        color="#059669"
        style={{ marginVertical: 20 }}
      />

      {submissionTips[0] && <Text style={styles.tip}>{submissionTips[0]}</Text>}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your test is being processed...</Text>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.cardSubtitle}>
          Please wait while we analyze your answers and prepare your
          personalized results.
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
    fontSize: 28,
    fontWeight: "700",
    color: "#059669",
    textAlign: "center",
  },
  tip: {
    fontSize: 18,
    fontWeight: "500",
    color: "#047857",
    textAlign: "center",
    minHeight: 48,
    marginVertical: 12,
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
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1fae5",
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default SubmittingTestLoader;
