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

const ModalChangePassword = ({ open, onClose }) => {
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

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error changing password:", error);
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
        <Typography variant="h6" className="font-bold text-blue-700">
          Thay đổi mật khẩu
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
            label="Mật khẩu cũ"
            type="password"
            startIcon={<Lock className="text-gray-400" />}
          />
          <FormField
            name="newPassword"
            control={control}
            label="Mật khẩu mới"
            type="password"
            startIcon={<Lock className="text-gray-400" />}
            endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
            onEndIconClick={() => setShowPassword(!showPassword)}
          />
          <FormField
            name="confirmNewPassword"
            control={control}
            label="Nhập lại mật khẩu mới"
            type="password"
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
              Yêu cầu mật khẩu:
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Ít nhất 8 ký tự
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Chứa chữ hoa và chữ thường
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Chứa ít nhất 1 số
            </Typography>
            <Typography
              variant="body2"
              component="li"
              className="text-gray-600"
            >
              Chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
            </Typography>
          </Box>
          <DialogActions className="mt-4">
            <Button
              onClick={onClose}
              variant="outlined"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalChangePassword;
