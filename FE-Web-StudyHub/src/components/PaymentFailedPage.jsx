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
          {/* 1. Icon và Tiêu đề */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ErrorOutlineIcon color="error" sx={{ fontSize: "2rem" }} />
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Thanh toán Thất bại
          </h1>

          {/* 2. Mô tả */}
          <p className="mb-8 text-center text-sm text-gray-600">
            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra
            lại thông tin và thử lại.
          </p>

          {/* 3. Thẻ lý do thất bại */}
          <div className="mb-8 w-full rounded-lg border border-red-300 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Lý do thất bại</p>
            <p className="mb-1 text-base font-bold text-gray-900">
              Thông tin thẻ không chính xác
            </p>
            <p className="text-sm text-gray-600">
              Vui lòng kiểm tra lại số thẻ, ngày hết hạn và mã CVC của bạn.
            </p>
          </div>

          {/* 4. Tóm tắt đơn hàng */}
          <div className="w-full">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              Tóm tắt đơn hàng
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
                  <p className="text-sm text-gray-500">Bởi Jane Doe</p>
                </div>
              </div>
              <span className="font-semibold text-gray-900">999,000đ</span>
            </div>

            <hr className="my-6 border-t border-gray-200" />

            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-gray-700">Tổng cộng</span>
              <span className="text-gray-900">999,000đ</span>
            </div>
          </div>

          {/* 5. Nút Bấm */}
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50">
              <ContactSupportIcon sx={{ fontSize: "1.25rem" }} />
              Liên hệ Hỗ trợ
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
              <CreditCardIcon sx={{ fontSize: "1.25rem" }} />
              Kiểm tra & Thử lại
            </button>
          </div>

          {/* 6. Link */}
          <Link
            to="#" // Sửa đường dẫn nếu cần
            className="mt-6 text-sm text-blue-600 hover:underline"
          >
            Xem các câu hỏi thường gặp về thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
