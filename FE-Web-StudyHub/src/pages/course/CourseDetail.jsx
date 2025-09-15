import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  Container,
  Alert,
} from "@mui/material";
import {
  Favorite,
  Image,
  Book,
  Person,
  WorkspacePremium,
  AccessTime,
  FormatQuote,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FavoriteBorder,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
import SnackBar from "../../components/Snackbar";
import CourseCard from "../../components/CourseCard";

const outcomes = [
  "Deep understanding and mastery of simple sentences",
  "5-step intensive listening comprehension practice",
  "Quick understanding and response to long simple sentences in part 2",
  "Understand 50% of short business English conversations",
  "Achieve minimum 60/100 listening questions on real TOEIC test",
  "Understand basic vocabulary in TOEIC",
  "Understand simple sentence structures",
  "Familiarize with TOEIC question types",
  "Develop basic reading speed",
  "Achieve minimum 40/100 reading questions on real TOEIC test",
];

const testimonials = [
  {
    name: "Jane Doe 1 ",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 2",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 3",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 4",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 5",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 6",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
  {
    name: "Jane Doe 7",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: new Date(),
  },
];

const courses = [
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
];
const CourseDetail = () => {
  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddToFavorites = () => {
    dispatch(openSnackbar({ message: "Add to favorites" }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Course Detail Section */}
      <main className="px-6 py-8">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Course Image */}
            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative">
                <Image className="text-gray-600 !text-6xl" />
              </div>
            </div>

            {/* Right Column - Course Information */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Typography variant="h4" className="!font-bold text-black">
                  TOEIC Foundation
                </Typography>
                <IconButton
                  className="!text-gray-400 hover:!text-red-500"
                  size="medium"
                  onClick={handleAddToFavorites}
                >
                  <FavoriteBorder />
                </IconButton>
              </div>

              <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-md">
                <Typography variant="body2" className="font-medium">
                  TOEIC
                </Typography>
              </div>

              <Typography variant="h3" className="!font-bold text-black">
                $50
              </Typography>

              <Typography
                variant="body1"
                className="text-gray-600 !mt-2 !text-justify"
              >
                Master the TOEIC exam with comprehensive preparation covering
                all sections: Listening, Reading, Speaking, and Writing. Master
                the TOEIC exam with comprehensive preparation covering all
                sections: Listening, Reading, Speaking, and Writing.
              </Typography>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-center space-x-3">
                  <AccessTime />
                  <Typography variant="body2" className="text-gray-600">
                    12 hours
                  </Typography>
                </div>

                <div className="flex items-center space-x-3">
                  <Book />
                  <Typography variant="body2" className="text-gray-600">
                    48 lessons
                  </Typography>
                </div>

                <div className="flex items-center space-x-3">
                  <WorkspacePremium />
                  <Typography variant="body2" className="text-gray-600">
                    Certificate included
                  </Typography>
                </div>

                {/* <div className="flex items-center space-x-3">
                  <Person />
                  <Typography variant="body2" className="text-gray-600">
                    Teacher Name
                  </Typography>
                </div> */}
              </div>

              <Button
                variant="contained"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3"
                sx={{
                  textTransform: "none",
                }}
                size="large"
              >
                Buy now
              </Button>
            </div>
          </div>
        </Container>
      </main>

      {/* Course Introduction Section */}
      <section className="px-6 py-12 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" className="!font-bold text-black !mb-4 ">
            Course Introduction
          </Typography>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8 !text-justify">
            <Typography
              variant="h6"
              className="font-bold text-blue-800 !mb-2.5"
            >
              TOEIC Foundation - Building a Solid Foundation
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 !mb-2 !text-justify"
            >
              TOEIC Foundation is a course specifically designed for people who
              have lost their English foundation for many years, cannot hear
              basic audio sounds, individual vocabulary words, and understand
              English vocabulary at a minimal level.
            </Typography>
            <Typography variant="body1" className="text-gray-700 ">
              The essence of learning any language starts with listening first
              (sounds) rather than reading first. Learning from the basics will
              make learners feel less pressured and build a truly solid
              foundation for the longer journey ahead.
            </Typography>
          </div>
        </Container>
      </section>

      {/* Expected Learning Outcomes Section */}
      <section className="px-6 py-12 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h4" className="!font-bold text-black">
            Expected Learning Outcomes
          </Typography>

          <div className="grid grid-cols-2 gap-y-4 mt-4 ">
            {outcomes.map((skill, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <Typography variant="body1" className="text-gray-700">
                  {skill}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Reviews Section */}
      <section className="py-12 bg-gray-50">
        {/* Tiêu đề và nút chuyển */}
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              mb: 2,
            }}
          >
            <Typography variant="h4" className="!font-bold ">
              Last reviews
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                className="!bg-gray-200 !rounded-sm w-16 h-fit"
                size="small"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 3))}
                disabled={currentIndex === 0}
              >
                <KeyboardArrowLeft />
              </Button>
              <Button
                className="!bg-gray-200 !rounded-sm w-16 h-fit"
                size="small"
                onClick={() =>
                  setCurrentIndex(
                    Math.min(testimonials.length - 3, currentIndex + 3)
                  )
                }
                disabled={currentIndex >= testimonials.length - 3}
              >
                <KeyboardArrowRight />
              </Button>
            </Box>
          </Box>

          {/* Danh sách các đánh giá */}
          <Box className="grid gap-4 grid-cols-1 sm:grid-cols-3 relative overflow-hidden pb-0.5">
            {testimonials
              .slice(currentIndex, currentIndex + 3)
              .map((t, idx) => (
                <Card
                  key={idx}
                  className="min-w-[320px] shadow-lg px-2 !rounded-xl hover:!shadow-2xl"
                >
                  <CardContent>
                    <Typography variant="body1" className="mb-4 text-blue-700">
                      <FormatQuote />
                    </Typography>
                    <Typography variant="body1" className="!mb-3">
                      {t.text}
                    </Typography>
                    <Box className="flex items-center gap-2">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <Box>
                        <Typography variant="body1" className="!font-semibold">
                          {t.name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          {t.date?.toLocaleDateString("vi-VN")}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Container>
      </section>

      {/* Recommended Courses Section */}
      <section className="px-6 py-12 bg-white">
        <Container maxWidth="lg">
          <div className="flex items-center justify-between !mb-4">
            <Typography variant="h4" className="!font-bold text-black">
              Recommended for you
            </Typography>
            <Button
              variant="text"
              size="large"
              className="text-blue-600 hover:text-blue-800 !font-medium"
              sx={{
                textTransform: "none",
              }}
            >
              See more
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {courses.map((course) => (
              <CourseCard course={course} />
            ))}
          </div>
        </Container>
      </section>

      <SnackBar isOpen={isOpen} message={message} severity={severity} />
    </div>
  );
};

export default CourseDetail;
