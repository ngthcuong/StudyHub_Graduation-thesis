import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useSearchParams } from "react-router-dom";
import { useCreatePaymentMutation } from "../services/paymentApi";
import Header from "./Header";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");
  const id = searchParams.get("id");
  const cancel = searchParams.get("cancel");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  console.log({ code, id, cancel, status, orderCode });
  const [createPayment] = useCreatePaymentMutation();

  useEffect(() => {
    if (cancel === "false" && status === "PASSED") {
      // Xử lý khi thanh toán thành công
      handlePaymentSuccess();
    }
  }, [cancel, status]);

  const handlePaymentSuccess = async () => {
    try {
      const paymentData = {
        courseId: id,
        amount: 2000, // Giả sử số tiền là 2000đ, bạn có thể thay đổi theo logic của mình
      };

      const response = await createPayment(paymentData).unwrap();
      console.log("Payment record created:", response);
    } catch (error) {
      console.error("Error creating payment record:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50">
      {/* ==================== Header ==================== */}
      <Header />

      {/* ==================== Main Content ==================== */}
      <main className="flex w-full flex-1 justify-center px-4 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 text-center shadow-xl sm:p-10">
          {/* 1. Icon Checkmark */}
          {/* <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="material-symbols-outlined text-4xl text-green-500">
              task_alt
            </span>
          </div> */}
          <CheckCircleIcon color="success" fontSize="large" />

          {/* 2. Title */}
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>

          {/* 3. Description */}
          <p className="mb-8 text-base text-gray-600">
            Thank you for purchasing the course. The course has been added to
            your account and a detailed invoice has been sent to your email.
          </p>

          {/* 4. Transaction Summary */}
          <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left">
            <h3 className="mb-5 text-center text-lg font-bold text-gray-800">
              Transaction Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Course:</span>
                <span className="font-semibold text-gray-900">
                  StudyHub Course
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US")}
                </span>
              </div>

              <hr className="my-4 border-t border-dashed border-gray-300" />

              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold text-gray-700">
                  Total Amount:
                </span>
                <span className="text-xl font-bold text-blue-600">2000đ</span>
              </div>
            </div>
          </div>

          {/* 5. Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/home/courses"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {" "}
              Start Learning Now{" "}
            </Link>
            <Link
              to="/home/dashboard"
              className="w-full rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
