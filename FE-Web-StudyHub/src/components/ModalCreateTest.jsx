import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  Backdrop,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Close as CloseIcon, Star as StarIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreateTestMutation,
  useGenerateTestQuestionsMutation,
} from "../services/testApi";
import { useGetCoursesQuery } from "../services/courseApi";
import {
  useGetLessonsByCourseIdMutation,
  useAddTestToLessonMutation,
} from "../services/grammarLessonApi";

const grammarTopics = [
  { value: "Tenses - Present Simple", label: "Tenses - Present Simple" },
  {
    value: "Tenses - Present Continuous",
    label: "Tenses - Present Continuous",
  },
  { value: "Tenses - Present Perfect", label: "Tenses - Present Perfect" },
  {
    value: "Tenses - Present Perfect Continuous",
    label: "Tenses - Present Perfect Continuous",
  },
  { value: "Tenses - Past Simple", label: "Tenses - Past Simple" },
  { value: "Tenses - Past Continuous", label: "Tenses - Past Continuous" },
  { value: "Tenses - Past Perfect", label: "Tenses - Past Perfect" },
  {
    value: "Tenses - Past Perfect Continuous",
    label: "Tenses - Past Perfect Continuous",
  },
  {
    value: "Tenses - Future Simple (will / be going to)",
    label: "Tenses - Future Simple (will / be going to)",
  },
  { value: "Tenses - Future Continuous", label: "Tenses - Future Continuous" },
  { value: "Tenses - Future Perfect", label: "Tenses - Future Perfect" },
  { value: "Word Types - Nouns", label: "Word Types - Nouns" },
  { value: "Word Types - Verbs", label: "Word Types - Verbs" },
  { value: "Word Types - Adjectives", label: "Word Types - Adjectives" },
  { value: "Word Types - Adverbs", label: "Word Types - Adverbs" },
  { value: "Word Types - Pronouns", label: "Word Types - Pronouns" },
  { value: "Word Types - Prepositions", label: "Word Types - Prepositions" },
  { value: "Word Types - Conjunctions", label: "Word Types - Conjunctions" },
  { value: "Passive Voice", label: "Passive Voice" },
  { value: "Clauses - Relative Clauses", label: "Clauses - Relative Clauses" },
  { value: "Clauses - Noun Clauses", label: "Clauses - Noun Clauses" },
  {
    value: "Clauses - Adverbial Clauses",
    label: "Clauses - Adverbial Clauses",
  },
  {
    value: "Conditional Sentences - Type 1",
    label: "Conditional Sentences - Type 1",
  },
  {
    value: "Conditional Sentences - Type 2",
    label: "Conditional Sentences - Type 2",
  },
  {
    value: "Conditional Sentences - Type 3",
    label: "Conditional Sentences - Type 3",
  },
  {
    value: "Conditional Sentences - Mixed Type",
    label: "Conditional Sentences - Mixed Type",
  },
  { value: "Comparisons - As...as", label: "Comparisons - As...as" },
  { value: "Comparisons - Comparative", label: "Comparisons - Comparative" },
  { value: "Comparisons - Superlative", label: "Comparisons - Superlative" },
  {
    value: "Comparisons - Double Comparison (The more... the more...)",
    label: "Comparisons - Double Comparison (The more... the more...)",
  },
  {
    value: "Gerunds & Infinitives - V-ing after verbs",
    label: "Gerunds & Infinitives - V-ing after verbs",
  },
  {
    value: "Gerunds & Infinitives - To-V after verbs",
    label: "Gerunds & Infinitives - To-V after verbs",
  },
  {
    value: "Gerunds & Infinitives - Both with meaning difference",
    label: "Gerunds & Infinitives - Both with meaning difference",
  },
  { value: "Subject-Verb Agreement", label: "Subject-Verb Agreement" },
  { value: "Reported Speech", label: "Reported Speech" },
  { value: "Inversion", label: "Inversion" },
  { value: "Connectors & Transitions", label: "Connectors & Transitions" },
  {
    value: "Participles (V-ing / V3 used as adjectives)",
    label: "Participles (V-ing / V3 used as adjectives)",
  },
  { value: "Subjunctive Mood", label: "Subjunctive Mood" },
];

