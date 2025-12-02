import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { courseApi } from "../../services/courseApi";
import RenderHtml from "react-native-render-html";

export default function CourseTextScreen({ navigation, route }) {
  const { partId } = route.params;
  const [partContent, setPartContent] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    FetchPartContent(partId);
  }, [partId]);

  const FetchPartContent = async (id) => {
    const response = await courseApi.getPartGrammarLessonsById(id);
    setPartContent(response?.data);
  };

  const htmlContent = partContent?.content || "<p>No content available.</p>";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Title */}
        <View style={styles.cardWrapper}>
          <RenderHtml
            contentWidth={width}
            source={{
              html: htmlContent,
            }}
            tagsStyles={{
              h1: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
              h2: { fontSize: 22, fontWeight: "700", marginVertical: 6 },
              h3: { fontSize: 18, fontWeight: "600", marginVertical: 4 },
              p: {
                fontSize: 16,
                lineHeight: 22,
                marginBottom: 4,
                color: "#444",
              },
              strong: { fontWeight: "700" },
              a: { color: "#258cf4", textDecorationLine: "underline" },
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = "#258cf4";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
  },

  /* HEADER */
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    backgroundColor: "#f5f7f8",
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    paddingRight: 40,
  },

  /* CONTENT */
  title: {
    fontSize: 32,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 24,
    color: "#111",
  },
  bodyText: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    lineHeight: 22,
    color: "#555",
  },

  /* CARD */
  cardWrapper: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  cardText: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },

  /* LIST RULES */
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    color: "#111",
  },
  listWrapper: {
    paddingHorizontal: 16,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginTop: 6,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },

  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },

  /* TAKEAWAYS */
  takeawayWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 6,
  },
  takeawayItem: {
    fontSize: 15,
    color: "#444",
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#f5f7f8",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
