const axios = require("axios");
const { model } = require("mongoose");
// const testResultService = require("../services/testResultService.service");
const testModel = require("../models/testModel");
const questionModel = require("../models/questionModel");
const userAnswerModel = require("../models/userAnswerModel");
const attemptModel = require("../models/testAttemptModel");

const submitAnswers = async (req, res) => {
  try {
    const { testId, attemptId } = req.body;

    console.log(testId, attemptId);

    // --- Lấy thông tin test ---
    const testDetail = await testModel.findTestById(testId);
    const questionsByTest = await questionModel.findQuestionsByTest(testId);

    const formattedAnswerKey = questionsByTest.map((q, index) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      return {
        id: index + 1, // đánh số từ 1
        answer: correctOption?.optionText || null,
        skill: q.skill || null,
        topic: Array.isArray(q.topic) ? q.topic.join(", ") : q.topic || null,
      };
    });

    // --- Lấy câu trả lời của học sinh ---
    const userAnswers = await userAnswerModel.findAnswersByAttempt(attemptId);
    const questionMap = new Map(
      questionsByTest.map((q, index) => [q._id.toString(), index + 1]) // map questionId -> số thứ tự
    );

    const studentAnswers = {};
    userAnswers.forEach((ans) => {
      const questionNumber = questionMap.get(ans.questionId.toString());
      if (questionNumber !== undefined) {
        const selectedOption = questionsByTest
          .find((q) => q._id.toString() === ans.questionId.toString())
          .options.find(
            (opt) => opt._id.toString() === ans.selectedOptionId.toString()
          );
        if (selectedOption)
          studentAnswers[questionNumber] = selectedOption.optionText;
      }
    });

    // --- Lấy thông tin học sinh ---
    const userInfo = await attemptModel.findAttemptById(attemptId);
    const formattedUser = {
      student_id: userInfo.userId._id.toString(),
      name: userInfo.userId.fullName,
      current_level: "Intermediate",
      study_hours_per_week: 12,
      learning_goals: "Đạt TOEIC 750 trong vòng 6 tháng",
      learning_preferences: userInfo.userId.learningPreferences || [],
      study_methods: userInfo.userId.studyMethods || [],
    };

    // --- Lịch sử làm bài ---
    const history = await attemptModel.findAttemptsByUser(userInfo.userId._id);
    const testHistory = history.map((a) => ({
      test_date: a.startTime
        ? new Date(a.startTime).toISOString().split("T")[0]
        : null,
      level_at_test: a.level || "Unknown",
      score: a.score || 0,
      notes: a.feedback || "",
    }));

    formattedUser.test_history = testHistory;

    // --- Ghép thành object cuối cùng ---
    const gradingPayload = {
      test_info: {
        title: testDetail.title,
        total_questions: questionsByTest.length,
      },
      answer_key: formattedAnswerKey,
      student_answers: studentAnswers,
      use_gemini: true,
      profile: formattedUser,
    };

    const response = await axios.post(
      "http://localhost:8000/grade",
      gradingPayload
    );

    res.status(201).json({
      message: "Answers submitted successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ error: "Failed to submit answers" });
  }
};

module.exports = {
  submitAnswers,
};
