const testPoolModel = require("../models/testPoolModel");

const createTestPool = async (req, res) => {
  try {
    const poolData = req.body;
    if (!poolData)
      return res.status(400).json({ error: "Pool data not found" });

    if (req.user && req.user.userId) poolData.createdBy = req.user.userId;

    const savedPool = await testPoolModel.createTestPool(poolData);
    res.status(201).json({ message: "Test pool created", data: savedPool });
  } catch (error) {
    console.error("Error creating test pool:", error);
    res.status(500).json({ error: "Failed to create test pool" });
  }
};

const getTestPoolById = async (req, res) => {
  try {
    const { poolId } = req.params;
    const pool = await testPoolModel.findTestPoolById(poolId);
    if (!pool) return res.status(404).json({ error: "Pool not found" });

    res.status(200).json({ message: "Test pool retrieved", data: pool });
  } catch (error) {
    console.error("Error getting pool by id:", error);
    res.status(500).json({ error: "Failed to get test pool" });
  }
};

const getAllTestPools = async (req, res) => {
  try {
    const pools = await testPoolModel.getAllTestPools();
    res
      .status(200)
      .json({ message: "Pools retrieved", data: pools, total: pools.length });
  } catch (error) {
    console.error("Error getting all pools:", error);
    res.status(500).json({ error: "Failed to get test pools" });
  }
};

const updateTestPoolById = async (req, res) => {
  try {
    const { poolId } = req.params;
    const updated = await testPoolModel.updateTestPoolById(poolId, req.body);
    if (!updated) return res.status(404).json({ error: "Pool not found" });

    res.status(200).json({ message: "Pool updated", data: updated });
  } catch (error) {
    console.error("Error updating pool:", error);
    res.status(500).json({ error: "Failed to update test pool" });
  }
};

const deleteTestPoolById = async (req, res) => {
  try {
    const { poolId } = req.params;
    const deleted = await testPoolModel.deleteTestPoolById(poolId);
    if (!deleted) return res.status(404).json({ error: "Pool not found" });

    res.status(200).json({ message: "Pool deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting pool:", error);
    res.status(500).json({ error: "Failed to delete test pool" });
  }
};

module.exports = {
  createTestPool,
  getTestPoolById,
  getAllTestPools,
  updateTestPoolById,
  deleteTestPoolById,
};
