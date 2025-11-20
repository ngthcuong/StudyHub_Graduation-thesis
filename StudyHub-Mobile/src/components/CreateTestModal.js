import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Checkbox, RadioButton, Button, Chip } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import GrammarDropdown from "./GrammarDropdown";
import VocabularyDropdown from "./VocabularyDropdown";
import { testApi } from "../services/testApi";

import { useNavigation } from "@react-navigation/native";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const weakSkills = ["Grammar", "Vocabulary"];
const goals = [
  "Prepare for TOEIC exam",
  "Improve communication",
  "Practice grammar",
  "Expand vocabulary",
  "General English improvement",
];
const grammarTopics = [
  // 📘 Phần 1: Nền Tảng Cốt Lõi
  "Tenses - Present Simple",
  "Tenses - Present Continuous",
  "Tenses - Present Perfect",
  "Tenses - Present Perfect Continuous",
  "Tenses - Past Simple",
  "Tenses - Past Continuous",
  "Tenses - Past Perfect",
  "Tenses - Past Perfect Continuous",
  "Tenses - Future Simple (will / be going to)",
  "Tenses - Future Continuous",
  "Tenses - Future Perfect",
  "Word Types - Nouns",
  "Word Types - Verbs",
  "Word Types - Adjectives",
  "Word Types - Adverbs",
  "Word Types - Pronouns",
  "Word Types - Prepositions",
  "Word Types - Conjunctions",

  // 📗 Phần 2: Cấu Trúc Câu Nâng Cao
  "Passive Voice",
  "Clauses - Relative Clauses",
  "Clauses - Noun Clauses",
  "Clauses - Adverbial Clauses",
  "Conditional Sentences - Type 1",
  "Conditional Sentences - Type 2",
  "Conditional Sentences - Type 3",
  "Conditional Sentences - Mixed Type",
  "Comparisons - As...as",
  "Comparisons - Comparative",
  "Comparisons - Superlative",
  "Comparisons - Double Comparison (The more... the more...)",
  "Gerunds & Infinitives - V-ing after verbs",
  "Gerunds & Infinitives - To-V after verbs",
  "Gerunds & Infinitives - Both with meaning difference",

  // 📙 Phần 3: Các Chủ Điểm Đặc Thù & Bẫy Trong TOEIC
  "Subject-Verb Agreement",
  "Reported Speech",
  "Inversion",
  "Connectors & Transitions",
  "Participles (V-ing / V3 used as adjectives)",
  "Subjunctive Mood",
];
const vocabularyTopics = [
  // 📘 General Vocabulary
  "Common Everyday Vocabulary",
  "Collocations",
  "Idioms & Phrases",
  "Phrasal Verbs",
  "Synonyms & Antonyms",
  "Word Formation (Prefixes & Suffixes)",
  "Confusing Words (e.g. make/do, say/tell, bring/take)",

  // 📗 Academic & Test Vocabulary
  "Academic Vocabulary",
  "TOEIC Vocabulary",
  "IELTS Vocabulary",
  "Transition Words & Connectors",
  "Adjective + Noun / Verb + Noun Combinations",

  // 📙 Topic-based Vocabulary
  "Business English",
  "Office & Company Vocabulary",
  "Travel & Tourism",
  "Technology & IT Vocabulary",
  "Health & Medicine",
  "Education & Learning",
  "Environment & Nature",
  "Marketing & Sales",
  "Finance & Banking",
  "Customer Service",
  "Meetings & Presentations",

  // 📒 Communication Focus
  "Conversational English",
  "Social English Expressions",
  "Email & Professional Writing Vocabulary",
  "Telephone & Online Communication",
];

