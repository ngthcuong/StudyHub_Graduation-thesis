import React, { useEffect, useState } from "react";
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  Check,
  ArrowForward,
  ArrowBack,
  CalendarMonth,
  PhoneIphone,
  Sms,
} from "@mui/icons-material";

const steps = [
  {
    label: "Họ tên",
    description: "Nhập họ tên của bạn",
  },
  {
    label: "Ngày sinh & Giới tính",
    description: "Cung cấp ngày sinh và giới tính",
  },
  {
    label: "Email",
    description: "Nhập địa chỉ email của bạn",
  },
  {
    label: "Mật khẩu",
    description: "Tạo mật khẩu và xác nhận",
  },
  {
    label: "Xác nhận thông tin",
    description: "Kiểm tra thông tin và nhập số điện thoại",
  },
  {
    label: "Xác minh OTP",
    description: "Nhập mã OTP gửi đến số điện thoại",
  },
  {
    label: "Hoàn tất",
    description: "Đăng ký thành công",
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);

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
    // Không cho phép ngày sinh ở tương lai
    return d <= today;
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: {
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Họ tên là bắt buộc";
        } else if (formData.fullName.trim().length < 2) {
          newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
        }
        break;
      }
      case 1: {
        if (!formData.dob) {
          newErrors.dob = "Ngày sinh là bắt buộc";
        } else if (!isValidDate(formData.dob)) {
          newErrors.dob = "Ngày sinh không hợp lệ";
        }
        if (!formData.gender) {
          newErrors.gender = "Vui lòng chọn giới tính";
        }
        break;
      }
      case 2: {
        if (!formData.email) {
          newErrors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email không hợp lệ";
        }
        break;
      }
      case 3: {
        if (!formData.password) {
          newErrors.password = "Mật khẩu là bắt buộc";
        } else if (formData.password.length < 6) {
          newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Mật khẩu không khớp";
        }
        break;
      }
      case 4: {
        if (!formData.phone) {
          newErrors.phone = "Số điện thoại là bắt buộc";
        } else if (!/^\d{10,11}$/.test(formData.phone)) {
          newErrors.phone = "Số điện thoại không hợp lệ";
        }
        break;
      }
      case 5: {
        if (!formData.otp) {
          newErrors.otp = "Vui lòng nhập mã OTP";
        } else if (!/^\d{6}$/.test(formData.otp)) {
          newErrors.otp = "OTP phải gồm 6 chữ số";
        } else if (formData.otp !== "123456") {
          // Demo: OTP tĩnh 123456
          newErrors.otp = "Mã OTP không đúng";
        }
        break;
      }
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = () => {
    // TODO: Gọi API gửi OTP thật ở đây
    setOtpSent(true);
    setOtpCountdown(60);
  };

  useEffect(() => {
    let timerId;
    if (otpSent && activeStep === 5 && otpCountdown > 0) {
      timerId = setInterval(() => {
        setOtpCountdown((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [otpSent, activeStep, otpCountdown]);

  const handleNext = () => {
    if (!validateStep(activeStep)) return;

    // Khi qua bước 5 (index 4) -> gửi OTP và sang bước OTP
    if (activeStep === 4) {
      sendOtp();
      setActiveStep(5);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // Quay lại bình thường, nếu đang ở bước OTP thì giữ trạng thái OTP đã gửi
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleVerifyOtp = () => {
    if (!validateStep(5)) return;
    // TODO: Xác minh OTP qua API nếu cần
    setActiveStep(6);
  };

  const handleGoLogin = () => {
    // Sau khi hoàn tất, điều hướng tới đăng nhập
    navigate("/login");
  };

  const maskPhone = (p) => {
    if (!p) return "";
    if (p.length < 4) return "*".repeat(p.length);
    return p.slice(0, 3) + "*".repeat(Math.max(0, p.length - 6)) + p.slice(-3);
    // Ví dụ: 098*******123
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="space-y-4">
            <TextField
              fullWidth
              name="fullName"
              label="Họ tên"
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
              size="medium"
            />
          </Box>
        );

      case 1:
        return (
          <Box className="space-y-4">
            <TextField
              fullWidth
              name="dob"
              label="Ngày sinh"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{ shrink: true }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth className="text-gray-400" />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="medium"
            />

            <FormControl component="fieldset" error={!!errors.gender}>
              <FormLabel component="legend">Giới tính</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Khác"
                />
              </RadioGroup>
              {errors.gender && (
                <Typography variant="caption" color="error">
                  {errors.gender}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box className="space-y-4">
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
              size="medium"
            />
          </Box>
        );

      case 3:
        return (
          <Box className="space-y-4">
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
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="medium"
            />

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
              size="medium"
            />

            <Box className="bg-blue-50 p-4 rounded-lg">
              <Typography variant="body2" color="textSecondary">
                <strong>Yêu cầu mật khẩu:</strong>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mt-1"
              >
                • Ít nhất 6 ký tự
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Chứa chữ hoa và chữ thường
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Chứa ít nhất 1 số
              </Typography>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box className="space-y-4">
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="mb-3">
                Xác nhận thông tin
              </Typography>
              <Box className="space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">
                    Họ tên:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formData.fullName || "-"}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">
                    Ngày sinh:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formData.dob || "-"}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">
                    Giới tính:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formData.gender === "male"
                      ? "Nam"
                      : formData.gender === "female"
                      ? "Nữ"
                      : formData.gender === "other"
                      ? "Khác"
                      : "-"}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2" color="textSecondary">
                    Email:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {formData.email || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <TextField
              fullWidth
              name="phone"
              label="Số điện thoại"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={
                errors.phone || "Chúng tôi sẽ gửi mã OTP để xác minh số này"
              }
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
              size="medium"
            />
          </Box>
        );

      case 5:
        return (
          <Box className="space-y-4">
            <Box className="bg-blue-50 p-4 rounded-lg">
              <Typography variant="body2" color="textSecondary">
                Mã OTP đã được gửi đến số:{" "}
                <strong>{maskPhone(formData.phone)}</strong>
              </Typography>
            </Box>

            <TextField
              fullWidth
              name="otp"
              label="Mã OTP"
              type="tel"
              value={formData.otp}
              onChange={(e) => {
                // Chỉ cho phép số và tối đa 6 ký tự
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleInputChange({ target: { name: "otp", value: v } });
              }}
              error={!!errors.otp}
              helperText={errors.otp}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Sms className="text-gray-400" />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="medium"
            />

            <Box className="flex items-center justify-between">
              <Typography variant="body2" color="textSecondary">
                Không nhận được mã?
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  if (otpCountdown === 0) {
                    sendOtp();
                  }
                }}
                disabled={otpCountdown > 0}
              >
                {otpCountdown > 0
                  ? `Gửi lại (${otpCountdown}s)`
                  : "Gửi lại OTP"}
              </Button>
            </Box>
          </Box>
        );

      case 6:
        return (
          <Box className="space-y-4 text-center">
            <Check className="text-green-600" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="font-semibold">
              Đăng ký thành công!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <Paper
        elevation={8}
        className="max-w-2xl w-full p-8 space-y-6"
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
            Đăng ký tài khoản
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tạo tài khoản mới để bắt đầu học tập
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => {
                  if (completed) {
                    return <Check className="text-green-600" />;
                  }
                  return null;
                }}
              >
                <Typography variant="h6" className="font-medium">
                  {step.label}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box className="py-4">{renderStepContent(index)}</Box>

                {/* Actions */}
                <Box className="flex justify-between mt-4">
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    variant="outlined"
                  >
                    Quay lại
                  </Button>

                  {index < 5 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      {index === 4 ? "Gửi OTP" : "Tiếp tục"}
                    </Button>
                  )}

                  {index === 5 && (
                    <Button
                      variant="contained"
                      onClick={handleVerifyOtp}
                      endIcon={<PersonAdd />}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Xác minh OTP
                    </Button>
                  )}

                  {index === 6 && (
                    <Button
                      variant="contained"
                      onClick={handleGoLogin}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Đi đến đăng nhập
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Divider */}
        <Divider className="my-4">
          <Typography variant="body2" color="textSecondary">
            hoặc
          </Typography>
        </Divider>

        {/* Social Register Buttons */}
        <Box className="space-y-3">
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
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
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
            <img
              src="https://facebook.com/favicon.ico"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Đăng ký với Facebook
          </Button>
        </Box>

        {/* Login Link */}
        <Box className="text-center">
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
