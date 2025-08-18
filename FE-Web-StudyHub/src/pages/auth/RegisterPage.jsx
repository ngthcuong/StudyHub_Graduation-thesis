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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    return d <= today;
  };

  const validateForm = () => {
    const newErrors = {};

    // Họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Ngày sinh
    if (!formData.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc";
    } else if (!isValidDate(formData.dob)) {
      newErrors.dob = "Ngày sinh không hợp lệ";
    }

    // Giới tính
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    // Email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Mật khẩu
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
    }

    // Xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Số điện thoại
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Gọi API đăng ký tại đây
      console.log("Đăng ký với dữ liệu:", formData);

      // Chuyển đến trang đăng nhập sau khi đăng ký thành công
      navigate("/login", {
        state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Handle error
    } finally {
      setIsLoading(false);
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
        <Box component="form" onSubmit={handleSubmit}>
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
              <TextField
                fullWidth
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="dob"
                label="Ngày sinh"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                error={!!errors.dob}
                helperText={errors.dob}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth className="text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Grid>

            {/* Giới tính */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl error={!!errors.gender} fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  id="gender"
                  labelId="gender-label"
                  name="gender"
                  label="Giới tính"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error" className="mt-1">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
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
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="phone"
                label="Số điện thoại"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphone className="text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
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
              <TextField
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                variant="outlined"
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
                  disabled={isLoading}
                  startIcon={<PersonAdd />}
                  className="py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 max-w-fit"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                  }}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
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
