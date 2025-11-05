import React, { useState, useEffect, useRef } from "react";
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
  Typography,
  IconButton,
  Tabs,
  Tab,
  Box,
  Paper,
  Chip,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  MenuBook as MenuBookIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../services/courseApi";
import { toast } from "react-toastify";

// Validation schema for course information
const courseInfoSchema = yup.object({
  title: yup
    .string()
    .required("Course title is required")
    .max(80, "Title must not exceed 80 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description must not exceed 500 characters"),
  courseType: yup.string().required("Course type is required"),
  courseLevel: yup.string().required("Course level is required"),
  category: yup.string().required("Category is required"),
  cost: yup
    .number()
    .required("Cost is required")
    .min(0, "Cost cannot be negative"),
  durationHours: yup
    .number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 hour"),
  thumbnailUrl: yup.string().url("Must be a valid URL"),
  tags: yup.array().of(yup.string()),
});

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const ModalCreateCourse = ({ open, onClose, onSuccess, course = null }) => {
  const [tabValue, setTabValue] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [expandedSections, setExpandedSections] = useState(new Set([0])); // Track which sections are expanded
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Track if this is the initial load to prevent resetting courseLevel in edit mode
  const isInitialLoadRef = useRef(true);

  const isEditMode = Boolean(course);
  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(courseInfoSchema),
    defaultValues: {
      title: "",
      description: "",
      courseType: "",
      courseLevel: "",
      category: "",
      cost: 0,
      durationHours: 1,
      thumbnailUrl: "",
      tags: [],
      sections: [],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedTags = watch("tags");
  const watchedSections = watch("sections");
  const watchedCourseType = watch("courseType");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const courseTypes = [
    { value: "TOEIC", label: "TOEIC" },
    { value: "IELTS", label: "IELTS" },
  ];

  // Course levels based on course type
  const courseLevelsByType = {
    TOEIC: [
      { value: "10-250", label: "Beginner (A1) - 10-250 band" },
      { value: "255-400", label: "Elementary (A2) - 255-400 band" },
      { value: "405-600", label: "Intermediate (B1) - 405-600 band" },
      {
        value: "605-780",
        label: "Upper-Intermediate (B2) - 605-780 band",
      },
      { value: "785-900", label: "Advanced (C1) - 785-900 band" },
      { value: "905-990", label: "Proficiency (C2) - 905-990 band" },
    ],
    IELTS: [
      { value: "0-3.5", label: "Beginner (A1-A2) - 0-3.5 band" },
      {
        value: "4.0-5.0",
        label: "Elementary (B1) - 4.0-5.0 band",
      },
      {
        value: "5.5-6.0",
        label: "Intermediate (B1-B2) - 5.5-6.0 band",
      },
      {
        value: "6.5-7.0",
        label: "Upper-Intermediate (B2-C1) - 6.5-7.0 band",
      },
      { value: "7.5-8.0", label: "Advanced (C1) - 7.5-8.0 band" },
      { value: "8.5-9.0", label: "Expert (C2) - 8.5-9.0 band" },
    ],
  };

  // Get course levels based on selected course type
  const getCourseLevels = () => {
    if (watchedCourseType === "TOEIC") {
      return courseLevelsByType.TOEIC;
    } else if (watchedCourseType === "IELTS") {
      return courseLevelsByType.IELTS;
    }
    return [];
  };

  const categories = [
    { value: "English", label: "English" },
    { value: "Business English", label: "Business English" },
    { value: "Academic English", label: "Academic English" },
    { value: "Test Preparation", label: "Test Preparation" },
  ];

  // Pre-fill data when in edit mode
  useEffect(() => {
    if (open && course) {
      // Course edit mode: Pre-fill with course data
      isInitialLoadRef.current = true;
      reset({
        title: course.title || "",
        description: course.description || "",
        courseType: course.courseType || "",
        courseLevel: course.courseLevel || "",
        category: course.category || "",
        cost: course.cost || 0,
        durationHours: course.durationHours || 1,
        thumbnailUrl: course.thumbnailUrl || "",
        tags: course.tags || [],
        sections: course.sections || [],
      });
      // Reset flag after a short delay to allow form to populate
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 100);
    } else if (open && !course) {
      // Create mode: Reset to empty
      isInitialLoadRef.current = false;
      reset({
        title: "",
        description: "",
        courseType: "",
        courseLevel: "",
        category: "",
        cost: 0,
        durationHours: 1,
        thumbnailUrl: "",
        tags: [],
        sections: [],
      });
    }
  }, [open, course, reset]);

  // Reset courseLevel when courseType changes (but not during initial load in edit mode)
  useEffect(() => {
    // Skip if this is initial load in edit mode
    if (isInitialLoadRef.current) {
      return;
    }

    // Reset courseLevel when courseType changes
    if (watchedCourseType) {
      setValue("courseLevel", "");
    }
  }, [watchedCourseType, setValue]);

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      setValue("tags", [...(watchedTags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToDelete)
    );
  };

  const handleAddSection = () => {
    const newIndex = sectionFields.length;
    appendSection({
      sectionName: "",
      lessons: [],
    });
    // Expand the newly added section
    setExpandedSections(new Set([...expandedSections, newIndex]));
  };

  const handleAddLesson = (sectionIndex) => {
    const currentSections = [...watchedSections];
    if (!currentSections[sectionIndex].lessons) {
      currentSections[sectionIndex].lessons = [];
    }
    currentSections[sectionIndex].lessons.push({
      lessonName: "",
      contentType: "video",
      videoUrl: "",
      attachmentUrl: "",
      description: "",
      lectureNotes: "",
    });
    setValue("sections", currentSections);
    // Keep the current section expanded
    if (!expandedSections.has(sectionIndex)) {
      setExpandedSections(new Set([...expandedSections, sectionIndex]));
    }
  };

  const handleRemoveLesson = (sectionIndex, lessonIndex) => {
    const currentSections = [...watchedSections];
    currentSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setValue("sections", currentSections);
  };

  // Handle accordion expansion
  const handleAccordionChange = (sectionIndex) => (event, isExpanded) => {
    const newExpanded = new Set(expandedSections);
    if (isExpanded) {
      newExpanded.add(sectionIndex);
    } else {
      newExpanded.delete(sectionIndex);
    }
    setExpandedSections(newExpanded);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        // Update existing course
        const { sections, ...courseData } = data;

        const updatePayload = {
          id: course._id,
          ...courseData,
        };

        // Smart sections handling:
        // - If sections have content (length > 0): Include them for update
        // - If sections is empty but original course had sections loaded in form: User wants to delete all
        // - If sections is empty and wasn't loaded: Don't send (no change to lessons)

        const originalSectionsCount = course?.sections?.length || 0;
        const currentSectionsCount = sections?.length || 0;

        if (currentSectionsCount > 0) {
          // User has sections with content - send for update
          updatePayload.sections = sections;
          console.log(`Sending ${currentSectionsCount} sections for update`);
        } else if (originalSectionsCount > 0 && currentSectionsCount === 0) {
          // Original had sections, now empty - user explicitly deleted all
          // Only send empty array if we're sure sections were loaded
          // Check if form was properly initialized with sections
          if (course.sections) {
            updatePayload.sections = [];
            console.log("User deleted all sections - sending empty array");
          } else {
            console.log("Sections not loaded yet - skipping sections update");
          }
        } else {
          console.log("No sections to update - skipping");
        }

        const result = await updateCourse(updatePayload).unwrap();
        toast.success("Update course successfully!");
        onSuccess?.(result);
      } else {
        // Create new course
        const result = await createCourse(data).unwrap();
        toast.success("Create course successfully!");
        onSuccess?.(result);
      }

      reset();
      setTabValue(0);
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} course:`,
        error
      );
      toast.error(
        error?.data?.message ||
          `Cannot ${isEditMode ? "update" : "create"} course!`
      );
    }
  };

  const handleClose = () => {
    reset();
    setTabValue(0);
    setExpandedSections(new Set([0])); // Reset to default (first section expanded)
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Box>
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {isEditMode ? "Update Course" : "Create New Course"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isEditMode
                  ? "Edit course information and content"
                  : "Set up detailed information and curriculum structure"}
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

      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8f9fa" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="course creation tabs"
          sx={{
            px: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: 64,
              "&.Mui-selected": {
                color: "#667eea",
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <DescriptionIcon fontSize="small" />
                <span>Basic Information</span>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <MenuBookIcon fontSize="small" />
                <span>Curriculum</span>
                <Chip
                  label={sectionFields.length}
                  size="small"
                  sx={{
                    height: 20,
                    minWidth: 20,
                    bgcolor: tabValue === 1 ? "#667eea" : "#e0e0e0",
                    color: tabValue === 1 ? "white" : "text.secondary",
                    fontWeight: 600,
                  }}
                />
              </Box>
            }
          />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 4, bgcolor: "#fafbfc", minHeight: 500 }}>
          {/* Tab 1: Basic Information */}
          <TabPanel value={tabValue} index={0}>
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
                {/* Course Title */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Course Title"
                      placeholder="Enter course title (e.g., Complete TOEIC Preparation Course)"
                      fullWidth
                      required
                      error={!!errors.title}
                      helperText={
                        errors.title?.message ||
                        `${field.value?.length || 0}/80 characters`
                      }
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
                      rows={4}
                      fullWidth
                      required
                      placeholder="Describe what students will learn in this course..."
                      error={!!errors.description}
                      helperText={
                        errors.description?.message ||
                        `${field.value?.length || 0}/500 characters`
                      }
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

                {/* Course Type and Level */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Controller
                    name="courseType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.courseType}>
                        <InputLabel>Course Type *</InputLabel>
                        <Select
                          {...field}
                          label="Course Type *"
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
                          {courseTypes.map((type) => (
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
                        {errors.courseType && (
                          <FormHelperText>
                            {errors.courseType.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="courseLevel"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.courseLevel}>
                        <InputLabel>Course Level *</InputLabel>
                        <Select
                          {...field}
                          label="Course Level *"
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
                          {getCourseLevels().map((level) => (
                            <MenuItem key={level.value} value={level.value}>
                              {level.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.courseLevel && (
                          <FormHelperText>
                            {errors.courseLevel.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>

                {/* Category, Cost, and Duration */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                          {...field}
                          label="Category *"
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
                          {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <FormHelperText>
                            {errors.category.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cost (VND)"
                        type="number"
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₫</InputAdornment>
                          ),
                        }}
                        error={!!errors.cost}
                        helperText={errors.cost?.message}
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
                    name="durationHours"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration (hours)"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.durationHours}
                        helperText={errors.durationHours?.message}
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
                </Box>

                {/* Thumbnail URL */}
                <Controller
                  name="thumbnailUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Thumbnail URL"
                      placeholder="https://example.com/thumbnail.jpg"
                      fullWidth
                      error={!!errors.thumbnailUrl}
                      helperText={errors.thumbnailUrl?.message}
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

                {/* Tags */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                  >
                    Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag (e.g., Grammar, Vocabulary)"
                      size="small"
                      fullWidth
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
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
                    <Button
                      variant="contained"
                      onClick={handleAddTag}
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 2,
                        bgcolor: "#667eea",
                        textTransform: "none",
                        px: 3,
                        "&:hover": {
                          bgcolor: "#5568d3",
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  {watchedTags && watchedTags.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {watchedTags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          sx={{
                            borderRadius: 2,
                            bgcolor: "#e9ecfe",
                            color: "#667eea",
                            fontWeight: 500,
                            border: "1px solid #d0d5f6",
                            "& .MuiChip-deleteIcon": {
                              color: "#667eea",
                              "&:hover": {
                                color: "#5568d3",
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          {/* Tab 2: Curriculum (Sections & Lessons) */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    Course Curriculum
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                  >
                    Organize your course into sections and lessons
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddSection}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#667eea",
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      bgcolor: "#5568d3",
                      boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  Add Section
                </Button>
              </Box>

              {sectionFields.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 6,
                    textAlign: "center",
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "#f0f2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: 40, color: "#667eea" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                  >
                    No sections added yet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3 }}
                  >
                    Start building your course curriculum by adding sections
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddSection}
                    sx={{
                      borderRadius: 2,
                      borderColor: "#667eea",
                      color: "#667eea",
                      textTransform: "none",
                      px: 3,
                      "&:hover": {
                        borderColor: "#5568d3",
                        bgcolor: "#f0f2ff",
                      },
                    }}
                  >
                    Add First Section
                  </Button>
                </Paper>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {sectionFields.map((section, sectionIndex) => (
                    <Accordion
                      key={section.id}
                      expanded={expandedSections.has(sectionIndex)}
                      onChange={handleAccordionChange(sectionIndex)}
                      sx={{
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          margin: 0,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#667eea" }} />
                        }
                        sx={{
                          bgcolor: "#f8f9ff",
                          borderRadius: "12px 12px 0 0",
                          "&.Mui-expanded": {
                            minHeight: 56,
                          },
                          "& .MuiAccordionSummary-content": {
                            my: 1.5,
                            "&.Mui-expanded": {
                              my: 1.5,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            pr: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 2,
                                bgcolor: "#667eea",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                              }}
                            >
                              {sectionIndex + 1}
                            </Box>
                            <Typography
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {watchedSections[sectionIndex]?.sectionName ||
                                "Untitled Section"}
                            </Typography>
                          </Box>
                          <Tooltip title="Remove Section">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSection(sectionIndex);
                              }}
                              sx={{
                                color: "#ef4444",
                                bgcolor: "#fee2e2",
                                "&:hover": {
                                  bgcolor: "#fecaca",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3, bgcolor: "white" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {/* Section Name */}
                          <Controller
                            name={`sections.${sectionIndex}.sectionName`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Section Name"
                                placeholder="e.g., Introduction to Grammar"
                                fullWidth
                                size="small"
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

                          <Divider sx={{ my: 1 }} />

                          {/* Lessons */}
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: "text.primary" }}
                              >
                                Lessons
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => handleAddLesson(sectionIndex)}
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  borderColor: "#667eea",
                                  color: "#667eea",
                                  textTransform: "none",
                                  "&:hover": {
                                    borderColor: "#5568d3",
                                    bgcolor: "#f0f2ff",
                                  },
                                }}
                              >
                                Add Lesson
                              </Button>
                            </Box>

                            {!watchedSections[sectionIndex]?.lessons ||
                            watchedSections[sectionIndex]?.lessons.length ===
                              0 ? (
                              <Paper
                                elevation={0}
                                sx={{
                                  bgcolor: "#f8f9fa",
                                  borderRadius: 2,
                                  p: 3,
                                  textAlign: "center",
                                  border: "1px dashed",
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary" }}
                                >
                                  No lessons added. Click "Add Lesson" to get
                                  started.
                                </Typography>
                              </Paper>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                {watchedSections[sectionIndex]?.lessons.map(
                                  (lesson, lessonIndex) => (
                                    <Accordion
                                      key={lessonIndex}
                                      sx={{
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "#fafbfc",
                                        boxShadow: "none",
                                        "&:before": { display: "none" },
                                        "&.Mui-expanded": {
                                          margin: 0,
                                          boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.08)",
                                        },
                                      }}
                                    >
                                      <AccordionSummary
                                        expandIcon={
                                          <ExpandMoreIcon
                                            sx={{ color: "#667eea" }}
                                          />
                                        }
                                        sx={{
                                          minHeight: 48,
                                          bgcolor: "white",
                                          borderRadius: "8px 8px 0 0",
                                          "&.Mui-expanded": {
                                            minHeight: 48,
                                            borderBottom: "1px solid",
                                            borderColor: "divider",
                                          },
                                          "& .MuiAccordionSummary-content": {
                                            my: 1,
                                            "&.Mui-expanded": {
                                              my: 1,
                                            },
                                          },
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            pr: 1,
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1.5,
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 1.5,
                                                bgcolor: "#e9ecfe",
                                                color: "#667eea",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                              }}
                                            >
                                              {lessonIndex + 1}
                                            </Box>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: 600,
                                                color: "text.primary",
                                              }}
                                            >
                                              {watchedSections[sectionIndex]
                                                ?.lessons[lessonIndex]
                                                ?.lessonName ||
                                                `Lesson ${lessonIndex + 1}`}
                                            </Typography>
                                          </Box>
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveLesson(
                                                sectionIndex,
                                                lessonIndex
                                              );
                                            }}
                                            sx={{
                                              color: "#ef4444",
                                              bgcolor: "#fee2e2",
                                              "&:hover": {
                                                bgcolor: "#fecaca",
                                              },
                                            }}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </AccordionSummary>
                                      <AccordionDetails
                                        sx={{ p: 2.5, bgcolor: "white" }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                          }}
                                        >
                                          <Controller
                                            name={`sections.${sectionIndex}.lessons.${lessonIndex}.lessonName`}
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                {...field}
                                                label="Lesson Name"
                                                placeholder="e.g., Present Simple Tense"
                                                fullWidth
                                                size="small"
                                                sx={{
                                                  "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    bgcolor: "white",
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
                                            name={`sections.${sectionIndex}.lessons.${lessonIndex}.contentType`}
                                            control={control}
                                            render={({ field }) => (
                                              <FormControl
                                                fullWidth
                                                size="small"
                                              >
                                                <InputLabel>
                                                  Content Type
                                                </InputLabel>
                                                <Select
                                                  {...field}
                                                  label="Content Type"
                                                  sx={{
                                                    borderRadius: 2,
                                                    bgcolor: "white",
                                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                                      {
                                                        borderColor: "#667eea",
                                                      },
                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                      {
                                                        borderColor: "#667eea",
                                                      },
                                                  }}
                                                >
                                                  <MenuItem value="video">
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                      }}
                                                    >
                                                      <VideoLibraryIcon
                                                        fontSize="small"
                                                        sx={{
                                                          color: "#667eea",
                                                        }}
                                                      />
                                                      <span>Video</span>
                                                    </Box>
                                                  </MenuItem>
                                                  <MenuItem value="document">
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                      }}
                                                    >
                                                      <DescriptionIcon
                                                        fontSize="small"
                                                        sx={{
                                                          color: "#10b981",
                                                        }}
                                                      />
                                                      <span>Document</span>
                                                    </Box>
                                                  </MenuItem>
                                                  <MenuItem value="text">
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                      }}
                                                    >
                                                      <ArticleIcon
                                                        fontSize="small"
                                                        sx={{
                                                          color: "#f59e0b",
                                                        }}
                                                      />
                                                      <span>Text Content</span>
                                                    </Box>
                                                  </MenuItem>
                                                </Select>
                                              </FormControl>
                                            )}
                                          />

                                          {watchedSections[sectionIndex]
                                            ?.lessons[lessonIndex]
                                            ?.contentType === "video" && (
                                            <Controller
                                              name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoUrl`}
                                              control={control}
                                              render={({ field }) => (
                                                <TextField
                                                  {...field}
                                                  label="Video URL"
                                                  placeholder="https://youtube.com/watch?v=..."
                                                  fullWidth
                                                  size="small"
                                                  sx={{
                                                    "& .MuiOutlinedInput-root":
                                                      {
                                                        borderRadius: 2,
                                                        bgcolor: "white",
                                                        "&:hover fieldset": {
                                                          borderColor:
                                                            "#667eea",
                                                        },
                                                        "&.Mui-focused fieldset":
                                                          {
                                                            borderColor:
                                                              "#667eea",
                                                          },
                                                      },
                                                  }}
                                                />
                                              )}
                                            />
                                          )}

                                          <Controller
                                            name={`sections.${sectionIndex}.lessons.${lessonIndex}.description`}
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                {...field}
                                                label="Description"
                                                placeholder="Brief description of this lesson..."
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
                                                sx={{
                                                  "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    bgcolor: "white",
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
                                      </AccordionDetails>
                                    </Accordion>
                                  )
                                )}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>
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
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Course"
              : "Create Course"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalCreateCourse;
