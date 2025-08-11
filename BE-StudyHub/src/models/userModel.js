const User = require("../schemas/User");

const userModel = {
  createUser: async (userData) => {
    try {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },
};

module.exports = userModel;
