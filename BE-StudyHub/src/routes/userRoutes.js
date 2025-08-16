const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const {
  removePasswordFromResponse,
} = require("../middlewares/validateMiddleware");
const {
  getUserProfile,
  updateProfile,
  getUserById,
  getUserByWalletAddress,
  getUserByEmail,
  updateUserById,
  getAllUsers,
} = require("../controllers/userController");

router.get("/profile", verifyToken, removePasswordFromResponse, getUserProfile);

router.put("/profile", verifyToken, removePasswordFromResponse, updateProfile);

router.get("/:id", verifyToken, removePasswordFromResponse, getUserById);

router.get(
  "/wallet/:walletAddress",
  verifyToken,
  removePasswordFromResponse,
  getUserByWalletAddress
);

router.get(
  "/email/:email",
  verifyToken,
  removePasswordFromResponse,
  getUserByEmail
);

router.put("/:id", verifyToken, removePasswordFromResponse, updateUserById);

// ======== ADMIN ==============
router.get(
  "/",
  verifyToken,
  requireAdmin,
  removePasswordFromResponse,
  getAllUsers
);

module.exports = router;
