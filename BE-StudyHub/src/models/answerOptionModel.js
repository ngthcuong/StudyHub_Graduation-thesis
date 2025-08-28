const AnswerOption = require("../schemas/AnswerOption");

const createAnswerOption = async (optionData) => {
  try {
    const newOpt = new AnswerOption(optionData);
    return await newOpt.save();
  } catch (error) {
    console.error("Error creating answer option:", error);
    throw new Error("Failed to create answer option");
  }
};

const findOptionsByQuestion = async (questionId) => {
  try {
    return await AnswerOption.find({ questionId }).sort({
      order: 1,
      createdAt: 1,
    });
  } catch (error) {
    console.error("Error finding options by question:", error);
    throw new Error("Failed to find options by question");
  }
};

const updateOptionById = async (id, updateData) => {
  try {
    return await AnswerOption.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating option:", error);
    throw new Error("Failed to update option");
  }
};

const deleteOptionById = async (id) => {
  try {
    return await AnswerOption.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting option:", error);
    throw new Error("Failed to delete option");
  }
};

module.exports = {
  createAnswerOption,
  findOptionsByQuestion,
  updateOptionById,
  deleteOptionById,
};
