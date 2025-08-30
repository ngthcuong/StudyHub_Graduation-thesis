import { Button, Container } from "@mui/material";
import React from "react";

const Header = () => {
  return (
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
          <Button
            variant="outlined"
            className="!rounded-lg px-4 py-1 ml-2"
            sx={{
              textTransform: "none",
            }}
          >
            Sign up
          </Button>
          <Button
            variant="contained"
            className="!rounded-lg px-4 py-1 ml-2"
            sx={{
              textTransform: "none",
            }}
          >
            Sign in
          </Button>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
