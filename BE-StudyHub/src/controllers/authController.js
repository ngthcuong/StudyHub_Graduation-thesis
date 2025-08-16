const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");

const register = async (req, res) => {
  try {
    const userData = req.body;
    const savedUser = await userModel.createUser(userData);

    const token = jwt.sign(
      {
        userId: savedUser._id,
        email: savedUser.email,
        fullName: user.fullName,
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

    res.status(200).json({
      message: "Login successfully!",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Failed to login user" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logout successful!",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to logout user" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { userId, email, fullName, role } = req.user; // Từ middleware verifyToken

    const newToken = jwt.sign(
      { userId, email, fullName, role },
      config.jwtKey,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      message: "Token refreshed successfully!",
      token: newToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
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
  changePassword,
  forgotPassword,
  logout,
  refreshToken,
};
