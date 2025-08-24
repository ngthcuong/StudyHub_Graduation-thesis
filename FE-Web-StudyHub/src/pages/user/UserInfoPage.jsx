import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { Edit, Lock } from "@mui/icons-material";
import classNames from "classnames";

const UserInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "Nguyen Van A sdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    email: "nguyenvana12a@example.com",
    phone: "0123456781",
    dob: "2024-08-21",
    gender: "male",
    walletAddress: "0x...........",
    organization: "IUH",
  });

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

          {/* Thông tin người dùng */}
          <div className="pt-12 pb-6 px-8">
            <div className="mb-6">
              {/* <Typography variant="h4" className="font-bold text-gray-800 mb-2">
                {userInfo?.fullName}
              </Typography> */}
              {/* <Typography variant="body1" className="text-gray-600 mb-4">
                {userInfo?.email}
              </Typography> */}

              <TextField
                fullWidth
                value={userInfo?.fullName}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "standard"}
                size="medium"
                className={classNames("max-w-fit", {
                  "bg-gray-50 ": isEditing,
                  "": !isEditing,
                })}
                slotProps={{
                  input: {
                    style: {
                      fontSize: "18px",
                      padding: "0px 8px 0px 4px",
                      fontWeight: 600,
                    },
                  },
                }}
              />

              <div className="flex gap-3 mt-4">
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
              </div>
            </div>

            {/* Form thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <div>
                <Typography variant="body1" className="mb-2">
                  Họ và tên
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.fullName}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div> */}

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.email}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Số điện thoại
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.phone}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Giới tính
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.gender}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Ngày sinh
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.dob}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Tổ chức
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.organization}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-2 font-medium"
                >
                  Địa chỉ ví điện tử
                </Typography>
                <TextField
                  fullWidth
                  value={userInfo?.walletAddress}
                  disabled={!isEditing}
                  variant="outlined"
                  size="medium"
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Nút lưu khi đang chỉnh sửa */}
            {isEditing && (
              <div className="flex gap-3 mt-6 justify-end">
                <Button
                  variant="outlined"
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
                  onClick={() => setIsEditing(false)}
                  className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </Paper>
      </div>
    </Box>
  );
};

export default UserInfoPage;
