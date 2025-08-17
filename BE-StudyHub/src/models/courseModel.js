const Course = require("../schemas/Course");

/**
 * Tạo khóa học mới
 * @param {Object} courseData Dữ liệu khóa học (title, description, cost, ratings)
 * @returns {Object} Khóa học vừa được tạo
 */
const createCourse = async (courseData) => {
  try {
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    return savedCourse;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }
};

const findCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    console.error("Error finding course by id:", error);
    throw new Error("Failed to find course by id");
  }
};

const findCourseByTitle = async (title) => {
  try {
    const course = await Course.findOne({ title });
    return course;
  } catch (error) {
    console.error("Error finding course by title:", error);
    throw new Error("Failed to find course by title");
  }
};

const updateCourseById = async (id, updateData) => {
  try {
    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return course;
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Failed to update course");
  }
};

const getAllCourses = async () => {
  try {
    const courses = await Course.find();
    return courses;
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw new Error("Failed to get all courses");
  }
};

const addRatingToCourse = async (id, ratingData) => {
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      { $push: { ratings: ratingData } },
      { new: true }
    );
    return course;
  } catch (error) {
    console.error("Error adding rating to course:", error);
    throw new Error("Failed to add rating to course");
  }
};

const getCourseRatings = async (id) => {
  try {
    const course = await Course.findById(id);
    return course.ratings;
  } catch (error) {
    console.error("Error getting course ratings:", error);
    throw new Error("Failed to get course ratings");
  }
};

module.exports = {
  createCourse,
  findCourseById,
  findCourseByTitle,
  updateCourseById,
  getAllCourses,
  addRatingToCourse,
  getCourseRatings,
};
