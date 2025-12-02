import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CourseListLessons({ navigation, route }) {
  const { courseId, lesson } = route.params;

  console.log("Course ID:", courseId);
  console.log("Lesson Data:", lesson?.exercises);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Section Header */}
        <Text style={styles.sectionHeader}>{lesson?.title}</Text>

        {lesson?.parts?.map((part, index) => {
          let icon = "play-circle";
          if (part?.contentType === "text") {
            icon = "description";
          } else if (part?.contentType === "video") {
            icon = "play-circle";
          }

          return (
            <LessonItem
              key={index}
              title={part?.title}
              icon={icon}
              partId={part?._id}
              navigation={navigation}
            />
          );
        })}

        {/* Quiz */}
        {lesson?.exercises.map((exercise, index) => {
          return (
            <LessonItem
              title={exercise?.title || `Quiz ${index + 1}`}
              icon="quiz"
              completed={exercise?.isPassed}
              exerciseId={exercise?._id}
              navigation={navigation}
              lesson={lesson}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

/* Component Lesson Item */
function LessonItem({
  icon,
  title,
  completed,
  partId,
  exerciseId,
  navigation,
  lesson,
}) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (partId) {
          navigation.navigate("CourseTextScreen", { partId: partId });
        } else if (exerciseId) {
          navigation.navigate("CourseTest", {
            lesson: lesson,
          });
        }
      }}
    >
      {/* Icon Left */}
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name={icon}
          size={28}
          color="#258cf4"
          style={{ opacity: 1 }}
        />
      </View>

      {/* Text Content */}
      <View style={styles.itemTextWrapper}>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>

      {/* Status Icon */}
      <View>
        {completed ? (
          <MaterialIcons name="check-circle" size={28} color="green" />
        ) : (
          <MaterialIcons name="radio-button-unchecked" size={28} color="#999" />
        )}
      </View>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
  },
  topBar: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f7f8",
  },
  icon: {
    color: "#555",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    backgroundColor: "rgba(37,140,244,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginRight: 12,
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
