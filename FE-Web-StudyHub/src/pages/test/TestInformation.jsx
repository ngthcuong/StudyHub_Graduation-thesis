import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { InfoOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { generateTestQuestions } from "../../services/testApi";

const testInfo = {
  name: "Middle Test",
  description:
    "Practice test with Present Simple, Present Continuous, Present Perfect, and Past Simple.",
  questionCount: 30,
  topic:
    "Practice test with Present Simple, Present Continuous, Present Perfect, and Past Simple.",
  duration: 60,
  maxAttempts: 3,
  attempts: 1,
  types: ["Multiple Choice", "Fill in the blank"],
};

const TestInformation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTest = async () => {
    try {
      setIsLoading(true);
      console.log("generate test");
      const testQuestions = await generateTestQuestions();
      console.log(testQuestions.data.data.data);
      if (testQuestions) {
        navigate(`/test/${testQuestions.data.data.data[0]?.testId}/attempt`, {
          state: { questions: testQuestions.data.data.data },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
            {testInfo.name}
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
            {testInfo.description}
          </Typography>

          {/* Các thông tin khác: số câu hỏi, thời gian, số lần làm lại, loại câu hỏi */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item size={{ xs: 12, sm: 6 }}>
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
                  {testInfo.questionCount}
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
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
                  {testInfo.duration}{" "}
                  <span className="text-base font-normal">minutes</span>
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
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
                  {testInfo.attempts} / {testInfo.maxAttempts}
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
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
                  {testInfo.types.join(", ")}
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
              className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
              sx={{
                fontSize: 18,
                textTransform: "none",
                mt: 1,
              }}
              onClick={() => handleStartTest()}
            >
              {isLoading ? "Loading ..." : " Start test"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestInformation;
