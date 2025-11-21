const paymentModel = require("../models/paymentModel");
const payment = require("../schemas/Payment");
const User = require("../schemas/User");

const { PayOS } = require("@payos/node");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

/**
 * Tạo payment mới (thanh toán khóa học)
 */
const createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const userId = req.user.userId;

    // Kiểm tra các trường bắt buộc
    const requiredFields = ["courseId", "amount"];
    const missingFields = requiredFields.filter(
      (field) => paymentData[field] === undefined || paymentData[field] === null
    );

    if (!userId) {
      missingFields.push("studentId");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Kiểm tra amount hợp lệ (cho phép 0)
    if (typeof paymentData.amount !== "number" || paymentData.amount < 0) {
      return res.status(400).json({
        error: "Amount must be a number equal or greater than 0",
      });
    }

    paymentData.studentId = userId;

    const savedPayment = await paymentModel.createPayment(paymentData);
    res.status(201).json({
      message: "Payment created successfully!",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    // Xử lý các lỗi cụ thể
    if (error.message === "Student not found") {
      return res.status(404).json({ error: "Student not found" });
    }
    if (error.message === "Course not found") {
      return res.status(404).json({ error: "Course not found" });
    }
    if (error.message === "You have already purchased this course") {
      return res
        .status(409)
        .json({ error: "You have already purchased this course" });
    }
    if (error.message.startsWith("Invalid payment amount")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to create payment" });
  }
};

/**
 * Lấy danh sách payments của user hiện tại
 */
const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const payments = await paymentModel.getPaymentsByUser(userId);
    res.status(200).json({
      message: "User payments retrieved successfully",
      payments: payments,
      total: payments.length,
    });
  } catch (error) {
    console.error("Error getting my payments:", error);
    res.status(500).json({ error: "Failed to get my payments" });
  }
};

/**
 * Lấy danh sách payments của một user (admin only)
 */
const getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const payments = await paymentModel.getPaymentsByUser(userId);
    res.status(200).json({
      message: "User payments retrieved successfully",
      payments: payments,
      total: payments.length,
    });
  } catch (error) {
    console.error("Error getting payments by user:", error);
    res.status(500).json({ error: "Failed to get payments by user" });
  }
};

/**
 * Lấy danh sách payments của một khóa học
 */
const getPaymentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const payments = await paymentModel.getPaymentsByCourse(courseId);
    res.status(200).json({
      message: "Course payments retrieved successfully",
      payments: payments,
      total: payments.length,
    });
  } catch (error) {
    console.error("Error getting payments by course:", error);
    res.status(500).json({ error: "Failed to get payments by course" });
  }
};

/**
 * Lấy tất cả payments
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json({
      message: "All payments retrieved successfully",
      payments: payments,
      total: payments.length,
    });
  } catch (error) {
    console.error("Error getting all payments:", error);
    res.status(500).json({ error: "Failed to get all payments" });
  }
};

/**
 * Lấy thống kê payments cho admin
 */
const getAdminPaymentStats = async (req, res) => {
  try {
    const stats = await paymentModel.getAdminPaymentStats();
    res.status(200).json({
      message: "Admin payment stats retrieved successfully",
      stats: stats,
    });
  } catch (error) {
    console.error("Error getting admin payment stats:", error);
    res.status(500).json({ error: "Failed to get admin payment stats" });
  }
};

const createPaymentLink = async (req, res) => {
  try {
    const { courseId, amount, description } = req.body;
    const userId = req.user?.userId;

    if (!userId || !courseId || amount === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:5173";

    const orderCode = Number(String(Date.now()).slice(-6));

    const paymentBody = {
      orderCode, // mã đơn hàng 6 số
      amount,
      description: `${courseId}`,
      items: [
        {
          name: `Course ${courseId}`,
          quantity: 1,
          price: amount,
        },
      ],
      returnUrl: `${YOUR_DOMAIN}/payment-success`,
      cancelUrl: `${YOUR_DOMAIN}/payment-cancel`,
    };

    const paymentLinkResponse = await payOS.paymentRequests.create(paymentBody);

    console.log("Payment link created:", paymentLinkResponse);

    const savedPayment = await payment.create({
      studentId: userId,
      courseId,
      amount,
      orderCode,
      status: "PENDING",
      payOSLink: paymentLinkResponse.checkoutUrl,
      paymentLinkId: paymentLinkResponse.paymentLinkId,
    });

    res.status(201).json({
      message: "Payment link created successfully",
      payment: savedPayment,
      payOSLink: paymentLinkResponse.checkoutUrl,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
};

const receiveHookPayment = async (req, res) => {
  try {
    const payload = req.body;

    const { data } = payload;
    const { orderCode, code, success } = data;

    if (!orderCode) {
      return res.status(400).json({ error: "Missing orderCode" });
    }

    const paymentOrder = await payment.findOne({ orderCode });
    if (!paymentOrder)
      return res.status(404).json({ error: "Payment not found" });

    // Cập nhật trạng thái
    if (code === "00" && success === true) {
      paymentOrder.status = "PAID";
    } else {
      paymentOrder.status = "CANCELLED";
    }
    await paymentOrder.save();

    await User.findByIdAndUpdate(
      paymentOrder.studentId,
      { $addToSet: { courses: paymentOrder.courseId } }, // $addToSet để tránh duplicate
      { new: true }
    );

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Error processing PayOS webhook:", error);
    res.status(500).json({ error: "Webhook error" });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getPaymentsByUser,
  getPaymentsByCourse,
  getAllPayments,
  getAdminPaymentStats,
  createPaymentLink,
  receiveHookPayment,
};
