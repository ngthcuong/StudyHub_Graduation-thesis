const AttemptDetail = require("../schemas/AttemptDetail");

// Tạo mới bản ghi AttemptDetail
const createAttemptDetail = async (data) => {
  try {
    const newAttemptDetail = new AttemptDetail(data);
    const saved = await newAttemptDetail.save();
    return saved;
  } catch (error) {
    console.error("Error creating AttemptDetail:", error);
    throw new Error("Failed to create AttemptDetail");
  }
};

// Lấy AttemptDetail theo attemptId
const getAttemptDetailByAttemptId = async (attemptId) => {
  try {
    return await AttemptDetail.findOne(attemptId)
      .populate("attemptId")
      .populate("answers.questionId");
  } catch (error) {
    console.error("Error getting AttemptDetail by attemptId:", error);
    throw new Error("Failed to get AttemptDetail by attemptId");
  }
};

// Cập nhật AttemptDetail theo attemptId
const updateAttemptDetailByAttemptId = async (attemptId, updateData) => {
  try {
    return await AttemptDetail.findOneAndUpdate({ attemptId }, updateData, {
      new: true,
    });
  } catch (error) {
    console.error("Error updating AttemptDetail:", error);
    throw new Error("Failed to update AttemptDetail");
  }
};

// Xoá AttemptDetail theo attemptId
const deleteAttemptDetailByAttemptId = async (attemptId) => {
  try {
    return await AttemptDetail.findOneAndDelete({ attemptId });
  } catch (error) {
    console.error("Error deleting AttemptDetail:", error);
    throw new Error("Failed to delete AttemptDetail");
  }
};

// Lấy toàn bộ AttemptDetail (chủ yếu dùng admin)
const getAllAttemptDetails = async () => {
  try {
    return await AttemptDetail.find().populate(
      "attemptId",
      "userId testId createdAt"
    );
  } catch (error) {
    console.error("Error getting all AttemptDetails:", error);
    throw new Error("Failed to get all AttemptDetails");
  }
};

module.exports = {
  createAttemptDetail,
  getAttemptDetailByAttemptId,
  updateAttemptDetailByAttemptId,
  deleteAttemptDetailByAttemptId,
  getAllAttemptDetails,
};
