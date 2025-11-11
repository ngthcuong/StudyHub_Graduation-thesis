import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper, Divider, Grid } from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  CalendarMonth,
  PhoneIphone,
  Transgender,
  AutoStories,
  CrisisAlert,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import { useRegisterMutation } from "../../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/slices/snackbar";
import SnackBar from "../../components/Snackbar";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = yup.object({
    fullName: yup
      .string()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .matches(
        /^[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{0,48}[A-Za-zÀ-ỹ]$/,
        "Invalid full name"
      )
      .trim(),

    dob: yup
      .date()
      .required("Date of birth is required")
      .typeError("Invalid date of birth")
      .max(new Date(), "Invalid date of birth"),

    gender: yup
      .string()
      .required("Please select a gender")
      .oneOf(["male", "female", "other"], "Invalid gender"),

    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, "Invalid phone number"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),

    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords do not match"),

    type: yup.string().required("Please select a type"),

    target: yup
      .number()
      .typeError("Target must be a number")
      .required("Target is required")
      .when("type", {
        is: "TOEIC",
        then: (schema) =>
          schema
            .min(10, "TOEIC score must be at least 10")
            .max(990, "TOEIC score must not exceed 990")
            .test(
              "is-integer",
              "TOEIC score must be a whole number (no decimals)",
              (value) => {
                if (value === undefined || value === null) return false;
                return Number.isInteger(value);
              }
            ),
        otherwise: (schema) =>
          schema
            .min(0, "IELTS score must be at least 0")
            .max(9, "IELTS score must not exceed 9")
            .test(
              "is-valid-ielts",
              "IELTS score must be in 0.5 increments (e.g., 6.0, 6.5, 7.0)",
              (value) => {
                if (value === undefined || value === null) return false;
                return Number.isInteger(value * 2);
              }
            ),
      }),

    time: yup
      .number()
      .typeError("Time must be a number")
      .required("Time is required")
      .min(1, "Time must be at least 1 month")
      .max(24, "Time must not exceed 24 months"),
  });

  const { control, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      type: "",
      target: "",
      time: "",
    },
    mode: "onChange",
  });

  const watchedType = watch("type");

  const [register, { isLoading }] = useRegisterMutation();

  // Reset target field when type changes
  useEffect(() => {
    if (watchedType) {
      setValue("target", "");
    }
  }, [watchedType, setValue]);

  const onSubmit = async (data) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const learningGoals = `Đạt ${data.type} ${data.target} trong vòng ${data.time} tháng.`;

      const response = await register({ ...registerData, learningGoals });
      if (!response.error) {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      } else {
        dispatch(
          openSnackbar({
            severity: "error",
            message: response?.error?.data?.error,
          })
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <Paper
        elevation={8}
        className="max-w-2xl w-full p-8"
        sx={{
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <Box className="text-center mb-4">
          <Typography
            variant="h4"
            component="h2"
            className="font-bold text-gray-900 mb-2"
          >
            Create an Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Create a new account to start learning with StudyHub
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Thông tin cá nhân */}
            <Grid size={12}>
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-800"
              >
                Personal Information
              </Typography>
            </Grid>

            {/* Họ tên */}
            <Grid size={{ xs: 12, md: 12 }}>
              <FormField
                name={"fullName"}
                control={control}
                label={"Full Name"}
                startIcon={<Person className="text-gray-400" />}
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="dob"
                control={control}
                label="Date of Birth"
                type="date"
                startIcon={<CalendarMonth className="text-gray-400" />}
              />
            </Grid>

            {/* Giới tính */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="gender"
                control={control}
                label="Gender"
                type="select"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                startIcon={<Transgender className="text-gray-400" />}
              />
            </Grid>

            {/* Thông tin liên hệ */}
            <Grid size={12}>
              <Divider className="my-4" />
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-800"
              >
                Contact Information
              </Typography>
            </Grid>

            {/* Email và Số điện thoại */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="email"
                control={control}
                label="Email"
                type="email"
                startIcon={<Email className="text-gray-400" />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="phone"
                control={control}
                label="Phone Number"
                type="tel"
                startIcon={<PhoneIphone className="text-gray-400" />}
              />
            </Grid>

            {/* Bảo mật */}
            <Grid size={12}>
              <Divider className="my-4" />
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-800"
              >
                Security Information
              </Typography>
            </Grid>

            {/* Mật khẩu */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="password"
                control={control}
                label="Password"
                type={showPassword ? "text" : "password"}
                startIcon={<Lock className="text-gray-400" />}
                endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                onEndIconClick={() => setShowPassword(!showPassword)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                startIcon={<Lock className="text-gray-400" />}
                endIcon={
                  showConfirmPassword ? <VisibilityOff /> : <Visibility />
                }
                onEndIconClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            </Grid>

            {/* Yêu cầu mật khẩu */}
            <Grid size={12}>
              <Box className="bg-blue-50 py-4 px-6 rounded-lg">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="font-semibold mb-2"
                >
                  Password requirements:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  At least 8 characters
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Contains uppercase and lowercase letters
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Contains at least 1 number
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Contains at least 1 special character (!@#$%^&*...)
                </Typography>
              </Box>
            </Grid>

            {/* Mục tiêu học tập */}
            <Grid size={12}>
              <Divider className="my-4" />
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-800"
              >
                Your Goal
                <div className="text-[13px]">
                  <strong>Examples:</strong>{" "}
                  {watchedType === "TOEIC"
                    ? "I want to get 750 TOEIC in 6 months."
                    : watchedType === "IELTS"
                    ? "I want to get 7.5 IELTS in 8 months."
                    : "I want to get 750 TOEIC in 6 months."}
                </div>
              </Typography>
            </Grid>

            <Grid size={4}>
              <FormField
                name="type"
                control={control}
                label="Type"
                type="select"
                options={[
                  { value: "TOEIC", label: "TOEIC" },
                  { value: "IELTS", label: "IELTS" },
                ]}
                startIcon={<AutoStories className="text-gray-400" />}
              />
            </Grid>

            <Grid size={4}>
              <FormField
                name="target"
                control={control}
                label={
                  watchedType === "TOEIC"
                    ? "Target Score"
                    : watchedType === "IELTS"
                    ? "Target Band"
                    : "Target"
                }
                placeholder={
                  watchedType === "TOEIC"
                    ? "e.g., 750"
                    : watchedType === "IELTS"
                    ? "e.g., 7.0"
                    : "Enter target"
                }
                type="number"
                step={watchedType === "IELTS" ? "0.5" : "1"}
                min={
                  watchedType === "TOEIC"
                    ? "10"
                    : watchedType === "IELTS"
                    ? "0"
                    : undefined
                }
                max={
                  watchedType === "TOEIC"
                    ? "990"
                    : watchedType === "IELTS"
                    ? "9"
                    : undefined
                }
                startIcon={<CrisisAlert className="text-gray-400" />}
              />
            </Grid>

            <Grid size={4}>
              <FormField
                name="time"
                control={control}
                label="In time (months)"
                type="number"
                placeholder="e.g., 6"
                startIcon={<CalendarMonth className="text-gray-400" />}
              />
            </Grid>

            {/* Goal validation info */}
            {watchedType && (
              <Grid size={12}>
                <Box className="bg-blue-50 py-4 px-6 rounded-lg">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="font-semibold mb-2"
                  >
                    {watchedType} Target Requirements:
                  </Typography>
                  {watchedType === "TOEIC" ? (
                    <>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component={"li"}
                      >
                        Score range: 10 - 990 points (whole numbers only)
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component={"li"}
                      >
                        Popular targets: 450 (basic), 600 (intermediate), 750
                        (advanced), 850+ (expert)
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component={"li"}
                      >
                        Band range: 0 - 9.0 (in 0.5 increments)
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component={"li"}
                      >
                        Popular targets: 5.5 (basic), 6.5 (intermediate), 7.5
                        (advanced), 8.0+ (expert)
                      </Typography>
                    </>
                  )}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component={"li"}
                  >
                    Time frame: 1 - 24 months
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={<PersonAdd />}
                  className="py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 max-w-fit"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                  }}
                >
                  {isLoading ? "Processing..." : "Register Account"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        {/* <Divider className="my-6">
          <Typography variant="body2" color="textSecondary">
            or
          </Typography>
        </Divider> */}

        {/* Social Register Buttons */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
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
            <Google className="mr-2" />
            Sign up with Google
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
            Sign up with Facebook
          </Button>
        </Box> */}

        {/* Login Link */}
        <Box className="text-center ">
          <Typography variant="body2" color="textSecondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Login now
            </Link>
          </Typography>
        </Box>
      </Paper>
      <SnackBar isOpen={isOpen} message={message} severity={severity} />
    </Box>
  );
};

export default RegisterPage;
