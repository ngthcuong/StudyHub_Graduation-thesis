import React from "react";
// Import icon từ thư viện Material-UI (giống như bạn đã dùng)
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom"; // Dùng Link cho các nút bấm
import Header from "./Header";

const CancelPaymentPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50">
      <Header />

      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg sm:p-10 mt-16">
        {/* 1. Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <CheckCircleIcon color="primary" sx={{ fontSize: "2.5rem" }} />
        </div>

        {/* 2. Title */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Order Cancelled Successfully!
        </h1>

        {/* 3. Description */}
        <p className="mb-8 text-center text-sm text-gray-600">
          Your cancellation request has been processed. The amount will be
          refunded to your original payment method within 5-7 business days.
        </p>

        {/* 4. Transaction Summary */}
        <div className="mb-8 space-y-3">
          {/* <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order Code:</span>
            <span className="font-medium text-gray-900">ORD123456789</span>
          </div> */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cancelled Course:</span>
            <span className="font-medium text-gray-900">StudyHub Course</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cancellation Date:</span>
            <span className="font-medium text-gray-900">26/10/2023</span>
          </div>
        </div>

        {/* 5. Buttons */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/home/dashboard" // Update path if needed
            className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            to="/home/courses" // Update path if needed
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Explore Other Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
