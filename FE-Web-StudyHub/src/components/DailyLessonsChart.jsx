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
  const chartData = Object.values(
    data.reduce((acc, item) => {
      const day = item.day.toString(); // dùng ngày làm key

      // Nếu chưa có ngày này trong accumulator thì khởi tạo
      if (!acc[day]) {
        acc[day] = { day, lessons: 0 };
      }

      // Nếu có trường lessons (tức là bài học), mới cộng vào
      if (item.lessons) {
        acc[day].lessons += 1;
      }

      return acc;
    }, {})
  );

  console.log("🚀 DailyLessonsChart chartData:", chartData);

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
                  : [`${value} bài học`, "Bài học hoàn thành"]
              }
            />
            <Bar dataKey="lessons" fill="#007bff" name="Bài học hoàn thành" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
