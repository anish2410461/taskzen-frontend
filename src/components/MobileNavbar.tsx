import toast from "react-hot-toast";
import {
  Menu,
  Bell
} from "lucide-react";

const MobileNavbar = () => {
  return (
    <div className="md:hidden flex justify-between items-center mb-6">
      <button className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl text-[var(--text)] hover:bg-[var(--hover)]">
        <Menu size={20} />
      </button>

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
