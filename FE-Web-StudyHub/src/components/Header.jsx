import { Button, Container } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200">
      <Container
        maxWidth="lg"
        className="flex items-center justify-between py-4"
      >
        {/* TODO: Thay bằng logo được thiết kế */}
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
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
          <Button
            variant="contained"
            className="!rounded-lg px-4 py-1 ml-2"
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
