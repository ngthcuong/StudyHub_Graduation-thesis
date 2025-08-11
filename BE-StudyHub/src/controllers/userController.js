const userModel = require("../models/userModel");

const userController = {
  createUser: async (req, res) => {
    try {
      const userData = req.body;
      const savedUser = await userModel.createUser(userData);
      res.status(201).json({
        message: "User created successfully!",
        course: savedUser,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  },
};

module.exports = userController;
