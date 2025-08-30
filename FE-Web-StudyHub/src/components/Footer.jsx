import { Language, LinkedIn, X } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const Footer = () => {
  return (
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
            <Typography variant="caption" className="text-gray-400 mt-2 block">
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
  );
};

export default Footer;
