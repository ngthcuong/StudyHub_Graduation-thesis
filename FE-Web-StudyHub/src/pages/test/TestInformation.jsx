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
import { ArrowBack, InfoOutline } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetTestByTestIdMutation,
  useGetAttemptByTestAndUserMutation,
  useGetAttemptInfoMutation,
} from "../../services/testApi";
import { useSelector } from "react-redux";
import Snackbar from "../../components/Snackbar";

const fakeAttemptHistory = [
  {
    _id: "1",
    startTime: "2025-10-01T09:00:00.000Z",
    endTime: "2025-10-01T09:25:30.000Z",
    score: 85,
  },
  {
    _id: "2",
    startTime: "2025-10-03T14:10:00.000Z",
    endTime: "2025-10-03T14:35:10.000Z",
    score: 92,
  },
  {
    _id: "3",
    startTime: "2025-10-05T16:48:18.698Z",
    endTime: "2025-10-05T16:49:57.356Z",
    score: 78,
  },
];

const TestInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testInfor } = location.state || {};
  const { id: testId } = useParams();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);
  const [attempt, setAttempt] = useState();

  const user = useSelector((state) => state.auth.user);

  const [testPool, setTestPool] = useState();

  const [getTestByTestId] = useGetTestByTestIdMutation();
  const [getAttemptInfo] = useGetAttemptInfoMutation();
  const [getAttemptByTestAndUser] = useGetAttemptByTestAndUserMutation();

  useEffect(() => {
    if (!user?._id || !testId) return;

    const fetchData = async () => {
      try {
        const res = await getAttemptInfo({
          userId: user._id,
          testId,
        }).unwrap();
        setTestPool(res);
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
  }, [user?._id, testId]);

  const handleStartTest = () => {
    navigate(`/test/${testPool._id || testId}/attempt`, {
      state: { testId: testPool._id || testId },
    });
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

          {/* Các thông tin khác: số câu hỏi, thời gian, số lần làm lại, loại câu hỏi */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
              disabled={attempt && attempt.attemptNumber >= attempt.maxAttempts}
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
          {fakeAttemptHistory.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              You have not taken this test yet.
            </Typography>
          ) : (
            <Box>
              <Grid container spacing={2}>
                {fakeAttemptHistory.map((attempt, idx) => (
                  <Grid size={12} key={attempt._id || idx}>
                    <Card variant="outlined" className="">
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
                            Date: {attempt.startTime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {(attempt.startTime, attempt.endTime)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          color="#22c55e"
                          fontWeight={700}
                        >
                          Score: {attempt.score}
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
