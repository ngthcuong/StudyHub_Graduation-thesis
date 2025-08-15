const express = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  changePassword,
  forgotPassword,
} = require("../controllers/authController");
const {
  validateEmail,
  validatePhone,
  validatePassword,
  validateWalletAddress,
  checkUserExists,
  removePasswordFromResponse,
} = require("../middlewares/validateMiddleware");
const { hashPassword, verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
  "/reiger",
  validateEmail,
  validatePhone,
  validatePassword,
  validateWalletAddress,
  checkUserExists,
  hashPassword,
  removePasswordFromResponse,
  register
);
router.post(
  "/login",
  validateEmail,
  validatePassword,
  removePasswordFromResponse,
  login
);
router.post("/logout", verifyToken, logout);
router.post("/refresh", verifyToken, refreshToken);
router.post("/change-password", verifyToken, validatePassword, changePassword);
router.post("/forgot-password", validateEmail, forgotPassword);
