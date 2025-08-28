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
      <header className="border-b border-gray-200">
        <Container
          maxWidth="lg"
          className="flex items-center justify-between py-4"
        >
          <div className="font-bold text-2xl">Logo</div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Courses
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              About us
            </a>
            <Button variant="outlined" className="rounded-md px-4 py-1 ml-2">
              Sign up
            </Button>
            <Button
              variant="contained"
              className="rounded-md px-4 py-1 bg-black hover:bg-gray-800 ml-2"
            >
              Sign in
            </Button>
          </nav>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                className="font-bold mb-4"
                sx={{ fontSize: { xs: "2rem", md: "2.8rem" } }}
              >
                <span className="text-blue-700">Studying</span> Online is
                <br />
                now much easier
              </Typography>
              <Typography variant="body1" className="mb-6 text-gray-700">
                StudyHub is an interesting platform that will teach you in more
                an interactive way
              </Typography>
              <Box className="flex gap-4">
                <Button
                  variant="contained"
                  className="bg-black hover:bg-gray-800 rounded-md px-6 py-2 text-white"
                >
                  Get started
                </Button>
                <Button variant="outlined" className="rounded-md px-6 py-2">
                  Learn more
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="relative flex justify-center items-center">
                <img
                  src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=facearea&w=300&q=80"
                  alt="Student"
                  className="rounded-xl w-48 h-56 object-cover shadow-lg absolute left-16 top-12"
                />
                <div className="bg-blue-100 rounded-full w-56 h-56 absolute right-0 top-0 -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=300&q=80"
                  alt="Lecturer"
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
          <Typography variant="h4" className="font-bold text-center mb-8">
            How it works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="font-bold text-center mb-2">
                1. Find Your Course
              </Typography>
              <Typography variant="body2" className="text-center text-gray-600">
                Browse through our extensive library of courses across various
                categories.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="font-bold text-center mb-2">
                2. Enroll & Pay
              </Typography>
              <Typography variant="body2" className="text-center text-gray-600">
                Choose your preferred course and complete the enrollment process
                securely.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="font-bold text-center mb-2">
                3. Learn & Grow
              </Typography>
              <Typography variant="body2" className="text-center text-gray-600">
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
      <footer className="bg-white border-t border-gray-200 pt-10 pb-4">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h5" className="font-bold mb-2">
                Logo
              </Typography>
              <Typography variant="body2" className="mb-4 text-gray-600">
                Join our newsletter to stay up to date on features and releases.
              </Typography>
              <Box className="flex gap-2">
                <TextField
                  size="small"
                  placeholder="Enter your email"
                  variant="outlined"
                  className="bg-white"
                />
                <Button variant="outlined" className="rounded-md">
                  Subscribe
                </Button>
              </Box>
              <Typography
                variant="caption"
                className="text-gray-400 mt-2 block"
              >
                By subscribing you agree to with our{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>{" "}
                and provide consent to receive updates from our company.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" className="font-bold mb-2">
                Curriculum
              </Typography>
              <ul className="text-gray-600 space-y-1">
                <li>
                  <a href="#">IELTS</a>
                </li>
                <li>
                  <a href="#">TOEIC</a>
                </li>
                <li>
                  <a href="#">HSK</a>
                </li>
                <li>
                  <a href="#">English communication</a>
                </li>
                <li>
                  <a href="#">Link Fire</a>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" className="font-bold mb-2">
                About us
              </Typography>
              <ul className="text-gray-600 space-y-1">
                <li>
                  <a href="#">AI Policy</a>
                </li>
                <li>
                  <a href="#">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Payment Policy</a>
                </li>
                <li>
                  <a href="#">Recruitment</a>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" className="font-bold mb-2">
                Follow Us
              </Typography>
              <Box className="flex gap-2">
                <IconButton>
                  <Language />
                </IconButton>
                <IconButton>
                  <X />
                </IconButton>
                <IconButton>
                  <LinkedIn />
                </IconButton>
              </Box>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </Grid>
          </Grid>
          <Box className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 text-gray-500 text-sm">
            <span>© 2024 Relume. All rights reserved.</span>
            <Box className="flex gap-4">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies Settings</a>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
