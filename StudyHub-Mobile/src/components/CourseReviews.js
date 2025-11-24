import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { reviewApi } from "../services/reviewApi";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const Star = ({ type }) => {
  // type: "full" | "half" | "empty"
  let name = "star-outline";
  if (type === "full") name = "star";
  else if (type === "half") name = "star-half";

  return (
    <Ionicons
      name={name}
      size={20}
      color={type !== "empty" ? "#f59e0b" : "#d1d5db"}
    />
  );
};

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} type="full" />);
    } else if (i - rating < 1) {
      stars.push(<Star key={i} type="half" />);
    } else {
      stars.push(<Star key={i} type="empty" />);
    }
  }
  return stars;
};

export default function CourseReviews({ route, navigation }) {
  const { course } = route.params;

  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchRating();
  }, []);

  const fetchReviews = async () => {
    // Call API to get reviews for the course
    const allReviewByCourse = await reviewApi.getReviewsByCourse(course?._id);
    setReviews(allReviewByCourse?.reviews);
  };

  const fetchRating = async () => {
    // Call API to get rating summary for the course
    const ratingStats = await reviewApi.getCourseRatingStats(course?._id);
    setRatingStats(ratingStats?.stats);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Course Details</Text>
      </View>

      {/* Rating Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.averageRating}>{ratingStats?.averageRating}</Text>
        <View style={styles.starsRow}>
          {renderStars(ratingStats?.averageRating)}
        </View>
        <Text style={styles.ratingsText}>
          based on {reviews?.length} ratings
        </Text>

        <View style={styles.containerProgressBar}>
          {Object.keys(ratingStats?.ratingDistribution || {})
            .sort((a, b) => b - a) // hiển thị 5 → 1
            .map((star) => {
              const percentage = ratingStats?.ratingDistribution[star];
              return (
                <View key={star} style={styles.row}>
                  <Text style={styles.starLabel}>{star}</Text>
                  <View style={styles.barBackground}>
                    <View
                      style={[styles.barFill, { width: `${percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.percentage}>{percentage}%</Text>
                </View>
              );
            })}
        </View>
      </View>

      {/* Reviews List */}
      {reviews.map((review) => (
        <View key={review._id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image
              source={{
                uri:
                  review?.user?.avatarUrl ||
                  "https://picsum.photos/id/237/200/300",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.reviewName}>{review?.user?.fullName}</Text>
              <Text style={styles.reviewDate}>
                {review.date ||
                  new Date(review.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} type={i < review.rating ? "full" : "empty"} />
            ))}
          </View>
          <Text style={styles.reviewComment}>{review?.content}</Text>
        </View>
      ))}

      {/* View All Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View All Reviews</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
    padding: 16,
  },
  header: {
    paddingVertical: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 12,
    alignItems: "center",
  },
  averageRating: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  star: {
    fontSize: 20,
    color: "#d1d5db", // gray
  },
  starFilled: {
    color: "#f59e0b", // amber
  },
  ratingsText: {
    fontSize: 14,
    color: "#6b7280",
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  reviewName: {
    fontWeight: "600",
    color: "#111827",
  },
  reviewDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  reviewComment: {
    marginTop: 4,
    color: "#374151",
  },
  button: {
    backgroundColor: "#258cf4",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // progess bar styles
  containerProgressBar: {
    flex: 1,
    minWidth: 200,
    maxWidth: 400,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starLabel: {
    width: 20,
    fontSize: 12,
    color: "#1f2937", // slate-800
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb", // slate-200
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#258cf4", // primary
    borderRadius: 4,
  },
  percentage: {
    width: 40,
    fontSize: 12,
    color: "#6b7280", // slate-500
    textAlign: "right",
  },
});
