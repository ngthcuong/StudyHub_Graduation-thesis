import React from "react";
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
} from "@mui/material";
import { Close as CloseIcon, Star as StarIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateTestMutation } from "../services/testApi";
import { useGetCoursesQuery } from "../services/courseApi";
import { toast } from "react-toastify";

// Validation schema
const schema = yup.object({
  title: yup.string().required("Test title is required"),
  description: yup.string(),
  courseId: yup.string().required("Course is required"),
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

  // Debug logging
  React.useEffect(() => {
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
        passingScore: data.passingScore,
        maxAttempts: data.maxAttempts,
        isTheLastTest: data.isTheLastTest,
      };

      const result = await createTest(testData).unwrap();

      toast.success("Test created successfully!");
      reset();
      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(error?.data?.message || "Failed to create test");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <DialogTitle className="flex items-center justify-between bg-blue-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <StarIcon className="text-blue-600" />
          <div>
            <Typography variant="h6" className="font-semibold text-gray-800">
              Create New Test
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Configure test settings and parameters
            </Typography>
          </div>
        </div>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="px-6 py-4 space-y-4">
          {/* Test Title */}
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Test Title *"
                  placeholder="Enter a descriptive test title..."
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </div>

          {/* Description */}
          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  fullWidth
                  placeholder="Enter test description..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </div>

          {/* Course and Exam Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.courseId}>
                  <InputLabel>Course *</InputLabel>
                  <Select {...field} label="Course *" disabled={coursesLoading}>
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
                    <FormHelperText>{errors.courseId.message}</FormHelperText>
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
                  <Select {...field} label="Exam Type *">
                    {examTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.examType && (
                    <FormHelperText>{errors.examType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          {/* Primary Skill and Question Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="skill"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.skill}>
                  <InputLabel>Primary Skill *</InputLabel>
                  <Select {...field} label="Primary Skill *">
                    {skills.map((skill) => (
                      <MenuItem key={skill.value} value={skill.value}>
                        {skill.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.skill && (
                    <FormHelperText>{errors.skill.message}</FormHelperText>
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
                            questionTypes.find((type) => type.value === value)
                              ?.label
                        )
                        .join(", ")
                    }
                  >
                    {questionTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Checkbox checked={field.value?.includes(type.value)} />
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
          </div>

          {/* Topics */}
          <div>
            <Controller
              name="topic"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={topics}
                  getOptionLabel={(option) => option.label}
                  value={topics.filter((topic) => value?.includes(topic.value))}
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
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  slotProps={{
                    chip: {
                      size: "medium",
                      color: "primary",
                    },
                  }}
                />
              )}
            />
          </div>

          {/* Number of Questions, Duration, Maximum Attempts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="numQuestions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Number of Questions *"
                  type="number"
                  fullWidth
                  error={!!errors.numQuestions}
                  helperText={errors.numQuestions?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              name="durationMin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Duration (minutes) *"
                  type="number"
                  fullWidth
                  error={!!errors.durationMin}
                  helperText={
                    errors.durationMin?.message || "1-2 min per question"
                  }
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              name="maxAttempts"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maximum Attempts *"
                  type="number"
                  fullWidth
                  error={!!errors.maxAttempts}
                  helperText={
                    errors.maxAttempts?.message ||
                    "Enter a number or leave blank for unlimited"
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? null : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>

          {/* Passing Score */}
          <div className="space-y-2">
            <Typography variant="subtitle2" className="font-medium">
              Passing Score: {passingScore}%
            </Typography>
            <Controller
              name="passingScore"
              control={control}
              render={({ field }) => (
                <Box className="px-3">
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
                    className="text-blue-600"
                  />
                </Box>
              )}
            />
            {errors.passingScore && (
              <FormHelperText error>
                {errors.passingScore.message}
              </FormHelperText>
            )}
          </div>

          {/* Final Test Checkbox */}
          <Controller
            name="isTheLastTest"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <div>
                    <Typography variant="body2" className="font-medium">
                      Final Test
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Mark this as a final assessment that affects course
                      completion
                    </Typography>
                  </div>
                }
              />
            )}
          />

          {/* Required Fields Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
            <Typography variant="caption">
              * All required fields must be completed
            </Typography>
          </div>
        </DialogContent>

        <DialogActions className="px-6 py-4 bg-gray-50">
          <Button
            onClick={handleClose}
            variant="outlined"
            className="text-gray-600 border-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create Test"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalCreateTest;
