import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateCourseMutation } from "../services/courseApi";
import { toast } from "react-toastify";

// Validation schema
const courseSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  courseType: yup.string().required("Course type is required"),
  courseLevel: yup.string().required("Course level is required"),
  cost: yup
    .number()
    .required("Cost is required")
    .min(0, "Cost must be positive"),
  thumbnailUrl: yup.string().url("Must be a valid URL"),
  sections: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Section title is required"),
      parts: yup.array().of(
        yup.object().shape({
          title: yup.string().required("Part title is required"),
          description: yup.string(),
          content: yup.string(),
          contentType: yup.string().oneOf(["video", "document", "text"]),
          videoUrl: yup.string().url("Must be a valid URL"),
          attachmentUrl: yup.string().url("Must be a valid URL"),
        })
      ),
    })
  ),
});

const courseLevelsByType = {
  TOEIC: ["10-250", "255-400", "405-600", "605-780", "785-900", "905-990"],
  IELTS: ["0-3.5", "4.0-4.5", "5.0-5.5", "6.0-6.5", "7.0-7.5", "8.5-9.0"],
};

const ModalUpdateCourse = ({ open, onClose, onSuccess, course }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      courseType: "TOEIC",
      courseLevel: "",
      cost: 0,
      thumbnailUrl: "",
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

  const courseType = watch("courseType");

  // Load course data when modal opens
  useEffect(() => {
    if (open && course) {
      reset({
        title: course.title || "",
        description: course.description || "",
        courseType: course.courseType || "TOEIC",
        courseLevel: course.courseLevel || "",
        cost: course.cost || 0,
        thumbnailUrl: course.thumbnailUrl || "",
        sections: course.sections || [],
      });
    }
  }, [open, course, reset]);

  // Reset courseLevel when courseType changes
  useEffect(() => {
    if (courseType) {
      const currentLevel = watch("courseLevel");
      const availableLevels = courseLevelsByType[courseType] || [];
      if (!availableLevels.includes(currentLevel)) {
        setValue("courseLevel", "");
      }
    }
  }, [courseType, setValue, watch]);

  const onSubmit = async (data) => {
    try {
      await updateCourse({
        id: course._id,
        ...data,
      }).unwrap();

      toast.success("Cập nhật khóa học thành công!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error?.data?.message || "Không thể cập nhật khóa học!");
    }
  };

  const handleClose = () => {
    reset();
    setActiveTab(0);
    onClose();
  };

  const handleAddSection = () => {
    appendSection({
      title: "",
      parts: [
        {
          title: "",
          description: "",
          content: "",
          contentType: "text",
          videoUrl: "",
          attachmentUrl: "",
        },
      ],
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Cập nhật khóa học
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Thông tin khóa học" />
          <Tab label="Danh sách bài học" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Tab 1: Course Information */}
          <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên khóa học"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mô tả"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="courseType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.courseType}>
                      <InputLabel>Loại khóa học</InputLabel>
                      <Select {...field} label="Loại khóa học">
                        <MenuItem value="TOEIC">TOEIC</MenuItem>
                        <MenuItem value="IELTS">IELTS</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="courseLevel"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.courseLevel}>
                      <InputLabel>Cấp độ</InputLabel>
                      <Select {...field} label="Cấp độ">
                        {(courseLevelsByType[courseType] || []).map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Giá (VNĐ)"
                      type="number"
                      fullWidth
                      error={!!errors.cost}
                      helperText={errors.cost?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="thumbnailUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="URL Thumbnail"
                      fullWidth
                      error={!!errors.thumbnailUrl}
                      helperText={errors.thumbnailUrl?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Tab 2: Lessons/Sections */}
          <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Danh sách bài học</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddSection}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Thêm bài học
              </Button>
            </Box>

            {sectionFields.map((section, sectionIndex) => (
              <Box
                key={section.id}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Bài học {sectionIndex + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeSection(sectionIndex)}
                    sx={{ color: "#ef4444" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Controller
                  name={`sections.${sectionIndex}.title`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên bài học"
                      fullWidth
                      sx={{ mb: 2 }}
                      error={!!errors.sections?.[sectionIndex]?.title}
                      helperText={
                        errors.sections?.[sectionIndex]?.title?.message
                      }
                    />
                  )}
                />

                <PartsList
                  control={control}
                  sectionIndex={sectionIndex}
                  errors={errors}
                />
              </Box>
            ))}

            {sectionFields.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Chưa có bài học nào. Click "Thêm bài học" để bắt đầu.
              </Typography>
            )}
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} sx={{ color: "#6b7280" }}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Parts List Component
const PartsList = ({ control, sectionIndex, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.parts`,
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
          Danh sách Parts
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() =>
            append({
              title: "",
              description: "",
              content: "",
              contentType: "text",
              videoUrl: "",
              attachmentUrl: "",
            })
          }
        >
          Thêm Part
        </Button>
      </Box>

      {fields.map((part, partIndex) => (
        <Box
          key={part.id}
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "white",
            borderRadius: 1,
            border: "1px solid #e5e7eb",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Chip
              label={`Part ${partIndex + 1}`}
              size="small"
              color="primary"
            />
            <IconButton size="small" onClick={() => remove(partIndex)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.title`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tên Part"
                    fullWidth
                    size="small"
                    error={
                      !!errors.sections?.[sectionIndex]?.parts?.[partIndex]
                        ?.title
                    }
                    helperText={
                      errors.sections?.[sectionIndex]?.parts?.[partIndex]?.title
                        ?.message
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mô tả"
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.contentType`}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Loại nội dung</InputLabel>
                    <Select {...field} label="Loại nội dung">
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="document">Document</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.content`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nội dung"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.videoUrl`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Video URL"
                    fullWidth
                    size="small"
                    error={
                      !!errors.sections?.[sectionIndex]?.parts?.[partIndex]
                        ?.videoUrl
                    }
                    helperText={
                      errors.sections?.[sectionIndex]?.parts?.[partIndex]
                        ?.videoUrl?.message
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={`sections.${sectionIndex}.parts.${partIndex}.attachmentUrl`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Attachment URL"
                    fullWidth
                    size="small"
                    error={
                      !!errors.sections?.[sectionIndex]?.parts?.[partIndex]
                        ?.attachmentUrl
                    }
                    helperText={
                      errors.sections?.[sectionIndex]?.parts?.[partIndex]
                        ?.attachmentUrl?.message
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      {fields.length === 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", py: 2 }}
        >
          Chưa có part nào
        </Typography>
      )}
    </Box>
  );
};

export default ModalUpdateCourse;
