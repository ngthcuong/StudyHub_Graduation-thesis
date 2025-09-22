// Export all mock data from a single file for easy importing
export { mockCourses, mockMyCourses, mockCourseCategories } from "./courseData";
export { mockTests, mockTestResults, mockTestCategories } from "./testData";
export { mockUser, mockLearningStats, mockNotifications } from "./userData";

// Import data for helper functions
import { mockCourses } from "./courseData";
import { mockTests } from "./testData";
import { mockUser } from "./userData";

// Helper functions for mock data
export const getMockCourseById = (id) => {
  return mockCourses.find((course) => course.id === id);
};

export const getMockTestById = (id) => {
  return mockTests.find((test) => test.id === id);
};

export const getMockUserStats = () => {
  return mockUser.stats;
};

export const getMockRecentActivity = () => {
  return mockUser.recentActivity;
};

export const getMockAchievements = () => {
  return mockUser.achievements;
};
