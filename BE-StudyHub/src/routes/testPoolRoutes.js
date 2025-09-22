const express = require("express");
const router = express.Router();
const testPoolController = require("../controllers/testPoolController");

// Admin tạo TestPool (sau khi AI sinh ra)
router.post("/", testPoolController.createTestPool);

// Lấy danh sách pool
router.get("/", testPoolController.getAllTestPools);

// Lấy pool theo ID
router.get("/:poolId", testPoolController.getTestPoolById);

// Update pool (admin)
router.put("/:poolId", testPoolController.updateTestPoolById);

// Xoá pool (admin)
router.delete("/:poolId", testPoolController.deleteTestPoolById);

module.exports = router;
