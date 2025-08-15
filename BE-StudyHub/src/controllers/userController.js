const userModel = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const savedUser = await userModel.createUser(userData);
    res.status(201).json({
      message: "User created successfully!",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ error: "Failed to get user by id" });
  }
};

const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await userModel.findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user by phone:", error);
    res.status(500).json({ error: "Failed to get user by phone" });
  }
};

const getUserByWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await userModel.findUserByWalletAddress(walletAddress);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user by wallet address:", error);
    res.status(500).json({ error: "Failed to get user by wallet address" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({ error: "Failed to get user by email" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await userModel.updateUserById(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user by id:", error);
    res.status(500).json({ error: "Failed to update user by id" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Từ middleware verifyToken
    const updateData = req.body;

    // Không cho phép cập nhật một số trường nhạy cảm
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    const updatedUser = await userModel.updateUserById(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Từ middleware verifyToken
    const user = await userModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Failed to get all users" });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByPhone,
  getUserByWalletAddress,
  getUserByEmail,
  updateUserById,
  updateProfile,
  getAllUsers,
  getUserProfile,
};
