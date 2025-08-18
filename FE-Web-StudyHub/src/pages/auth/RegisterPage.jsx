import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  CalendarMonth,
  PhoneIphone,
  Google,
  FacebookOutlined,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import authApi from "../../services/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = yup.object({
    fullName: yup
      .string()
      .required("Họ tên là bắt buộc")
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .trim(),

    dob: yup
      .date()
      .required("Ngày sinh là bắt buộc")
      .max(new Date(), "Ngày sinh không hợp lệ"),

    gender: yup
      .string()
      .required("Vui lòng chọn giới tính")
      .oneOf(["male", "female", "other"], "Giới tính không hợp lệ"),

    email: yup
      .string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),

    phone: yup
      .string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),

    password: yup
      .string()
      .required("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa chữ hoa, chữ thường và số"
      ),

    confirmPassword: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu")
      .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Đăng ký người dùng với thông tin: ", data);
      // TODO: Gọi API đăng ký tại đây
      const response = await authApi.register(data);
      if (response) {
        console.log("res register ", response);
        navigate("/login", {
          state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
        });
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
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
            Đăng ký tài khoản
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Tạo tài khoản mới để bắt đầu học tập cùng StudyHub
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
                Thông tin cá nhân
              </Typography>
            </Grid>

            {/* Họ tên */}
            <Grid size={{ xs: 12, md: 12 }}>
              <FormField
                name={"fullName"}
                control={control}
                label={"Họ và tên"}
                startIcon={<Person className="text-gray-400" />}
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="dob"
                control={control}
                label="Ngày sinh"
                type="date"
                startIcon={<CalendarMonth className="text-gray-400" />}
              />
            </Grid>

            {/* Giới tính */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="gender"
                control={control}
                label="Giới tính"
                type="select"
                options={[
                  { value: "male", label: "Nam" },
                  { value: "female", label: "Nữ" },
                  { value: "other", label: "Khác" },
                ]}
              />
            </Grid>

            {/* Thông tin liên hệ */}
            <Grid size={12}>
              <Divider className="my-4" />
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-800"
              >
                Thông tin liên hệ
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
                label="Số điện thoại"
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
                Thông tin bảo mật
              </Typography>
            </Grid>

            {/* Mật khẩu */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                name="password"
                control={control}
                label="Mật khẩu"
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
                label="Nhập lại mật khẩu"
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
              <Box className="bg-blue-50 p-4 rounded-lg">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="font-semibold mb-2"
                >
                  Yêu cầu mật khẩu:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Ít nhất 6 ký tự
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Chứa chữ hoa và chữ thường
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component={"li"}
                >
                  Chứa ít nhất 1 số
                </Typography>
              </Box>
            </Grid>

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
                  disabled={isSubmitting}
                  startIcon={<PersonAdd />}
                  className="py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 max-w-fit"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                  }}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng ký tài khoản"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider className="my-6">
          <Typography variant="body2" color="textSecondary">
            hoặc
          </Typography>
        </Divider>

        {/* Social Register Buttons */}
        <Box
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
            Đăng ký với Google
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
            Đăng ký với Facebook
          </Button>
        </Box>

        {/* Login Link */}
        <Box className="text-center mt-6">
          <Typography variant="body2" color="textSecondary">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
