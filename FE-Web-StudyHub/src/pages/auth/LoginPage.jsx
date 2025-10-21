import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login,
  Google,
  FacebookOutlined,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import { useLoginMutation } from "../../services/authApi";
import { openSnackbar } from "../../redux/slices/snackbar";
import { useDispatch, useSelector } from "react-redux";
import SnackBar from "../../components/Snackbar";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const [loginUser, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const formSchema = yup.object({
    email: yup
      .string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
    password: yup
      .string()
      .required("Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap(); // .unwrap() để lấy data hoặc throw error

      if (response) {
        dispatch(openSnackbar({ message: response.message }));
        navigate("/home/dashboard");
      } else {
        dispatch(
          openSnackbar({ severity: "error", message: response.message })
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(openSnackbar({ severity: "error", message: error.data?.error }));
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
        <Box className="text-center space-y-2">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900"
          >
            Sign in
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Welcome back to StudyHub!
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

          {/* Password Field */}
          <FormField
            name="password"
            control={control}
            label="Password"
            type={showPassword ? "text" : "password"}
            startIcon={<Lock className="text-gray-400" />}
            endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />

          {/* Remember Me & Forgot Password */}
          <Box className="flex items-center justify-between">
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={<Login />}
            className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Box>

        {/* Divider */}
        <Divider className="!my-1">
          <Typography variant="body2" color="textSecondary">
            or
          </Typography>
        </Divider>

        {/* Social Login Buttons */}
        <Box className="space-y-5">
          <Button
            fullWidth
            variant="outlined"
            size="large"
            className="border-gray-300 text-gray-700 hover:bg-gray-5"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#d1d5db",
              marginY: 2,
            }}
          >
            <Google className="mr-2" />
            Sign in with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#d1d5db",
            }}
          >
            <FacebookOutlined className="mr-2" />
            Sign in with Facebook
          </Button>
        </Box>

        {/* Register Link */}
        <Box className="text-center">
          <Typography variant="body2" color="textSecondary">
            You don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
