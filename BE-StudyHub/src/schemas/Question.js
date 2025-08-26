const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["mcq", "fill_blank", "essay", "speaking"],
      required: true,
    },
    audioUrl: { type: String, trim: true }, // listening
    imageUrl: { type: String, trim: true }, // hình minh họa
    points: { type: Number, default: 1 },

    skill: {
      type: String,
      enum: [
        "Grammar",
        "Vocabulary",
        "Reading",
        "Listening",
        "Speaking",
        "Writing",
      ],
    },
    topic: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
