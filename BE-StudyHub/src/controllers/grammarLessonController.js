const grammarLessonModel = require("../models/grammarLessonModel");

const createLesson = async (req, res) => {
  try {
    const lessonData = req.body;
    const newLesson = await grammarLessonModel.createLesson(lessonData);
    res
      .status(201)
      .json({ message: "Lesson created successfully", data: newLesson });
  } catch (error) {
    // Bắt lỗi được ném từ model
    if (error.message.includes("slug already exists")) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error in createLesson controller:", error);
    res.status(500).json({ error: "Failed to create lesson" });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const lessons = await grammarLessonModel.getAllLessons();
    res
      .status(200)
      .json({ message: "Lessons retrieved successfully", data: lessons });
  } catch (error) {
    console.error("Error in getAllLessons controller:", error);
    res.status(500).json({ error: "Failed to retrieve lessons" });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await grammarLessonModel.getLessonById(id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res
      .status(200)
      .json({ message: "Lesson retrieved successfully", data: lesson });
  } catch (error) {
    console.error("Error in getLessonBySlug controller:", error);
    res.status(500).json({ error: "Failed to retrieve lesson" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;
    const updatedLesson = await grammarLessonModel.updateLesson(
      slug,
      updateData
    );

    if (!updatedLesson) {
      return res.status(404).json({ error: "Lesson not found to update" });
    }
    res
      .status(200)
      .json({ message: "Lesson updated successfully", data: updatedLesson });
  } catch (error) {
    console.error("Error in updateLesson controller:", error);
    res.status(500).json({ error: "Failed to update lesson" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedLesson = await grammarLessonModel.deleteLesson(slug);

    if (!deletedLesson) {
      return res.status(404).json({ error: "Lesson not found to delete" });
    }
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLesson controller:", error);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
