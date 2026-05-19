import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Clock,
  Star,
  Settings
} from "lucide-react";

interface SidebarProps {
  activeFilter?: string;
  setFilter?: (filter: string) => void;
}

const Sidebar = ({ activeFilter = "ALL", setFilter = () => {} }: SidebarProps) => {
  const getNavClass = (filterName: string) => {
    return `flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
      activeFilter === filterName
        ? "bg-gradient-to-r from-primary to-primaryHover text-white shadow-glow"
        : "text-muted hover:text-text hover:bg-hover"
    }`;
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-sidebar border-r border-border fixed left-0 top-0 p-6 text-text">
      <div className="flex items-center justify-start bg-white border border-slate-200/60 shadow-sm rounded-xl px-3.5 py-2 mb-10 w-fit">
        <img src="/logo.png" alt="TaskZen Logo" className="h-7 w-auto object-contain" />
      </div>

      <div className="space-y-3">
        <div className={getNavClass("DASHBOARD")} onClick={() => setFilter("DASHBOARD")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className={getNavClass("ALL")} onClick={() => setFilter("ALL")}>
          <ClipboardList size={20} />
          <span>All Tasks</span>
        </div>

        <div className={getNavClass("COMPLETED")} onClick={() => setFilter("COMPLETED")}>
          <CheckCircle size={20} />
          <span>Completed</span>
        </div>

        <div className={getNavClass("PENDING")} onClick={() => setFilter("PENDING")}>
          <Clock size={20} />
          <span>Pending</span>
        </div>

        <div className={getNavClass("IMPORTANT")} onClick={() => setFilter("IMPORTANT")}>
          <Star size={20} />
          <span>Important</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
        <div className={getNavClass("SETTINGS")} onClick={() => setFilter("SETTINGS")}>
          <Settings size={20} />
          <span>Settings</span>
        </div>

        {/* Chief Developer Profile Badge */}
        <div className="flex flex-col items-center justify-center border-t border-border/40 pt-4 mt-2 text-center group">
          <div className="relative w-14 h-14 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-primary to-indigo-500 shadow-md group-hover:scale-105 transition-all duration-300">
            <img 
              src="/developer.png" 
              alt="Chief Developer" 
              className="w-full h-full object-cover rounded-full bg-sidebar"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-sidebar rounded-full animate-pulse" />
          </div>
          <div className="mt-2 text-center">
            <h4 className="text-[10px] tracking-[0.12em] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 font-sans">
              Creative Director & Chief Developer
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
