import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Radio,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useDeleteQuestionByIdMutation } from "../services/testApi";

const ReviewQuestionsModal = ({ open, onClose, questionsData, onSave }) => {
  const [questions, setQuestions] = useState([]);

  const [deleteQuestionById] = useDeleteQuestionByIdMutation();

  // Load dữ liệu từ props vào state khi mở modal
  useEffect(() => {
    if (questionsData && Array.isArray(questionsData)) {
      // Deep copy để không ảnh hưởng data gốc bên ngoài cho đến khi bấm Save
      setQuestions(JSON.parse(JSON.stringify(questionsData)));
    }
  }, [questionsData]);

  // Hàm xử lý thay đổi nội dung câu hỏi (Title, Description,...)
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Hàm xử lý thay đổi nội dung đáp án (Text của A, B, C, D)
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex].optionText = value;
    setQuestions(updatedQuestions);
  };

  // Hàm chọn đáp án đúng (Radio logic)
  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    // Reset tất cả options của câu này về false
    updatedQuestions[qIndex].options.forEach((opt) => (opt.isCorrect = false));
    // Set đáp án được chọn thành true
    updatedQuestions[qIndex].options[oIndex].isCorrect = true;
    setQuestions(updatedQuestions);
  };

  // Hàm xóa câu hỏi khỏi danh sách
  const handleDeleteQuestion = async (index) => {
    const questionToDelete = questions[index];

    try {
      if (questionToDelete?._id) {
        await deleteQuestionById(questionToDelete?._id).unwrap();
        console.log("Deleted from Database");
      }
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Lỗi: Không thể xóa câu hỏi này. Vui lòng thử lại.");
    }
  };

  const handleSave = () => {
    // Validate cơ bản (ví dụ: bắt buộc phải có đáp án đúng)
    // Code validation ở đây nếu cần...

    // Gửi dữ liệu đã chỉnh sửa ra ngoài
    onSave(questions);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f0f4f8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Review Generated Questions
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Please verify and edit the AI-generated questions before publishing.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#f8f9fa", p: 3 }}>
        {questions.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography>No questions to review.</Typography>
          </Box>
        ) : (
          questions.map((q, qIndex) => (
            <Accordion
              key={q._id || qIndex}
              defaultExpanded
              sx={{
                mb: 2,
                borderRadius: "8px !important",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:before": { display: "none" }, // Xóa line kẻ mặc định của Accordion
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                    pr: 2,
                  }}
                >
                  <Typography fontWeight="bold" sx={{ color: "#333" }}>
                    Question {qIndex + 1}
                  </Typography>
                  <Chip
                    label={
                      q.questionType?.replace("_", " ") || "Multiple Choice"
                    }
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ ml: 2, textTransform: "capitalize" }}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0 }}>
                {/* Nội dung câu hỏi */}
                <TextField
                  fullWidth
                  label="Question Text"
                  placeholder="Enter the question content here..."
                  multiline
                  minRows={2}
                  value={q.questionText || ""}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "questionText", e.target.value)
                  }
                  sx={{ mb: 3, mt: 1, bgcolor: "white" }}
                  variant="outlined"
                />

                {/* Danh sách đáp án */}
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
                >
                  Options (Select the correct answer):
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "#fafafa", mb: 3, borderRadius: 2 }}
                >
                  {q.options.map((opt, oIndex) => (
                    <Box
                      key={opt._id || oIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <Radio
                        checked={opt.isCorrect}
                        onChange={() =>
                          handleCorrectOptionChange(qIndex, oIndex)
                        }
                        color="success"
                        sx={{ p: 0.5 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt.optionText || ""}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        sx={{
                          bgcolor: opt.isCorrect ? "#f1f8e9" : "white",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: opt.isCorrect
                                ? "#4caf50"
                                : "#e0e0e0",
                              borderWidth: opt.isCorrect ? "2px" : "1px",
                            },
                            "&:hover fieldset": {
                              borderColor: opt.isCorrect
                                ? "#2e7d32"
                                : "#bdbdbd",
                            },
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Paper>

                {/* Giải thích */}
                <TextField
                  fullWidth
                  label="Explanation / AI Reasoning"
                  multiline
                  minRows={2}
                  value={q.description || ""}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "description", e.target.value)
                  }
                  sx={{ bgcolor: "white" }}
                  helperText="This explanation will be shown to students after they answer."
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteQuestion(qIndex)}
                    sx={{ textTransform: "none" }}
                  >
                    Remove this Question
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 3, bgcolor: "#fff", borderTop: "1px solid #e0e0e0" }}
      >
        <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
          Cancel (Discard)
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disableElevation
          sx={{ px: 3 }}
        >
          Approve & Save Questions
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewQuestionsModal;
