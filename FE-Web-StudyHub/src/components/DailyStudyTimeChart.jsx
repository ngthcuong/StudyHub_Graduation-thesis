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
    return <p className="text-center text-gray-500">No data.</p>;
  }

  const chartData = Object.values(
    data.reduce((acc, item) => {
      const day = item.day.toString();
      if (!acc[day]) {
        acc[day] = { day, studyTimeMinutes: 0 };
      }
      acc[day].studyTimeMinutes += Math.floor(item.durationSeconds / 60);
      return acc;
    }, {})
  );

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
