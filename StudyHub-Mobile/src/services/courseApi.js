import api from "./api";

export const courseApi = {
  // Get all courses
  getCourses: async (params = {}) => {
    const response = await api.get("/courses", { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Get user's enrolled courses
  getMyCourses: async () => {
    const response = await api.get("/courses/my-courses");
    return response.data;
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  // Get course lessons
  getCourseLessons: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get lesson by ID
  getLessonById: async (courseId, lessonId) => {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Mark lesson as completed
  markLessonCompleted: async (courseId, lessonId) => {
    const response = await api.post(
      `/courses/${courseId}/lessons/${lessonId}/complete`
    );
    return response.data;
  },
};
