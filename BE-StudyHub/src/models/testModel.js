const Test = require("../schemas/Test");

const createTest = async (testData) => {
  try {
    const newTest = new Test(testData);
    const savedTest = await newTest.save();
    return savedTest;
  } catch (error) {
    console.error("Error creating test:", error);
    throw new Error("Failed to create test");
  }
};

const findTestById = async (id) => {
  try {
    return await Test.findById(id).populate("createdBy", "fullName email");
  } catch (error) {
    console.error("Error finding test by id:", error);
    throw new Error("Failed to find test by id");
  }
};

const getAllTests = async (filter = {}) => {
  try {
    return await Test.find(filter).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting all tests:", error);
    throw new Error("Failed to get all tests");
  }
};

const updateTestById = async (id, updateData) => {
  try {
    return await Test.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating test:", error);
    throw new Error("Failed to update test");
  }
};

const deleteTestById = async (id) => {
  try {
    return await Test.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting test:", error);
    throw new Error("Failed to delete test");
  }
};

module.exports = {
  createTest,
  findTestById,
  getAllTests,
  updateTestById,
  deleteTestById,
};