const vocabularyTopics = [
  { value: "Common Everyday Vocabulary", label: "Common Everyday Vocabulary" },
  { value: "Collocations", label: "Collocations" },
  { value: "Idioms & Phrases", label: "Idioms & Phrases" },
  { value: "Phrasal Verbs", label: "Phrasal Verbs" },
  { value: "Synonyms & Antonyms", label: "Synonyms & Antonyms" },
  {
    value: "Word Formation (Prefixes & Suffixes)",
    label: "Word Formation (Prefixes & Suffixes)",
  },
  {
    value: "Confusing Words (e.g. make/do, say/tell, bring/take)",
    label: "Confusing Words (e.g. make/do, say/tell, bring/take)",
  },
  { value: "Academic Vocabulary", label: "Academic Vocabulary" },
  { value: "TOEIC Vocabulary", label: "TOEIC Vocabulary" },
  { value: "IELTS Vocabulary", label: "IELTS Vocabulary" },
  {
    value: "Transition Words & Connectors",
    label: "Transition Words & Connectors",
  },
  {
    value: "Adjective + Noun / Verb + Noun Combinations",
    label: "Adjective + Noun / Verb + Noun Combinations",
  },
  { value: "Business English", label: "Business English" },
  {
    value: "Office & Company Vocabulary",
    label: "Office & Company Vocabulary",
  },
  { value: "Travel & Tourism", label: "Travel & Tourism" },
  { value: "Technology & IT Vocabulary", label: "Technology & IT Vocabulary" },
  { value: "Health & Medicine", label: "Health & Medicine" },
  { value: "Education & Learning", label: "Education & Learning" },
  { value: "Environment & Nature", label: "Environment & Nature" },
  { value: "Marketing & Sales", label: "Marketing & Sales" },
  { value: "Finance & Banking", label: "Finance & Banking" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Meetings & Presentations", label: "Meetings & Presentations" },
  { value: "Conversational English", label: "Conversational English" },
  { value: "Social English Expressions", label: "Social English Expressions" },
  {
    value: "Email & Professional Writing Vocabulary",
    label: "Email & Professional Writing Vocabulary",
  },
  {
    value: "Telephone & Online Communication",
    label: "Telephone & Online Communication",
  },
];

const schema = yup.object({
  title: yup.string().required("Test title is required"),
  description: yup.string().required("Description is required"),
  courseId: yup.string().required("Course is required"),
  grammarLessonId: yup.string().nullable(),
  topic: yup.array().min(1, "At least one topic is required"),
  skill: yup.array().min(1, "At least one skill is required"),
  questionTypes: yup.array().min(1, "Question type is required"),
  examType: yup.string().required("Exam type is required"),
  numQuestions: yup
    .number()
    .required("Number of questions is required")
    .positive("Number of questions must be a positive number")
    .min(1, "Must have at least 1 question")
    .max(30, "Cannot exceed 30 questions")
    .integer("Number of questions must be a whole number"),
  durationMin: yup
    .number()
    .required("Duration is required")
    .positive("Duration must be a positive number")
    .min(1, "Duration must be at least 1 minute")
    .integer("Duration must be a whole number"),
  maxAttempts: yup
    .number()
    .nullable()
    .positive("Maximum attempts must be a positive number")
    .integer("Maximum attempts must be a whole number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? null : value
    ),
  passingScore: yup
    .number()
    .required("Passing score is required")
    .min(0, "Passing score cannot be negative")
    .max(100, "Passing score cannot exceed 100%"),
  isTheLastTest: yup.boolean(),
});

const ModalCreateTest = ({ open, onClose, onSuccess }) => {
  const [createTest, { isLoading }] = useCreateTestMutation();
  const [generateQuestions] = useGenerateTestQuestionsMutation();
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCoursesQuery();

  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [getLessonsByCourseId] = useGetLessonsByCourseIdMutation();
  const [addTestToLesson] = useAddTestToLessonMutation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [createdTestData, setCreatedTestData] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      grammarLessonId: "",
      topic: [],
      skill: [],
      questionTypes: [],
      examType: "",
      numQuestions: 10,
      durationMin: 30,
      maxAttempts: null,
      passingScore: 70,
      isTheLastTest: false,
    },
  });

  const passingScore = watch("passingScore");
  const selectedCourseId = watch("courseId");
  const selectedSkills = watch("skill");

  useEffect(() => {
    const loadLessons = async () => {
      if (selectedCourseId) {
        setLessonsLoading(true);
        try {
          const response = await getLessonsByCourseId(selectedCourseId);
          if (response.data) {
            setLessons(response.data.data || []);
          }
        } catch (error) {
          console.error("Error loading lessons:", error);
          setLessons([]);
        } finally {
          setLessonsLoading(false);
        }

        const selectedCourse = coursesData?.find(
          (course) => course._id === selectedCourseId
        );
        if (selectedCourse?.courseType) {
          reset((formValues) => ({
            ...formValues,
            examType: selectedCourse.courseType,
          }));
        }
      } else {
        setLessons([]);
      }
    };

    loadLessons();
  }, [selectedCourseId, getLessonsByCourseId, coursesData, reset]);

  const courses = (() => {
    if (!coursesData) return [];
    if (Array.isArray(coursesData)) {
      return coursesData.map((course) => ({
        value: course._id,
        label: course.title,
      }));
    }
    return [];
  })();

  const skills = [
    { value: "grammar", label: "Grammar" },
    { value: "vocabulary", label: "Vocabulary" },
  ];

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "fill_in_blank", label: "Fill in the Blank" },
  ];

  const examTypes = [
    { value: "TOEIC", label: "TOEIC" },
    { value: "IELTS", label: "IELTS" },
  ];

  const onSubmit = async (data) => {
    try {
      setIsProcessing(true);

      const primarySkill =
        Array.isArray(data.skill) && data.skill.length > 0
          ? data.skill[0]
          : "grammar";

      const testData = {
        title: data.title,
        description: data.description,
        topic: data.topic.join(", "),
        skill: primarySkill,
        durationMin: data.durationMin,
        courseId: data.courseId,
        numQuestions: data.numQuestions,
        questionTypes: data.questionTypes,
        examType: data.examType,
        passingScore: data.passingScore / 10,
        maxAttempts: data.maxAttempts,
        isTheLastTest: data.isTheLastTest,
      };

      const result = await createTest(testData).unwrap();
      setCreatedTestData(result);

      if (data.grammarLessonId) {
        await addTestToLesson({
          lessonId: data.grammarLessonId,
          testId: result.data._id,
        }).unwrap();
      }

      const selectedCourse = coursesData?.find(
        (course) => course._id === data.courseId
      );

      const topicString = Array.isArray(data.topic)
        ? data.topic.join(", ")
        : data.topic;

      const scoreRange = selectedCourse?.courseLevel
        ? `${selectedCourse.courseType} ${selectedCourse.courseLevel}`
        : `${data.examType} 605-780`;

      const questionData = {
        testId: result.data._id,
        exam_type: data.examType,
        num_questions: data.numQuestions,
        topic: topicString,
        question_types: data.questionTypes,
        score_range: scoreRange,
      };

      await generateQuestions(questionData).unwrap();

      handleCloseModal();
    } catch (error) {
      console.error("Error in test creation process:", error);
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    reset();
    setLessons([]);
    setShowConfirmDialog(false);
    setCreatedTestData(null);
    setIsProcessing(false);
    onSuccess?.(createdTestData);
    onClose();
  };

  const handleClose = () => {
    if (isProcessing) return;

    reset();
    setLessons([]);
    setShowConfirmDialog(false);
    setCreatedTestData(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 3,
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StarIcon sx={{ fontSize: 32 }} />
              </Box>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Create New Test
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Configure test settings and parameters
                </Typography>
              </div>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  transform: "rotate(90deg)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 4, bgcolor: "#fafbfc" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Test Title */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Test Title"
                      placeholder="Enter a descriptive test title..."
                      fullWidth
                      required
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Description */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Enter test description..."
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                      }}
                    />
                  )}
                />

                {/* Course and Exam Type */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Controller
                    name="courseId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.courseId}>
                        <InputLabel>Course *</InputLabel>
                        <Select
                          {...field}
                          label="Course *"
                          disabled={coursesLoading}
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          {coursesLoading ? (
                            <MenuItem disabled>
                              <Typography variant="body2" color="textSecondary">
                                Loading courses...
                              </Typography>
                            </MenuItem>
                          ) : coursesError ? (
                            <MenuItem disabled>
                              <Typography variant="body2" color="error">
                                Error loading courses
                              </Typography>
                            </MenuItem>
                          ) : courses.length === 0 ? (
                            <MenuItem disabled>
                              <Typography variant="body2" color="textSecondary">
                                No courses available
                              </Typography>
                            </MenuItem>
                          ) : (
                            courses?.map((course) => (
                              <MenuItem
                                key={course.value}
                                value={course.value}
                                sx={{ maxHeight: 48 }}
                              >
                                <Typography noWrap>{course.label}</Typography>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.courseId && (
                          <FormHelperText>
                            {errors.courseId.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="examType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.examType}>
                        <InputLabel>Exam Type *</InputLabel>
                        <Select
                          {...field}
                          label="Exam Type *"
                          disabled
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          {examTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor:
                                      type.value === "TOEIC"
                                        ? "#3b82f6"
                                        : "#8b5cf6",
                                  }}
                                />
                                {type.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.examType?.message ||
                            "Auto-filled from selected course"}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Box>

                {/* Grammar Lesson Selection */}
                {selectedCourseId && (
                  <Controller
                    name="grammarLessonId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.grammarLessonId}>
                        <InputLabel>Lesson (Optional)</InputLabel>
                        <Select
                          {...field}
                          label="Lesson (Optional)"
                          disabled={lessonsLoading}
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>None - Create general course test</em>
                          </MenuItem>
                          {lessonsLoading ? (
                            <MenuItem disabled>
                              <Typography variant="body2" color="textSecondary">
                                Loading lessons...
                              </Typography>
                            </MenuItem>
                          ) : lessons.length === 0 ? (
                            <MenuItem disabled>
                              <Typography variant="body2" color="textSecondary">
                                No lessons available for this course
                              </Typography>
                            </MenuItem>
                          ) : (
                            lessons?.map((lesson) => (
                              <MenuItem
                                key={lesson._id}
                                value={lesson._id}
                                sx={{ maxHeight: 48 }}
                              >
                                <Typography noWrap>{lesson.title}</Typography>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.grammarLessonId && (
                          <FormHelperText>
                            {errors.grammarLessonId.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                )}

                {/* Primary Skill and Question Types */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Controller
                    name="skill"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.skill}>
                        <InputLabel>Skills *</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label="Skills *"
                          renderValue={(selected) =>
                            selected
                              .map(
                                (s) =>
                                  skills.find((skill) => skill.value === s)
                                    ?.label
                              )
                              .join(", ")
                          }
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          {skills.map((skill) => (
                            <MenuItem key={skill.value} value={skill.value}>
                              <Checkbox
                                checked={field.value?.includes(skill.value)}
                                sx={{
                                  color: "#667eea",
                                  "&.Mui-checked": {
                                    color: "#667eea",
                                  },
                                }}
                              />
                              {skill.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.skill && (
                          <FormHelperText>
                            {errors.skill.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="questionTypes"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.questionTypes}>
                        <InputLabel>Question Type *</InputLabel>
                        <Select
                          {...field}
                          label="Question Type *"
                          value={field.value?.[0] || ""}
                          onChange={(e) => {
                            field.onChange([e.target.value]);
                          }}
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#667eea",
                            },
                          }}
                        >
                          {questionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.questionTypes && (
                          <FormHelperText>
                            {errors.questionTypes.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    color="#64748b"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Topics * (Maximum 5 topics)
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <Controller
                      name="topic"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        const grammarValues =
                          value?.filter((v) =>
                            grammarTopics.some((t) => t.value === v)
                          ) || [];
                        const vocabularyValues =
                          value?.filter((v) =>
                            vocabularyTopics.some((t) => t.value === v)
                          ) || [];

                        const handleGrammarChange = (event) => {
                          const newGrammarValues = event.target.value;
                          if (newGrammarValues.length <= 5) {
                            const combinedValues = [
                              ...newGrammarValues,
                              ...vocabularyValues,
                            ];
                            onChange(combinedValues);
                          }
                        };

                        const handleVocabularyChange = (event) => {
                          const newVocabularyValues = event.target.value;
                          if (newVocabularyValues.length <= 5) {
                            const combinedValues = [
                              ...grammarValues,
                              ...newVocabularyValues,
                            ];
                            onChange(combinedValues);
                          }
                        };

                        const totalSelected = value?.length || 0;

                        return (
                          <>
                            <FormControl
                              fullWidth
                              disabled={!selectedSkills?.includes("grammar")}
                            >
                              <InputLabel>Grammar Topics</InputLabel>
                              <Select
                                multiple
                                value={grammarValues}
                                onChange={handleGrammarChange}
                                input={<OutlinedInput label="Grammar Topics" />}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((val) => {
                                      const topic = grammarTopics.find(
                                        (t) => t.value === val
                                      );
                                      return (
                                        <Chip
                                          key={val}
                                          label={topic?.label || val}
                                          size="small"
                                        />
                                      );
                                    })}
                                  </Box>
                                )}
                                sx={{
                                  borderRadius: 2,
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#667eea",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#667eea",
                                    },
                                }}
                              >
                                {grammarTopics.map((topic) => (
                                  <MenuItem
                                    key={topic.value}
                                    value={topic.value}
                                    disabled={
                                      !grammarValues.includes(topic.value) &&
                                      totalSelected >= 5
                                    }
                                  >
                                    {topic.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              fullWidth
                              disabled={!selectedSkills?.includes("vocabulary")}
                            >
                              <InputLabel>Vocabulary Topics</InputLabel>
                              <Select
                                multiple
                                value={vocabularyValues}
                                onChange={handleVocabularyChange}
                                input={
                                  <OutlinedInput label="Vocabulary Topics" />
                                }
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((val) => {
                                      const topic = vocabularyTopics.find(
                                        (t) => t.value === val
                                      );
                                      return (
                                        <Chip
                                          key={val}
                                          label={topic?.label || val}
                                          size="small"
                                        />
                                      );
                                    })}
                                  </Box>
                                )}
                                sx={{
                                  borderRadius: 2,
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#667eea",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#667eea",
                                    },
                                }}
                              >
                                {vocabularyTopics.map((topic) => (
                                  <MenuItem
                                    key={topic.value}
                                    value={topic.value}
                                    disabled={
                                      !vocabularyValues.includes(topic.value) &&
                                      totalSelected >= 5
                                    }
                                  >
                                    {topic.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </>
                        );
                      }}
                    />
                  </Box>

                  {errors.topic && (
                    <FormHelperText error sx={{ mt: 1, ml: 2 }}>
                      {errors.topic.message}
                    </FormHelperText>
                  )}

                  {/* <Controller
                    name="topic"
                    control={control}
                    render={({ field: { value } }) =>
                      value && value.length > 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            color="#64748b"
                            sx={{ mb: 1 }}
                          >
                            Selected Topics ({value.length}):
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              p: 2,
                              bgcolor: "#f8f9ff",
                              borderRadius: 2,
                              border: "1px solid #e0e4f7",
                            }}
                          >
                            {value.map((topicValue) => {
                              const topic = [
                                ...grammarTopics,
                                ...vocabularyTopics,
                              ].find((t) => t.value === topicValue);
                              return (
                                <Chip
                                  key={topicValue}
                                  label={topic?.label || topicValue}
                                  size="medium"
                                  sx={{
                                    bgcolor: "#e9ecfe",
                                    color: "#667eea",
                                    fontWeight: 500,
                                    border: "1px solid #d0d5f6",
                                  }}
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      ) : null
                    }
                  /> */}
                </Box>

                {/* Number of Questions, Duration, Maximum Attempts */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Controller
                    name="numQuestions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number of Questions"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.numQuestions}
                        helperText={errors.numQuestions?.message}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="durationMin"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration (minutes)"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.durationMin}
                        helperText={
                          errors.durationMin?.message || "1-2 min per question"
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="maxAttempts"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Maximum Attempts"
                        type="number"
                        fullWidth
                        error={!!errors.maxAttempts}
                        helperText={
                          errors.maxAttempts?.message ||
                          "Leave blank for unlimited"
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          field.onChange(value);
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Passing Score */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                  >
                    Passing Score: {passingScore}%
                  </Typography>
                  <Controller
                    name="passingScore"
                    control={control}
                    render={({ field }) => (
                      <Box sx={{ px: 2 }}>
                        <Slider
                          {...field}
                          min={0}
                          max={100}
                          step={5}
                          marks={[
                            { value: 0, label: "0%" },
                            { value: 50, label: "50%" },
                            { value: 100, label: "100%" },
                          ]}
                          valueLabelDisplay="auto"
                          sx={{
                            color: "#667eea",
                            "& .MuiSlider-thumb": {
                              "&:hover, &.Mui-focusVisible": {
                                boxShadow:
                                  "0 0 0 8px rgba(102, 126, 234, 0.16)",
                              },
                            },
                            "& .MuiSlider-rail": {
                              opacity: 0.3,
                            },
                          }}
                        />
                      </Box>
                    )}
                  />
                  {errors.passingScore && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {errors.passingScore.message}
                    </FormHelperText>
                  )}
                </Box>

                {/* Final Test Checkbox */}
                <Controller
                  name="isTheLastTest"
                  control={control}
                  render={({ field }) => (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8f9ff",
                        border: "1px solid #e0e4f7",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            sx={{
                              color: "#667eea",
                              "&.Mui-checked": {
                                color: "#667eea",
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              Final Test
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              Mark this as a final assessment that affects
                              course completion
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  )}
                />

                {/* Required Fields Notice */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    * All required fields must be completed
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </DialogContent>

          <DialogActions
            sx={{
              p: 3,
              bgcolor: "#f8f9fa",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
                color: "text.secondary",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "text.secondary",
                  bgcolor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || isProcessing}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                py: 1,
                fontWeight: 600,
                bgcolor: "#667eea",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  bgcolor: "#5568d3",
                  boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                },
                "&:disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {isLoading || isProcessing
                ? "Processing..."
                : "Create Test & Questions"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Processing Overlay */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.modal + 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        open={isProcessing}
      >
        <CircularProgress color="inherit" size={60} />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Creating Questions...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Please wait while we generate questions for your test
          </Typography>
        </Box>
      </Backdrop>

      {/* Confirmation Dialog for Creating Questions */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "black",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Test Created Successfully!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Would you like to create questions for this test now?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 0 }}>
          <Alert severity="info">
            <Typography variant="body2">
              You can create questions now or do it later. The test has been
              added to the selected lesson.
            </Typography>
          </Alert>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCreateTest;
