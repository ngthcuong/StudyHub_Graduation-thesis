const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const grammarLessonModel = require("../models/grammarLessonModel");

/** Hàm tạo khóa học mới */
const createCourse = async (req, res) => {
  try {
    const { sections, ...courseData } = req.body;

    // Tạo course trước
    const savedCourse = await courseModel.createCourse(courseData);

    // Nếu có sections (grammar lessons), tạo chúng
    if (sections && sections.length > 0) {
      const grammarLessons = [];

      for (const section of sections) {
        if (section.lessons && section.lessons.length > 0) {
          // Tạo grammar lesson cho mỗi section
          const lessonData = {
            title: section.sectionName,
            courseId: savedCourse._id,
            parts: section.lessons.map((lesson) => ({
              title: lesson.lessonName,
              description: lesson.description || "",
              content: lesson.content || lesson.lectureNotes || "", // Prioritize rich text content
              videoUrl: lesson.videoUrl || "",
              attachmentUrl: lesson.attachmentUrl || "",
              contentType: lesson.contentType || "video",
            })),
          };

          const createdLesson = await grammarLessonModel.createLesson(
            lessonData
          );
          grammarLessons.push(createdLesson._id);
        }
      }

      // Cập nhật course với grammar lessons
      if (grammarLessons.length > 0) {
        await courseModel.updateCourseById(savedCourse._id, {
          grammarLessons: grammarLessons,
        });
      }
    }

    // Lấy course đã cập nhật với grammar lessons
    const finalCourse = await courseModel.findCourseById(savedCourse._id);

    res.status(201).json({
      message: "Course created successfully!",
      course: finalCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching course with ID:", id);
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

    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty or undefined",
        receivedBody: req.body,
        contentType: req.headers["content-type"],
      });
    }

    const { sections, ...updateData } = req.body;

    // Cập nhật thông tin course
    let updatedCourse = await courseModel.updateCourseById(id, updateData);

    // Nếu có sections trong request (có thể rỗng hoặc có data)
    if (sections !== undefined) {
      // Xóa TẤT CẢ các grammar lessons cũ của course này
      const oldLessons = await grammarLessonModel.getLessonsByCourseId(id);

      let deletedCount = 0;
      for (const lesson of oldLessons) {
        const result = await grammarLessonModel.deleteLesson(lesson._id);
        if (result) deletedCount++;
      }

      // Tạo grammar lessons mới (nếu có sections)
      const grammarLessons = [];
      if (sections.length > 0) {
        console.log(`Creating ${sections.length} new grammar lessons...`);
        for (const section of sections) {
          if (section.lessons && section.lessons.length > 0) {
            const lessonData = {
              title: section.sectionName,
              courseId: id,
              parts: section.lessons.map((lesson) => ({
                title: lesson.lessonName,
                description: lesson.description || "",
                content: lesson.content || lesson.lectureNotes || "", // Prioritize rich text content
                videoUrl: lesson.videoUrl || "",
                attachmentUrl: lesson.attachmentUrl || "",
                contentType: lesson.contentType || "video",
              })),
            };

            const createdLesson = await grammarLessonModel.createLesson(
              lessonData
            );
            grammarLessons.push(createdLesson._id);
          }
        }
        console.log(
          `Created ${grammarLessons.length} grammar lessons successfully`
        );
      } else {
        console.log("No sections to create (sections array is empty)");
      }

      updatedCourse = await courseModel.updateCourseById(id, {
        grammarLessons: grammarLessons,
      });
    }

    // Lấy course đã cập nhật đầy đủ
    const finalCourse = await courseModel.findCourseById(id);
    res.status(200).json(finalCourse);
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

const getMyCourses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.getMyCourses(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ courses: user.courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Lấy thống kê courses cho admin
 */
const getCourseStatistics = async (req, res) => {
  try {
    const stats = await courseModel.getCourseStatistics();
    res.status(200).json({
      message: "Course statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error getting course statistics:", error);
    res.status(500).json({ error: "Failed to get course statistics" });
  }
};

/**
 * Xóa course và tất cả grammar lessons liên quan
 */
const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa tất cả grammar lessons của course
    const lessons = await grammarLessonModel.getLessonsByCourseId(id);
    for (const lesson of lessons) {
      await grammarLessonModel.deleteLesson(lesson._id);
    }

    // Xóa course
    const deletedCourse = await courseModel.deleteCourseById(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      message: "Course and all related lessons deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

module.exports = {
  createCourse,
  getCourseById,
  getCourseByTitle,
  getAllCourses,
  updateCourseById,
  addRatingToCourse,
  getMyCourses,
  getCourseStatistics,
  deleteCourseById,
};
