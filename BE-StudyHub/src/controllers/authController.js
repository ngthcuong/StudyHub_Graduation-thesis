const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const redisService = require("../services/redis.service");

const register = async (req, res) => {
  try {
    const userData = req.body;
    const savedUser = await userModel.createUser(userData);

    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
      },
      config.jwtKey,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: savedUser,
      token: token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      config.jwtKey,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      config.jwtKey,
      { expiresIn: "24h" }
    );

    // Lưu token vào Redis
    await redisService.saveAccessToken({
      userId: user._id.toString(),
      token: accessToken,
      expiresIn: 15 * 60, // 15 phút
    });
    await redisService.saveRefreshToken({
      userId: user._id.toString(),
      token: refreshToken,
      expiresIn: 24 * 60 * 60, // 24 giờ
    });

    res.status(200).json({
      message: "Login successfully!",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to login user" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.user.userId;

    if (token) {
      // await redisService.removeAccessToken({ userId, token });
      // await redisService.removeRefreshToken({ userId, token });
      await redisService.removeToken({ userId, token });
    }

    res.status(200).json({
      message: "Logout successful!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to logout user" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { userId, email, fullName, role } = req.user; // Từ middleware verifyToken
    const oldToken = req.headers.authorization?.split(" ")[1];
    const { refreshToken } = req.body;

    const isValidToken = await redisService.isValidRefreshToken({
      userId,
      token: refreshToken,
    });
    if (!isValidToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId, email, fullName, role },
      config.jwtKey,
      {
        expiresIn: "15m",
      }
    );

    await redisService.removeAccessToken({ userId, token: oldToken });
    await redisService.saveAccessToken({
      userId,
      token: newAccessToken,
      expiresIn: 15 * 60,
    });

    res.status(200).json({
      message: "Token refreshed successfully!",
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};

const logoutAllSessions = async (req, res) => {
  try {
    const userId = req.user.userId;

    await redisService.removeAllUserTokens(userId);

    res.status(200).json({
      message: "All sessions logged out successfully!",
      timestamp: new Date().toISOString(),
      userId: userId,
    });
  } catch (error) {
    console.error("Error logging out all sessions:", error);
    res.status(500).json({ error: "Failed to logout all sessions" });
  }
};

const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const activeSessions = await redisService.getUserActiveSessions(userId);

    res.status(200).json({
      message: "User sessions retrieved successfully",
      data: {
        userId: userId,
        activeSessions: activeSessions,
      },
    });
  } catch (error) {
    console.error("Error getting user sessions:", error);
    res.status(500).json({ error: "Failed to get user sessions" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // Từ middleware verifyToken

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userModel.updateUserById(userId, {
      password: hashedNewPassword,
    });

    res.status(200).json({
      message: "Password changed successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtKey,
      { expiresIn: "1h" }
    );

    // Bổ sung code gửi email để reset
  } catch (error) {
    console.error("Error in forgot password:", error);
    res
      .status(500)
      .json({ error: "Failed to process forgot password request" });
  }
};

module.exports = {
  register,
  login,
  getUserSessions,
  changePassword,
  forgotPassword,
  logout,
  logoutAllSessions,
  refreshToken,
};
