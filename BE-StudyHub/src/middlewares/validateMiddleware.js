const user = require("../schemas/User");
const bcrypt = require("bcrypt");

// Hàm để validate mật khẩu
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Passoword is required" });
  }

  // Kiểm tra độ dài tối thiểu (>= 8 kí tự)
  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long",
    });
  }

  // Kiểm tra có ít nhất 1 chữ hoa
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one uppercase letter",
    });
  }

  // Kiểm tra có ít nhất 1 chữ thường
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one lowercase letter",
    });
  }

  // Kiểm tra có ít nhất 1 số
  if (!/\d/.test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one number",
    });
  }

  // Kiểm tra có ít nhất 1 ký tự đặc biệt
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({
      error: "Password must contain at least one special character",
    });
  }

  next();
};

// Hàm để validate email
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address" });
  }

  next();
};

// Hàm để validate số điện thoại
const validatePhone = (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Regex cho số điện thoại VN và quốc tế
  // Hỗ trợ: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx, +1xxxxxxxxx, ...
  const phoneRegex = /^(\+?[0-9]{1,4})?[0-9]{9,15}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      error:
        "Please provide a valid phone number (9-15 digits, optionally with country code)",
    });
  }

  next();
};

// Hàm để validate địa chỉ ví
const validateWalletAddress = (req, res, next) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  const walletRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!walletRegex.test(walletAddress)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid wallet address" });
  }

  next();
};

// Hàm để kiểm tra tài khoản có tồn tại hay không
const checkUserExists = async (req, res, next) => {
  try {
    const { email, username, phone, walletAddress } = req.body;

    // Kiểm tra email đã tồn tại
    if (email) {
      const existingUserByEmail = await user.findOne({ email });
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Kiểm tra username đã tồn tại
    if (username) {
      const existingUserByUsername = await user.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    // Kiểm tra phone đã tồn tại
    if (phone) {
      const existingUserByPhone = await user.findOne({ phone });
      if (existingUserByPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    // Kiểm tra wallet address đã tồn tại
    if (walletAddress) {
      const existingUserByWallet = await user.findOne({ walletAddress });
      if (existingUserByWallet) {
        return res.status(400).json({ error: "Wallet address already exists" });
      }
    }

    next();
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Failed to check user existence" });
  }
};

// Hàm để xóa mật khẩu khỏi res trả về
const removePasswordFromResponse = (req, res, next) => {
  // Lưu hàm json gốc
  const originalJson = res.json;

  // Override hàm json để loại bỏ password
  res.json = function (data) {
    if (data && typeof data === "object") {
      if (Array.isArray(data)) {
        // Nếu là array, loại bỏ password từ mỗi object
        data = data.map((item) => {
          if (item && typeof item === "object" && item.password) {
            const { password, ...itemWithoutPassword } = item;
            return itemWithoutPassword;
          }
          return item;
        });
      } else if (data.password) {
        // Nếu là object, loại bỏ password
        const { password, ...dataWithoutPassword } = data;
        data = dataWithoutPassword;
      }
    }

    // Gọi hàm json gốc
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  checkUserExists,
  removePasswordFromResponse,
  validateEmail,
  validatePassword,
  validatePhone,
  validateWalletAddress,
};
