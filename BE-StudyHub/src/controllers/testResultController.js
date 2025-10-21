const axios = require("axios");
const { model } = require("mongoose");
const testModel = require("../models/testModel");
const questionModel = require("../models/questionModel");
const attemptModel = require("../models/testAttemptModel");
const attemptDetailModel = require("../models/attemptDetailModel");
const certificateController = require("../controllers/certificateController");

const submitAnswers = async (req, res) => {
  try {
    const { testId, attemptId, answers } = req.body;

    // --- Lấy thông tin test ---
    const testDetail = await testModel.findTestById(testId);
    const questionsByTest = await questionModel.findQuestionsByTest(testId);

    const formattedAnswerKey = questionsByTest.map((q, index) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      return {
        id: index + 1, // đánh số từ 1
        question: q.questionText,
        answer: correctOption?.optionText || null,
        skill: q.skill || null,
        topic: Array.isArray(q.topic) ? q.topic.join(", ") : q.topic || null,
      };
    });

    // --- Lấy câu trả lời của học sinh ---
    // const userAnswers = await userAnswerModel.findAnswersByAttempt(attemptId);
    const userAnswers = await attemptDetailModel.findAnswersByAttempt(
      attemptId
    );

    const questionMap = new Map(
      questionsByTest.map((q, index) => [q._id.toString(), index + 1]) // map questionId -> số thứ tự
    );

    const studentAnswers = {};
    userAnswers.forEach((ans) => {
      const questionNumber = questionMap.get(ans.questionId?.toString());
      if (questionNumber !== undefined) {
        const selectedOption = questionsByTest
          .find((q) => q._id.toString() === ans.questionId?.toString())
          .options.find(
            (opt) => opt._id.toString() === ans.selectedOptionId?.toString()
          );
        if (selectedOption)
          studentAnswers[questionNumber] = selectedOption.optionText;
      }
    });

    // Lấy danh sách câu hỏi để chấm điểm
    const qIds = answers.map((a) => a.questionId);
    const questionDocs = await questionModel.findQuestionsByIds(qIds);
    const qMap = new Map(questionDocs.map((q) => [q._id.toString(), q]));

    let totalScore = 0;
    const processedAnswers = [];

    for (const a of answers) {
      const q = qMap.get(String(a.questionId));
      if (!q) continue;

      let selectedOption = null;
      if (a.selectedOptionId) {
        selectedOption = q.options.find(
          (opt) => opt._id.toString() === a.selectedOptionId
        );
      }
      if (!selectedOption && a.answerLetter) {
        selectedOption = q.options.find(
          (opt, idx) =>
            String.fromCharCode(65 + idx) === a.answerLetter.toUpperCase()
        );
      }

      let isCorrect = undefined;
      let score = 0;
      if (q.questionType === "multiple_choice") {
        if (selectedOption) {
          isCorrect = !!selectedOption.isCorrect;
          score = isCorrect ? q.points || 1 : 0;
        } else {
          isCorrect = false;
          score = 0;
        }
      }

      totalScore += score;
      processedAnswers.push({
        questionId: q._id,
        questionText: q.questionText,
        selectedOptionId: selectedOption?._id,
        selectedOptionText: selectedOption?.optionText || a.answerText || "",
        isCorrect,
        score,
      });
    }

    // 👉 Tạo object dạng { "1": "ARE YOU", "2": "IS SHE", ... }
    const studentAnswersMap = {};
    processedAnswers.forEach((a, index) => {
      studentAnswersMap[String(index + 1)] = a.selectedOptionText || "";
    });

    // --- Lấy thông tin học sinh ---
    const userInfo = await attemptModel.findAttemptById(attemptId);
    console.log("User info:", userInfo);
    const formattedUser = {
      student_id: userInfo?.userId._id.toString(),
      name: userInfo?.userId.fullName,
      current_level: "Intermediate",
      study_hours_per_week: 12,
      learning_goals: "Đạt TOEIC 750 trong vòng 6 tháng",
      learning_preferences: userInfo?.userId.learningPreferences || [],
      study_methods: userInfo?.userId.studyMethods || [],
    };

    // --- Lịch sử làm bài ---
    const history = await attemptModel.findAttemptsByUser(userInfo?.userId._id);
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
      student_answers: studentAnswersMap,
      use_gemini: true,
      profile: formattedUser,
    };

    const response = await axios.post(
      "http://localhost:8000/grade",
      gradingPayload
    );

    if (
      (response.data.total_score / response.data.total_questions) * 10 >
      testDetail?.passingScore * 10
    ) {
      const certifate = await certificateController.issueCertificate(
        testDetail.courseId
      );
    }

    // console.log("Grading response:", response.data);

    res.status(201).json({
      message: "Answers submitted successfully",
      data: response?.data,
      certifate,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ error: "Failed to submit answers" });
  }
};

module.exports = {
  submitAnswers,
};
