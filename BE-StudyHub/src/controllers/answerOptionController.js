const answerOptionModel = require("../models/answerOptionModel");

const createAnswerOption = async (req, res) => {
  try {
    const optionData = req.body;
    if (!optionData || !optionData.questionId || !optionData.optionText) {
      return res.status(400).json({ error: "Option data incomplete" });
    }
    const saved = await answerOptionModel.createAnswerOption(optionData);
    res.status(201).json({ message: "Option created", data: saved });
  } catch (error) {
    console.error("Error creating option:", error);
    res.status(500).json({ error: "Failed to create option" });
  }
};

const getOptionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!questionId)
      return res.status(400).json({ error: "Question ID not found" });

    const options = await answerOptionModel.findOptionsByQuestion(questionId);
    res
      .status(200)
      .json({
        message: "Options retrieved",
        data: options,
        total: options.length,
      });
  } catch (error) {
    console.error("Error getting options:", error);
    res.status(500).json({ error: "Failed to get options" });
  }
};

const updateAnswerOption = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await answerOptionModel.updateOptionById(id, req.body);
    if (!updated) return res.status(404).json({ error: "Option not found" });
    res.status(200).json({ message: "Option updated", data: updated });
  } catch (error) {
    console.error("Error updating option:", error);
    res.status(500).json({ error: "Failed to update option" });
  }
};

const deleteAnswerOption = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await answerOptionModel.deleteOptionById(id);
    if (!deleted) return res.status(404).json({ error: "Option not found" });
    res.status(200).json({ message: "Option deleted" });
  } catch (error) {
    console.error("Error deleting option:", error);
    res.status(500).json({ error: "Failed to delete option" });
  }
};

module.exports = {
  createAnswerOption,
  getOptionsByQuestion,
  updateAnswerOption,
  deleteAnswerOption,
};
