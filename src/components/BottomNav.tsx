import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Settings
} from "lucide-react";

interface BottomNavProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const BottomNav = ({ activeFilter, setFilter }: BottomNavProps) => {
  const getTabClass = (filterName: string) => {
    const isActive = activeFilter === filterName;
    return `flex flex-col items-center justify-center gap-1 flex-1 py-1.5 cursor-pointer transition-all duration-300 ${
      isActive
        ? "text-primary scale-110 font-bold"
        : "text-muted hover:text-text"
    }`;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)]/90 backdrop-blur-xl border-t border-[var(--border)] px-4 py-2 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
      <div className={getTabClass("DASHBOARD")} onClick={() => setFilter("DASHBOARD")}>
        <LayoutDashboard size={18} />
        <span className="text-[8px] uppercase tracking-widest font-semibold">Dash</span>
      </div>

      <div className={getTabClass("ALL")} onClick={() => setFilter("ALL")}>
        <ClipboardList size={18} />
        <span className="text-[8px] uppercase tracking-widest font-semibold">Tasks</span>
      </div>

      <div className={getTabClass("COMPLETED")} onClick={() => setFilter("COMPLETED")}>
        <CheckCircle size={18} />
        <span className="text-[8px] uppercase tracking-widest font-semibold">Done</span>
      </div>

      <div className={getTabClass("SETTINGS")} onClick={() => setFilter("SETTINGS")}>
        <Settings size={18} />
        <span className="text-[8px] uppercase tracking-widest font-semibold">Setup</span>
      </div>
    </div>
  );
};

export default BottomNav;
