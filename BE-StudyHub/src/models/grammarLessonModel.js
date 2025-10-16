const GrammarLesson = require("../schemas/grammarLesson");

// Chỉ nhận vào dữ liệu và trả về promise
const createLesson = async (lessonData) => {
  const { slug } = lessonData;

  // Xử lý logic nghiệp vụ trong model
  const existingLesson = await GrammarLesson.findOne({ slug });
  if (existingLesson) {
    // Ném lỗi để controller có thể bắt và xử lý
    throw new Error("A lesson with this slug already exists.");
  }

  // Tương tác với DB và trả về kết quả
  return GrammarLesson.create(lessonData);
};

const getAllLessons = async () => {
  return GrammarLesson.find({}).sort({ createdAt: -1 });
};

const getLessonById = async (id) => {
  return GrammarLesson.findOne({ _id: id });
};

const updateLesson = async (id, updateData) => {
  return GrammarLesson.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteLesson = async (slug) => {
  return GrammarLesson.findOneAndDelete({ slug });
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
