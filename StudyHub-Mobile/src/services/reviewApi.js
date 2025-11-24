import api from "./api";

export const reviewApi = {
  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // Lấy danh sách reviews theo khóa học
  getReviewsByCourse: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
  },

  // Lấy danh sách reviews theo user
  getReviewsByUser: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Lấy thống kê rating của khóa học
  getCourseRatingStats: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}/statistics`);
    return response.data;
  },

  // Kiểm tra user đã review khóa học này chưa
  getUserReviewForCourse: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}/user-review`);
    return response.data;
  },

  // Cập nhật review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },
};
