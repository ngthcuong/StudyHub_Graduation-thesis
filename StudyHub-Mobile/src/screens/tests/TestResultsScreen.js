import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert, // Dùng để mô phỏng hành động Button
} from "react-native";
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  ProgressBar,
  List,
  useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Hoặc bất kỳ bộ icon nào bạn thích
import { useRoute } from "@react-navigation/native";
import ProgressSpeedCard from "../../components/ProgressSpeedCard";
import CourseCard from "../../components/CourseCard";
import { courseApi } from "../../services/courseApi";
import { useSelector } from "react-redux";
import { testApi } from "../../services/testApi";

const scoreRanges = {
  "TOEIC 10-250": ["TOEIC 10-250", "TOEIC 255-400"],
  "TOEIC 255-400": ["TOEIC 255-400"],
  "TOEIC 405-600": ["TOEIC 405-600"],
  "TOEIC 605-780": ["TOEIC 605-780"],
  "TOEIC 785-900": ["TOEIC 785-900"],
  "TOEIC 905-990": ["TOEIC 905-990"],
};

// --- Hàm tiện ích (Utility Functions) ---

const formatTime = (s) => {
  console.log("Formatting time:", s);

  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
};

// --- Component Chính (Main Component) ---

const TestResultsScreen = ({ navigation }) => {
  const route = useRoute();
  const theme = useTheme(); // Lấy theme để custom style
  const resultData = route.params?.resultData; // Lấy dữ liệu từ route params
  const completedTests = route.params?.completedTests || false;
  const user = useSelector((state) => state.auth.user);

  const [recommendedCourses, setRecommendedCourses] = useState([]);

  console.log("TestResultsScreen received resultData:", resultData);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAllCourses();

      const resCourse = await courseApi.getMyCourses(user._id);
      const filteredCourse = res.filter(
        (course2) =>
          !resCourse?.courses?.some((course1) => course1._id === course2._id)
      );

      let recommended = [];
      if (
        resultData.attemptDetail.analysisResult.post_test_level ===
        "Unknown".trim()
      ) {
        recommended = resultData?.attemptDetail.analysisResult.current_level;
      } else {
        recommended = resultData?.attemptDetail.analysisResult.post_test_level;
      }
      const filtered = filteredCourse.filter((course) =>
        scoreRanges[recommended].includes(
          `${course.courseType} ${course.courseLevel}`
        )
      );

      setRecommendedCourses(filtered);

      // update attempt pass
      if (resultData.attemptDetail.totalScore >= 7) {
        await testApi.updateAttempt({
          attemptId: resultData.attempt._id,
          updateData: {
            isPassed: true,
          },
        });
      }

      // take test
      const testDetailRes = await testApi.getTestById(
        resultData.attempt.testId
      );
    } catch (error) {
      console.error("Error fetching courses for recommendations:", error);
    }
  };

  console.log("Recommended courses based on test result:", recommendedCourses);

  const [tab, setTab] = useState(0);

  // --- Xử lý dữ liệu (Data Handling) ---

  // Kiểm tra và xử lý dữ liệu từ cả hai nguồn khác nhau
  let analysisResult,
    timeTaken = 0;

  if (!resultData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text }}>
            Loading test result or data is missing...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Case 1: Dữ liệu từ test submission (có attemptDetail)
  if (resultData.attemptDetail && resultData.attemptDetail.analysisResult) {
    analysisResult = resultData.attemptDetail.analysisResult;
    const startTime = new Date(resultData.attemptDetail.startTime);
    const endTime = new Date(resultData.attemptDetail.endTime);
    timeTaken = Math.floor((endTime - startTime) / 1000);
  }
  // Case 2: Dữ liệu từ CompletedTestsScreen (có analysisResult trực tiếp)
  else if (resultData.analysisResult) {
    analysisResult = resultData.analysisResult;
    // Tính thời gian từ durationMin nếu có
    timeTaken = (resultData.durationMin || 0) * 60;
  } else {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text }}>
            Invalid test result data format.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Lấy answers từ dữ liệu (có thể không có trong case CompletedTestsScreen)
  const answers = resultData.attemptDetail?.answers || [];

  // Destructuring với giá trị mặc định để tránh lỗi
  const {
    total_questions = 0,
    per_question: analysisPerQuestion = [],
    skill_summary = [],
    weak_topics = [],
    recommendations = [],
    personalized_plan = {},
  } = analysisResult;

  // Kết hợp dữ liệu từ `analysisPerQuestion` và `answers`
  const per_question = analysisPerQuestion.map((item, idx) => ({
    ...item,
    user_answer: answers[idx]?.selectedOptionText || item.user_answer,
    question: answers[idx]?.questionText || item.question,
  }));

  // Tính toán stats
  const correctCount = per_question.filter((q) => q.correct).length;
  const incorrectCount = total_questions - correctCount;
  const scorePercent = total_questions
    ? Math.round((correctCount / total_questions) * 100)
    : 0;

  const resultStats = {
    score: scorePercent,
    correct: correctCount,
    incorrect: incorrectCount,
    total: total_questions,
    time: timeTaken,
  };

  const correctAnswers = per_question
    .filter((q) => q && q.correct === true)
    .map((q) => ({
      question: q.question,
      answer: q.expected_answer || "No answer",
      type: `${q.skill || "Unknown"} - ${q.topic || "Unknown topic"}`,
      explain: q.explain || "No explanation",
    }));

  const incorrectAnswers = per_question
    .filter((q) => q && q.correct === false)
    .map((q) => ({
      question: q.question,
      yourAnswer: q.user_answer || "No answer",
      correctAnswer: q.expected_answer || "No answer",
      type: `${q.skill || "Unknown"} - ${q.topic || "Unknown topic"}`,
      explain: q.explain || "No explanation",
    }));

  const avgTime = total_questions ? Math.round(timeTaken / total_questions) : 0;

  // --- Components con (Sub Components) ---

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Card style={[styles.statCard, { borderTopColor: color }]}>
      <Card.Content>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Paragraph style={styles.statSubtitle}>{subtitle}</Paragraph>
      </Card.Content>
    </Card>
  );

  const getProgressBarColor = (accuracy) => {
    if (accuracy >= 70) return theme.colors.success; // green
    if (accuracy >= 40) return theme.colors.warning; // orange/yellow
    return theme.colors.error; // red
  };

  // Custom colors cho Paper v5 theme
  const customColors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  // --- JSX Rendering ---

  console.log(personalized_plan.weekly_goals);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Title style={styles.title}>Test Results</Title>
        <Paragraph style={styles.subtitle}>
          Here's how you performed on your recent test
        </Paragraph>

        {/* Thông tin tổng quan (Overall Stats) */}
        <View style={styles.statsGrid}>
          <StatCard
            value={`${resultStats.score}%`}
            subtitle={`${resultStats.correct} out of ${resultStats.total} correct`}
            icon="check-circle"
            color={customColors.success}
          />
          <StatCard
            value={resultStats.correct}
            subtitle="Questions answered correctly"
            icon="check-circle"
            color={customColors.success}
          />
          <StatCard
            value={resultStats.incorrect}
            subtitle="Questions answered incorrectly"
            icon="close-circle"
            color={customColors.error}
          />
          <StatCard
            value={formatTime(resultStats.time)}
            subtitle={`${avgTime}s average per question`}
            icon="clock-time-four"
            color={customColors.info}
          />
        </View>

        {/* Skill Summary */}
        {skill_summary.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Skill Performance</Title>
              {skill_summary.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text>{skill.skill}</Text>
                    <Text>
                      {skill.correct}/{skill.total} ({skill.accuracy}%)
                    </Text>
                  </View>
                  <ProgressBar
                    progress={(skill.accuracy || 0) / 100}
                    color={getProgressBarColor(skill.accuracy || 0)}
                    style={styles.progressBar}
                  />
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Weak Topics */}
        {weak_topics.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Areas for Improvement</Title>
              <View style={styles.chipContainer}>
                {weak_topics.map((topic, idx) => (
                  <Chip key={idx} icon="alert-octagon" mode="outlined">
                    {topic}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Tabs - Sử dụng Buttons để mô phỏng Tabs */}
        <Card style={styles.card}>
          <View style={styles.tabBar}>
            {["Correct Answers", "Incorrect Answers", "Learning Plan"].map(
              (label, index) => (
                <Button
                  key={index}
                  mode={tab === index ? "contained" : "text"}
                  onPress={() => setTab(index)}
                  style={styles.tabButton}
                  labelStyle={styles.tabLabel}
                  compact
                >
                  {label}
                </Button>
              )
            )}
          </View>
          <Divider />
          <Card.Content>
            {/* Tab 0: Correct Answers */}
            {tab === 0 && (
              <View>
                <Title style={styles.tabContentTitle}>
                  Questions You Got Right
                </Title>
                <Paragraph style={styles.tabContentSubtitle}>
                  Great job on these questions! You demonstrated strong
                  knowledge in these areas.
                </Paragraph>
                {correctAnswers.length > 0 ? (
                  correctAnswers.map((item, idx) => (
                    <Card
                      key={idx}
                      style={[
                        styles.answerCard,
                        {
                          borderLeftColor: customColors.success,
                          backgroundColor: "#e8f5e9",
                        },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.answerHeader}>
                          <Chip
                            icon="check-circle"
                            textStyle={{ color: customColors.success }}
                            style={{ backgroundColor: "transparent" }}
                          >
                            CORRECT
                          </Chip>
                          <Chip
                            icon="information"
                            style={{ marginLeft: 8, flexShrink: 1 }}
                            textStyle={{ flexShrink: 1 }}
                            compact
                          >
                            {item.type}
                          </Chip>
                        </View>
                        <Paragraph style={styles.questionText}>
                          {item.question}
                        </Paragraph>
                        <Paragraph style={styles.answerDetail}>
                          <Text style={{ fontWeight: "bold" }}>
                            YOUR ANSWER:{" "}
                          </Text>
                          <Text
                            style={{
                              color: customColors.success,
                              fontWeight: "bold",
                            }}
                          >
                            {item.answer}
                          </Text>
                        </Paragraph>
                        <Paragraph style={styles.answerDetail}>
                          <Text style={{ fontWeight: "bold" }}>EXPLAIN: </Text>
                          <Text>{item.explain}</Text>
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  ))
                ) : (
                  <Paragraph style={styles.emptyText}>
                    No correct answers in this test. Keep practicing!
                  </Paragraph>
                )}
              </View>
            )}

            {/* Tab 1: Incorrect Answers */}
            {tab === 1 && (
              <View>
                <Title style={styles.tabContentTitle}>
                  Questions to Review
                </Title>
                <Paragraph style={styles.tabContentSubtitle}>
                  These questions need some attention. Review the correct
                  answers to improve your understanding.
                </Paragraph>
                {incorrectAnswers.length > 0 ? (
                  incorrectAnswers.map((item, idx) => (
                    <Card
                      key={idx}
                      style={[
                        styles.answerCard,
                        {
                          borderLeftColor: customColors.error,
                          backgroundColor: "#fbeaea",
                        },
                      ]}
                    >
                      <Card.Content>
                        <View style={styles.answerHeader}>
                          <Chip
                            icon="close-circle"
                            textStyle={{ color: customColors.error }}
                            style={{ backgroundColor: "transparent" }}
                          >
                            INCORRECT
                          </Chip>
                          <Chip
                            icon="information"
                            style={{ marginLeft: 8, flexShrink: 1 }}
                            textStyle={{ flexShrink: 1 }}
                            compact
                          >
                            {item.type}
                          </Chip>
                        </View>
                        <Paragraph style={styles.questionText}>
                          {item.question}
                        </Paragraph>
                        <Paragraph style={styles.answerDetail}>
                          <Text style={{ fontWeight: "bold" }}>
                            YOUR ANSWER:{" "}
                          </Text>
                          <Text
                            style={{
                              color: customColors.error,
                              fontWeight: "bold",
                            }}
                          >
                            {item.yourAnswer}
                          </Text>
                        </Paragraph>
                        <Paragraph style={styles.answerDetail}>
                          <Text style={{ fontWeight: "bold" }}>
                            CORRECT ANSWER:{" "}
                          </Text>
                          <Text
                            style={{
                              color: customColors.success,
                              fontWeight: "bold",
                            }}
                          >
                            {item.correctAnswer}
                          </Text>
                        </Paragraph>
                        <Paragraph style={styles.answerDetail}>
                          <Text style={{ fontWeight: "bold" }}>EXPLAIN: </Text>
                          <Text>{item.explain}</Text>
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  ))
                ) : (
                  <Paragraph style={styles.emptyText}>
                    All questions were answered correctly!
                  </Paragraph>
                )}
              </View>
            )}

            {/* Tab 2: Learning Plan */}
            {tab === 2 && (
              <View>
                <Title style={styles.tabContentTitle}>
                  Personalized Learning Plan
                </Title>

                {/* Overall Goal */}
                {/* <Card
                  style={[
                    styles.planCard,
                    { backgroundColor: "#e3f2fd", borderColor: "#90caf9" },
                  ]}
                >
                  <Card.Content>
                    <View style={styles.planHeader}>
                      <Icon
                        name="trending-up"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <View style={{ marginLeft: 8 }}>
                        <Text style={styles.planTitle}>Overall Goal</Text>
                        <Paragraph style={styles.planSubtitle}>
                          {personalized_plan.overall_goal}
                        </Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card> */}

                {/* Progress Speed */}
                <ProgressSpeedCard personalized_plan={personalized_plan} />

                {/* General Recommendations */}
                {recommendations.length > 0 && (
                  <Card style={styles.planCard}>
                    <Card.Content>
                      <Title style={styles.planTitle}>
                        General Recommendations
                      </Title>
                      <List.Section>
                        {recommendations.map((rec, idx) => (
                          <List.Item
                            key={idx}
                            title={rec}
                            left={() => (
                              <List.Icon
                                icon="book-open-page-variant"
                                color={theme.colors.primary}
                              />
                            )}
                            style={{ paddingVertical: 0 }}
                            titleNumberOfLines={2}
                          />
                        ))}
                      </List.Section>
                    </Card.Content>
                  </Card>
                )}

                {/* Weekly Study Plan (Accordion) */}
                {personalized_plan.weekly_goals &&
                  personalized_plan.weekly_goals.length > 0 && (
                    <View style={{ marginTop: 16 }}>
                      <Title style={styles.cardTitle}>
                        Weekly Study Plan (
                        {personalized_plan.weekly_goals.length} weeks)
                      </Title>
                      {personalized_plan.weekly_goals.map((week, idx) => (
                        <List.Accordion
                          key={idx}
                          title={week.topic || "No topic specified"}
                          description={`Week ${week.week || idx + 1}`}
                          left={(props) => (
                            <List.Icon {...props} icon="calendar-outline" />
                          )}
                          right={() => (
                            <Chip style={{ marginRight: 10 }} compact>
                              {week.hours || 0}h
                            </Chip>
                          )}
                          style={styles.accordion}
                          titleStyle={styles.accordionTitle}
                          descriptionStyle={styles.accordionDesc}
                        >
                          {/* Activities/Study Methods */}
                          {week.study_methods &&
                            week.study_methods.length > 0 && (
                              <View style={styles.accordionDetail}>
                                <Text style={styles.detailHeader}>
                                  Activities:
                                </Text>
                                {week.study_methods.map((method, methodIdx) => (
                                  <List.Item
                                    key={methodIdx}
                                    title={method}
                                    left={() => (
                                      <List.Icon icon="file-document-outline" />
                                    )}
                                    titleStyle={styles.listItemTitle}
                                    style={{
                                      paddingVertical: 0,
                                      paddingLeft: 20,
                                    }}
                                  />
                                ))}
                              </View>
                            )}

                          {/* Materials */}
                          {week.materials && week.materials.length > 0 && (
                            <View style={styles.accordionDetail}>
                              <Text style={styles.detailHeader}>
                                Recommended Materials:
                              </Text>
                              <View style={styles.chipContainer}>
                                {week.materials.map((material, matIdx) => (
                                  <Chip
                                    key={matIdx}
                                    icon="folder-video"
                                    style={{ margin: 4 }}
                                    mode="outlined"
                                    compact
                                  >
                                    {material?.title}
                                  </Chip>
                                ))}
                              </View>
                            </View>
                          )}
                        </List.Accordion>
                      ))}
                    </View>
                  )}

                {/* Recommended Study Methods */}
                {personalized_plan.study_methods &&
                  personalized_plan.study_methods.length > 0 && (
                    <Card style={styles.planCard}>
                      <Card.Content>
                        <Title style={styles.cardTitle}>
                          Recommended Study Methods
                        </Title>
                        {personalized_plan.study_methods.map((method, idx) => (
                          <View key={idx} style={styles.methodItem}>
                            <Icon
                              name="play-circle-outline"
                              size={20}
                              color={theme.colors.primary}
                            />
                            <Paragraph style={{ marginLeft: 8, flex: 1 }}>
                              {method}
                            </Paragraph>
                          </View>
                        ))}
                      </Card.Content>
                    </Card>
                  )}

                {/* Notes */}
                {personalized_plan.notes && (
                  <Card
                    style={[
                      styles.planCard,
                      { backgroundColor: "#fffde7", borderColor: "#ffe082" },
                    ]}
                  >
                    <Card.Content>
                      <Title style={styles.planTitle}>Important Notes</Title>
                      <Paragraph style={styles.planSubtitle}>
                        {personalized_plan.notes}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Recommend course */}
        <View style={styles.containerRecommend}>
          <Text style={styles.titleRecommend}>Recommended Courses for You</Text>
          <Text style={styles.subtitleRecommend}>
            Based on your test results, we suggest these courses to help you
            improve.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardContainerRecommend}
          >
            {recommendedCourses?.map((course, index) => {
              return (
                <View key={index} style={styles.cardWrapperRecommend}>
                  <CourseCard
                    course={course}
                    variant="market"
                    navigation={navigation}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        {!completedTests && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() =>
                Alert.alert("Action", "Retake Test functionality triggered.")
              }
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              icon="redo"
            >
              Retake Test
            </Button>
            <Button
              mode="outlined"
              onPress={() =>
                navigation.navigate("Tests", { screen: "AssessmentList" })
              }
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
              icon="format-list-bulleted"
            >
              View All Tests
            </Button>

            {resultData.certificate && (
              <Button
                mode="contained"
                color={customColors.success} // Màu xanh lá cây
                onPress={() =>
                  navigation.navigate("Profile", {
                    screen: "CertificateDetail",
                    params: { item: resultData.certificate },
                  })
                }
                style={[
                  styles.actionButton,
                  { backgroundColor: customColors.success, marginBottom: 30 },
                ]}
                labelStyle={styles.actionButtonLabel}
                icon="rocket"
              >
                View certificates obtained
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // Giống bg-gray-50
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#22223b", // Giống #22223b
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b", // Giống #64748b
    marginBottom: 20,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%", // 2 cột trên mobile
    marginBottom: 10,
    borderRadius: 12,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748b",
  },

  // General Card
  card: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Skill Summary
  skillItem: {
    marginBottom: 15,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  skillText: {
    fontWeight: "600",
  },
  skillAccuracy: {
    color: "#64748b",
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },

  // Weak Topics
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -4,
  },

  // Tabs
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 0,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: {
    textTransform: "none",
    fontSize: 13,
  },
  tabContentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tabContentSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 30,
    color: "#64748b",
  },

  // Answer Card
  answerCard: {
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowOpacity: 0, // Bỏ shadow cho card chi tiết câu hỏi để trông nhẹ nhàng hơn
    elevation: 0,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  answerDetail: {
    fontSize: 14,
    marginTop: 4,
  },

  // Learning Plan
  planCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    shadowOpacity: 0,
    elevation: 0,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  planSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },

  // Accordion (Weekly Plan)
  accordion: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 8,
  },
  accordionTitle: {
    fontWeight: "600",
    fontSize: 15,
  },
  accordionDesc: {
    fontSize: 12,
  },
  accordionDetail: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    backgroundColor: "#f7f7f7",
  },
  detailHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  listItemTitle: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexWrap: "wrap",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "column", // Thay đổi thành column trên mobile để tránh tràn
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    marginVertical: 4,
    borderRadius: 8,
  },
  actionButtonLabel: {
    fontWeight: "600",
    textTransform: "none",
  },

  // recommended courses
  containerRecommend: {
    marginTop: 32,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleRecommend: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitleRecommend: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  cardContainerRecommend: {
    flexDirection: "row",
    gap: 16,
  },
  cardWrapperRecommend: {
    width: 200, // You can adjust the card width as per the design
  },
});

export default TestResultsScreen;
