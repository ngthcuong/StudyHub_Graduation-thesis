import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { Email, Send } from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import SnackBar from "../../components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
import { useForgotPasswordMutation } from "../../services/authApi";
import LogoStudyHub from "../../assets/Logo.jpg";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  // ✅ Validation schema
  const formSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  // ✅ Handle submit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log("Forgot password data:", data);
      const res = await forgotPassword(data).unwrap();
      dispatch(openSnackbar({ message: res.message, severity: "success" }));
      setIsLoading(false);
      reset();
    } catch (error) {
      console.error("Forgot password error:", error);
      dispatch(
        openSnackbar({
          message: error?.data?.error || "Gửi yêu cầu thất bại",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <SnackBar isOpen={isOpen} message={message} severity={severity} />

      <Paper
        elevation={8}
        className="max-w-md w-full p-8 space-y-3"
        sx={{
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <Box className="flex justify-center">
          <img
            src={LogoStudyHub}
            alt="StudyHub Logo"
            className="h-1/3 w-1/3 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </Box>

        <Box className="text-center space-y-2">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900"
          >
            Forgot Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your email address and we’ll send you a reset link.
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 flex flex-col gap-4"
        >
          {/* Email Field */}
          <FormField
            name="email"
            control={control}
            label="Email"
            type="email"
            startIcon={<Email className="text-gray-400" />}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Send />}
            disabled={isLoading}
            className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Box>

        {/* Divider */}
        <Divider className="!my-3">
          <Typography variant="body2" color="textSecondary">
            Remember your password?
          </Typography>
        </Divider>

        {/* Back to Login */}
        <Box className="text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
