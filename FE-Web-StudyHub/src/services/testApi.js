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

const createAttempt = async () => {
  const attempt = {
    testId: "68b31228c76248a2f3324515",
    userId: "68a2eb7da4178e9ee70a34c2",
    evaluationModel: "gemini",
  };

  try {
    const res = await axios.post(`${config.baseApiUrl}/attempts`, attempt);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const submitTest = async () => {
  try {
    const res = await axios.post(`${config.baseApiUrl}/test-result/submit`);
    console.log(res);
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
};
