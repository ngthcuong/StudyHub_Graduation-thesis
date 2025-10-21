import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  Divider,
  InputLabel,
  OutlinedInput,
  Chip,
  Alert,
} from "@mui/material";
import { useCreateTestMutation } from "../../src/services/testApi";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string(),
  level: yup.string(),
  numQuestions: yup
    .number()
    .max(30, "Maximum is 30 questions")
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Required"),
  timeLimit: yup
    .number()
    .max(120, "Maximum is 120 minutes")
    .typeError("Must be a number")
    .positive("Must be positive")
    .required("Required"),
});

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

export default function ModalCreateCustomTest({
  open,
  handleClose,
  onSuccess,
}) {
  const [selectedGrammar, setSelectedGrammar] = useState([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState([]);
  const [selectedWeakSkills, setSelectedWeakSkills] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [manualError, setManualError] = useState("");

  const navigate = useNavigate();

  const [createTest] = useCreateTestMutation();

  const handleSelectGrammar = (event) => {
    const value = event.target.value;
    if (value.length <= 5) {
      setSelectedGrammar(value);
    }
  };

  const handleSelectVocabulary = (event) => {
    const value = event.target.value;
    if (value.length <= 5) {
      setSelectedVocabulary(value);
    }
  };

  const handleGoalChange = (goal, isChecked) => {
    if (isChecked) {
      // Thêm goal nếu được chọn
      setSelectedGoals((prevGoals) => [...prevGoals, goal]);
    } else {
      // Loại bỏ goal nếu bị bỏ chọn
      setSelectedGoals((prevGoals) => prevGoals.filter((g) => g !== goal));
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      level: "",
      toeicScore: "",
      weakSkills: [],
      goals: [],
      topics: [],
      difficulty: "Moderate",
      questionType: [],
      numQuestions: "",
      timeLimit: "",
    },
  });

  const onSubmit = async (data) => {
    // Payload từ Form (dữ liệu thô từ người dùng)
    const payload_form = {
      ...data,
      topics: [...selectedGrammar, ...selectedVocabulary],
      goals: selectedGoals,
      weakSkills: selectedWeakSkills,
    };

    if (selectedWeakSkills.length === 0) {
      setManualError("Please select at least one Weak Skill.");
      return;
    }

    const Topics = [...selectedGrammar, ...selectedVocabulary];
    if (Topics.length === 0) {
      setManualError("Please select at least one Grammar or Vocabulary Topic.");
      return;
    }

    // -------------------------------------------------------------------
    // Bắt đầu Logic Ánh xạ Dữ liệu sang Payload DB
    // -------------------------------------------------------------------

    // 1. Ánh xạ và Xử lý Logic
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
    const REQUIRED_DB_FIELDS = {
      // ⚠️ CẦN THAY BẰNG ID COURSE THỰC TẾ
      courseId: "000000000000000000000000",
      // Mặc định Question Type
      questionTypes: ["multiple_choice"],
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

    console.log(
      "✅ 1. Original Form Data (Sent to AI/Intermediate Payload):",
      payload_form
    );

    // Gọi API tạo Test với payload_DB
    let apiSuccess = false;

    try {
      const response = await createTest(payload_DB);
      console.log("API Response:", response);
      apiSuccess = true;

      navigate(`/test/${response?.data?.data?._id}/custom`, {
        state: {
          payloadForm: { ...payload_form, testId: response?.data?.data?._id },
        },
      });
    } catch (error) {
      console.error("Error creating test:", error);
    }

    if (apiSuccess && onSuccess) {
      onSuccess(payload_form);
    } else if (!apiSuccess) {
      console.log("Test creation failed. Modal remains open.");
    } else {
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="mx-auto mt-10 max-h-[90vh] w-[800px] overflow-y-auto rounded-2xl bg-white p-8 text-black shadow-lg">
        <div className="mb-6">
          <Typography variant="h6" fontWeight="bold" className="mb-2">
            Create Custom Test
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personalize your practice test to match your current level and
            goals.
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ================= Test Information ================= */}
          <div className="mb-8">
            <Typography
              variant="subtitle1"
              fontWeight="semibold"
              className="mb-4 border-b border-gray-200 pb-2"
            >
              Test Information
            </Typography>
            <div className="space-y-4">
              {/* <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Test Title"
                    fullWidth
                    margin="dense"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                  />
                )}
              /> */}
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="dense">
                    <Select {...field} displayEmpty>
                      <MenuItem value="" disabled>
                        Select your level
                      </MenuItem>
                      {levels.map((lvl) => (
                        <MenuItem key={lvl} value={lvl}>
                          {lvl}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {manualError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {manualError}
                </Alert>
              )}
              <Controller
                name="toeicScore"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Recent TOEIC Score"
                    fullWidth
                    margin="dense"
                    placeholder="e.g. 750"
                  />
                )}
              />
              {manualError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {manualError}
                </Alert>
              )}
            </div>
          </div>

          {/* ================= Test Focus ================= */}
          <div className="mb-8">
            <Typography
              variant="h6"
              fontWeight="semibold"
              className="mb-4 border-gray-200 pb-2"
            >
              Test Focus
            </Typography>
            <div className="space-y-6">
              {/* Weak Skills */}
              <div>
                <Typography className="mb-3 text-sm font-medium text-gray-700">
                  Weak Skills
                </Typography>

                <FormGroup className="grid grid-cols-2 gap-2">
                  {weakSkills.map((skill) => (
                    <FormControlLabel
                      key={skill}
                      control={
                        <Checkbox
                          checked={selectedWeakSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWeakSkills([
                                ...selectedWeakSkills,
                                skill,
                              ]);
                            } else {
                              setSelectedWeakSkills(
                                selectedWeakSkills.filter((s) => s !== skill)
                              );
                            }
                          }}
                        />
                      }
                      label={skill}
                    />
                  ))}
                </FormGroup>
              </div>

              {/* Goals */}
              <div>
                <Typography className="mb-3 text-sm font-medium text-gray-700">
                  Goals
                </Typography>
                <FormGroup className="grid grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <FormControlLabel
                      key={goal}
                      control={
                        <Checkbox
                          // ✅ Kết nối trạng thái với state selectedGoals
                          checked={selectedGoals.includes(goal)}
                          // ✅ Sử dụng hàm xử lý thay đổi
                          onChange={(e) =>
                            handleGoalChange(goal, e.target.checked)
                          }
                        />
                      }
                      label={goal}
                    />
                  ))}
                </FormGroup>
              </div>
              {/* Preferred Topics */}
              <div>
                <Typography className="pb-3 text-sm font-medium text-gray-700">
                  Preferred Topics
                </Typography>

                <div className="grid grid-cols-2 gap-6">
                  {/* Grammar Topics */}
                  <FormControl
                    fullWidth
                    disabled={!selectedWeakSkills.includes("Grammar")}
                  >
                    <InputLabel>
                      Grammar Topics ({selectedGrammar.length}/3)
                    </InputLabel>
                    <Select
                      multiple
                      value={selectedGrammar}
                      onChange={handleSelectGrammar}
                      input={<OutlinedInput label="Grammar Topics" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {grammarTopics.map((topic) => (
                        <MenuItem
                          key={topic}
                          value={topic}
                          disabled={
                            !selectedGrammar.includes(topic) &&
                            selectedGrammar.length >= 3
                          }
                        >
                          {topic}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Vocabulary Topics */}
                  <FormControl
                    fullWidth
                    disabled={!selectedWeakSkills.includes("Vocabulary")}
                  >
                    <InputLabel>
                      Vocabulary Topics ({selectedVocabulary.length}/3)
                    </InputLabel>
                    <Select
                      multiple
                      value={selectedVocabulary}
                      onChange={handleSelectVocabulary}
                      input={<OutlinedInput label="Vocabulary Topics" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {vocabularyTopics.map((topic) => (
                        <MenuItem
                          key={topic}
                          value={topic}
                          disabled={
                            !selectedVocabulary.includes(topic) &&
                            selectedVocabulary.length >= 3
                          }
                        >
                          {topic}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Difficulty ================= */}
          <div className="mb-8">
            <Typography className="mb-3 text-sm font-medium text-gray-700">
              Difficulty Level
            </Typography>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row className="gap-4">
                  <FormControlLabel
                    value="easier"
                    control={<Radio />}
                    label="Easier"
                  />
                  <FormControlLabel
                    value="same"
                    control={<Radio />}
                    label="Moderate"
                  />
                  <FormControlLabel
                    value="harder"
                    control={<Radio />}
                    label="Harder"
                  />
                </RadioGroup>
              )}
            />
          </div>

          <Divider className="my-6" />

          {/* ================= Test Settings ================= */}
          <div className="mb-8">
            <Typography
              variant="h6"
              fontWeight="semibold"
              className="mb-4 border-gray-200 pb-2"
            >
              Test Settings
            </Typography>

            <div className="space-y-6">
              {/* <div>
                <Typography className="mb-3 text-sm font-medium text-gray-700">
                  Question Type
                </Typography>
                <FormGroup row className="gap-4">
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Multiple Choice"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Fill in the Blanks"
                  />
                </FormGroup>
              </div> */}

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="numQuestions"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number" // ✅ thêm dòng này
                      label="Number of Questions"
                      fullWidth
                      margin="dense"
                      placeholder="e.g. 20"
                      error={!!errors.numQuestions}
                      helperText={errors.numQuestions?.message}
                      inputProps={{ min: 1 }} // ✅ tùy chọn: chỉ cho nhập >=1
                    />
                  )}
                />
                <Controller
                  name="timeLimit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Time Limit (minutes)"
                      fullWidth
                      margin="dense"
                      placeholder="e.g. 30"
                      error={!!errors.timeLimit}
                      helperText={errors.timeLimit?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* ================= Action Buttons ================= */}
          <Box className="mt-8 flex justify-between gap-4">
            <Button
              onClick={handleClose}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#1677ff",
                color: "#1677ff",
                py: 1.5,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1677ff",
                py: 1.5,
              }}
            >
              Create Test
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
