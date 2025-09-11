export default function HeaderHome() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center justify-between">
      {/* Bên trái */}
      <div>
        <h2 className="text-2xl font-semibold">Welcome back, Sarah!</h2>
        <p className="text-gray-600">
          Ready to continue your English learning journey?
        </p>
      </div>

      {/* Bên phải */}
      <div className="flex items-center space-x-4">
        {/* Nút chuông */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.311 6.022c1.74.68 3.574 1.131 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>

          {/* Chấm đỏ thông báo */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
      </div>
    </div>
  );
}
