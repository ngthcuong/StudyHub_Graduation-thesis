const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnailUrl: { type: String, trim: true },
    category: { type: String, trim: true },
    tags: { type: [String], trim: true },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    durationHours: { type: Number, min: 0 },
    ratings: [ratingSchema],

    grammarLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GrammarLesson",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
