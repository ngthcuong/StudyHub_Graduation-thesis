import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailyLessonsChart({ data }) {
  // Nếu không có data thì render rỗng
  if (!data || !Array.isArray(data)) {
    return <p className="text-center text-gray-500">Không có dữ liệu</p>;
  }

  // ✨ Chuyển dữ liệu API → format cho Recharts
  const chartData = data.map((item) => ({
    // Lấy ngày từ chuỗi "2025-10-01" → "1"
    day: new Date(item.date).getDate().toString(),
    lessons: item.completedLessons,
    studyTimeMinutes: item.studyTimeMinutes,
  }));

  return (
    <div className="flex justify-center">
      <div className="w-full p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ position: "insideBottom", dy: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name) =>
                name === "lessons"
                  ? [`${value} bài học`, "Bài học hoàn thành"]
                  : [`${value} phút`, "Thời gian học"]
              }
            />
            <Bar dataKey="lessons" fill="#007bff" name="Bài học hoàn thành" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
