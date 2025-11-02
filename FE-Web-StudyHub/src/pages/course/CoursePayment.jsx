import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Shield,
  User,
  ArrowLeft,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useCreatePaymentMutation } from "../../services/paymentApi";

const CoursePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location?.state?.course;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // Payment API mutation
  const [createPayment, { isLoading: isPaymentLoading }] =
    useCreatePaymentMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Course Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a course to proceed with payment.
          </p>
          <button
            onClick={() => navigate("/course")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate(`/home/courses`);
  };

  const onSubmit = async () => {
    try {
      // Kiểm tra course.cost phải là số và không âm (cho phép 0)
      if (
        course.cost === undefined ||
        course.cost === null ||
        course.cost < 0
      ) {
        setDialogMessage("Invalid course price. Please contact support.");
        setDialogOpen(true);
        return;
      }

      const paymentData = {
        courseId: course._id,
        amount: course.cost,
      };

      // Gọi API tạo payment
      await createPayment(paymentData).unwrap();

      setDialogMessage(
        "Payment successful! You now have access to the course."
      );
      setDialogOpen(true);
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error?.data?.error || "Payment failed. Please try again.";
      setDialogMessage(errorMessage);
      setDialogOpen(true);
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dialog for notifications */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer text-white hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment Information
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Card Holder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Name on Card
                  </label>
                  <input
                    type="text"
                    {...register("cardName", {
                      required: "Name on card is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cardName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter name as shown on card"
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Card Number
                  </label>
                  <input
                    type="text"
                    {...register("cardNumber", {
                      required: "Card number is required",
                      pattern: {
                        value: /^[0-9\s]{15,19}$/,
                        message: "Please enter a valid card number",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    onInput={(e) => {
                      const value = e.target.value
                        .replace(/\s+/g, "")
                        .replace(/[^0-9]/gi, "");
                      const formatted = value.replace(/(.{4})/g, "$1 ").trim();
                      e.target.value = formatted;
                    }}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                {/* Expiration Date and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Expiration Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      {...register("expiryDate", {
                        required: "Expiration date is required",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: "Please enter a valid date (MM/YY)",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="MM/YY"
                      maxLength="5"
                      onInput={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value =
                            value.substring(0, 2) + "/" + value.substring(2, 4);
                        }
                        e.target.value = value;
                      }}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      CVC
                    </label>
                    <input
                      type="text"
                      {...register("cvc", {
                        required: "CVC is required",
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: "Please enter a valid CVC",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.cvc ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cvc.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Information Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("saveInfo")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    Save my information for faster checkout
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isPaymentLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || isPaymentLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Payment
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Summary
              </h2>

              {/* Course Information */}
              <div className="space-y-4">
                {/* Course Image */}
                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                    {truncateText(course.description)}
                  </p>
                </div>

                {/* Course Meta */}
                <div className="space-y-2">
                  {course.durationHours && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-800">
                        {course.durationHours} hours
                      </span>
                    </div>
                  )}
                  {course.lessonNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lessons:</span>
                      <span className="text-gray-800">
                        {course.lessonNumber} lessons
                      </span>
                    </div>
                  )}
                  {course.instructor && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="text-gray-800">{course.instructor}</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800">${course.cost || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount:</span>
                    <span className="text-gray-800">0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TAX:</span>
                    <span className="text-gray-800">$0</span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-gray-800">${course.cost || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePayment;
