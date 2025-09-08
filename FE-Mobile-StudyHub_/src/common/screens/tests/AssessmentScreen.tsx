import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AssessmentScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>JavaScript Fundamentals Assessment</Text>
        <View style={styles.blueLine} />

        <Text style={styles.subTitle}>Test Overview</Text>
        <Text style={styles.description}>
          This comprehensive test covers core JavaScript concepts including
          variables, functions, objects, arrays, DOM manipulation, and
          asynchronous programming. You will be tested on syntax, best
          practices, and problem-solving skills essential for modern web
          development.
        </Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>📄</Text>
            <View>
              <Text style={styles.infoLabel}>QUESTIONS</Text>
              <Text style={styles.infoValue}>25</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View>
              <Text style={styles.infoLabel}>DURATION</Text>
              <Text style={styles.infoValue}>45 min</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>🔃</Text>
            <View>
              <Text style={styles.infoLabel}>ALLOWED</Text>
              <Text style={styles.infoValue}>2</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>📋</Text>
            <View>
              <Text style={styles.infoLabel}>TEST TYPE</Text>
              <Text style={styles.infoValue}>Multiple Choice</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.note}>
          <Text>⚠️</Text>
          <Text style={{ marginLeft: 6 }}>
            Make sure you have a stable internet connection before starting
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FillExercise" as never)}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    width: "100%",
    maxWidth: 600,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  blueLine: {
    width: 40,
    height: 3,
    backgroundColor: "#3b82f6",
    marginVertical: 24,
    borderRadius: 2,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    borderRadius: 6,
    padding: 12,
    width: "48%",
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  divider: {
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    color: "#777",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AssessmentScreen;
