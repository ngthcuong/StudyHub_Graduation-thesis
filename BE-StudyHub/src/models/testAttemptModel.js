const TestAttempt = require("../schemas/TestAttempt");

const createAttempt = async (attemptData) => {
  try {
    const newAttempt = new TestAttempt(attemptData);
    return await newAttempt.save();
  } catch (error) {
    console.error("Error creating attempt:", error);
    throw new Error("Failed to create attempt");
  }
};

const findAttemptById = async (id) => {
  try {
    return await TestAttempt.findById(id).populate("testPoolId userId");
  } catch (error) {
    console.error("Error finding attempt by id:", error);
    throw new Error("Failed to find attempt by id");
  }
};

const findAttemptsByUser = async (userId) => {
  try {
    return await TestAttempt.find({ userId }).populate("testPoolId");
  } catch (error) {
    console.error("Error finding attempts by user:", error);
    throw new Error("Failed to find attempts by user");
  }
};

const updateAttemptById = async (id, updateData) => {
  try {
    return await TestAttempt.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating attempt:", error);
    throw new Error("Failed to update attempt");
  }
};

const findAttemptByTestId = async (testPoolId, userId) => {
  const query = { testPoolId };
  if (userId) query.userId = userId;

  return await TestAttempt.findOne(query)
    .sort({ createdAt: -1 })
    .populate("testPoolId userId");
};

const findAttemptByUserAndPool = async (userId, testPoolId) => {
  try {
    return await TestAttempt.findOne({ userId, testPoolId }).populate(
      "testPoolId userId"
    );
  } catch (error) {
    console.error("Error finding attempt by user and pool:", error);
    throw new Error("Failed to find attempt by user and pool");
  }
};

module.exports = {
  createAttempt,
  findAttemptById,
  findAttemptsByUser,
  updateAttemptById,
  findAttemptByTestId,
  findAttemptByUserAndPool,
};
