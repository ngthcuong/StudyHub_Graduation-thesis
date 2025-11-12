import React, { useEffect } from "react";
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
  CircularProgress,
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
  ArrowBack,
  PlayArrow,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
import SnackBar from "../../components/Snackbar";
import CourseCard from "../../components/CourseCard";
import CourseReviews from "../../components/CourseReviews";
import CourseRatingStats from "../../components/CourseRatingStats";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useGetCourseByIdMutation,
  useGetCoursesQuery,
} from "../../services/courseApi";
import { useGetMyCoursesMutation } from "../../services/grammarLessonApi";

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
  const navigate = useNavigate();
  const { courseId } = useParams();

  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);
  const user = useSelector((state) => state.auth.user);
  const [course, setCourse] = React.useState(null);
  const [courseError, setCourseError] = React.useState(null);
  const [courseLoading, setCourseLoading] = React.useState(true);
  const [isOwned, setIsOwned] = React.useState(false);
  const [checkingOwnership, setCheckingOwnership] = React.useState(true);

  // Fetch course details using API
  // const {
  //   data: course,
  //   isLoading: courseLoading,
  //   error: courseError,
  // } = useGetCourseByIdQuery(courseId, {
  //   skip: !courseId,
  // });
  const [getCourseById] = useGetCourseByIdMutation();
  const [getMyCourses] = useGetMyCoursesMutation();

  useEffect(() => {
    const fetchCourseAndCheckOwnership = async () => {
      setCourseLoading(true);
      setCheckingOwnership(true);

      try {
        // Fetch course details
        const courseData = await getCourseById(courseId).unwrap();
        setCourse(courseData);
        setCourseError(null);

        // Check if user owns this course
        if (user?._id) {
          try {
            const result = await getMyCourses(user._id).unwrap();
            const ownedCourses = result.courses || [];
            const isOwned = ownedCourses.some(
              (course) => course._id === courseId
            );
            setIsOwned(isOwned);
          } catch (error) {
            console.error("Failed to fetch user courses:", error);
            setIsOwned(false);
          }
        }
      } catch (error) {
        setCourseError(error);
      } finally {
        setCourseLoading(false);
        setCheckingOwnership(false);
      }
    };

    fetchCourseAndCheckOwnership();
  }, [courseId, getCourseById, getMyCourses, user?._id]);

  // Fetch recommended courses
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery();

  const handleAddToFavorites = () => {
    dispatch(openSnackbar({ message: "Add to favorites" }));
  };

  const handleStartLearning = () => {
    // Navigate to the learning page - adjust this path based on your routing structure
    navigate(`/course/${courseId}/lesson/${course.id || course._id}`);
  };

  // Loading state
  if (courseLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress size={40} />
          <Typography variant="body1">Loading course details...</Typography>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container maxWidth="sm">
          <Alert severity="error" className="mb-4">
            <Typography variant="h6" className="mb-2">
              Course not found
            </Typography>
            <Typography variant="body2">
              {courseError?.data?.message ||
                "The course you're looking for doesn't exist or has been removed."}
            </Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/course")}
            className="w-full"
          >
            Back to Courses
          </Button>
        </Container>
      </div>
    );
  }

  // Get recommended courses (exclude current course)
  const recommendedCourses =
    coursesData?.filter((c) => c._id !== courseId)?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-800"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 24,
            }}
          >
            Back
          </Button>
        </Container>
      </div>

      {/* Main Course Detail Section */}
      <main className="px-6 pb-8">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Course Image */}
            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="text-gray-600 !text-6xl" />
                )}
              </div>
            </div>

            {/* Right Column - Course Information */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Typography variant="h4" className="!font-bold text-black">
                  {course.title}
                </Typography>
                <IconButton
                  className="!text-gray-400 hover:!text-red-500"
                  size="medium"
                  onClick={handleAddToFavorites}
                >
                  <FavoriteBorder />
                </IconButton>
              </div>

              <div className="flex gap-2">
                <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-md">
                  <Typography variant="body2" className="font-medium">
                    {course.type || "Course"}
                  </Typography>
                </div>
                {isOwned && (
                  <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md">
                    <Typography variant="body2" className="font-medium">
                      Owned
                    </Typography>
                  </div>
                )}
              </div>

              <Typography variant="h3" className="!font-bold text-black">
                {isOwned
                  ? "Already Purchased"
                  : course.cost
                  ? `$${course.cost}`
                  : "Free"}
              </Typography>

              <Typography
                variant="body1"
                className="text-gray-600 !mt-2 !text-justify"
              >
                {course.description}
              </Typography>

              <div className="space-y-1.5 mt-2">
                <div className="flex items-center space-x-3">
                  <AccessTime />
                  <Typography variant="body2" className="text-gray-600">
                    {course.durationHours} hours
                  </Typography>
                </div>

                <div className="flex items-center space-x-3">
                  <Book />
                  <Typography variant="body2" className="text-gray-600">
                    {course.lessonNumber} lessons
                  </Typography>
                </div>

                <div className="flex items-center space-x-3">
                  <WorkspacePremium />
                  <Typography variant="body2" className="text-gray-600">
                    Certificate included
                  </Typography>
                </div>

                {course.instructor && (
                  <div className="flex items-center space-x-3">
                    <Person />
                    <Typography variant="body2" className="text-gray-600">
                      {course.instructor}
                    </Typography>
                  </div>
                )}
              </div>

              {checkingOwnership ? (
                <Button
                  variant="contained"
                  className="bg-gray-400 text-white w-full py-3"
                  sx={{
                    textTransform: "none",
                  }}
                  size="large"
                  disabled
                >
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Checking...
                </Button>
              ) : isOwned ? (
                <Button
                  variant="contained"
                  className="bg-green-600 hover:bg-green-700 text-white w-full py-3"
                  sx={{
                    textTransform: "none",
                  }}
                  size="large"
                  onClick={handleStartLearning}
                  startIcon={<PlayArrow />}
                >
                  Start Learning
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3"
                  sx={{
                    textTransform: "none",
                  }}
                  size="large"
                  onClick={() =>
                    navigate("/course/payment", { state: { course } })
                  }
                >
                  Buy now
                </Button>
              )}
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
              {course.title} - {course.description}
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 !mb-2 !text-justify"
            >
              {course.description ||
                "This comprehensive course is designed to help you achieve your learning goals with structured lessons and expert guidance."}
            </Typography>
            {course.skills && course.skills.length > 0 && (
              <Typography variant="body1" className="text-gray-700">
                Key skills you'll learn: {course.skills.join(", ")}
              </Typography>
            )}
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

      {/* Reviews and Rating Section */}
      <section className="py-12 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" className="!font-bold mb-6">
            Reviews & Ratings
          </Typography>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Stats - Left Column */}
            <div className="lg:col-span-1 mt-4">
              <CourseRatingStats courseId={courseId} />
            </div>

            {/* Reviews List - Right Column */}
            <div className="lg:col-span-2 -mt-4">
              <Typography variant="h6" className="!font-semibold mb-4">
                Latest Reviews
              </Typography>
              <CourseReviews courseId={courseId} maxDisplay={3} />
            </div>
          </div>
        </Container>
      </section>

      {/* Recommended Courses Section */}
      <section className="px-6 py-12 bg-white">
        <Container maxWidth="lg">
          <div className="flex items-center justify-between !mb-4">
            <Typography variant="h4" className="!font-bold text-black">
              Recommended for you
            </Typography>
            {/* <Button
              variant="text"
              size="large"
              className="text-blue-600 hover:text-blue-800 !font-medium"
              sx={{
                textTransform: "none",
              }}
              onClick={() => {
                navigate("/course");
              }}
            >
              See more
            </Button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {coursesLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <CircularProgress size={32} />
              </div>
            ) : recommendedCourses.length > 0 ? (
              recommendedCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Typography variant="body1" className="text-gray-500">
                  No recommended courses available
                </Typography>
              </div>
            )}
          </div>
        </Container>
      </section>

      <SnackBar isOpen={isOpen} message={message} severity={severity} />
    </div>
  );
};

export default CourseDetail;
