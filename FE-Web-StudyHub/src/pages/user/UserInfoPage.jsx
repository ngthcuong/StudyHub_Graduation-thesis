import React, { useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalanceWallet,
  CalendarMonth,
  CorporateFare,
  Edit,
  Email,
  Lock,
  Person,
  PhoneIphone,
  Transgender,
} from "@mui/icons-material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";

const UserInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const formSchema = yup.object({
    fullName: yup
      .string()
      .required("Họ tên là bắt buộc")
      .min(2, "Họ tên phải có ít nhất 2 ký tự")
      .matches(
        /^[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{0,48}[A-Za-zÀ-ỹ]$/,
        "Họ tên không hợp lệ"
      )
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
      .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),

    organization: yup.string().trim(),

    walletAddress: yup
      .string()
      .matches(/^0x[a-fA-F0-9]{40}$/, "Địa chỉ ví điện tử không hợp lệ")
      .trim(),
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
      organization: "",
      walletAddress: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // setIsEditing(false);
    } catch (error) {
      console.error("Lỗi thay đổi thông tin người dùng: ", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <Paper elevation={8} className="overflow-hidden">
          {/* Header với background gradient */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "gray",
                  }}
                  className="border-4 border-white"
                >
                  User
                </Avatar>
                <IconButton
                  size="small"
                  className="absolute bottom-8 left-18 bg-orange-500 hover:bg-orange-600"
                  sx={{
                    bgcolor: "#f97316",
                    "&:hover": { bgcolor: "#ea580c" },
                    width: 24,
                    height: 24,
                  }}
                >
                  <Edit sx={{ fontSize: 14, color: "white" }} />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="pt-12 pb-6 px-8">
            <Grid className="mb-6" container spacing={2}>
              <Grid size={12} className="flex gap-3 mt-1">
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Cập nhật thông tin
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  className="py-3  from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Grid>
            </Grid>

            {/* Form thông tin */}
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <FormField
                    name={"fullName"}
                    control={control}
                    label={"Họ và tên"}
                    disable={!isEditing}
                    startIcon={<Person className="text-gray-400" />}
                  />
                </Grid>

                {/* Email và Số điện thoại */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="email"
                    control={control}
                    label="Email"
                    type="email"
                    disable={!isEditing}
                    startIcon={<Email className="text-gray-400" />}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="phone"
                    control={control}
                    label="Số điện thoại"
                    type="tel"
                    disable={!isEditing}
                    startIcon={<PhoneIphone className="text-gray-400" />}
                  />
                </Grid>

                {/* Ngày sinh */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="dob"
                    control={control}
                    label="Ngày sinh"
                    type="date"
                    disable={!isEditing}
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
                    disable={!isEditing}
                    startIcon={<Transgender className="text-gray-400" />}
                  />
                </Grid>

                {/* Tổ chức */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="organization"
                    control={control}
                    label="Tổ chức"
                    type="text"
                    disable={!isEditing}
                    startIcon={<CorporateFare className="text-gray-400" />}
                  />
                </Grid>

                {/* Ví điện tử */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="walletAddress"
                    control={control}
                    label="Địa chỉ ví điện tử"
                    type="text"
                    disable={!isEditing}
                    startIcon={
                      <AccountBalanceWallet className="text-gray-400" />
                    }
                  />
                </Grid>
              </Grid>

              {/* Nút lưu khi đang chỉnh sửa */}
              {isEditing && (
                <div className="flex gap-3 mt-6 justify-end">
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="normal-case"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: 400,
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(onSubmit)}
                    className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : "Lưu"}
                  </Button>
                </div>
              )}
            </Box>
          </div>
        </Paper>
      </div>
    </Box>
  );
};

export default UserInfoPage;
