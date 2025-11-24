import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  LockReset,
  CheckCircle,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import SnackBar from "../../components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
import { useResetPasswordMutation } from "../../services/authApi";
import LogoStudyHub from "../../assets/Logo.jpg";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // ✅ Toggle hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Lấy token từ URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // ✅ Validation
  const schema = yup.object({
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm your password"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  // ✅ Xử lý submit
  const onSubmit = async (data) => {
    try {
      const res = await resetPassword({
        token,
        newPassword: data.newPassword,
      }).unwrap();

      dispatch(openSnackbar({ message: res.message, severity: "success" }));
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Failed to reset password",
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
            Reset Password
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Enter your new password to reset your account.
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 flex flex-col gap-4"
        >
          {/* New Password */}
          <FormField
            name="newPassword"
            control={control}
            label="New Password"
            type={showPassword ? "text" : "password"}
            startIcon={<LockReset className="text-gray-400" />}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Confirm Password */}
          <FormField
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            startIcon={<CheckCircle className="text-gray-400" />}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirm(!showConfirm)}
                  edge="end"
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </Button>
        </Box>

        <Divider className="!my-3">
          <Typography variant="body2" color="textSecondary">
            Back to Login
          </Typography>
        </Divider>

        <Box className="text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Go to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
