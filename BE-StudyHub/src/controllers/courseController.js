const courseModel = require("../models/courseModel");

/** Hàm tạo khóa học mới */
const createCourse = async (req, res) => {
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
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseModel.findCourseById(id);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error getting course by id:", error);
    res.status(500).json({ error: "Failed to get course by id" });
  }
};

const getCourseByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const course = await courseModel.findCourseByTitle(title);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error getting course by title:", error);
    res.status(500).json({ error: "Failed to get course by title" });
  }
};

const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedCourse = await courseModel.updateCourseById(id, updateData);
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course by id:", error);
    res.status(500).json({ error: "Failed to update course by id" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error getting all courses:", error);
    res.status(500).json({ error: "Failed to get all courses" });
  }
};

const addRatingToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, content } = req.body;

    if (!id) return res.status(400).json({ error: "Missing course id" });
    if (!userId || typeof rating === "undefined" || !content) {
      return res
        .status(400)
        .json({ error: "Missing required fields (userId, rating, content)" });
    }

    const numericRating = Number(rating);
    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5" });
    }

    const updatedCourse = await courseModel.addRatingToCourse(id, {
      userId,
      rating: numericRating,
      content,
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json({
      message: "Rating added successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error adding rating to course:", error);
    res.status(500).json({ error: "Failed to add rating to course" });
  }
};

module.exports = {
  createCourse,
  getCourseById,
  getCourseByTitle,
  getAllCourses,
  updateCourseById,
  addRatingToCourse,
};
