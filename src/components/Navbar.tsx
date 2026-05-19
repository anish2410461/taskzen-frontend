import React from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  Moon,
  Search,
  Sun,
  LogOut
} from "lucide-react";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar = ({ search, setSearch }: Props) => {
  const { darkMode, toggleTheme } = useTheme();
  const { logout, name } = useAuth();

  return (
    <div className="hidden md:flex justify-between items-center mb-10">
      <div>
        <h1 className="text-2xl md:text-4xl text-text font-bold">Welcome back{name ? `, ${name}` : ''}.</h1>
        <p className="text-muted mt-2">Your productivity score is up this week.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="bg-[var(--input)] border border-[var(--border)] shadow-sm px-4 py-3 rounded-2xl flex items-center gap-3 w-full sm:w-auto">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-[var(--text)] placeholder:text-[var(--muted)] w-full"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl text-[var(--text)] hover:bg-[var(--hover)]"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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
          <Bell size={18} />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
            Notification.permission === "granted" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-500 animate-pulse"
          }`} />
        </button>

        <button
          onClick={logout}
          className="bg-danger border border-danger p-3 rounded-2xl text-white hover:opacity-90 flex items-center justify-center"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