export default function ModalCreateCustomTest({ visible, onClose, onSubmit }) {
  const navigation = useNavigation();

  const [level, setLevel] = useState("");
  const [toeicScore, setToeicScore] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [difficulty, setDifficulty] = useState("moderate");
  const [questionType, setQuestionType] = useState("MCQ");
  const [selectedWeakSkills, setSelectedWeakSkills] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedGrammar, setSelectedGrammar] = useState([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleSelect = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetForm = () => {
    setLevel("");
    setToeicScore("");
    setNumQuestions("");
    setTimeLimit("");
    setDifficulty("moderate");
    setQuestionType("MCQ");
    setSelectedWeakSkills([]);
    setSelectedGoals([]);
    setSelectedGrammar([]);
    setSelectedVocabulary([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    // ===== Validation =====
    if (!level || !numQuestions || !timeLimit) {
      return Alert.alert("Missing Info", "Please fill in all required fields.");
    }
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 30) {
      return Alert.alert("Invalid Number", "Questions must be between 1-30.");
    }
    if (isNaN(timeLimit) || timeLimit < 5 || timeLimit > 120) {
      return Alert.alert("Invalid Time", "Time must be between 5-120 minutes.");
    }
    if (selectedWeakSkills.length === 0) {
      return Alert.alert(
        "Select Weak Skills",
        "Choose at least one weak skill."
      );
    }
    if (selectedGoals.length === 0) {
      return Alert.alert("Select Goals", "Choose at least one goal.");
    }

    const payload_form = {
      level,
      toeicScore,
      numQuestions: parseInt(numQuestions),
      timeLimit: parseInt(timeLimit),
      difficulty,
      questionType,
      weakSkills: selectedWeakSkills,
      goals: selectedGoals,
      topics: [...selectedGrammar, ...selectedVocabulary],
    };

    const allTopics = payload_form.topics;
    const topicString =
      allTopics.length > 0 ? allTopics.join(", ") : "General English";

    const primarySkill = payload_form.weakSkills.includes("Grammar")
      ? "grammar"
      : payload_form.weakSkills.includes("Vocabulary")
      ? "vocabulary"
      : "grammar"; // Mặc định là 'grammar'

    // Dùng level từ form để gợi ý Exam Type, hoặc hardcode
    const examType = "TOEIC";

    // 2. Điền các trường BẮT BUỘC THIẾU cho DB (Cần giá trị giả định hoặc thực tế)
    let type = ["multiple_choice"];
    if (payload_form.questionType === "FIB") {
      type = ["fill_in_blank"];
    } else if (payload_form.questionType === "MCQ") {
      type = ["multiple_choice"];
    } else {
      type = ["multiple_choice"];
    }
    const REQUIRED_DB_FIELDS = {
      // ⚠️ CẦN THAY BẰNG ID COURSE THỰC TẾ
      courseId: "000000000000000000000000",
      // Mặc định Question Type
      questionTypes: type,
      // Giá trị mặc định
      passingScore: 7,
      isTheLastTest: false,
    };

    // 3. Xây dựng Payload DB cuối cùng
    const payload_DB = {
      // Ánh xạ từ Form
      title:
        payload_form.title ||
        `Custom Test (${payload_form.level}) - ${primarySkill}`,
      description:
        payload_form.description ||
        `Personalized test for level ${payload_form.level}.`,
      numQuestions: parseInt(payload_form.numQuestions),
      durationMin: parseInt(payload_form.timeLimit),

      // Các trường đã chuyển đổi/xử lý
      topic: topicString,
      skill: primarySkill,
      examType: examType,

      // Các trường bắt buộc đã điền
      ...REQUIRED_DB_FIELDS,

      // Thêm các thông tin phụ nếu cần (như level, toeicScore...)
      level: payload_form.level,
      toeicScore: payload_form.toeicScore,
      difficulty: payload_form.difficulty,
    };

    // Gọi API tạo Test với payload_DB
    let apiSuccess = false;

    try {
      const response = await testApi.createTest(payload_DB);
      console.log("API Response:", response);
      apiSuccess = true;
      if (payload_form.questionType === "FIB") {
        console.log("Navigating to FillExerciseCustom");
      } else if (payload_form.questionType === "MCQ") {
        navigation.navigate("MultilExerciseCustom", {
          payloadForm: { ...payload_form, testId: response?.data?._id },
        });
      } else {
        console.warn("Unknown question type");
      }
    } catch (error) {
      console.error("API Error:", error);
    }

    // onSubmit && onSubmit(payload_form);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Create Custom Test</Text>
          <Text style={styles.subtitle}>
            Personalize your test to match your goals and skills.
          </Text>

          {/* Level */}
          <Text style={styles.label}>Level</Text>
          <ScrollView horizontal>
            {levels.map((lvl) => (
              <Chip
                key={lvl}
                selected={level === lvl}
                onPress={() => setLevel(lvl)}
                style={styles.chip}
              >
                {lvl}
              </Chip>
            ))}
          </ScrollView>

          {/* TOEIC Score */}
          <Text style={styles.label}>TOEIC Score</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 750"
            keyboardType="numeric"
            value={toeicScore}
            onChangeText={setToeicScore}
          />

          {/* Weak Skills */}
          <Text style={styles.label}>Weak Skills</Text>
          {weakSkills.map((skill) => (
            <Checkbox.Item
              key={skill}
              label={skill}
              status={
                selectedWeakSkills.includes(skill) ? "checked" : "unchecked"
              }
              onPress={() =>
                toggleSelect(skill, selectedWeakSkills, setSelectedWeakSkills)
              }
            />
          ))}

          {/* Goals */}
          <Text style={styles.label}>Goals</Text>
          {goals.map((goal) => (
            <Checkbox.Item
              key={goal}
              label={goal}
              status={selectedGoals.includes(goal) ? "checked" : "unchecked"}
              onPress={() =>
                toggleSelect(goal, selectedGoals, setSelectedGoals)
              }
            />
          ))}

          {/* Topics */}
          {selectedWeakSkills.includes("Grammar") && (
            <GrammarDropdown
              grammarTopics={grammarTopics}
              selectedGrammar={selectedGrammar}
              setSelectedGrammar={setSelectedGrammar}
            />
          )}

          {selectedWeakSkills.includes("Vocabulary") && (
            <VocabularyDropdown
              vocabularyTopics={vocabularyTopics}
              selectedVocabulary={selectedVocabulary}
              setSelectedVocabulary={setSelectedVocabulary}
            />
          )}

          {/* Difficulty */}
          <Text style={styles.label}>Difficulty</Text>
          <RadioButton.Group
            onValueChange={(val) => setDifficulty(val)}
            value={difficulty}
          >
            <RadioButton.Item label="Easier" value="easier" />
            <RadioButton.Item label="Moderate" value="same" />
            <RadioButton.Item label="Harder" value="harder" />
          </RadioButton.Group>

          {/* Question Type */}
          <Text style={styles.label}>Question Type</Text>
          <RadioButton.Group
            onValueChange={(val) => setQuestionType(val)}
            value={questionType}
          >
            <RadioButton.Item label="Multiple Choice" value="MCQ" />
            <RadioButton.Item label="Fill in the Blank" value="FIB" />
          </RadioButton.Group>

          {/* Test Settings */}
          <Text style={styles.label}>
            Number of Questions (Questions must be between 1-30.)
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 20"
            value={numQuestions}
            onChangeText={setNumQuestions}
          />
          <Text style={styles.label}>
            Time Limit (minutes) (Time must be between 5-120 minutes.)
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 30"
            value={timeLimit}
            onChangeText={setTimeLimit}
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCreate}
              style={styles.createButton}
            >
              Create Test
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
  },
  label: {
    marginTop: 16,
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  chip: {
    marginRight: 6,
    marginVertical: 4,
  },
  topicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  topicChip: {
    margin: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  dropdownText: {
    fontSize: 16,
    color: "#111827",
  },
});
