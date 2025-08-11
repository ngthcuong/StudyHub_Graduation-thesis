const express = require("express");
const { createCourse } = require("../controllers/courseController");
const router = express.Router();

router.post("/courses", createCourse);

module.exports = router;
