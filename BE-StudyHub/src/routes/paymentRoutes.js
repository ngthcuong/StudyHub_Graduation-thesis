const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

// Tạo payment mới (thanh toán khóa học)
router.post("/", verifyToken, paymentController.createPayment);

// Lấy thống kê payments cho admin
router.get(
  "/statistics",
  verifyToken,
  requireAdmin,
  paymentController.getAdminPaymentStats
);

// Lấy tất cả payments (admin only)
router.get("/", verifyToken, requireAdmin, paymentController.getAllPayments);

// Lấy danh sách payments theo khóa học
router.get(
  "/course/:courseId",
  verifyToken,
  paymentController.getPaymentsByCourse
);

// Lấy danh sách payments theo user
router.get("/user", verifyToken, paymentController.getPaymentsByUser);

module.exports = router;
