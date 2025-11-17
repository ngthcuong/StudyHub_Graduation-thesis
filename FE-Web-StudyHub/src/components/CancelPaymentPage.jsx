import React from "react";
// Import icon từ thư viện Material-UI (giống như bạn đã dùng)
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom"; // Dùng Link cho các nút bấm

const CancelPaymentPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-slate-50">
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

      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg sm:p-10 mt-16">
        {/* 1. Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <CheckCircleIcon color="primary" sx={{ fontSize: "2.5rem" }} />
        </div>

        {/* 2. Tiêu đề */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Hủy Đơn Hàng Thành Công!
        </h1>

        {/* 3. Mô tả */}
        <p className="mb-8 text-center text-sm text-gray-600">
          Yêu cầu hủy của bạn đã được xử lý. Khoản tiền sẽ được hoàn lại vào
          phương thức thanh toán ban đầu trong 5-7 ngày làm việc.
        </p>

        {/* 4. Tóm tắt giao dịch */}
        <div className="mb-8 space-y-3">
          {/* <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mã đơn hàng:</span>
            <span className="font-medium text-gray-900">ORD123456789</span>
          </div> */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Khóa học đã hủy:</span>
            <span className="font-medium text-gray-900">
              Khóa học của StudyHub
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ngày hủy:</span>
            <span className="font-medium text-gray-900">26/10/2023</span>
          </div>
        </div>

        {/* 5. Nút Bấm */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/home/dashboard" // Sửa đường dẫn nếu cần
            className="flex w-full items-center justify-center rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 sm:w-auto"
          >
            Về Trang Chủ
          </Link>
          <Link
            to="/home/courses" // Sửa đường dẫn nếu cần
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Khám Phá Các Khóa Học Khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
