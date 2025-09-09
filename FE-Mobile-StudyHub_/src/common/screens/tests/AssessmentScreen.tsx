import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";
import attemptApi from "../../../api/attemptApi";

const AssessmentScreen = (props) => {
  const {
    testId,
    title,
    description,
    quantity,
    time,
    allowed,
    type,
    questionTypes,
  } = props;
  const navigation = useNavigation();

  const { authData } = useAuth();
  const { user } = authData;
  console.log("Starting attempt for user:", user);

  const handleStartTest = async () => {
    const token = authData?.accessToken;
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc token không hợp lệ");
      return;
    }

    try {
      const payload = {
        testId,
        userId: user._id,
        evaluationModel: "gemini",
      };

      const response = await attemptApi.startAttempt(payload, token);
      const attemptId = response.data.data._id;
      alert(`Attempt started with id: ${attemptId}`);

      // 2️⃣ Xác định màn hình đích dựa vào loại câu hỏi
      let targetScreen = "FillExercise";
      if (questionTypes[0] === "multiple_choice") {
        targetScreen = "MultilExercise";
      }

      // 3️⃣ Điều hướng sang màn hình phù hợp, truyền params
      navigation.navigate(targetScreen, {
        testId,
        attemptId,
        title,
        description,
        quantity,
        time,
        allowed,
        type,
      });
    } catch (error: any) {
      console.error(
        "Error starting attempt:",
        error.response?.data || error.message
      );
      alert("Failed to start attempt");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.blueLine} />

        <Text style={styles.subTitle}>Test Overview</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>📄</Text>
            <View>
              <Text style={styles.infoLabel}>QUESTIONS</Text>
              <Text style={styles.infoValue}>{quantity}</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <View>
              <Text style={styles.infoLabel}>DURATION</Text>
              <Text style={styles.infoValue}>{time} min</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>🔃</Text>
            <View>
              <Text style={styles.infoLabel}>ALLOWED</Text>
              <Text style={styles.infoValue}>{allowed}</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoIcon}>📋</Text>
            <View>
              <Text style={styles.infoLabel}>TEST TYPE</Text>
              <Text style={styles.infoValue}>{type}</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleStartTest}>
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ✅ Khai báo PropTypes
AssessmentScreen.propTypes = {
  testId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  allowed: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
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

// ✅ Export 1 lần duy nhất
export default AssessmentScreen;
