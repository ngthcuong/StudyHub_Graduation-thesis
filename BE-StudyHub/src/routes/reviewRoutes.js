const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

// Tạo review mới
router.post("/", verifyToken, reviewController.createReview);

// Lấy thống kê tổng quan reviews cho admin
router.get(
  "/statistics",
  verifyToken,
  requireAdmin,
  reviewController.getAdminReviewStats
);

// Lấy thống kê rating của khóa học
router.get(
  "/course/:courseId/statistics",
  verifyToken,
  requireAdmin,
  reviewController.getCourseRatingStats
);

// Lấy danh sách reviews theo khóa học
router.get("/course/:courseId", reviewController.getReviewsByCourse);

// Lấy danh sách reviews theo user
router.get("/user/:userId", verifyToken, reviewController.getReviewsByUser);

// Lấy review theo ID
router.get("/:id", reviewController.getReviewById);

// Cập nhật review
router.put("/:id", verifyToken, reviewController.updateReview);

// Xóa review
router.delete("/:id", verifyToken, requireAdmin, reviewController.deleteReview);

module.exports = router;
