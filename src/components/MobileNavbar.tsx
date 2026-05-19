import toast from "react-hot-toast";
import {
  Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MobileNavbar = () => {
  const { name } = useAuth();

  const getInitials = (fullName: string | null) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return "User";
    return fullName.trim().split(/\s+/)[0];
  };

  return (
    <div className="md:hidden flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-white/10">
          {getInitials(name)}
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[8px] text-muted font-bold uppercase tracking-wider">Hey,</span>
          <span className="text-[11px] font-extrabold text-[var(--text)] truncate max-w-[65px] mt-0.5">
            {getFirstName(name)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white border border-slate-200/60 shadow-sm rounded-xl px-3 py-1.5">
        <img src="/logo.png" alt="TaskZen Logo" className="h-6 w-auto object-contain" />
      </div>

      <button
        onClick={() => {
          if (!("Notification" in window)) {
            toast.error("This browser does not support desktop notifications.");
            return;
          }
          if (Notification.permission === "granted") {
            new Notification("🔔 TaskZen Notifications Active!", {
              body: "You are all set to receive automatic overdue task alerts!",
              icon: "/logo.png"
            });
            toast.success("Desktop notifications are active and verified!");
          } else {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("🎉 Notifications Enabled!", {
                  body: "Welcome to TaskZen smart overdue task reminders!",
                  icon: "/logo.png"
                });
                toast.success("Notifications enabled successfully!");
              } else {
                toast.error("Notification permission denied. Please allow them in your browser settings.");
              }
            });
          }
        }}
        className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl text-[var(--text)] hover:bg-[var(--hover)] relative group"
      >
        <Bell size={20} />
        <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
          Notification.permission === "granted" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-500 animate-pulse"
        }`} />
      </button>
    </div>
  );
};

export default MobileNavbar;
