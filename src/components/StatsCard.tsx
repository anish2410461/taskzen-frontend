interface Props {
  title: string;
  value: string | number;
  subtitle: string;
}

const StatsCard = ({
  title,
  value,
  subtitle
}: Props) => {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] shadow-[var(--cardShadow)] rounded-3xl p-6 hover:scale-[1.02] hover:border-primaryHover transition-all duration-300">
      <p className="text-[var(--muted)] text-sm">{title}</p>
      <h1 className="text-[var(--text)] text-5xl font-bold mt-4">{value}</h1>
      <p className="text-primary mt-4 text-sm">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
