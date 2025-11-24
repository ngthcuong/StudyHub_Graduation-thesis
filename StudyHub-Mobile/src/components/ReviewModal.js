import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { reviewApi } from "../services/reviewApi";

const ReviewModal = ({ navigation, route }) => {
  const { course } = route.params || {};
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [JusReview, setJusReview] = useState(false);

  const handleStarPress = (value) => setRating(value);

  useEffect(() => {
    fetcheJusReview();
  }, []);

  const fetcheJusReview = async () => {
    try {
      const justReview = await reviewApi.getUserReviewForCourse(course?._id);
      setJusReview(justReview);
      setReviewContent(justReview?.review?.content || "");
      setRating(justReview?.review?.rating || 5);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Course:", course);
    console.log("Rating:", rating);
    console.log("Review:", reviewContent);

    if (JusReview && JusReview?.hasReview) {
      console.log(JusReview?.review?._id);
      await reviewApi.updateReview(JusReview?.review?._id, {
        rating: rating,
        content: reviewContent,
      });
      Alert.alert(
        "Success",
        "Your review has been updated successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    } else {
      try {
        const reviewData = {
          courseId: course?._id,
          rating,
          content: reviewContent,
        };
        await reviewApi.createReview(reviewData);
        navigation.goBack();
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.body}>
        {/* Course Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Course Name</Text>
          <View style={styles.courseBox}>
            <Text style={styles.courseText}>
              {course?.title || "Loading..."}
            </Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Star Rating</Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
                <Ionicons
                  name={i <= rating ? "star" : "star-outline"}
                  size={32}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.ratingText}>({rating}/5 stars)</Text>
          </View>
        </View>

        {/* Review Content */}
        <View style={styles.section}>
          <Text style={styles.label}>Review Content</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience with the course..."
            multiline
            numberOfLines={6}
            maxLength={500}
            value={reviewContent}
            onChangeText={setReviewContent}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {reviewContent.length}/500 characters
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            reviewContent.trim().length === 0 && { backgroundColor: "#9CA3AF" },
          ]}
          disabled={reviewContent.trim().length === 0}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>SUBMIT REVIEW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  body: { padding: 16, paddingBottom: 80 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#6B7280", marginBottom: 6 },
  courseBox: {
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
  },
  courseText: { color: "#1F2937", fontWeight: "500" },
  starContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingText: { marginLeft: 8, color: "#6B7280" },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "#1F2937",
  },
  charCount: {
    marginTop: 4,
    textAlign: "right",
    color: "#6B7280",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: "#D1D5DB",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: { color: "#374151", fontWeight: "600" },
  submitBtn: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600" },
});

export default ReviewModal;
