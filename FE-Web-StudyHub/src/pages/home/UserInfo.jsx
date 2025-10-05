import React, { useEffect, useState } from "react";
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
  School,
  Transgender,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormField from "../../components/FormField";
import ModalChangePassword from "../../components/ModalChangePassword";
import {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
} from "../../services/userApi";
import { openSnackbar } from "../../redux/slices/snackbar";
import SnackBar from "../../components/Snackbar";

const levelTOEIC = [
  { value: "0", label: "No level" },
  { value: "450", label: "450 - Basic" },
  { value: "600", label: "600 - Intermediate" },
  { value: "750", label: "750 - Upper Intermediate" },
  { value: "900", label: "900 - Advanced" },
];

const levelIELTS = [
  { value: "0", label: "No level" },
  { value: "3.0", label: "3.0 - Basic" },
  { value: "5.0", label: "5.0 - Intermediate" },
  { value: "6.5", label: "6.5 - Upper Intermediate" },
  { value: "8.0", label: "8.0 - Advanced" },
];

const UserInfo = () => {
  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const [isEditing, setIsEditing] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const { data } = useGetUserInfoQuery();
  const userData = data?.data;

  const [updateUserInfo, { isLoading }] = useUpdateUserInfoMutation();

  const formSchema = yup.object({
    fullName: yup
      .string()
      .required("Full name is required")
      .min(2, "Full name must have at least 2 characters")
      .matches(
        /^[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{0,48}[A-Za-zÀ-ỹ]$/,
        "Fullname is invalid"
      )
      .trim(),

    dob: yup
      .date()
      .required("Birthday is required")
      .typeError("Birthday is invalid")
      .max(new Date(), "Birthday is invalid"),

    gender: yup
      .string()
      .required("Please select one gender")
      .oneOf(["male", "female", "other"], "Gender is invalid"),

    email: yup.string().required("Email is required").email("Email is invalid"),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^(\+?[0-9]{1,4})?[0-9]{9,15}$/, "Phone number is invalid"),

    organization: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test("organization-format", "Organization is invalid", (value) => {
        if (!value) return true;
        return /^[A-Za-zÀ-ỹ0-9][A-Za-zÀ-ỹ0-9\s]{0,48}[A-Za-zÀ-ỹ0-9]$/.test(
          value.trim()
        );
      }),

    walletAddress: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .test("wallet-format", "Wallet Address is invalid", (value) => {
        if (!value) return true;
        return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
      }),

    currentLevel: yup.object({
      TOEIC: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .oneOf(
          ["0", "450", "600", "750", "900"],
          "Current level TOEIC is invalid"
        ),
      IELTS: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .oneOf(
          ["0", "3.0", "5.0", "6.5", "8.0"],
          "Current level IELTS is invalid"
        ),
    }),
  });

  const { control, handleSubmit, reset, clearErrors } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "",
      email: "",
      phone: "",
      organization: "",
      walletAddress: "",
      currentLevel: {
        TOEIC: "0",
        IELTS: "0",
      },
    },
    mode: "onChange",
  });

  const formatUserData = (userData) => ({
    fullName: userData.fullName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    dob: userData.dob
      ? new Date(userData.dob).toISOString().slice(0, 10) // "yyyy-MM-dd"
      : "",
    gender: userData.gender || "",
    organization: userData.organization || "",
    walletAddress: userData.walletAddress || "",
    currentLevel: {
      IELTS: userData.currentLevel?.IELTS || "0",
      TOEIC: userData.currentLevel?.TOEIC || "0",
    },
  });

  useEffect(() => {
    if (userData) {
      const formattedData = formatUserData(userData);
      console.log(formattedData);

      reset(formattedData);
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        dob: data.dob,
        currentLevel: {
          IELTS: data.ielts,
          TOEIC: data.toeic,
        },
      };
      console.log("payload: ", payload);

      const response = await updateUserInfo(payload);
      if (!response) return;

      dispatch(
        openSnackbar({
          message: response.data.message,
          severity: "success",
        })
      );

      // Cập nhật form với dữ liệu mới
      const updatedData = formatUserData(response.data.data);
      console.log(updatedData);

      reset(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi thay đổi thông tin người dùng: ", error);
      dispatch(
        openSnackbar({
          message: "Cannot update user information",
          severity: "error",
        })
      );
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    clearErrors();
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
                  Update your information
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  className="py-3  from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => setIsShowModal(!isShowModal)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  Change password
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
                    label={"Full Name"}
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
                    label="Phone Number"
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
                    label="Birthday"
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
                    label="Gender"
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
                    label="Organization"
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
                    label="Wallet Address"
                    type="text"
                    disable={!isEditing}
                    startIcon={
                      <AccountBalanceWallet className="text-gray-400" />
                    }
                  />
                </Grid>

                {/* Current Level IELTS */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="currentLevel.TOEIC"
                    control={control}
                    label="TOEIC"
                    type="select"
                    options={levelTOEIC}
                    disable={!isEditing}
                    startIcon={<School className="text-gray-400" />}
                  />
                </Grid>

                {/* Current Level TOEIC */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="currentLevel.IELTS"
                    control={control}
                    label="IELTS"
                    type="select"
                    options={levelIELTS}
                    disable={!isEditing}
                    startIcon={<School className="text-gray-400" />}
                  />
                </Grid>
              </Grid>

              {/* Nút lưu khi đang chỉnh sửa */}
              {isEditing && (
                <div className="flex gap-3 mt-6 justify-end">
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={handleCancel}
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
                    disabled={isLoading}
                    // onClick={() => handleSubmit(onSubmit)}
                    className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} /> : "Save"}
                  </Button>
                </div>
              )}
            </Box>
          </div>
        </Paper>

        {isShowModal && (
          <ModalChangePassword
            open={isShowModal}
            onClose={() => setIsShowModal(!isShowModal)}
          />
        )}

        <SnackBar isOpen={isOpen} message={message} severity={severity} />
      </div>
    </Box>
  );
};

export default UserInfo;
