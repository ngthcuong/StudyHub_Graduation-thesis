const attemptDetailModel = require("../models/attemptDetailModel");

const TestAttempt = require("../schemas/TestAttempt");
const AttemptDetail = require("../schemas/AttemptDetail");
const TestPool = require("../schemas/TestPool");
const Test = require("../schemas/Test");

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

const getUserTestDetailsGroupedByTest = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.userId;

    // 1️⃣ Lấy toàn bộ attempt của user + populate sang testPool -> test
    const attempts = await TestAttempt.find({ userId })
      .populate({
        path: "testPoolId",
        populate: {
          path: "baseTestId",
          model: "Test",
          select: "title skill level examType durationMin",
        },
      })
      .sort({ createdAt: -1 });

    // 2️⃣ Lấy toàn bộ attemptId của user
    const attemptIds = attempts.map((a) => a._id);

    // 3️⃣ Lấy toàn bộ chi tiết attempt (AttemptDetail)
    const attemptDetails = await AttemptDetail.find({
      attemptId: { $in: attemptIds },
    });

    // 4️⃣ Gom nhóm theo Test
    const groupedByTest = {};

    for (const attempt of attempts) {
      const testInfo = attempt.testPoolId?.baseTestId;
      if (!testInfo) continue;

      const testId = testInfo._id.toString();

      if (!groupedByTest[testId]) {
        groupedByTest[testId] = {
          testId,
          title: testInfo.title,
          skill: testInfo.skill,
          level: testInfo.level,
          examType: testInfo.examType,
          durationMin: testInfo.durationMin,
          attempts: [],
        };
      }

      // tìm chi tiết tương ứng
      const details = attemptDetails.filter(
        (d) => d.attemptId.toString() === attempt._id.toString()
      );

      groupedByTest[testId].attempts.push({
        attemptId: attempt._id,
        attemptNumber: attempt.attemptNumber,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        score: attempt.score,
        totalScore: details[0]?.totalScore || 0,
        detailCount: details[0]?.answers?.length || 0,
        submittedAt: details[0]?.submittedAt,
      });
    }

    res.status(200).json({
      message: "Fetched all test details grouped by test successfully",
      data: Object.values(groupedByTest),
    });
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({
      message: "Failed to get test details for user",
      error: error.message,
    });
  }
};

module.exports = {
  createAttemptDetail,
  getAttemptDetailByAttemptId,
  updateAttemptDetailByAttemptId,
  deleteAttemptDetailByAttemptId,
  getAllAttemptDetails,
  getUserTestDetailsGroupedByTest,
};
