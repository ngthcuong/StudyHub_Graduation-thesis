import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Lock, Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormField from "./FormField";
import { useState } from "react";
import { useChangePasswordMutation } from "../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../redux/slices/snackbar";
import Snackbar from "../components/Snackbar";

const ModalChangePassword = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector((state) => state.snackbar);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = yup.object({
    currentPassword: yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: yup
      .string()
      .required("Mật khẩu mới là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
    confirmNewPassword: yup
      .string()
      .required("Vui lòng nhập lại mật khẩu mới")
      .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      console.log(response);
      if (response?.error) {
        dispatch(
          openSnackbar({
            message: response?.error?.data?.error,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: response.data?.message || "Password changed successfully",
          })
        );
        reset();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      dispatch(
        openSnackbar({
          message: errorMessage,
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="rounded-lg"
    >
      <DialogTitle className="flex justify-between items-center bg-blue-50">
        <Typography variant="inherit" className="font-bold text-blue-700">
          Change password
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="mt-4">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 flex flex-col gap-4 mt-2"
        >
          <FormField
            name="currentPassword"
            control={control}
            label="Old password"
            type="password"
            startIcon={<Lock className="text-gray-400" />}
          />
          <FormField
            name="newPassword"
            control={control}
            label="New password"
            type={showPassword ? "text" : "password"}
            startIcon={<Lock className="text-gray-400" />}
            endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />
          <FormField
            name="confirmNewPassword"
            control={control}
            label="Confirm new password"
            type={showConfirmPassword ? "text" : "password"}
            startIcon={<Lock className="text-gray-400" />}
            endIcon={showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          {/* Yêu cầu mật khẩu*/}
          <Box className="bg-blue-50 p-4 rounded-lg mt-4">
            <Typography
              variant="body2"
              className="font-semibold mb-2 text-blue-700"
            >
              Password Require:
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              At least 8 characters
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Contains uppercase and lowercase letters
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Contains at least 1 number
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Contains at least 1 special character (!@#$%^&*...)
            </Typography>
          </Box>
          <DialogActions className="mt-4">
            <Button
              onClick={onClose}
              variant="outlined"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              sx={{
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              sx={{
                textTransform: "none",
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
      <Snackbar isOpen={isOpen} message={message} severity={severity} />
    </Dialog>
  );
};

export default ModalChangePassword;
