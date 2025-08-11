const courseModel = require("../models/courseModel");

const courseController = {
  /** Hàm tạo khóa học mới */
  createCourse: async (req, res) => {
    try {
      const courseData = req.body;
      const savedCourse = await courseModel.createCourse(courseData);
      res.status(201).json({
        message: "Course created successfully!",
        course: savedCourse,
      });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  },
};

module.exports = courseController;
