import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailyStudyTimeChart({ data }) {
  if (!data || !Array.isArray(data)) {
    return <p className="text-center text-gray-500">Không có dữ liệu</p>;
  }

  // ✨ Chuyển dữ liệu từ API → Recharts
  const chartData = data.map((item) => ({
    day: new Date(item.date).getDate().toString(),
    studyTimeMinutes: Math.floor(item.studyTimeSeconds / 60),
  }));

  return (
    <div className="flex justify-center">
      <div className="w-full p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ position: "insideBottom", dy: 10 }} />
            <YAxis
              allowDecimals={false}
              label={{
                angle: -90,
                position: "insideLeft",
                dy: 50,
              }}
            />
            <Tooltip
              formatter={(value) => [`${value} mins`, "Study Time"]}
              labelFormatter={(label) => `Days ${label}`}
            />
            <Bar
              dataKey="studyTimeMinutes"
              fill="#007bff"
              name="Study Time (minutes)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
