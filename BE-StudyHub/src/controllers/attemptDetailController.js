const attemptDetailModel = require("../models/attemptDetailModel");

const createAttemptDetail = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.attemptId) {
      return res.status(400).json({ error: "attemptId is required" });
    }

    const created = await attemptDetailModel.createAttemptDetail(data);
    res.status(201).json({
      message: "AttemptDetail created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Error creating AttemptDetail:", error);
    res.status(500).json({ error: "Failed to create AttemptDetail" });
  }
};

const getAttemptDetailByAttemptId = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const detail = await attemptDetailModel.getAttemptDetailByAttemptId(
      attemptId
    );

    if (!detail)
      return res.status(404).json({ error: "AttemptDetail not found" });

    res.status(200).json({
      message: "AttemptDetail retrieved successfully",
      data: detail,
    });
  } catch (error) {
    console.error("Error getting AttemptDetail by attemptId:", error);
    res.status(500).json({ error: "Failed to get AttemptDetail" });
  }
};

const updateAttemptDetailByAttemptId = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const updateData = req.body;

    const updated = await attemptDetailModel.updateAttemptDetailByAttemptId(
      attemptId,
      updateData
    );

    if (!updated)
      return res.status(404).json({ error: "AttemptDetail not found" });

    res.status(200).json({
      message: "AttemptDetail updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating AttemptDetail:", error);
    res.status(500).json({ error: "Failed to update AttemptDetail" });
  }
};

const deleteAttemptDetailByAttemptId = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const deleted = await attemptDetailModel.deleteAttemptDetailByAttemptId(
      attemptId
    );

    if (!deleted)
      return res.status(404).json({ error: "AttemptDetail not found" });

    res.status(200).json({
      message: "AttemptDetail deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting AttemptDetail:", error);
    res.status(500).json({ error: "Failed to delete AttemptDetail" });
  }
};

const getAllAttemptDetails = async (req, res) => {
  try {
    const list = await attemptDetailModel.getAllAttemptDetails();
    res.status(200).json({
      message: "AttemptDetails retrieved successfully",
      total: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error getting all AttemptDetails:", error);
    res.status(500).json({ error: "Failed to get AttemptDetails" });
  }
};

module.exports = {
  createAttemptDetail,
  getAttemptDetailByAttemptId,
  updateAttemptDetailByAttemptId,
  deleteAttemptDetailByAttemptId,
  getAllAttemptDetails,
};
