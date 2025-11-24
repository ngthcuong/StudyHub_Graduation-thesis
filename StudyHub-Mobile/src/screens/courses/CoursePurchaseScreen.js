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

const reviews = [
  {
    id: 1,
    name: "Jane Doe",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVS0PGoF0XyyzcNDMuPw1AGZ3wJuIfPkeuwtXW1nj7T1X-taiSv1KOmR5VSat3XrXcMaLEWXV9TckaBzmp5rw7Pv74LGvdbYX0z007Q3Yvz0o10iNoVPQ9oe-dBd_zewY2smkVivCBy0sfcAaYGWXPrt-ydxqtV5hAMgA8awNgxr3VBxCY-J3AbADnP17RKxGCJI-kAwjvMAP6ycXyqpAhB-gF97WrTdbcnGRn0emsMTt8Ey1BOvt2MYUgH4T3Al00oikwyIruLnw",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "This is by far the best course I've ever taken on this platform. The instructor is clear, concise, and incredibly knowledgeable. Highly recommended!",
  },
  {
    id: 2,
    name: "John Smith",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOl_8TwahZpo9DeURxRsRmGDsJGB9VobuQF8vi_lL9qheZshgVLxR3pRwjEBoVceWGIEyW9V42nit8AhbugEMMG4dwa7dQbGa4v_sq8CONSQycvtZBdlChHAyaJ59YCHfKRGmIIwgFgvFHnaQuMyc0wSBuEKqVewqzm9Z8hhYdoDbNC7fm37r0Rib63IWJ38fSy62bPRgSnZY7SdQXnk-g-KzUvILZjkVtii6klDPOiSF_9PbOHK87mPqZEd4-19ItRcLY_Obqd4A",
    rating: 5,
    date: "1 month ago",
    comment:
      "Fantastic content that was easy to follow. I was able to apply the concepts to my job immediately. The project files were also a huge help.",
  },
  {
    id: 3,
    name: "Emily White",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOnnDQxqZYAUFk0nP9NWAqCDw1GaAjhhINYeBGpB4Rc4TR1nEfPSRUvmeELgknj5cTrWoYx_QZjbbtyH1BUpfFNNNkAUSNjnn3r6RcVufpyQip_2RQ9Y5nZ-DKKrhBvh-9yMNv0GVqbcW9XcpuRJdbWptACYAL7Jjr_DilzaJlyX6dpjSfO-GZvQZxC64vZvKJ_z6wXY6gEvpdLUriZOnv5MAHK89pFct_sg48DBrA4iBYBYUdNbGM8sziYbIYugV6rM4Yfpp7x7c",
    rating: 4,
    date: "3 months ago",
    comment:
      "A very comprehensive course. A little fast-paced in some sections, but overall I learned a lot. The community support was also great.",
  },
];

const CoursePurchaseScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const [teacher, setTeacher] = useState(null);
  const [grammarLessons, setGrammarLessons] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const linkData = {
        courseId: course?._id,
        amount: 2000,
        description: course?._id,
      };

      const response = await courseApi.buyCourse(linkData);
      console.log("Payment link response:", response);

      const checkoutUrl = response?.payOSLink || response?.payment?.payOSLink;

      if (checkoutUrl) {
        navigation.navigate("PaymentWebView", { url: checkoutUrl });
      } else {
        console.warn("Không có checkoutUrl");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
    setLoading(false);
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

        {/* View all feedback button */}
        <View style={styles.enrollSection}>
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={() => navigation.navigate("CourseReviews", { course })}
          >
            <Text style={styles.enrollButtonText}>View all feedback!</Text>
          </TouchableOpacity>
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
          onPress={() => handleBuyNow()}
          disabled={true}
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
    marginBottom: 30,
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

  // Enroll section
  enrollSection: {
    padding: 20,
  },
  enrollButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CoursePurchaseScreen;
