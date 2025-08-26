const questionModel = require("../models/questionModel");
const answerOptionModel = require("../models/answerOptionModel");

// Create question (optionally with options array)
const createQuestion = async (req, res) => {
  try {
    const { options, ...questionData } = req.body;
    if (!questionData || !questionData.testId || !questionData.questionText) {
      return res.status(400).json({ error: "Question data incomplete" });
    }

    const savedQuestion = await questionModel.createQuestion(questionData);

    // insert options if provided
    let savedOptions = [];
    if (Array.isArray(options) && options.length) {
      savedOptions = await Promise.all(
        options.map((opt, idx) =>
          answerOptionModel.createAnswerOption({
            questionId: savedQuestion._id,
            label: opt.label,
            optionText: opt.optionText,
            isCorrect: !!opt.isCorrect,
            order: opt.order ?? idx,
          })
        )
      );
    }

    res.status(201).json({
      message: "Question created",
      data: { question: savedQuestion, options: savedOptions },
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question" });
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
  getQuestionsByTest,
  updateQuestionById,
  deleteQuestionById,
};
