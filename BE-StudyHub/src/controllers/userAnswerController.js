const userAnswerModel = require("../models/userAnswerModel");
const questionModel = require("../models/questionModel");
// const AnswerOption = require("../schemas/AnswerOption");

const submitAnswer = async (req, res) => {
  try {
    const {
      attemptId,
      questionId,
      selectedOptionId,
      answerText,
      answerLetter,
    } = req.body;

    // Validate input
    if (!attemptId || !questionId) {
      return res
        .status(400)
        .json({ error: "attemptId and questionId are required" });
    }

    // Lấy question
    const question = await questionModel.findById(questionId).lean();
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Tìm option trong question.options
    let selectedOption = null;
    if (selectedOptionId) {
      selectedOption = question.options.find(
        (opt) => opt._id.toString() === selectedOptionId
      );
    }
    if (!selectedOption && answerLetter) {
      selectedOption = question.options.find(
        (opt, idx) =>
          opt.label?.toUpperCase() === answerLetter.toUpperCase() ||
          String.fromCharCode(65 + idx) === answerLetter.toUpperCase() // A,B,C,D,...
      );
    }

    // Tính điểm
    let isCorrect = undefined;
    let score = 0;

    if (question.questionType === "mcq") {
      if (selectedOption) {
        isCorrect = !!selectedOption.isCorrect;
        score = isCorrect ? question.points || 1 : 0;
      } else {
        isCorrect = false;
        score = 0;
      }
    } else {
      // essay, short answer...
      isCorrect = undefined;
      score = 0;
    }

    // Lưu UserAnswer
    const ua = await userAnswerModel.createUserAnswer({
      attemptId,
      questionId,
      selectedOptionId: selectedOption?._id,
      selectedOptionText: selectedOption?.optionText, // thêm field để tiện debug
      answerText,
      isCorrect,
      score,
    });

    return res.status(201).json({ message: "Answer saved", data: ua });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({ error: "Failed to submit answer" });
  }
};

const getAnswersByAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    if (!attemptId)
      return res.status(400).json({ error: "Attempt ID not found" });

    const answers = await userAnswerModel.findAnswersByAttempt(attemptId);
    res.status(200).json({
      message: "Answers retrieved",
      data: answers,
      total: answers.length,
    });
  } catch (error) {
    console.error("Error getting answers by attempt:", error);
    res.status(500).json({ error: "Failed to get answers" });
  }
};

const updateUserAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await userAnswerModel.updateUserAnswerById(id, req.body);
    if (!updated) return res.status(404).json({ error: "Answer not found" });
    res.status(200).json({ message: "Answer updated", data: updated });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ error: "Failed to update answer" });
  }
};

const deleteUserAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userAnswerModel.deleteUserAnswerById(id);
    if (!deleted) return res.status(404).json({ error: "Answer not found" });
    res.status(200).json({ message: "Answer deleted" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ error: "Failed to delete answer" });
  }
};

module.exports = {
  submitAnswer,
  getAnswersByAttempt,
  updateUserAnswer,
  deleteUserAnswer,
};
