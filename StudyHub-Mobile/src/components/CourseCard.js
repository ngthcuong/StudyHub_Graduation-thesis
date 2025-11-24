import { CommonActions } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const CourseCard = ({ course, variant, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Courses" }, { name: "Tests" }],
          })
        );
      }}
    >
      <Image source={{ uri: course?.thumbnailUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{course?.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {course?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: 200, // You can adjust the width
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 120, // You can adjust the height
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
  },
});

export default CourseCard;
