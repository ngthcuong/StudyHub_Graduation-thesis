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
    return <p className="text-center text-gray-500">No data.</p>;
  }

  console.log("🚀 DailyLessonsChart received data:", data);

  // ✨ Chuyển dữ liệu API → format cho Recharts
  const chartData = Object.values(
    data.reduce((acc, item) => {
      const day = item.day.toString(); // dùng ngày làm key

      // Nếu chưa có ngày này thì khởi tạo
      if (!acc[day]) {
        acc[day] = { day, exercises: 0 };
      }

      // Nếu có exercises thì cộng số lượng exercise trong ngày đó
      if (Array.isArray(item.exercises)) {
        acc[day].exercises += item.exercises.length;
      }

      return acc;
    }, {})
  );

  console.log("🚀 Formatted chartData:", chartData);

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
                name === "exercises"
                  ? [`${value} bài tập`, "Bài tập đã làm"]
                  : value
              }
            />

            <Bar dataKey="exercises" fill="#007bff" name="Bài tập đã làm" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
