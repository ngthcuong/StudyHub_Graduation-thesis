const Course = require("../schemas/Course");

const courseModel = {
  /**
   * Tạo khóa học mới
   * @param {Object} courseData Dữ liệu khóa học (title, description, cost, ratings)
   * @returns {Object} Khóa học vừa được tạo
   */
  createCourse: async (courseData) => {
    try {
      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();
      return savedCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw new Error("Failed to create course");
    }
  },
};

module.exports = courseModel;
