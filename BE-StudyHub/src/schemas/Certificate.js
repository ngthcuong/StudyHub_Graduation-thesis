const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
