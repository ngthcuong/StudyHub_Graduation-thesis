const testResultService = require("../services/testResultService.service");

exports.submitAnswers = async (req, res) => {
  try {
    const { attemptId, answers } = req.body;
    const saved = await testResultService.saveUserAnswers(attemptId, answers);

    res.status(201).json({
      message: "Answers submitted successfully",
      answers: saved,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ error: "Failed to submit answers" });
  }
};
