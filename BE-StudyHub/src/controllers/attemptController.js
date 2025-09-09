const attemptModel = require("../models/testAttemptModel");
const userAnswerModel = require("../models/userAnswerModel");
const questionModel = require("../models/questionModel");
// const answerOptionModel = require("../models/answerOptionModel");

const startAttempt = async (req, res) => {
  try {
    const { testId, evaluationModel } = req.body;
    if (!testId) return res.status(400).json({ error: "testId is required" });

    const attemptData = {
      testId,
      userId: req.user && req.user.userId ? req.user.userId : req.body.userId,
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

// submit: req.body.answers = [ { questionId, selectedOptionId?, answerLetter?, answerText? } ]
const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!attemptId)
      return res.status(400).json({ error: "attemptId is required" });
    if (!Array.isArray(answers) || !answers.length)
      return res.status(400).json({ error: "answers is required" });

    // Lấy tất cả câu hỏi theo questionId
    const qIds = answers.map((a) => a.questionId);
    const questionDocs = await questionModel.findQuestionsByIds(qIds);
    const qMap = new Map(questionDocs.map((q) => [q._id.toString(), q]));

    let totalScore = 0;
    const savedAnswers = [];

    for (const a of answers) {
      const q = qMap.get(String(a.questionId));
      if (!q) continue;

      // tìm option trong mảng question.options
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

      // Tính điểm
      let isCorrect = undefined;
      let score = 0;
      if (q.questionType === "mcq") {
        if (selectedOption) {
          isCorrect = !!selectedOption.isCorrect;
          score = isCorrect ? q.points || 1 : 0;
        } else {
          isCorrect = false;
          score = 0;
        }
      }

      const ua = await userAnswerModel.createUserAnswer({
        attemptId,
        questionId: a.questionId,
        selectedOptionId: selectedOption?._id,
        selectedOptionText: selectedOption?.optionText,
        answerText: a.answerText,
        isCorrect,
        score,
      });

      totalScore += score;
      savedAnswers.push(ua);
    }

    // Cập nhật tổng điểm vào attempt
    const updatedAttempt = await attemptModel.updateAttemptById(attemptId, {
      score: totalScore,
      endTime: new Date(),
    });

    res.status(200).json({
      message: "Submitted successfully",
      attempt: updatedAttempt,
      answers: savedAnswers,
      summary: { totalScore, answered: savedAnswers.length },
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

    const answers = await userAnswerModel.findAnswersByAttempt(attemptId);
    res
      .status(200)
      .json({ message: "Attempt retrieved", data: { attempt, answers } });
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

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByUser,
};
