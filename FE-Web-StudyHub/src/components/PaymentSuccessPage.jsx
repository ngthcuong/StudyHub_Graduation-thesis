import React, { useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useSearchParams } from "react-router-dom";
import { useCreatePaymentMutation } from "../services/paymentApi";

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
      <header className="flex w-full items-center justify-center border-b border-gray-200/80 bg-white">
        <nav className="flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="size-6 text-blue-600">
              {/* Bạn có thể thay thế SVG này bằng logo của mình */}
              <svg
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.8285 17.8285C15.8787 19.7782 13.2615 20.9416 10.5 20.9416C7.73852 20.9416 5.1213 19.7782 3.17163 17.8285C1.22195 15.8787 0.0585938 13.2615 0.0585938 10.5C0.0585938 7.73852 1.22195 5.1213 3.17163 3.17163C5.1213 1.22195 7.73852 0.0585938 10.5 0.0585938C13.2615 0.0585938 15.8787 1.22195 17.8285 3.17163L10.5 10.5L17.8285 17.8285Z"
                  fill="currentColor"
                />
                <path
                  d="M20.8284 20.8284C19.8536 21.8033 18.707 22.6074 17.4475 23.1979C16.188 23.7884 14.8397 24.156 13.4695 24.2829C12.1 24.4098 10.725 24.2934 9.41372 23.9397C8.10243 23.586 6.87913 23.0017 5.80338 22.2185L10.5 17.5218L13.1966 14.8252L20.8284 20.8284Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">CourseApp</h2>
          </div>

          {/* Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              to={`/home/dashboard`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to={`/home/courses`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              My Courses
            </Link>
            <Link
              to={`/home/profile`}
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Account
            </Link>
            <div className="size-10 rounded-full bg-orange-100 p-1">
              {/* Avatar Icon */}
              <svg
                className="text-orange-400"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </nav>
      </header>

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

          {/* 2. Tiêu đề */}
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Thanh toán thành công!
          </h1>

          {/* 3. Mô tả */}
          <p className="mb-8 text-base text-gray-600">
            Cảm ơn bạn đã mua khóa học. Khóa học đã được thêm vào tài khoản của
            bạn và hóa đơn chi tiết đã được gửi đến email của bạn.
          </p>

          {/* 4. Tóm tắt giao dịch */}
          <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left">
            <h3 className="mb-5 text-center text-lg font-bold text-gray-800">
              Tóm tắt giao dịch
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Khóa học:</span>
                <span className="font-semibold text-gray-900">
                  Khóa học của StudyHub
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ngày thanh toán:</span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>

              <hr className="my-4 border-t border-dashed border-gray-300" />

              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold text-gray-700">
                  Tổng tiền:
                </span>
                <span className="text-xl font-bold text-blue-600">2000đ</span>
              </div>
            </div>
          </div>

          {/* 5. Nút Bấm */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/home/courses"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {" "}
              Bắt đầu học ngay{" "}
            </Link>
            <Link
              to="/home/dashboard"
              className="w-full rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-center"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
