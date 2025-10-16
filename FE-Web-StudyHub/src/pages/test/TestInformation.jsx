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
  InfoOutline,
  GradeOutlined,
  FlagOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetTestByTestIdMutation,
  useGetAttemptByTestAndUserMutation,
  useGetAttemptInfoMutation,
  useGetAttemptDetailByUserAndTestMutation,
} from "../../services/testApi";
import { useSelector } from "react-redux";
import Snackbar from "../../components/Snackbar";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";

const TestInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { testInfor } = location.state || {};
  const { id: testId } = useParams();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);
  const [attempt, setAttempt] = useState();
  const [history, setHistory] = useState([]);

  const user = useSelector((state) => state.auth.user);

  const [testPool, setTestPool] = useState();

  const [getTestByTestId] = useGetTestByTestIdMutation();
  const [getAttemptInfo] = useGetAttemptInfoMutation();
  const [getAttemptByTestAndUser] = useGetAttemptByTestAndUserMutation();
  const [getAttemptDetailByUserAndTest] =
    useGetAttemptDetailByUserAndTestMutation();

  useEffect(() => {
    if (!user?._id || !testId) return;

    const fetchData = async () => {
      try {
        const res = await getAttemptInfo({
          userId: user._id,
          testId,
        }).unwrap();
        setTestPool(res);

        try {
          const res = await getAttemptDetailByUserAndTest({
            userId: user._id,
            testId,
          }).unwrap();
          setHistory(res.data);
        } catch (error) {
          console.error("Failed to fetch attempt detail:", error);
        }
      } catch (error) {
        if (error.status === 404) {
          const res = await getTestByTestId(testId).unwrap();
          setTestPool(res.data);
        } else {
          throw error;
        }
      }

      try {
        const res = await getAttemptByTestAndUser({
          testId,
          userId: user._id,
        }).unwrap();
        setAttempt(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch attempt:", err);
      }
    };

    fetchData();
  }, [
    user._id,
    testId,
    getAttemptInfo,
    getAttemptDetailByUserAndTest,
    getTestByTestId,
    getAttemptByTestAndUser,
  ]);

  const handleStartTest = () => {
    // Kiểm tra xem user có currentLevel với key trùng với examType của test hay không
    if (!user?.currentLevel || !testInfor?.examType) {
      dispatch(
        openSnackbar({
          message:
            "Please update your profile with current level information before taking this test.",
          severity: "error",
        })
      );
      return;
    }

    // Kiểm tra xem examType của test có trong currentLevel của user hay không
    const hasMatchingLevel = Object.prototype.hasOwnProperty.call(
      user.currentLevel,
      testInfor.examType
    );

    if (!hasMatchingLevel) {
      dispatch(
        openSnackbar({
          message: `Please update your ${testInfor.examType} level in your profile before taking this test.`,
          severity: "error",
        })
      );
      return;
    }

    // Nếu có currentLevel phù hợp, bắt đầu làm bài
    navigate(`/test/${testPool._id || testId}/attempt`, {
      state: { testId: testPool._id || testId },
    });
  };

  // Kiểm tra xem user có thể làm bài test hay không
  const canTakeTest = () => {
    if (!user?.currentLevel || !testInfor?.examType) return false;
    return Object.prototype.hasOwnProperty.call(
      user.currentLevel,
      testInfor.examType
    );
  };

  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  // Format question types for display
  const formatQuestionTypes = (types) => {
    return types
      .map((type) => {
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

    const diffMs = end - start; // chênh lệch tính bằng milliseconds

    const diffSec = Math.floor(diffMs / 1000); // giây
    const diffMin = Math.floor(diffSec / 60); // phút

    return `${diffMin} minutes ${diffSec % 60} seconds`;
  };

  return (
    <Box className="flex justify-center items-center py-10 bg-gray-50 flex-col ">
      <Box className="w-full max-w-3xl ">
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 24,
            color: "#2563eb",
          }}
        >
          Back
        </Button>
      </Box>

      <Card
        className="w-full max-w-3xl"
        sx={{ borderRadius: 4, p: { xs: 1, md: 2 } }}
      >
        <CardContent>
          {/* Tên và nội dung */}
          <Typography
            variant="h4"
            fontWeight={700}
            color="#111827"
            gutterBottom
          >
            {testInfor?.title}
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
            {testInfor.description}
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
                  {testInfor.numQuestions}
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
                  {testInfor.durationMin}{" "}
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
                  {formatQuestionTypes(testInfor.questionTypes)}
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
                  {attempt
                    ? `${attempt.attemptNumber || 0}/${
                        attempt.maxAttempts || 3
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
                  {testInfor.passScore || 0}
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
                  color={testInfor.isFinalTest ? "#dc2626" : "#16a34a"}
                  noWrap
                >
                  {testInfor.isFinalTest ? "Yes" : "No"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box className="flex justify-center items-center w-full flex-col">
            {/* Kiểm tra và hiển thị thông báo nếu user chưa có currentLevel phù hợp */}
            {!canTakeTest() && testInfor?.examType && (
              <Box
                sx={{
                  backgroundColor: "#fff3cd",
                  borderColor: "#ffeaa7",
                  color: "#856404",
                  p: 2,
                  borderRadius: 1,
                  border: "1px solid #ffeaa7",
                  mb: 2,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ⚠️ You need to update your{" "}
                  <strong>{testInfor.examType}</strong> level in your profile
                  before taking this test.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUpdateProfile}
                  sx={{
                    textTransform: "none",
                    borderColor: "#856404",
                    color: "#856404",
                    "&:hover": {
                      backgroundColor: "#856404",
                      color: "white",
                    },
                  }}
                >
                  Update Profile
                </Button>
              </Box>
            )}

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
                (attempt && attempt.attemptNumber >= attempt.maxAttempts) ||
                !canTakeTest()
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
                          color="#22c55e"
                          fontWeight={700}
                        >
                          Score: {attempt.attemptId.score}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>

        <Snackbar isOpen={isOpen} message={message} severity={severity} />
      </Card>
    </Box>
  );
};

export default TestInformation;
