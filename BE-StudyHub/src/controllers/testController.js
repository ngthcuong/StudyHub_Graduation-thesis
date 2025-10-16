const testModel = require("../models/testModel");

const createTest = async (req, res) => {
  try {
    const testData = req.body;

    console.log(testData);

    if (!testData)
      return res.status(400).json({ error: "Test data not found" });

    // attach creator if available
    if (req.user && req.user.userId) testData.createdBy = req.user.userId;

    const requiredFields = [
      "title",
      "topic",
      "skill",
      "durationMin",
      "courseId",
      "createdBy",
      "numQuestions",
      "questionTypes",
      "examType",
      "passingScore",
      // "maxAttempts",
      "isTheLastTest",
    ];
    for (const field of requiredFields) {
      if (testData[field] === undefined || testData[field] === null) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Tạo test mới
    const savedTest = await testModel.createTest(testData);
    res
      .status(201)
      .json({ message: "Test created successfully", data: savedTest });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({ error: "Failed to create test" });
  }
};

const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId) return res.status(404).json({ error: "Test ID not found" });

    const test = await testModel.findTestById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });

    res.status(200).json({ message: "Test retrieved", data: test });
  } catch (error) {
    console.error("Error getting test by id:", error);
    res.status(500).json({ error: "Failed to get test by id" });
  }
};

const getAllTests = async (req, res) => {
  try {
    const tests = await testModel.getAllTests();
    res
      .status(200)
      .json({ message: "Tests retrieved", data: tests, total: tests.length });
  } catch (error) {
    console.error("Error getting all tests:", error);
    res.status(500).json({ error: "Failed to get tests" });
  }
};

const getTestsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId)
      return res.status(400).json({ error: "Course ID not found" });

    const tests = await testModel.getTestsByCourseId(courseId);
    if (!tests || tests.length === 0)
      return res.status(404).json({ error: "No tests found for this course" });

    res
      .status(200)
      .json({ message: "Tests retrieved successfully", data: tests });
  } catch (error) {
    console.error("Error getting tests by courseId:", error);
    res.status(500).json({ error: "Failed to get tests by courseId" });
  }
};

const updateTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const updateData = req.body;
    if (!testId) return res.status(404).json({ error: "Test ID not found" });
    if (!updateData)
      return res.status(400).json({ error: "Update data not found" });

    const updatedTest = await testModel.updateTestById(testId, updateData);
    if (!updatedTest) return res.status(404).json({ error: "Test not found" });

    res
      .status(200)
      .json({ message: "Test updated successfully", data: updatedTest });
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ error: "Failed to update test" });
  }
};

const deleteTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId) return res.status(404).json({ error: "Test ID not found" });

    const deleted = await testModel.deleteTestById(testId);
    if (!deleted) return res.status(404).json({ error: "Test not found" });

    res
      .status(200)
      .json({ message: "Test deleted successfully", data: deleted });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ error: "Failed to delete test" });
  }
};

module.exports = {
  createTest,
  getTestById,
  getAllTests,
  updateTestById,
  deleteTestById,
  getTestsByCourseId,
};
