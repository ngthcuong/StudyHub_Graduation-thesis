import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Icon } from "react-native-paper"; // Hoặc thư viện icon bạn đang dùng

const ProgressSpeedCard = ({ personalized_plan }) => {
  // Lấy data an toàn (optional chaining)
  const speedData = personalized_plan?.progress_speed || {};
  const trendData = speedData?.trend || {};

  // Hàm xác định màu dựa trên category (giống logic web)
  const getCategoryColor = (category) => {
    if (category === "accelerating") return "#16a34a"; // green-600
    if (category === "steady") return "#ea580c"; // orange-600
    return "#dc2626"; // red-600 (cho declining)
  };

  const categoryColor = getCategoryColor(speedData.category);

  return (
    <Card style={[styles.card, { borderColor: "#bbf7d0" }]}>
      <Card.Content>
        <View style={styles.container}>
          {/* --- HEADER --- */}
          <View style={styles.headerRow}>
            <Icon
              source="speedometer" // Đổi icon cho hợp ngữ cảnh
              size={32}
              color={categoryColor}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Progress Speed</Text>
              <Text style={[styles.category, { color: categoryColor }]}>
                {speedData.category || "N/A"}
              </Text>
            </View>
          </View>

          {/* --- DESCRIPTION --- */}
          <Text style={styles.description}>{speedData.description}</Text>

          {/* --- TREND SECTION (Box xám) --- */}
          <View style={styles.trendBox}>
            <Text style={styles.trendTitle}>Performance Trend</Text>

            <Text style={styles.trendText}>
              Past Tests:{" "}
              <Text style={styles.bold}>{trendData.past_tests}</Text>
            </Text>

            <Text style={styles.trendText}>
              Accuracy Growth Rate:{" "}
              <Text style={styles.bold}>{trendData.accuracy_growth_rate}%</Text>
            </Text>

            <Text style={[styles.trendText, { marginTop: 4 }]}>
              Consistency Index:{" "}
              <Text style={styles.bold}>{trendData.consistency_index}</Text>
            </Text>

            {/* --- Strong & Weak Skills (Grid mô phỏng) --- */}
            <View style={styles.skillsContainer}>
              {/* Strong Skills */}
              <View style={styles.skillColumn}>
                <Text style={styles.skillHeader}>Strong Skills:</Text>
                {trendData.strong_skills?.length > 0 ? (
                  trendData.strong_skills.slice(0, 5).map((skill, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      • {skill}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.listItem}>None</Text>
                )}
              </View>

              {/* Weak Skills */}
              <View style={styles.skillColumn}>
                <Text style={styles.skillHeader}>Weak Skills:</Text>
                {trendData.weak_skills?.length > 0 ? (
                  trendData.weak_skills.slice(0, 5).map((skill, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      • {skill}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.listItem}>None</Text>
                )}
              </View>
            </View>
          </View>

          {/* --- PREDICTED WEEKS --- */}
          <Text style={styles.predictedText}>
            Predicted Weeks to Reach Next Level:{" "}
            <Text style={styles.bold}>
              {speedData.predicted_reach_next_level_weeks}
            </Text>
          </Text>

          {/* --- RECOMMENDATION (Box xanh) --- */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>Recommendation</Text>
            <Text style={styles.recommendationText}>
              {speedData.recommendation}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0fdf4", // bg-green-50
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 8,
  },
  container: {
    gap: 12, // Khoảng cách giữa các phần tử (như Stack spacing={2})
  },
  // Header Styles
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  // Description
  description: {
    fontSize: 14,
    color: "#4b5563", // text.secondary
  },
  // Trend Box Styles
  trendBox: {
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  trendText: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  // Skills Styles
  skillsContainer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  skillColumn: {
    flex: 1, // Chia đôi màn hình (Grid xs={6})
    paddingRight: 4,
  },
  skillHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  listItem: {
    fontSize: 12,
    color: "#4b5563",
    marginLeft: 4, // Thay cho pl-5
  },
  // Predicted Text
  predictedText: {
    fontSize: 13,
    color: "#4b5563",
  },
  // Recommendation Box
  recommendationBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16a34a", // green text
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: "#4b5563",
  },
});

export default ProgressSpeedCard;
