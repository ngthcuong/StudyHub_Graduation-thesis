import React from "react";
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
import { InfoOutline } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateAttemptMutation,
  useGenerateTestQuestionsMutation,
  useGetQuestionsByTestIdQuery,
} from "../../services/testApi";
import { useSelector } from "react-redux";

const TestInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testInfor } = location.state || {};
  const { id: testId } = useParams();

  const user = useSelector((state) => state.auth.user);

  let { data: testQuestions, isLoading: isLoadingGetTest } =
    useGetQuestionsByTestIdQuery(testId);

  const [generateTestQuestions, { isLoading: isLoadingTestQuestion }] =
    useGenerateTestQuestionsMutation();

  const [createAttempt, { isLoading: isLoadingAttempt }] =
    useCreateAttemptMutation();

  const handleStartTest = async () => {
    try {
      const testData = {
        testId: testInfor._id,
        topic: testInfor.topic,
        num_questions: testInfor.numQuestions,
        difficulty: testInfor.difficulty,
        question_types: testInfor.questionTypes,
      };

      const attempt = await createAttempt({
        testId: testInfor._id,
        userId: user._id,
      });

      if (!attempt) {
        return;
      }

      if (testQuestions.data.length === 0) {
        testQuestions = await generateTestQuestions(testData);
        navigate(`/test/${testInfor._id}/attempt`, {
          state: {
            questions: testQuestions?.data?.data?.data,
            testTitle: testInfor.title,
            testDuration: testInfor.durationMin,
            testId: testInfor._id,
            attemptId: attempt?.data.data._id,
          },
        });
      } else {
        navigate(`/test/${testInfor._id}/attempt`, {
          state: {
            questions: testQuestions?.data,
            testTitle: testInfor.title,
            testDuration: testInfor.durationMin,
            testId: testInfor._id,
            attemptId: attempt?.data.data._id,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box className="flex justify-center items-center py-10 bg-gray-50">
      <Card
        className="w-full max-w-2xl"
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
                  {testInfor?.attemptCount || 0} / {testInfor?.attemptMax || 0}
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
                  {testInfor.questionTypes.join(", ")}
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
                isLoadingAttempt || isLoadingTestQuestion || isLoadingGetTest
              }
              className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
              sx={{
                fontSize: 18,
                textTransform: "none",
                mt: 1,
              }}
              onClick={() => handleStartTest()}
            >
              {isLoadingTestQuestion || isLoadingAttempt || isLoadingGetTest ? (
                <CircularProgress size={24} color="white" />
              ) : (
                "Start test"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestInformation;
