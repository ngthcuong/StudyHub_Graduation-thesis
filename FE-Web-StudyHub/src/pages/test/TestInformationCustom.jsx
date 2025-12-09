import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import {
  ArrowBack,
  InfoOutlined as InfoOutline,
  GradeOutlined,
  FlagOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAttemptDetailByUserAndTestMutation } from "../../services/testApi";
import Header from "../../components/Header";

const TestInformationCustom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testInfor, attemptDetail } = location.state || {};
  const { id: testId } = useParams();

  const user = useSelector((state) => state.auth.user);

  const [getAttemptDetailByUserAndTest] =
    useGetAttemptDetailByUserAndTestMutation();

  const testInfoState = {
    title: "Grammar Level 2 Practice Test",
    description:
      "Evaluate your grammar knowledge with 20 randomly generated questions.",
    numQuestions: 20,
    durationMin: 25,
    questionTypes: ["Grammar"],
    passScore: 75,
    examType: "grammar",
    isFinalTest: false,
  };

  const [history, setHistory] = useState([]);

  const testPool = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAttemptDetailByUserAndTest({
          userId: user._id,
          testId,
        }).unwrap();
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch attempt detail:", error);
      }
    };
    fetchData();
  }, [history]);

  // 🧠 HÀM HỖ TRỢ
  const handleStartTest = () => {
    localStorage.removeItem("test_initialized");

    if (testInfor.questionTypes[0] == "multiple_choice") {
      navigate(`/test/${testId}/custom`, {
        state: { attemptDetail: attemptDetail },
      });
    } else if (testInfor.questionTypes[0] == "fill_in_blank") {
      navigate(`/test/${testId}/fill-in-blank`, {
        state: { attemptDetail: attemptDetail },
      });
    }
  };

  const formatQuestionTypes = (types) => {
    return types
      ?.map((type) => {
        switch (type) {
          case "multiple_choice":
            return "Multi Choice";
          case "fill_in_blank":
            return "Fill in the Blank";
          case "true_false":
            return "True / False";
          default:
            return type;
        }
      })
      .join(", ");
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffMs = end - start;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) {
      return `${diffSec}s`;
    }

    const totalMinutes = Math.floor(diffSec / 60);
    const remainingSec = diffSec % 60;

    if (totalMinutes < 60) {
      return remainingSec > 0
        ? `${totalMinutes}m ${remainingSec}s`
        : `${totalMinutes}m`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0 && remainingSec === 0) {
      return `${hours}h`;
    } else if (remainingSec === 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h ${remainingSec}s`;
    } else {
      return `${hours}h ${minutes}m ${remainingSec}s`;
    }
  };

  return (
    <Box className="flex justify-center items-center  bg-gray-50 flex-col ">
      <Header />

      <Card
        className="w-full max-w-3xl"
        sx={{ borderRadius: 4, p: { xs: 1, md: 2 }, mt: 2 }}
      >
        <CardContent>
          {/* Tên và nội dung */}
          <Typography
            variant="h4"
            fontWeight={700}
            color="#111827"
            gutterBottom
          >
            {testInfor?.title || testInfoState?.title}
          </Typography>
          <Divider
            sx={{
              mb: 2,
              borderColor: "#2563eb",
              borderBottomWidth: 3,
              width: 60,
            }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="#374151"
            gutterBottom
          >
            Test Overview
          </Typography>
          <Typography
            variant="body2"
            color="#6b7280"
            sx={{ mb: 2, textAlign: "justify" }}
          >
            {testInfor?.description || testInfoState?.description}
          </Typography>

          {/* Các thông tin khác: 2 dòng 3 cột */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Dòng 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-blue-600">
                  <DescriptionOutlinedIcon />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#2563eb"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Questions
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#111827"
                  noWrap
                >
                  {testInfor?.numQuestions || testInfoState?.numQuestions}{" "}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-blue-600">
                  <AccessTimeOutlinedIcon />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#2563eb"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Duration
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#111827"
                  noWrap
                >
                  {testInfor?.durationMin || testInfoState?.durationMin}{" "}
                  <span className="text-base font-normal">minutes</span>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-blue-600">
                  <AssignmentOutlinedIcon />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#2563eb"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Test type
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={600} color="#111827">
                  {formatQuestionTypes(testInfor?.questionTypes)}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-green-600">
                  <ReplayOutlinedIcon />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#22c55e"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Retakes Allowed
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#111827"
                  noWrap
                >
                  {attemptDetail
                    ? `${attemptDetail.attemptNumber || 0}/${
                        attemptDetail.maxAttempts || 3
                      }`
                    : "0/3"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-orange-600">
                  <GradeOutlined />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#ea580c"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Pass Score
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#111827"
                  noWrap
                >
                  {testInfor.passingScore * 10}{" "}
                  <span className="text-base font-normal">%</span>
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="border rounded-lg bg-white p-4 flex flex-col items-start gap-2 h-full shadow-sm">
                <Box className="flex items-center gap-2 text-purple-600">
                  <FlagOutlined />
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#7c3aed"
                    whiteSpace="nowrap"
                    textTransform={"uppercase"}
                  >
                    Final Test
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={testInfor?.isTheLastTest ? "#dc2626" : "#16a34a"}
                  noWrap
                >
                  {testInfor
                    ? testInfor?.isTheLastTest
                      ? "Yes"
                      : "No"
                    : testInfoState?.isTheLastTest
                    ? "Yes"
                    : "No"}{" "}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box className="flex justify-center items-center w-full flex-col">
            <Typography
              variant="caption"
              color="#6b7280"
              className="flex items-center justify-center gap-1"
            >
              <InfoOutline />
              Make sure you have a stable internet connection before starting
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={
                attemptDetail &&
                attemptDetail?.attemptNumber >= attemptDetail?.maxAttempts
              }
              className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
              sx={{
                fontSize: 18,
                textTransform: "none",
                mt: 1,
              }}
              onClick={() => handleStartTest()}
            >
              {!testPool ? (
                <CircularProgress size={24} color="white" />
              ) : (
                "Start test"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography
            variant="h6"
            fontWeight={600}
            color="#2563eb"
            gutterBottom
          >
            Your Test Attempts
          </Typography>
          {history?.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              You have not taken this test yet.
            </Typography>
          ) : (
            <Box>
              <Grid container spacing={2}>
                {history?.map((attempt, idx) => (
                  <Grid size={12} key={attempt._id || idx}>
                    <Card
                      variant="outlined"
                      onClick={() =>
                        navigate(`/attempt/${attempt._id}`, {
                          state: attempt,
                        })
                      }
                      className=""
                      sx={{
                        cursor: "pointer", // 🖱️ hiển thị con trỏ khi hover
                        transition: "0.2s ease-in-out",
                        "&:hover": {
                          boxShadow: 3, // hiệu ứng nổi nhẹ
                          transform: "scale(1.02)", // phóng nhẹ
                          backgroundColor: "#f9fafb", // nền sáng hơn
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className=""
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Date:{" "}
                            {new Date(attempt.startTime).toLocaleString(
                              "vi-VN",
                              { timeZone: "Asia/Ho_Chi_Minh" }
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration:{" "}
                            {formatDuration(attempt.startTime, attempt.endTime)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          color="#16a34a"
                          fontWeight={700}
                        >
                          Score: {attempt.totalScore}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>

        {/* <Snackbar isOpen={isOpen} message={message} severity={severity} /> */}
      </Card>
    </Box>
  );
};

// 🧩 COMPONENT PHỤ: InfoCard
const InfoCard = ({ icon, label, value, color }) => (
  <Box
    className="border rounded-lg bg-white p-4 flex flex-col gap-2 h-full shadow-sm"
    sx={{ borderColor: "#e5e7eb" }}
  >
    <Box className="flex items-center gap-2" sx={{ color }}>
      {icon}
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{ color, textTransform: "uppercase" }}
      >
        {label}
      </Typography>
    </Box>
    <Typography variant="h6" fontWeight={700}>
      {value}
    </Typography>
  </Box>
);

export default TestInformationCustom;
