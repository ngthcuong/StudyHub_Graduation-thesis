import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailyLessonsChart() {
  // Chuẩn bị dữ liệu dạng object thay vì array thuần
  const data = Array.from({ length: 30 }, (_, i) => ({
    day: (i + 1).toString(),
    lessons:
      [
        5, 8, 6, 4, 7, 3, 9, 5, 6, 8, 4, 7, 5, 3, 6, 9, 7, 5, 8, 6, 4, 7, 3, 5,
        6, 8, 4, 7, 5, 6,
      ][i] || 0, // gán dữ liệu lessons theo ngày
  }));

  return (
    <div className="flex justify-center">
      <div className="w-full p-6 ">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{ value: "Day", position: "insideBottom", dy: 10 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="lessons" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
