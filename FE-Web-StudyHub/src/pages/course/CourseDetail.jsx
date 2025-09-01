import React from "react";
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
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Image as ImageIcon,
  LockClock,
  Book,
  Celebration,
  Person,
  WorkspacePremium,
  AccessTime,
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

const CourseDetail = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Course Detail Section */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Course Image */}
            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative">
                <ImageIcon className="text-gray-600 text-6xl" />
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
                >
                  <FavoriteIcon />
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

              <Typography variant="body1" className="text-gray-600 !mt-2">
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
        </div>
      </main>

      {/* Course Introduction Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h4" className="font-bold text-black mb-8 ">
            Course Introduction
          </Typography>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <Typography variant="h6" className="font-bold text-blue-800 mb-3">
              TOEIC Foundation - Building a Solid Foundation
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 leading-relaxed mb-4"
            >
              TOEIC Foundation is a course specifically designed for people who
              have lost their English foundation for many years, cannot hear
              basic audio sounds, individual vocabulary words, and understand
              English vocabulary at a minimal level.
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 leading-relaxed"
            >
              The essence of learning any language starts with listening first
              (sounds) rather than reading first. Learning from the basics will
              make learners feel less pressured and build a truly solid
              foundation for the longer journey ahead.
            </Typography>
          </div>
        </div>
      </section>

      {/* Expected Learning Outcomes Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h4" className="font-bold text-black mb-8 ">
            Expected Learning Outcomes
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                {outcomes.map((skill, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <Typography variant="body1" className="text-gray-700">
                      {skill}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Reviews Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h4" className="font-bold text-black mb-8 ">
            Latest Reviews
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <Rating value={0} readOnly className="mb-3" />
                  <Typography
                    variant="h6"
                    className="font-bold text-black mb-2"
                  >
                    Review title
                  </Typography>
                  <Typography variant="body2" className="text-black mb-4">
                    Review body
                  </Typography>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <Person />
                    </Avatar>
                    <div>
                      <Typography
                        variant="body2"
                        className="font-medium text-black"
                      >
                        Reviewer name
                      </Typography>
                      <Typography variant="caption" className="text-black">
                        Date
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Courses Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h4" className="font-bold text-black">
              Recommended for you
            </Typography>
            <Button
              variant="text"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              See more
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AWS Certified Solutions Architect",
                category: "Design",
                duration: "3 Month",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
                instructor: "Lina",
                originalPrice: "$100",
                discountedPrice: "$80",
                image: "💻",
              },
              {
                title: "AWS Certified Solutions Architect",
                category: "Design",
                duration: "3 Month",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
                instructor: "Lina",
                originalPrice: "$100",
                discountedPrice: "$80",
                image: "💻",
              },
              {
                title: "AWS Certified Solutions Architect",
                category: "Design",
                duration: "3 Month",
                description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
                instructor: "Lina",
                originalPrice: "$100",
                discountedPrice: "$80",
                image: "💻",
              },
            ].map((course, index) => (
              <Card
                key={index}
                className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <div className="">
                    <div className="text-6xl mb-2">{course.image}</div>
                    <div className="text-xs text-gray-500">
                      Laptop with video conference
                    </div>
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
                      <span className="text-gray-500">⏰</span>
                      <Typography variant="body2" className="text-gray-600">
                        {course.duration}
                      </Typography>
                    </div>
                  </div>

                  {/* Course Title */}
                  <Typography
                    variant="h6"
                    className="font-bold text-black mb-2 leading-tight"
                  >
                    {course.title}
                  </Typography>

                  {/* Course Description */}
                  <Typography
                    variant="body2"
                    className="text-gray-600 mb-4 leading-relaxed"
                  >
                    {course.description}
                  </Typography>

                  {/* Instructor and Pricing */}
                  <div className="flex items-center justify-between">
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
                    <div className="text-right">
                      <Typography
                        variant="body2"
                        className="text-gray-400 line-through text-sm"
                      >
                        {course.originalPrice}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="font-bold text-teal-600"
                      >
                        {course.discountedPrice}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
