const express = require("express");
const {
  createCourse,
  getCourseById,
  getCourseByTitle,
  getAllCourses,
  updateCourseById,
  addRatingToCourse,
  getMyCourses,
} = require("../controllers/courseController");
const router = express.Router();

router.post("/create", createCourse);
router.get("/:id", getCourseById);
router.get("/title/:title", getCourseByTitle);
router.get("/", getAllCourses);
router.put("/update/:id", updateCourseById);
router.post("/:id/ratings", addRatingToCourse);

router.get("/my-courses/:userId", getMyCourses);

module.exports = router;
