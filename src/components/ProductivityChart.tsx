import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface Props {
  completed: number;
  pending: number;
}

const ProductivityChart = ({
  completed,
  pending
}: Props) => {
  const chartData = [
    {
      name: "Completed",
      value: completed
    },
    {
      name: "Pending",
      value: pending
    }
  ];

  const COLORS = ["#3B82F6", "#60A5FA"];

  const hasTasks = completed > 0 || pending > 0;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-[var(--cardShadow)]">
      <h1 className="text-[var(--text)] text-2xl font-bold mb-6">
        Productivity Overview
      </h1>

      {hasTasks ? (
        <div className="w-full h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] w-full flex flex-col items-center justify-center text-center text-muted">
          <span className="text-4xl mb-3">📈</span>
          <p className="text-sm font-medium">No analytics available</p>
          <p className="text-xs opacity-70 mt-1">Create tasks and track them to see your productivity dashboard!</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityChart;
