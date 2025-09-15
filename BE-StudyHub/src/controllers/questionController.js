const questionModel = require("../models/questionModel");
const answerOptionModel = require("../models/answerOptionModel");

// Create question (optionally with options array)
const createQuestion = async (req, res) => {
  try {
    const {
      testId,
      questionText,
      questionType,
      skill,
      topic,
      points,
      options,
    } = req.body;

    if (!testId || !questionText || !questionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      questionType === "mcq" &&
      (!options || !Array.isArray(options) || options.length === 0)
    ) {
      return res.status(400).json({ error: "MCQ must include options" });
    }

    const newQuestion = await questionModel.createQuestion({
      testId,
      questionText,
      questionType,
      skill,
      topic,
      points,
      options,
    });

    res.status(201).json({
      message: "Question created successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const createManyQuestions = async (req, res) => {
  try {
    let { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Questions array is required" });
    }

    // Validate nhanh
    for (let q of questions) {
      if (!q.testId || !q.questionText || !q.questionType) {
        return res
          .status(400)
          .json({ error: "Missing required fields in some questions" });
      }
      if (q.questionType && (!q.options || q.options.length === 0)) {
        return res.status(400).json({ error: "MCQ must include options" });
      }
    }

    // Lưu vào DB (nếu questionModel là mongoose model thì dùng insertMany)
    const newQuestions = await questionModel.createManyQuestions(questions);

    res.status(201).json({
      message: `${newQuestions.length} questions created successfully`,
      data: newQuestions,
    });
  } catch (error) {
    console.error("Error creating questions:", error);
    res.status(500).json({ error: "Failed to create questions" });
  }
};

const getQuestionsByTest = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId) return res.status(400).json({ error: "Test ID not found" });

    const questions = await questionModel.findQuestionsByTest(testId);

    res.status(200).json({
      message: "Questions retrieved",
      data: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ error: "Failed to get questions" });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId)
      return res.status(400).json({ error: "Question ID not found" });

    const question = await questionModel.findQuestionById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    res.status(200).json({
      message: "Question retrieved successfully",
      data: question,
    });
  } catch (error) {
    console.error("Error getting question by ID:", error);
    res.status(500).json({ error: "Failed to get question" });
  }
};

const updateQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updateData = req.body;
    if (!questionId)
      return res.status(400).json({ error: "Question ID not found" });

    const updated = await questionModel.updateQuestionById(
      questionId,
      updateData
    );
    if (!updated) return res.status(404).json({ error: "Question not found" });

    res.status(200).json({ message: "Question updated", data: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Failed to update question" });
  }
};

const deleteQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId)
      return res.status(400).json({ error: "Question ID not found" });

    const deleted = await questionModel.deleteQuestionById(questionId);
    if (!deleted) return res.status(404).json({ error: "Question not found" });

    res.status(200).json({ message: "Question deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Failed to delete question" });
  }
};

module.exports = {
  createQuestion,
  createManyQuestions,
  getQuestionsByTest,
  updateQuestionById,
  deleteQuestionById,
  getQuestionById,
};
