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
    <div className="bg-[var(--card)] border border-[var(--border)] shadow-[var(--cardShadow)] rounded-2xl md:rounded-3xl p-4 md:p-6 hover:scale-[1.02] hover:border-primary/20 transition-all duration-300">
      <p className="text-[var(--muted)] text-xs md:text-sm font-semibold truncate">{title}</p>
      <h1 className="text-[var(--text)] text-3xl md:text-5xl font-extrabold mt-2 md:mt-4">{value}</h1>
      <p className="text-primary mt-2 md:mt-4 text-xs md:text-sm font-medium leading-tight">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
