import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { userApi } from "../../services/userApi";
import { courseApi } from "../../services/courseApi";

const CoursePurchaseScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const [teacher, setTeacher] = useState(null);
  const [grammarLessons, setGrammarLessons] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchGrammarLessons();
  }, []);

  const fetchGrammarLessons = async () => {
    try {
      const response = await courseApi.getGrammarCoursesById(course._id);
      setGrammarLessons(response.data);
    } catch (error) {
      console.error("Error fetching grammar lessons:", error);
    }
  };

  const fetchUser = async () => {
    const res = await userApi.getProfile(course.teacherId);
    setTeacher(res.data);
  };

  const allExercises = grammarLessons.flatMap((course) => course.exercises);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Course cover image */}
        <Image
          source={{
            uri:
              course?.thumbnailUrl || "https://linklearn.vn/default-image.jpg",
          }}
          style={styles.courseImage}
        />

        <View style={styles.contentContainer}>
          {/* Title and author */}
          <Text style={styles.title}>{course?.title}</Text>
          <Text style={styles.author}>
            Author: {teacher?.fullName || "Teacher A"}
          </Text>

          {/* Short description */}
          <Text style={styles.description}>
            {course?.description ||
              "Learn how to build professional mobile apps for both iOS and Android with React Native."}
          </Text>

          {/* What you will get */}
          <View style={styles.includesContainer}>
            <Text style={styles.includesTitle}>What you'll get:</Text>
            <InfoItem
              icon="video"
              text={`${course?.durationHours} hours of on-demand video`}
            />
            <InfoItem
              icon="file-text"
              text={`${allExercises.length} practical exercises`}
            />
            <InfoItem icon="award" text="Certificate of completion" />
            <InfoItem icon="smartphone" text="Access on all devices" />
          </View>
        </View>
      </ScrollView>

      {/* Price and Buy button (sticky footer) */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>{`${course?.cost}đ`}</Text>
        </View>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => alert("Purchased!")}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Child component for "What you'll get" items
const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Feather name={icon} size={18} color="#3B82F6" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  courseImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 24,
  },
  includesContainer: {
    marginBottom: 20,
  },
  includesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  buyButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CoursePurchaseScreen;
