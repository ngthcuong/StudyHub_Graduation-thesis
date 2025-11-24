import React from "react";
// Import icon từ thư viện Material-UI (giống như bạn đã dùng)
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Link } from "react-router-dom";

const PaymentFailedPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg sm:p-10">
        <div className="flex w-full flex-col items-center">
          {/* 1. Icon and Title */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ErrorOutlineIcon color="error" sx={{ fontSize: "2rem" }} />
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Payment Failed
          </h1>

          {/* 2. Description */}
          <p className="mb-8 text-center text-sm text-gray-600">
            Unfortunately, your transaction could not be completed. Please check
            your information and try again.
          </p>

          {/* 3. Failure Reason Card */}
          <div className="mb-8 w-full rounded-lg border border-red-300 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Failure Reason</p>
            <p className="mb-1 text-base font-bold text-gray-900">
              Incorrect Card Information
            </p>
            <p className="text-sm text-gray-600">
              Please check your card number, expiration date, and CVC code.
            </p>
          </div>

          {/* 4. Order Summary */}
          <div className="w-full">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              Order Summary
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100">
                  {/*  */}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Full-Stack Web Development Bootcamp
                  </p>
                  <p className="text-sm text-gray-500">By Jane Doe</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">999,000đ</span>
            </div>

            <hr className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-gray-700">Total</span>
              <span className="text-gray-900">999,000đ</span>
            </div>
          </div>

          {/* 5. Buttons */}
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50">
              <ContactSupportIcon sx={{ fontSize: "1.25rem" }} />
              Contact Support
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
              <CreditCardIcon sx={{ fontSize: "1.25rem" }} />
              Review & Try Again
            </button>
          </div>

          {/* 6. Link */}
          <Link
            to="#" // Update path if needed
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            View payment FAQs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
