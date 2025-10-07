const attemptModel = require("../models/testAttemptModel");
const attemptDetailModel = require("../models/attemptDetailModel");
const questionModel = require("../models/questionModel");
const testPoolModel = require("../models/testPoolModel");
const testModel = require("../models/testModel");

//  For calling external grading service
const axios = require("axios");
const userAnswerModel = require("../models/userAnswerModel");

const startAttempt = async (req, res) => {
  try {
    const { testPoolId, evaluationModel } = req.body;
    if (!testPoolId)
      return res.status(400).json({ error: "testPoolId is required" });

    const attemptData = {
      testPoolId,
      userId: req.user?.userId || req.body.userId,
      evaluationModel: evaluationModel || "gemini",
      feedback: "",
    };

    const savedAttempt = await attemptModel.createAttempt(attemptData);
    res.status(201).json({ message: "Attempt started", data: savedAttempt });
  } catch (error) {
    console.error("Error starting attempt:", error);
    res.status(500).json({ error: "Failed to start attempt" });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, testId } = req.body;

    let resForTestResult = {};

    // TEST RESULT CONTROLLER
    try {
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
      const userAnswers = await userAnswerModel.findAnswersByAttempt(attemptId);

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
      const history = await attemptModel.findAttemptsByUser(
        userInfo?.userId._id
      );
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

      resForTestResult = response?.data?.data || {};

      // console.log("Grading response:", response.data);

      // res.status(201).json({
      //   message: "Answers submitted successfully",
      //   data: response?.data,
      // });
    } catch (error) {
      console.error("Error submitting answers:", error);
      return res.status(500).json({ error: "Failed to submit answers" });
    }

    // TEST RESULT CONTROLLER

    if (!attemptId)
      return res.status(400).json({ error: "attemptId is required" });
    if (!Array.isArray(answers) || !answers.length)
      return res.status(400).json({ error: "answers is required" });

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

    // Lấy attempt hiện tại để tăng số lần làm bài
    const attemptDoc = await attemptModel.findAttemptById(attemptId);
    const newAttemptNumber = (attemptDoc.attemptNumber || 0) + 1;

    // Tạo AttemptDetail mới (1 bản ghi / lần nộp)
    const attemptDetail = await attemptDetailModel.createAttemptDetail({
      attemptId,
      attemptNumber: newAttemptNumber,
      answers: processedAnswers,
      analysisResult: resForTestResult || {},
      totalScore,
      submittedAt: new Date(),
    });

    // Cập nhật tổng điểm và số lần attempt
    const updatedAttempt = await attemptModel.updateAttemptById(attemptId, {
      score: totalScore,
      endTime: new Date(),
      attemptNumber: newAttemptNumber,
    });

    res.status(200).json({
      message: "Submitted successfully",
      attempt: updatedAttempt,
      attemptDetail,
      summary: { totalScore, answered: processedAnswers.length },
    });
  } catch (error) {
    console.error("Error submitting attempt:", error);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;
    if (!attemptId)
      return res.status(400).json({ error: "Attempt ID not found" });

    const attempt = await attemptModel.findAttemptById(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });

    // Lấy tất cả các lần attempt detail của attempt này
    const details = await attemptDetailModel.getAttemptDetailByAttemptId({
      attemptId,
    });

    res.status(200).json({
      message: "Attempt retrieved",
      data: { attempt, details },
    });
  } catch (error) {
    console.error("Error getting attempt:", error);
    res.status(500).json({ error: "Failed to get attempt" });
  }
};

const getAttemptsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID not found" });

    const attempts = await attemptModel.findAttemptsByUser(userId);
    res.status(200).json({
      message: "Attempts retrieved",
      data: attempts,
      total: attempts.length,
    });
  } catch (error) {
    console.error("Error getting attempts by user:", error);
    res.status(500).json({ error: "Failed to get attempts" });
  }
};

const getAttemptByTest = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId) return res.status(400).json({ error: "testId is required" });

    const userId = req.user?.userId;
    const attempt = await attemptModel.findAttemptByTestId(testId, userId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });

    res.status(200).json({ message: "Attempt retrieved", data: attempt });
  } catch (error) {
    console.error("Error getting attempt by testId:", error);
    res.status(500).json({ error: "Failed to get attempt" });
  }
};

const getAttemptInfo = async (req, res) => {
  try {
    const { userId, testId } = req.body;

    const testPool = await testPoolModel.findTestPool({
      baseTestId: testId,
      status: "active",
      createdBy: userId,
    });
    if (!testPool)
      return res
        .status(404)
        .json({ message: "No test pool found for this test" });

    console.log("Found testPool:", testPool);

    const attempt = await attemptModel.findAttemptByUserAndPool(
      userId,
      testPool[0]?._id
    );

    const baseTest = await testModel.findTestById(testId);

    if (attempt) {
      return res.json({
        testInfo: baseTest,
        attemptInfo: {
          id: attempt._id,
          testPoolId: attempt.testPoolId?._id,
          userId: attempt.userId?._id,
          attemptNumber: attempt.attemptNumber,
          maxAttempts: attempt.maxAttempts,
          startTime: attempt.startTime,
          endTime: attempt.endTime,
          score: attempt.score,
          feedback: attempt.feedback,
          evaluationModel: attempt.evaluationModel,
        },
      });
    } else {
      return res.json({
        testInfo: baseTest,
        attemptInfo: {
          attemptNumber: 0,
          maxAttempts: 3,
          score: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error in getAttemptInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByUser,
  getAttemptByTest,
  getAttemptInfo,
};
