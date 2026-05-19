import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
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
  const data = [
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

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-[var(--cardShadow)]">
      <h1 className="text-[var(--text)] text-2xl font-bold mb-6">
        Productivity Overview
      </h1>

      <div className="h-[350px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={100}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityChart;
