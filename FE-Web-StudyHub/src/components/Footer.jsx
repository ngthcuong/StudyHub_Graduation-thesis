import { Facebook, Instagram, LinkedIn, YouTube } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-4">
      <Container maxWidth="lg">
        <Grid
          container
          spacing={10}
          sx={{
            padding: "0 10px",
          }}
        >
          <Grid item size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" className="font-bold !mb-2">
              StudyHub
            </Typography>
            <Typography variant="body2" className="!mb-4 text-gray-600">
              Join our newsletter to stay up to date on features and releases.
            </Typography>
            <Box className="flex gap-2">
              <TextField
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                className="bg-white w-full"
              />
              <Button
                variant="outlined"
                className="rounded-md"
                sx={{
                  textTransform: "none",
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography variant="caption" className="text-gray-400 mt-2 block">
              By subscribing you agree to with our{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>{" "}
              and provide consent to receive updates from our company.
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle1" className="!font-bold mb-2">
              Curriculum
            </Typography>
            <ul className="text-gray-600 space-y-1">
              <li>
                <a href="#">IELTS</a>
              </li>
              <li>
                <a href="#">TOEIC</a>
              </li>
            </ul>
          </Grid>
          <Grid item size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle1" className="!font-bold mb-2">
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
          <Grid item size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle1" className="!font-bold mb-2">
              Follow Us
            </Typography>
            <Box className="flex flex-col items-start">
              <Button
                startIcon={<Facebook />}
                sx={{
                  textTransform: "none",
                  color: "gray",
                  "&:hover": {
                    // color: "blue",
                  },
                }}
              >
                Facebook
              </Button>
              <Button
                startIcon={<Instagram />}
                sx={{
                  textTransform: "none",
                  color: "gray",
                  "&:hover": {
                    // color: "blue",
                  },
                }}
              >
                Instagram
              </Button>
              <Button
                startIcon={<LinkedIn />}
                sx={{
                  textTransform: "none",
                  color: "gray",
                  "&:hover": {
                    // color: "blue",
                  },
                }}
              >
                LinkedIn
              </Button>
              <Button
                startIcon={<YouTube />}
                sx={{
                  textTransform: "none",
                  color: "gray",
                  "&:hover": {
                    // color: "blue",
                  },
                }}
              >
                YouTube
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 text-gray-500 text-sm">
          <span>© 2025 StudyHub. All rights reserved.</span>
          <Box className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </Box>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
