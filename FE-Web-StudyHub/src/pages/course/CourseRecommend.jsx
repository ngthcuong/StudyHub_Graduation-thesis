import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CourseCard from "../../components/CourseCard";

const CourseRecommend = () => {
  const [selectedCurrentLevel, setSelectedCurrentLevel] = useState("");
  const [selectedGoalLevel, setSelectedGoalLevel] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

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

  const handleLevelSelect = (level, type) => {
    if (type === "current") {
      setSelectedCurrentLevel(level);
    } else {
      setSelectedGoalLevel(level);
    }

    // Show recommendations if both levels are selected
    const bothSelected =
      (type === "current" && selectedGoalLevel) ||
      (type === "goal" && selectedCurrentLevel);

    if (bothSelected) {
      setShowRecommendations(true);
    }
  };

  const LevelButton = ({ level, isSelected, onClick, variant = "current" }) => (
    <button
      onClick={onClick}
      className={`
        w-full px-6 py-4 rounded-full text-lg font-semibold
        transition-all duration-300 transform hover:scale-105 max-w-lg
        ${
          isSelected
            ? "bg-white text-blue-600 shadow-lg "
            : variant === "current"
            ? "bg-blue-800/30 text-white hover:bg-blue-800/50"
            : "bg-white/20 text-white hover:bg-white/30"
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

                {goalLevels.map((level) => (
                  <LevelButton
                    key={level.id}
                    level={level}
                    isSelected={selectedGoalLevel === level.id}
                    onClick={() => handleLevelSelect(level.id, "goal")}
                    variant="goal"
                  />
                ))}
              </div>
            </Grid>
          </Grid>

          <div className="text-center mt-8">
            <Typography className="!text-white">
              Not sure about your current level?{" "}
              <a
                href="#"
                className="underline hover:text-yellow-300 transition font-semibold"
              >
                Take a placement test
              </a>
            </Typography>
          </div>
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

            <Grid container spacing={4}>
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course) => (
                  <Grid item xs={12} sm={6} lg={4} key={course._id}>
                    <CourseCard course={course} variant="market" />
                  </Grid>
                ))
              ) : (
                <Box className="flex justify-center items-center py-12 w-full">
                  <CircularProgress size={40} />
                </Box>
              )}
            </Grid>

            {recommendedCourses.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-8 py-3 bg-blue-600 cursor-pointer text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
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
