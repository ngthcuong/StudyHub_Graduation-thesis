const testModel = require("../models/testModel");

const createTest = async (req, res) => {
  try {
    const testData = req.body;

    if (!testData)
      return res.status(400).json({ error: "Test data not found" });

    // attach creator if available
    if (req.user && req.user.userId) testData.createdBy = req.user.userId;

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
};
