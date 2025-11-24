const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");

// Tạo review mới
router.post("/", verifyToken, reviewController.createReview);

// Lấy thống kê tổng quan reviews
router.get("/statistics", reviewController.getAdminReviewStats);

// Lấy tất cả reviews (admin only)
router.get("/all", reviewController.getAllReviews);

// Lấy thống kê rating của khóa học
router.get(
  "/course/:courseId/statistics",
  reviewController.getCourseRatingStats
);

// Lấy danh sách reviews theo khóa học
router.get("/course/:courseId", reviewController.getReviewsByCourse);

// Kiểm tra user đã review khóa học này chưa
router.get(
  "/course/:courseId/user-review",
  verifyToken,
  reviewController.getUserReviewForCourse
);

// Lấy danh sách reviews theo user
router.get("/user/:userId", verifyToken, reviewController.getReviewsByUser);

// Lấy review theo ID
router.get("/:id", reviewController.getReviewById);

// Cập nhật review
router.put("/:id", verifyToken, reviewController.updateReview);

// Xóa review
router.delete("/:id", verifyToken, requireAdmin, reviewController.deleteReview);

module.exports = router;
