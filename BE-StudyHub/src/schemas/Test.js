const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    skill: {
      type: String,
      enum: [
        "reading",
        "listening",
        "speaking",
        "writing",
        "vocabulary",
        "grammar",
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    durationMin: { type: Number, required: true }, // thời gian làm bài (phút)
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }, // liên kết test với course
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // teacher/admin
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
