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
    title: "AWS Certified Solutions Architect",
    category: "TOEIC",
    duration: "3 Month",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: "Lina",
    originalPrice: "$100",
    discountedPrice: "$80",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "AWS Certified Solutions Architect",
    category: "TOEIC",
    duration: "3 Month",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: "Lina",
    originalPrice: "$100",
    discountedPrice: "$80",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "AWS Certified Solutions Architect",
    category: "TOEIC",
    duration: "3 Month",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: "Lina",
    originalPrice: "$100",
    discountedPrice: "$80",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "AWS Certified Solutions Architect",
    category: "TOEIC",
    duration: "3 Month",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    instructor: "Lina",
    originalPrice: "$100",
    discountedPrice: "$80",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];
const CourseDetail = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddToFavorites = () => {
    alert("add to favorites");
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

                <div className="flex items-center space-x-3">
                  <Person />
                  <Typography variant="body2" className="text-gray-600">
                    Teacher Name
                  </Typography>
                </div>
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

          <div className="grid grid-cols-2 space-y-4 mt-4 ">
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
            {courses.map((course, index) => (
              <Card
                key={index}
                className="bg-white border border-gray-200 !rounded-xl hover:!shadow-2xl transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <div className="">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Category and Duration */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <Typography
                        variant="body2"
                        className="text-gray-600 font-medium"
                      >
                        {course.category}
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AccessTime />
                      <Typography variant="body2" className="text-gray-600">
                        {course.duration}
                      </Typography>
                    </div>
                  </div>

                  {/* Course Title */}
                  <Typography
                    variant="subtitle1"
                    className="!font-black text-black !mb-1 "
                  >
                    {course.title}
                  </Typography>

                  {/* Course Description */}
                  <Typography variant="body2" className="text-gray-600 ">
                    {course.description}
                  </Typography>

                  {/* Instructor and Pricing */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6 bg-gray-300 text-gray-600 text-xs">
                        L
                      </Avatar>
                      <Typography
                        variant="body2"
                        className="text-gray-700 font-medium"
                      >
                        {course.instructor}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <Typography
                        variant="body1"
                        className="text-gray-600 line-through text-sm"
                      >
                        {course.originalPrice}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="!font-bold text-teal-600"
                      >
                        {course.discountedPrice}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CourseDetail;
