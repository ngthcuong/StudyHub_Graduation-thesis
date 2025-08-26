// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const TestAttempt = require("../models/testAttemptModel");
const UserAnswer = require("../models/userAnswerModel");
const { gradeTestWithAI } = require("../services/aiService.service");

// Submit test
router.post("/submit", async (req, res) => {
  try {
    const { userId, testId, studentAnswers, useGemini = true } = req.body;

    // 1. Tạo test attempt
    // const attempt = await TestAttempt.createAttempt({
    //   userId,
    //   testId,
    //   startTime: new Date(),
    // });

    // 2. Chuẩn bị payload cho AI
    const aiPayload = {
      test_info: {
        title: "Some test title",
        total_questions: Object.keys(studentAnswers).length,
      },
      answer_key: [], // có thể lấy từ DB Question
      student_answers: studentAnswers,
      use_gemini: useGemini,
      profile: { student_id: userId }, // có thể thêm các thông tin khác
    };

    console.log("AI grading payload:", aiPayload);

    // 3. Gọi AI grading
    // const aiResult = await gradeTestWithAI(aiPayload);

    // // 4. Lưu từng câu trả lời vào UserAnswer
    // for (const key in studentAnswers) {
    //   const answer = studentAnswers[key];
    //   // Tìm điểm và đúng/sai từ AI result (giả sử AI trả về {score, isCorrect})
    //   const aiAnswer = aiResult.answer_key.find((a) => a.id.toString() === key);
    //   await UserAnswer.create({
    //     attemptId: attempt._id,
    //     questionId: key,
    //     answerText: answer,
    //     score: aiAnswer?.score || 0,
    //     isCorrect: aiAnswer?.isCorrect || false,
    //   });
    // }

    // // 5. Cập nhật tổng điểm
    // const totalScore = aiResult.answer_key.reduce(
    //   (acc, a) => acc + (a.score || 0),
    //   0
    // );
    // attempt.score = totalScore;
    // attempt.endTime = new Date();
    // attempt.feedback = aiResult.feedback || "";
    // await attempt.save();

    // res
    //   .status(201)
    //   .json({ message: "Test submitted and graded", attempt, aiResult });
  } catch (error) {
    console.error("Submit test error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
