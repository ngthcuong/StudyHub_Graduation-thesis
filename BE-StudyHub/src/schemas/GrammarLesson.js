const mongoose = require("mongoose");

const grammarLessonSchema = new mongoose.Schema(
  {
    // Tiêu đề của bài học, ví dụ: "Thì Hiện tại Đơn (Present Simple)"
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Slug để tạo URL thân thiện, ví dụ: "present-simple"
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Cấp độ của bài học để người dùng có thể lọc
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    // Danh mục chính của bài học
    category: {
      type: String,
      trim: true,
      required: true,
    },
    // TRƯỜNG QUAN TRỌNG NHẤT:
    // Chứa toàn bộ nội dung bài học dưới dạng một chuỗi Markdown
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GrammarLesson", grammarLessonSchema);
