const mongoose = require("mongoose");

// Định nghĩa schema cho một khối nội dung
const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image", "example", "audio", "video"], // Các loại nội dung bạn muốn hỗ trợ
      required: true,
    },
    value: {
      type: String,
      required: true, // Đây sẽ là nội dung văn bản, hoặc URL của ảnh/audio/video
    },
    caption: {
      // Chú thích, tiêu đề phụ (tùy chọn)
      type: String,
      trim: true,
    },
  },
  { _id: false }
); // _id: false để không tự tạo ID cho từng khối nội dung

const grammarLessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    parts: [
      {
        title: { type: String, required: true }, // Phần 1, 2, 3
        description: { type: String }, // mô tả phần

        // SỬA ĐỔI CHÍNH Ở ĐÂY
        content: [contentBlockSchema], // Thay String bằng một mảng các khối nội dung
      },
    ],
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GrammarLesson", grammarLessonSchema);
