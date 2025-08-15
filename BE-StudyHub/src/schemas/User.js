const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    walletAddress: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, "Please provide a valid wallet address"],
    },
    avatarUrl: { type: String, trim: true },
    organization: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    certificates: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Certificate",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
