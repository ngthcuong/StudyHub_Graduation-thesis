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
    return await TestAttempt.findById(id).populate("testId userId");
  } catch (error) {
    console.error("Error finding attempt by id:", error);
    throw new Error("Failed to find attempt by id");
  }
};

const findAttemptsByUser = async (userId) => {
  try {
    return await TestAttempt.find({ userId });
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

const findAttemptByTestId = async (testId, userId) => {
  const query = { testId };
  if (userId) query.userId = userId;

  // Lấy attempt mới nhất
  return await TestAttempt.findOne(query).sort({ createdAt: -1 });
};

module.exports = {
  createAttempt,
  findAttemptById,
  findAttemptsByUser,
  updateAttemptById,
  findAttemptByTestId,
};
