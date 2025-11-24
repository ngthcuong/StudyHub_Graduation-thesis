import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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

  // get my course
  getMyCourses: async (userId) => {
    const response = await api.get(`/courses/my-courses/${userId}`);
    return response.data;
  },

  // get all courses
  getAllCourses: async () => {
    const response = await api.get(`/courses`);
    return response.data;
  },

  // get grammar courses by id
  getGrammarCoursesById: async (courseId) => {
    const response = await api.get(`/grammar-lessons/course/${courseId}`);
    return response.data;
  },

  // get part of grammar lessons by id
  getPartGrammarLessonsById: async (partId) => {
    const response = await api.get(`/grammar-lessons/parts/${partId}`);
    return response.data;
  },

  // buy course
  buyCourse: async (linkData) => {
    const response = await api.post(`/payments/create-payment-link`, linkData);
    return response.data;
  },
};
