import axios from "axios";
import config from "../configs/config";

export const testInfo = {
  title: "TOEIC Grammar Practice - Verb Tenses",
  description:
    "Practice test with Present Simple, Present Continuous, Present Perfect, and Past Simple.",
  topic: "Present Simple, Present Continuous, Present Perfect, and Past Simple",
  skill: "grammar",
  level: "B1",
  durationMin: 30,
  numQuestions: 10,
  difficulty: "medium",
  questionTypes: ["multiple_choice"],
};

const createTest = async (testInfo) => {
  try {
    const res = await axios.post(`${config.baseApiUrl}/tests`, testInfo);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const getTestByTestId = async (testId) => {
  try {
    const res = await axios.get(`${config.baseApiUrl}/tests/${testId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const generateTestQuestions = async () => {
  const testData = {
    testId: "68c01f071fe11e25c650cf3f",
    topic: "thì hiện tại đơn, hiện tại tiếp diễn",
    num_questions: 10,
    difficulty: "dễ",
    question_types: ["multiple_choice"],
  };

  try {
    const res = await axios.post(
      `${config.baseApiUrl}/generate-test`,
      testData
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const createAttempt = async ({ testId, userId }) => {
  try {
    const res = await axios.post(
      `${config.baseApiUrl}/attempts`,
      {
        testId,
        userId,
      }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

const submitTest = async ({ answers, attemptId }) => {
  try {
    const res = await axios.post(
      `${config.baseApiUrl}/attempts/${attemptId}/submit`,
      { answers }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

const getTestResult = async ({ testId, attemptId }) => {
  try {
    const res = await axios.post(
      `${config.baseApiUrl}/test-result/submit`,
      { testId, attemptId }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export {
  createTest,
  getTestByTestId,
  generateTestQuestions,
  createAttempt,
  submitTest,
  getTestResult,
};
