const TestPool = require("../schemas/TestPool");

const createTestPool = async (poolData) => {
  try {
    const newPool = new TestPool(poolData);
    return await newPool.save();
  } catch (error) {
    console.error("Error creating test pool:", error);
    throw new Error("Failed to create test pool");
  }
};

const findTestPoolById = async (id) => {
  try {
    return await TestPool.findById(id).populate("createdBy", "fullName email");
  } catch (error) {
    console.error("Error finding test pool:", error);
    throw new Error("Failed to find test pool");
  }
};

const getAllTestPools = async (filter = {}) => {
  try {
    return await TestPool.find(filter).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error getting all test pools:", error);
    throw new Error("Failed to get test pools");
  }
};

const updateTestPoolById = async (id, updateData) => {
  try {
    return await TestPool.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating test pool:", error);
    throw new Error("Failed to update test pool");
  }
};

const deleteTestPoolById = async (id) => {
  try {
    return await TestPool.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting test pool:", error);
    throw new Error("Failed to delete test pool");
  }
};

module.exports = {
  createTestPool,
  findTestPoolById,
  getAllTestPools,
  updateTestPoolById,
  deleteTestPoolById,
};
