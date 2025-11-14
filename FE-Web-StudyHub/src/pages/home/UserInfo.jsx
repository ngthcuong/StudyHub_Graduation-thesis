import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Typography,
  Divider,
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
  CrisisAlert,
  AutoStories,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
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
import dayjs from "dayjs";
import { updateUser } from "../../redux/slices/auth";
import { isAddress } from "ethers";

const levelTOEIC = [
  { value: "0", label: "No level" },
  { value: "10-250", label: "10-250 - Beginner" },
  { value: "255-400", label: "255-400 - Elementary" },
  { value: "405-600", label: "405-600 - Intermediate" },
  { value: "605-780", label: "605-780 - Upper Intermediate" },
  { value: "785-900", label: "785-900 - Advanced" },
  { value: "905-990", label: "905-990 - Proficient" },
];

const levelIELTS = [
  { value: "0", label: "No level" },
  { value: "0-3.5", label: "0-3.5 - Beginner" },
  { value: "4.0-5.0", label: "4.0-5.0 - Elementary" },
  { value: "5.5-6.0", label: "5.5-6.0 - Intermediate" },
  { value: "6.5-7.0", label: "6.5-7.0 - Upper Intermediate" },
  { value: "7.5-8.0", label: "7.5-8.0 - Advanced" },
  { value: "8.5-9.0", label: "8.5-9.0 - Expert" },
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
        // Use ethers library for robust Ethereum address validation
        try {
          return isAddress(value.trim());
        } catch {
          return false;
        }
      }),

    currentLevel: yup.object({
      TOEIC: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .oneOf(
          [
            "0",
            "10-250",
            "255-400",
            "405-600",
            "605-780",
            "785-900",
            "905-990",
          ],
          "Current level TOEIC is invalid"
        ),
      IELTS: yup
        .string()
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .oneOf(
          ["0", "0-3.5", "4.0-5.0", "5.5-6.0", "6.5-7.0", "7.5-8.0", "8.5-9.0"],
          "Current level IELTS is invalid"
        ),
    }),

    type: yup.string().nullable(),

    target: yup
      .number()
      .typeError("Target must be a number")
      .nullable()
      .when("type", {
        is: "TOEIC",
        then: (schema) =>
          schema
            .required("Target is required")
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
          schema.when("type", {
            is: "IELTS",
            then: (schema) =>
              schema
                .required("Target is required")
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
            otherwise: (schema) => schema.nullable(),
          }),
      }),

    time: yup
      .number()
      .typeError("Time must be a number")
      .nullable()
      .when("type", {
        is: (value) => value && value !== "",
        then: (schema) =>
          schema
            .required("Time is required")
            .min(1, "Time must be at least 1 month")
            .max(24, "Time must not exceed 24 months"),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  const { control, handleSubmit, reset, clearErrors, watch, setValue } =
    useForm({
      resolver: yupResolver(formSchema),
      defaultValues: {
        fullName: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        organization: "",
        walletAddress: "",
        toeic: "0",
        ielts: "0",
        type: "",
        target: "",
        time: "",
      },
      mode: "onChange",
    });

  // Parse learning goals from string to separate fields
  const parseLearningGoals = (learningGoals) => {
    if (!learningGoals) return { type: "", target: "", time: "" };

    // Parse format: "Đạt TOEIC 750 trong vòng 12 tháng." hoặc "Đạt IELTS 6.0 trong vòng 12 tháng."
    const toeicMatch = learningGoals.match(
      /Đạt TOEIC (\d+) trong vòng (\d+) tháng/
    );
    const ieltsMatch = learningGoals.match(
      /Đạt IELTS ([\d.]+) trong vòng (\d+) tháng/
    );

    if (toeicMatch) {
      return {
        type: "TOEIC",
        target: parseInt(toeicMatch[1]),
        time: parseInt(toeicMatch[2]),
      };
    } else if (ieltsMatch) {
      return {
        type: "IELTS",
        target: parseFloat(ieltsMatch[1]),
        time: parseInt(ieltsMatch[2]),
      };
    }

    return { type: "", target: "", time: "" };
  };

  const formatUserData = useCallback((userData) => {
    const goalData = parseLearningGoals(userData.learningGoals);

    return {
      fullName: userData.fullName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      dob: userData.dob ? dayjs(userData.dob).format("YYYY-MM-DD") : "",
      gender: userData.gender || "",
      organization: userData.organization || "",
      walletAddress: userData.walletAddress || "",
      toeic: userData.currentLevel?.TOEIC || "0",
      ielts: userData.currentLevel?.IELTS || "0",
      type: goalData.type || "",
      target: goalData.target || "",
      time: goalData.time || "",
    };
  }, []);

  const watchedType = watch("type");

  useEffect(() => {
    if (userData) {
      const formattedData = formatUserData(userData);
      reset(formattedData);
    }
  }, [userData, reset, formatUserData]);

  // Reset target field when type changes (similar to RegisterPage)
  useEffect(() => {
    if (watchedType && isEditing) {
      setValue("target", "");
    }
  }, [watchedType, setValue, isEditing]);

  const onSubmit = async (data) => {
    try {
      // Create learningGoals from type, target, time with format: "Đạt TOEIC 750 trong vòng 12 tháng."
      let learningGoals = "";
      if (data.type && data.target && data.time) {
        learningGoals = `Đạt ${data.type} ${data.target} trong vòng ${data.time} tháng.`;
      }

      const payload = {
        ...data,
        dob: dayjs(data.dob).toISOString(),
        currentLevel: {
          IELTS: data.ielts,
          TOEIC: data.toeic,
        },
        learningGoals: learningGoals,
      };

      const response = await updateUserInfo(payload);
      if (!response) return;

      dispatch(updateUser(response.data.data));
      dispatch(
        openSnackbar({
          message: response.data.message,
          severity: "success",
        })
      );

      // Update form with new data
      const updatedData = formatUserData(response.data.data);

      reset(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user information: ", error);
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
          {/* Header with background gradient */}
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

            {/* User information form */}
            <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="h6" fontWeight={"600"} mb={-1}>
                    User Information
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                  <FormField
                    name={"fullName"}
                    control={control}
                    label={"Full Name"}
                    disable={!isEditing}
                    startIcon={<Person className="text-gray-400" />}
                  />
                </Grid>

                {/* Email and Phone Number */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="email"
                    control={control}
                    label="Email"
                    type="email"
                    disable={true}
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
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
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

                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="h6" fontWeight={"600"} mb={-1}>
                    Current Level
                  </Typography>
                </Grid>

                {/* Current Level IELTS */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormField
                    name="toeic"
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
                    name="ielts"
                    control={control}
                    label="IELTS"
                    type="select"
                    options={levelIELTS}
                    disable={!isEditing}
                    startIcon={<School className="text-gray-400" />}
                  />
                </Grid>

                {/* Learning Goals */}
                <Grid size={{ xs: 12, md: 12 }}>
                  <Typography variant="h6" fontWeight={"600"} mb={-1}>
                    Your Goal
                    <div className="text-[13px] font-normal">
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
                      { value: "", label: "Select type" },
                      { value: "TOEIC", label: "TOEIC" },
                      { value: "IELTS", label: "IELTS" },
                    ]}
                    disable={!isEditing}
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
                    disable={!isEditing}
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
                    disable={!isEditing}
                    startIcon={<CalendarMonth className="text-gray-400" />}
                  />
                </Grid>

                {/* Goal validation info */}
                {watchedType && isEditing && (
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
                            Popular targets: 450 (basic), 600 (intermediate),
                            750 (advanced), 850+ (expert)
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
                            Popular targets: 5.5 (basic), 6.5 (intermediate),
                            7.5 (advanced), 8.0+ (expert)
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
                    Cancel
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
