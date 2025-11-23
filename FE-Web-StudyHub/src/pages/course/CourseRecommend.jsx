import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CourseCard from "../../components/CourseCard";
import { useGetAllCoursesMutation } from "../../services/grammarLessonApi";
import { useNavigate } from "react-router-dom";

const CourseRecommend = () => {
  const navigate = useNavigate();

  const [selectedCurrentLevel, setSelectedCurrentLevel] = useState("");
  const [selectedGoalLevel, setSelectedGoalLevel] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  const [getAllCourse] = useGetAllCoursesMutation();

  const currentLevels = [
    { id: "lr-1-295", label: "TOEIC LR 1-295", range: "1-295" },
    { id: "lr-300-595", label: "TOEIC LR 300 - 595", range: "300-595" },
    { id: "lr-600-650", label: "TOEIC LR 600 - 650", range: "600-650" },
  ];

  const goalLevels = [
    { id: "lr-300+", label: "TOEIC LR 300+", range: "300+" },
    { id: "lr-600+", label: "TOEIC LR 600+", range: "600+" },
    { id: "lr-800+", label: "TOEIC LR 800+", range: "800+" },
  ];

  const allowedGoals = {
    "lr-1-295": ["lr-300+", "lr-600+", "lr-800+"],
    "lr-300-595": ["lr-600+", "lr-800+"],
    "lr-600-650": ["lr-800+"],
  };

  const learningPaths = [
    {
      currentLevel: "lr-1-295",
      goalLevel: "lr-300+",
      courses: [
        "TOEIC Foundation – Ngữ pháp và Từ vựng cơ bản",
        "Listening Starter – TOEIC Part 1 & 2",
        "Reading Starter – TOEIC Part 5 & 6",
        "Mini Test – TOEIC 300+ Practice",
      ],
    },

    {
      currentLevel: "lr-1-295",
      goalLevel: "lr-600+",
      courses: [
        "Grammar & Vocabulary Expansion – Trung cấp",
        "Listening Practice A – TOEIC Part 3 & 4",
        "Reading Practice A – TOEIC Part 6 & 7",
        "Mock Test – TOEIC 600+ Simulation",
      ],
    },

    {
      currentLevel: "lr-1-295",
      goalLevel: "lr-800+",
      courses: [
        "Advanced Grammar Review & Traps in TOEIC",
        "Listening Mastery – Chiến thuật nghe nâng cao",
        "Reading Mastery – Đọc hiểu & Suy luận ý chính",
        "Full Mock Test – TOEIC 800+ Challenge",
      ],
    },

    {
      currentLevel: "lr-300-595",
      goalLevel: "lr-600+",
      courses: [
        "Grammar & Vocabulary Expansion – Trung cấp",
        "Listening Practice A – TOEIC Part 3 & 4",
        "Reading Practice A – TOEIC Part 6 & 7",
        "Mock Test – TOEIC 600+ Simulation",
      ],
    },

    {
      currentLevel: "lr-300-595",
      goalLevel: "lr-800+",
      courses: [
        "Advanced Grammar Review & Traps in TOEIC",
        "Listening Mastery – Chiến thuật nghe nâng cao",
        "Reading Mastery – Đọc hiểu & Suy luận ý chính",
        "Full Mock Test – TOEIC 800+ Challenge",
      ],
    },

    {
      currentLevel: "lr-600-650",
      goalLevel: "lr-800+",
      courses: [
        "Advanced Grammar Review & Traps in TOEIC",
        "Listening Mastery – Chiến thuật nghe nâng cao",
        "Reading Mastery – Đọc hiểu & Suy luận ý chính",
        "Full Mock Test – TOEIC 800+ Challenge",
      ],
    },
  ];

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await getAllCourse().unwrap();
        setCourses(response);
        if (selectedCurrentLevel && selectedGoalLevel) {
          const path = learningPaths.find(
            (p) =>
              p.currentLevel === selectedCurrentLevel &&
              p.goalLevel === selectedGoalLevel
          );
          console.log("Selected Learning Path:", response, path.courses);
          const filteredCourses = response.filter((course) =>
            path.courses.includes(course.title)
          );

          setRecommendedCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchAllCourses();
  }, [selectedCurrentLevel, selectedGoalLevel]);

  const handleLevelSelect = (levelId, type) => {
    if (type === "current") {
      setSelectedCurrentLevel(levelId);
      // reset goal nếu goal đang không hợp lệ
      if (
        selectedGoalLevel &&
        !allowedGoals[levelId]?.includes(selectedGoalLevel)
      ) {
        setSelectedGoalLevel("");
      }
    } else {
      // chỉ cho chọn nếu hợp lệ
      if (
        selectedCurrentLevel &&
        !allowedGoals[selectedCurrentLevel]?.includes(levelId)
      ) {
        return; // không cho chọn goal sai
      }
      setSelectedGoalLevel(levelId);
    }

    // Hiện gợi ý nếu đã chọn đủ 2 cấp
    if (
      (type === "current" && selectedGoalLevel) ||
      (type === "goal" && selectedCurrentLevel)
    ) {
      setShowRecommendations(true);
    }
  };

  const LevelButton = ({
    level,
    isSelected,
    onClick,
    variant = "current",
    disabled = false,
  }) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        w-full px-6 py-4 rounded-full text-lg font-semibold
        transition-all duration-300 max-w-lg
        ${
          disabled
            ? "bg-white/10 text-white/40 cursor-not-allowed opacity-50"
            : isSelected
            ? "bg-white text-blue-600 shadow-lg transform hover:scale-105"
            : variant === "current"
            ? "bg-blue-800/30 text-white hover:bg-blue-800/50 transform hover:scale-105"
            : "bg-white/20 text-white hover:bg-white/30 transform hover:scale-105"
        }
      `}
    >
      {level.label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <div className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <Container maxWidth="lg" className="relative z-10 py-16 ">
          <div className="mb-12">
            <Typography variant="h3" className="!text-white !font-bold !mb-4">
              Welcome!
            </Typography>
            <Typography
              variant="h2"
              className="!text-white !font-black !mb-2 !leading-tight"
            >
              Design your learning path
            </Typography>
            <Typography
              variant="h2"
              className="!text-white !font-black !leading-tight"
            >
              right here!
            </Typography>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-lg">
              TOEIC Listening & Reading
            </button>
          </div>

          <Grid
            container
            spacing={6}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid item xs={12} md={6}>
              <div className="space-y-4">
                <Typography
                  variant="h4"
                  className="!text-white !font-bold !mb-6"
                >
                  My Current Level
                </Typography>

                {currentLevels.map((level) => (
                  <LevelButton
                    key={level.id}
                    level={level}
                    isSelected={selectedCurrentLevel === level.id}
                    onClick={() => handleLevelSelect(level.id, "current")}
                    variant="current"
                  />
                ))}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="space-y-4">
                <Typography
                  variant="h4"
                  className="!text-white !font-bold !mb-6"
                >
                  My Goal
                </Typography>

                {goalLevels.map((level) => {
                  const isDisabled =
                    selectedCurrentLevel &&
                    !allowedGoals[selectedCurrentLevel]?.includes(level.id);
                  return (
                    <LevelButton
                      key={level.id}
                      level={level}
                      isSelected={selectedGoalLevel === level.id}
                      onClick={() => handleLevelSelect(level.id, "goal")}
                      variant="goal"
                      disabled={isDisabled}
                    />
                  );
                })}
              </div>
            </Grid>
          </Grid>

          {/* <div className="text-center mt-8">
            <Typography className="!text-white">
              Not sure about your current level?{" "}
              <a
                href="#"
                className="underline hover:text-yellow-300 transition font-semibold"
              >
                Take a placement test
              </a>
            </Typography>
          </div> */}
        </Container>
      </div>

      {showRecommendations && (
        <div className="bg-gray-50 py-16">
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              className="!font-bold !mb-2 text-center !text-gray-800"
            >
              Recommended Courses for You
            </Typography>
            <Typography
              variant="body1"
              className="text-center !text-gray-600 !mb-8"
            >
              Based on your current level and goals
            </Typography>

            {/* --- Hiển thị 4 card mỗi hàng --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
              {recommendedCourses.map((course, i) => (
                <CourseCard key={i} course={course} variant="market" />
              ))}
            </div>

            {recommendedCourses.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate("/course")}
                  className="px-8 py-3 bg-blue-600 cursor-pointer text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  View More Courses
                </button>
              </div>
            )}
          </Container>
        </div>
      )}
    </div>
  );
};

export default CourseRecommend;
