export const mockTests = [
  {
    id: "1",
    title: "TOEIC Listening Part 1 Practice Test",
    description:
      "Practice TOEIC Listening Part 1 with 6 photograph questions. Improve your ability to identify the correct description of images.",
    duration: 15, // minutes
    totalQuestions: 6,
    passingScore: 80,
    difficulty: "Beginner",
    category: "TOEIC",
    attempts: 2,
    maxAttempts: 3,
    lastScore: 85,
    bestScore: 85,
    isCompleted: false,
    isAvailable: true,
    createdAt: "2024-01-15",
    questions: [
      {
        id: "1",
        question: "Look at the photograph. What do you see?",
        type: "multiple_choice",
        options: [
          "A man is reading a newspaper",
          "A woman is typing on a computer",
          "A group of people are having a meeting",
          "A person is cooking in the kitchen",
        ],
        correctAnswer: 1,
        explanation:
          "The photograph shows a woman working at a computer, typing on the keyboard.",
      },
      {
        id: "2",
        question: "What is happening in this picture?",
        type: "multiple_choice",
        options: [
          "People are waiting for a bus",
          "A man is giving a presentation",
          "Students are taking an exam",
          "A chef is preparing food",
        ],
        correctAnswer: 1,
        explanation:
          "The image shows a man standing in front of an audience, giving a presentation with slides.",
      },
    ],
  },
  {
    id: "2",
    title: "IELTS Academic Writing Task 1 Assessment",
    description:
      "Practice IELTS Academic Writing Task 1 with graph description. Learn to analyze and describe data effectively.",
    duration: 20,
    totalQuestions: 1,
    passingScore: 6.5,
    difficulty: "Intermediate",
    category: "IELTS",
    attempts: 1,
    maxAttempts: 2,
    lastScore: 6.0,
    bestScore: 6.0,
    isCompleted: false,
    isAvailable: true,
    createdAt: "2024-01-10",
    questions: [
      {
        id: "3",
        question:
          "Describe the bar chart showing sales figures from 2018-2022. Write at least 150 words.",
        type: "essay",
        correctAnswer:
          "Sample response describing the chart with key trends and data points",
        explanation:
          "A good response should include an overview, key trends, and specific data comparisons with appropriate vocabulary.",
      },
    ],
  },
  {
    id: "3",
    title: "TOEIC Reading Part 5 Grammar Test",
    description:
      "Test your grammar knowledge with TOEIC Reading Part 5 incomplete sentences. Focus on verb tenses, prepositions, and word forms.",
    duration: 30,
    totalQuestions: 20,
    passingScore: 75,
    difficulty: "Intermediate",
    category: "TOEIC",
    attempts: 0,
    maxAttempts: 3,
    lastScore: null,
    bestScore: null,
    isCompleted: false,
    isAvailable: true,
    createdAt: "2024-01-20",
    questions: [
      {
        id: "4",
        question:
          "The meeting has been _____ until next week due to scheduling conflicts.",
        type: "multiple_choice",
        options: ["postpone", "postponed", "postponing", "postponement"],
        correctAnswer: 1,
        explanation:
          "The sentence requires a past participle 'postponed' to form the present perfect passive voice.",
      },
      {
        id: "5",
        question: "She is responsible _____ managing the new project.",
        type: "multiple_choice",
        options: ["for", "of", "with", "to"],
        correctAnswer: 0,
        explanation:
          "The correct preposition with 'responsible' is 'for' when indicating what someone is responsible for.",
      },
    ],
  },
  {
    id: "4",
    title: "IELTS Speaking Part 2 Practice",
    description:
      "Practice IELTS Speaking Part 2 with cue card topics. Develop fluency and coherence in your responses.",
    duration: 15,
    totalQuestions: 1,
    passingScore: 7.0,
    difficulty: "Advanced",
    category: "IELTS",
    attempts: 0,
    maxAttempts: 2,
    lastScore: null,
    bestScore: null,
    isCompleted: false,
    isAvailable: true,
    createdAt: "2024-01-25",
    questions: [
      {
        id: "6",
        question:
          "Describe a memorable trip you have taken. You should say: where you went, who you went with, what you did, and explain why it was memorable.",
        type: "speaking",
        correctAnswer:
          "A 2-minute response covering all aspects of the cue card",
        explanation:
          "A good response should address all parts of the question with clear organization, appropriate vocabulary, and natural fluency.",
      },
    ],
  },
  {
    id: "5",
    title: "Business English Vocabulary Quiz",
    description:
      "Test your business English vocabulary with terms commonly used in professional settings, meetings, and corporate communications.",
    duration: 25,
    totalQuestions: 15,
    passingScore: 80,
    difficulty: "Intermediate",
    category: "Business English",
    attempts: 0,
    maxAttempts: 3,
    lastScore: null,
    bestScore: null,
    isCompleted: false,
    isAvailable: true,
    createdAt: "2024-01-18",
    questions: [
      {
        id: "7",
        question: "What does 'ROI' stand for in business?",
        type: "multiple_choice",
        options: [
          "Return on Investment",
          "Rate of Interest",
          "Revenue of Income",
          "Report on Innovation",
        ],
        correctAnswer: 0,
        explanation:
          "ROI stands for 'Return on Investment' - a measure of the efficiency of an investment.",
      },
      {
        id: "8",
        question:
          "Complete the sentence: The company needs to _____ its market share to remain competitive.",
        type: "fill_blank",
        correctAnswer: "increase",
        explanation:
          "The verb 'increase' fits the context of expanding market share to stay competitive.",
      },
    ],
  },
];

export const mockTestResults = [
  {
    id: "1",
    testId: "1",
    testTitle: "TOEIC Listening Part 1 Practice Test",
    score: 85,
    totalQuestions: 6,
    correctAnswers: 5,
    wrongAnswers: 1,
    timeSpent: 12, // minutes
    completedAt: "2024-01-20T10:30:00Z",
    answers: [
      {
        questionId: "1",
        userAnswer: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
      {
        questionId: "2",
        userAnswer: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
    ],
  },
  {
    id: "2",
    testId: "2",
    testTitle: "IELTS Academic Writing Task 1 Assessment",
    score: 6.0,
    totalQuestions: 1,
    correctAnswers: 1,
    wrongAnswers: 0,
    timeSpent: 18,
    completedAt: "2024-01-18T14:15:00Z",
    answers: [
      {
        questionId: "3",
        userAnswer: "The bar chart shows sales figures from 2018-2022...",
        correctAnswer:
          "Sample response describing the chart with key trends and data points",
        isCorrect: true,
      },
    ],
  },
];

export const mockTestCategories = [
  "All",
  "TOEIC",
  "IELTS",
  "Business English",
  "General English",
  "Grammar",
  "Vocabulary",
  "Speaking",
];
