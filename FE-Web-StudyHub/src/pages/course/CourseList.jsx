import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const mockCourses = [
  {
    id: "674a1b2c3d4e5f6789012345",
    title: "IELTS Foundation Course",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
    description:
      "Master IELTS fundamentals with comprehensive reading, writing, listening, and speaking practice. Perfect for beginners aiming for band 6.0+",
    cost: 299,
    type: "IELTS",
    lessonNumber: 24,
    skills: ["Reading", "Writing", "Listening", "Speaking"],
    score: 6.5,
    durationHours: 40,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "674a1b2c3d4e5f6789012346",
    title: "TOEIC Master Program",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    description:
      "Comprehensive TOEIC preparation focusing on business English skills. Target score: 750-900 points with proven strategies",
    cost: 399,
    type: "TOEIC",
    lessonNumber: 32,
    skills: ["Business English", "Listening", "Reading", "Grammar"],
    score: 750,
    durationHours: 60,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "674a1b2c3d4e5f6789012347",
    title: "IELTS Academic Writing",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?w=400&h=250&fit=crop",
    description:
      "Intensive IELTS Academic Writing course focusing on Task 1 and Task 2. Achieve band 7.0+ with expert guidance",
    cost: 0,
    type: "IELTS",
    lessonNumber: 15,
    skills: ["Academic Writing", "Task 1", "Task 2", "Grammar"],
    score: 7.0,
    durationHours: 25,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    id: "674a1b2c3d4e5f6789012348",
    title: "TOEIC Listening Intensive",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop",
    description:
      "Boost your TOEIC Listening score with advanced techniques and practice tests. Target 400+ points in Listening section",
    cost: 199,
    type: "TOEIC",
    lessonNumber: 20,
    skills: ["Listening", "Audio Comprehension", "Note Taking", "Strategy"],
    score: 650,
    durationHours: 30,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "674a1b2c3d4e5f6789012349",
    title: "IELTS Speaking Mastery",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop",
    description:
      "Master IELTS Speaking with AI-powered feedback and real examiner practice. Achieve band 8.0+ with confidence",
    cost: 499,
    type: "IELTS",
    lessonNumber: 28,
    skills: ["Speaking", "Pronunciation", "Fluency", "Vocabulary"],
    score: 8.0,
    durationHours: 45,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    id: "674a1b2c3d4e5f6789012350",
    title: "TOEIC Complete Course",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
    description:
      "Complete TOEIC preparation covering all sections with practice tests and strategies. Target 900+ points",
    cost: 0,
    type: "TOEIC",
    lessonNumber: 18,
    skills: ["Listening", "Reading", "Grammar", "Vocabulary"],
    score: 900,
    durationHours: 35,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-05"),
  },
];

const CourseList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 6;
  const pageCount = Math.ceil(mockCourses.length / pageSize);
  const pagedCourses = mockCourses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box className="min-h-screen bg-gray-50 py-8 px-4">
      <Box className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <Box className="flex gap-4 mb-6 flex-wrap">
          <TextField
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            className="flex-1 min-w-[200px]"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Course Grid */}
        <Grid container spacing={3}>
          {pagedCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnailUrl}
                  alt={course.title}
                  className="bg-gray-200"
                />
                <CardContent className="flex-1 p-4">
                  {/* Type Badge */}
                  <Box className="mb-2">
                    <Chip
                      label={course.type}
                      size="small"
                      color={course.type === "TOEIC" ? "primary" : "secondary"}
                      variant="filled"
                    />
                  </Box>

                  {/* Course Title */}
                  <Typography
                    variant="subtitle1"
                    className="font-medium mb-2 line-clamp-2"
                  >
                    {course.title}
                  </Typography>

                  {/* Skills */}
                  <Box className="mb-3">
                    <Box className="flex flex-wrap gap-1">
                      {course.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          className="text-xs"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Price */}
                  <Typography variant="h6" className="font-bold text-gray-900">
                    {course.cost === 0 ? "Free" : `$${course.cost}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box className="flex justify-center mt-8">
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseList;
