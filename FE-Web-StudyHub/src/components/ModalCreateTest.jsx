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
  Autocomplete,
  Paper,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Star as StarIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateTestMutation } from "../services/testApi";
import { useGetCoursesQuery } from "../services/courseApi";
import {
  useGetLessonsByCourseIdMutation,
  useAddTestToLessonMutation,
} from "../services/grammarLessonApi";

// Validation schema
const schema = yup.object({
  title: yup.string().required("Test title is required"),
  description: yup.string(),
  courseId: yup.string().required("Course is required"),
  grammarLessonId: yup.string().nullable(), // Optional - để chọn lesson cụ thể
  topic: yup.array().min(1, "At least one topic is required"),
  skill: yup.string().required("Primary skill is required"),
  questionTypes: yup.array().min(1, "At least one question type is required"),
  examType: yup.string().required("Exam type is required"),
  numQuestions: yup
    .number()
    .required("Number of questions is required")
    .min(1, "Must have at least 1 question")
    .max(100, "Cannot exceed 100 questions"),
  durationMin: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 minute"),
  maxAttempts: yup.number().nullable(),
  passingScore: yup
    .number()
    .required("Passing score is required")
    .min(0, "Passing score cannot be negative")
    .max(100, "Passing score cannot exceed 100%"),
  isTheLastTest: yup.boolean(),
});

const ModalCreateTest = ({ open, onClose, onSuccess }) => {
  const [createTest, { isLoading }] = useCreateTestMutation();
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetCoursesQuery();

  // Lessons state và API
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [getLessonsByCourseId] = useGetLessonsByCourseIdMutation();
  const [addTestToLesson] = useAddTestToLessonMutation();

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [createdTestData, setCreatedTestData] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Debug logging
  useEffect(() => {
    if (coursesData) {
      console.log("Courses data structure:", coursesData);
      console.log("Type of coursesData:", typeof coursesData);
      console.log("Is coursesData an array:", Array.isArray(coursesData));
    }
    if (coursesError) {
      console.error("Courses API error:", coursesError);
    }
  }, [coursesData, coursesError]);

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
      skill: "",
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

  // Load lessons when course changes
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
      } else {
        setLessons([]);
      }
    };

    loadLessons();
  }, [selectedCourseId, getLessonsByCourseId]);

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
    { value: "reading", label: "Reading" },
    { value: "writing", label: "Writing" },
    { value: "listening", label: "Listening" },
    { value: "speaking", label: "Speaking" },
    { value: "vocabulary", label: "Vocabulary" },
    { value: "grammar", label: "Grammar" },
  ];

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "fill_in_blank", label: "Fill in the Blank" },
    { value: "rearrange", label: "Rearrange" },
    { value: "essay", label: "Essay" },
  ];

  const examTypes = [
    { value: "TOEIC", label: "TOEIC" },
    { value: "IELTS", label: "IELTS" },
  ];

  const topics = [
    { value: "Present Tense", label: "Present Tense" },
    { value: "Past Tense", label: "Past Tense" },
    { value: "Future Tense", label: "Future Tense" },
    { value: "Conditional Sentences", label: "Conditional Sentences" },
    { value: "Passive Voice", label: "Passive Voice" },
    { value: "Modal Verbs", label: "Modal Verbs" },
    { value: "Adjectives", label: "Adjectives" },
    { value: "Adverbs", label: "Adverbs" },
    { value: "Prepositions", label: "Prepositions" },
    { value: "Phrasal Verbs", label: "Phrasal Verbs" },
    { value: "Vocabulary Building", label: "Vocabulary Building" },
    { value: "Reading Comprehension", label: "Reading Comprehension" },
    { value: "Listening Skills", label: "Listening Skills" },
    { value: "Writing Skills", label: "Writing Skills" },
    { value: "Speaking Practice", label: "Speaking Practice" },
  ];

  const onSubmit = async (data) => {
    try {
      const testData = {
        title: data.title,
        description: data.description,
        topic: data.topic.join(", "),
        skill: data.skill,
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

      // Lưu thông tin test đã tạo và lesson được chọn
      setCreatedTestData(result);
      setSelectedLessonId(data.grammarLessonId);

      // Nếu có lesson được chọn, hiển thị dialog xác nhận
      if (data.grammarLessonId) {
        setShowConfirmDialog(true);
      } else {
        // Nếu không có lesson, đóng modal luôn
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handleCloseModal = () => {
    reset();
    setLessons([]);
    setShowConfirmDialog(false);
    setCreatedTestData(null);
    setSelectedLessonId(null);
    onSuccess?.(createdTestData);
    onClose();
  };

  const handleClose = () => {
    reset();
    setLessons([]); // Reset lessons khi đóng modal
    setShowConfirmDialog(false);
    setCreatedTestData(null);
    setSelectedLessonId(null);
    onClose();
  };

  const handleCreateQuestions = async () => {
    try {
      if (selectedLessonId && createdTestData) {
        await addTestToLesson({
          lessonId: selectedLessonId,
          testId: createdTestData.data._id,
        }).unwrap();
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error adding test to lesson:", error);
    }
  };

  const handleSkipQuestions = async () => {
    try {
      // Chỉ thêm test vào lesson mà không tạo câu hỏi
      if (selectedLessonId && createdTestData) {
        await addTestToLesson({
          lessonId: selectedLessonId,
          testId: createdTestData.data._id,
        }).unwrap();
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error adding test to lesson:", error);
    }
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
                        {errors.examType && (
                          <FormHelperText>
                            {errors.examType.message}
                          </FormHelperText>
                        )}
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
                        <InputLabel>Grammar Lesson (Optional)</InputLabel>
                        <Select
                          {...field}
                          label="Grammar Lesson (Optional)"
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
                        <InputLabel>Primary Skill *</InputLabel>
                        <Select
                          {...field}
                          label="Primary Skill *"
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
                        <InputLabel>Question Types *</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label="Question Types *"
                          renderValue={(selected) =>
                            selected
                              .map(
                                (value) =>
                                  questionTypes.find(
                                    (type) => type.value === value
                                  )?.label
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
                          {questionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Checkbox
                                checked={field.value?.includes(type.value)}
                              />
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

                {/* Topics */}
                <Controller
                  name="topic"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={topics}
                      getOptionLabel={(option) => option.label}
                      value={topics.filter((topic) =>
                        value?.includes(topic.value)
                      )}
                      onChange={(_, newValue) => {
                        onChange(newValue.map((item) => item.value));
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Topics *"
                          placeholder="Search and select topics..."
                          error={!!errors.topic}
                          helperText={errors.topic?.message}
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
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.label}
                        </li>
                      )}
                      slotProps={{
                        chip: {
                          size: "medium",
                          sx: {
                            borderRadius: 2,
                            bgcolor: "#e9ecfe",
                            color: "#667eea",
                            fontWeight: 500,
                            border: "1px solid #d0d5f6",
                          },
                        },
                      }}
                    />
                  )}
                />

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
              disabled={isLoading}
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
              {isLoading ? "Creating..." : "Create Test"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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

        <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleSkipQuestions}
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
            Skip for Now
          </Button>
          <Button
            onClick={handleCreateQuestions}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 4,
              py: 1,
              fontWeight: 600,
              bgcolor: "#4caf50",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                bgcolor: "#43a047",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            Create Questions
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCreateTest;
