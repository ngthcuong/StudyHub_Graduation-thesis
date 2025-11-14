import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
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
import { useUpdateGrammarLessonMutation } from "../services/grammarLessonApi";
import { toast } from "react-toastify";

// Validation schema
const lessonSchema = yup.object().shape({
  title: yup.string().required("Tên bài học là bắt buộc"),
  parts: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Tên Part là bắt buộc"),
      description: yup.string(),
      content: yup.string(),
      contentType: yup.string().oneOf(["video", "document", "text"]),
      videoUrl: yup.string().url("Phải là URL hợp lệ"),
      attachmentUrl: yup.string().url("Phải là URL hợp lệ"),
    })
  ),
});

const ModalUpdateLesson = ({ open, onClose, onSuccess, lesson }) => {
  const [updateLesson, { isLoading }] = useUpdateGrammarLessonMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(lessonSchema),
    defaultValues: {
      title: "",
      parts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  // Load lesson data when modal opens
  useEffect(() => {
    if (open && lesson) {
      reset({
        title: lesson.title || "",
        parts: lesson.parts || [],
      });
    }
  }, [open, lesson, reset]);

  const onSubmit = async (data) => {
    try {
      await updateLesson({
        id: lesson._id,
        ...data,
      }).unwrap();

      toast.success("Cập nhật bài học thành công!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error(error?.data?.message || "Không thể cập nhật bài học!");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddPart = () => {
    append({
      title: "",
      description: "",
      content: "",
      contentType: "text",
      videoUrl: "",
      attachmentUrl: "",
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
          Cập nhật bài học
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tên bài học"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Danh sách Parts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddPart}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Thêm Part
                </Button>
              </Box>
            </Grid>

            {fields.map((part, partIndex) => (
              <Grid item xs={12} key={part.id}>
                <Box
                  sx={{
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
                    <Chip label={`Part ${partIndex + 1}`} color="primary" />
                    <IconButton
                      size="small"
                      onClick={() => remove(partIndex)}
                      sx={{ color: "#ef4444" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name={`parts.${partIndex}.title`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Tên Part"
                            fullWidth
                            error={!!errors.parts?.[partIndex]?.title}
                            helperText={
                              errors.parts?.[partIndex]?.title?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name={`parts.${partIndex}.description`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Mô tả"
                            fullWidth
                            multiline
                            rows={2}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name={`parts.${partIndex}.contentType`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
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
                        name={`parts.${partIndex}.content`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Nội dung" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name={`parts.${partIndex}.videoUrl`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Video URL"
                            fullWidth
                            error={!!errors.parts?.[partIndex]?.videoUrl}
                            helperText={
                              errors.parts?.[partIndex]?.videoUrl?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name={`parts.${partIndex}.attachmentUrl`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Attachment URL"
                            fullWidth
                            error={!!errors.parts?.[partIndex]?.attachmentUrl}
                            helperText={
                              errors.parts?.[partIndex]?.attachmentUrl?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            ))}

            {fields.length === 0 && (
              <Grid item xs={12}>
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Chưa có part nào. Click "Thêm Part" để bắt đầu.
                </Typography>
              </Grid>
            )}
          </Grid>
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

export default ModalUpdateLesson;
