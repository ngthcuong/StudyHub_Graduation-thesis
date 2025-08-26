const Question = require("../schemas/Question");

const createQuestion = async (questionData) => {
  try {
    const newQ = new Question(questionData);
    return await newQ.save();
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Failed to create question");
  }
};

const findQuestionById = async (id) => {
  try {
    return await Question.findById(id);
  } catch (error) {
    console.error("Error finding question by id:", error);
    throw new Error("Failed to find question by id");
  }
};

const findQuestionsByTest = async (testId) => {
  try {
    return await Question.find({ testId }).sort({ createdAt: 1 });
  } catch (error) {
    console.error("Error finding questions by test:", error);
    throw new Error("Failed to find questions by test");
  }
};

const updateQuestionById = async (id, updateData) => {
  try {
    return await Question.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Failed to update question");
  }
};

const deleteQuestionById = async (id) => {
  try {
    return await Question.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Failed to delete question");
  }
};

module.exports = {
  createQuestion,
  findQuestionById,
  findQuestionsByTest,
  updateQuestionById,
  deleteQuestionById,
};
