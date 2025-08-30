import React from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  LinkedIn,
  X,
  Language,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LecturerImage from "../assets/lecture.png";
import StudentImage from "../assets/student.png";

const testimonials = [
  {
    name: "Jane Doe",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Jane Doe",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Jane Doe",
    course: "Course name",
    text: `"Byway's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia."`,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const stats = [
  { value: "4.8", label: "Average Rating", icon: "⭐" },
  { value: "2,847", label: "Total Reviews" },
  { value: "96%", label: "Satisfaction Rate" },
  { value: "15k+", label: "Students Enrolled" },
];

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side */}
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                className="font-bold mb-4"
                sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}
              >
                <span className="text-blue-700 font-bold">Studying</span> Online
                is
                <br />
                now much easier
              </Typography>
              <Typography variant="h6" className="mb-6 text-gray-700 !mt-6">
                StudyHub is an interesting platform that will teach you in more
                an interactive way
              </Typography>
              <Box className="flex gap-4 mt-8">
                <Button
                  variant="contained"
                  size="large"
                  className="rounded-md px-6 py-2 text-white "
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Get started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className="rounded-md px-6 py-2"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Learn more
                </Button>
              </Box>
            </Grid>

            {/* Right Side */}
            <Grid item size={{ xs: 12, md: 6 }} className={"w-full"}>
              <Box className="relative flex items-center">
                <img
                  src={LecturerImage}
                  alt="Lecturer"
                  className="rounded-xl w-48 h-56 object-cover shadow-lg absolute left-16 top-12"
                />
                <div className="bg-blue-100 rounded-full w-56 h-56 absolute right-0 top-0 -z-10"></div>
                <img
                  src={StudentImage}
                  alt="Student"
                  className="rounded-xl w-40 h-48 object-cover shadow-lg absolute right-8 top-0"
                />
                <div className="h-64"></div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h4" className="font-bold text-center !mb-8">
            How it works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                1. Find Your Course
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Browse through our extensive library of courses across various
                categories.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                2. Enroll & Pay
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Choose your preferred course and complete the enrollment process
                securely.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <div className="flex justify-center mb-3">
                <X />
              </div>
              <Typography variant="h6" className="!font-bold text-center !mb-4">
                3. Learn & Grow
              </Typography>
              <Typography variant="body1" className="text-center text-gray-600">
                Access course materials, complete assignments, and earn your
                certificate.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" className="font-bold mb-8">
            What our students say about us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box className="flex gap-4 overflow-x-auto">
                <IconButton>
                  <ArrowBackIos />
                </IconButton>
                {testimonials.map((t, idx) => (
                  <Card key={idx} className="min-w-[320px] shadow-sm">
                    <CardContent>
                      <Typography
                        variant="body1"
                        className="mb-4 text-blue-700"
                      >
                        “
                      </Typography>
                      <Typography variant="body2" className="mb-4">
                        {t.text}
                      </Typography>
                      <Box className="flex items-center gap-2">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <Box>
                          <Typography variant="body2" className="font-bold">
                            {t.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500"
                          >
                            {t.course}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <IconButton>
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-10 bg-white">
        <Container maxWidth="lg">
          <Typography variant="h5" className="font-bold mb-6 text-center">
            Course Review Statistics
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, idx) => (
              <Grid item xs={12} md={3} key={idx}>
                <Card className="shadow-sm text-center py-6">
                  <CardContent>
                    <Typography variant="h4" className="font-bold mb-2">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {stat.label}
                    </Typography>
                    {stat.icon && (
                      <Typography className="mt-2">{stat.icon}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-teal-300 to-blue-200">
        <Container maxWidth="md">
          <Box className="text-center">
            <Typography variant="h5" className="font-bold mb-2 text-gray-800">
              Ready to Join Our Learning Community?
            </Typography>
            <Typography variant="body1" className="mb-6 text-gray-700">
              Start your learning journey today and become part of our success
              stories
            </Typography>
            <Button
              variant="contained"
              className="bg-white text-blue-700 font-bold px-6 py-2 rounded-md shadow hover:bg-blue-50"
            >
              Browse Courses
            </Button>
          </Box>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
