import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Bell } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );
      
      login(res.data.token, res.data.name, email);
      toast.success(`Welcome back, ${res.data.name || "User"}! ✨`);
      
      if ("Notification" in window && Notification.permission === "default") {
        setTimeout(() => {
          setShowPermissionPrompt(true);
        }, 600);
      } else {
        // Delay briefly to allow the success toast to be read
        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Invalid credentials. Please check and try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[var(--background)] grid-bg px-4">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] animate-float-slower pointer-events-none" />

      {/* Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] glass-panel border border-[var(--border)] shadow-2xl rounded-3xl p-8 md:p-10 z-10 relative"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="flex items-center justify-center bg-white border border-slate-200/50 shadow-sm rounded-2xl px-5 py-2.5 mb-4"
          >
            <img src="/logo.png" alt="TaskZen Logo" className="h-11 w-auto object-contain" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted text-sm mt-2 font-medium"
          >
            Simplify your workflow, achieve peace of mind.
          </motion.p>
        </div>

        <div className="space-y-5">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-1.5"
          >
            <label className="text-sm font-semibold text-[var(--text)] opacity-80 pl-1">Email Address</label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-4 text-muted group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--input)] text-[var(--text)] border border-[var(--border)] focus:border-primary focus:bg-[var(--card)] outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between items-center pl-1">
              <label className="text-sm font-semibold text-[var(--text)] opacity-80">Password</label>
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  toast("We've sent a simulated password recovery link to your inbox! 📬", { icon: '📧' }); 
                }} 
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-4 text-muted group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[var(--input)] text-[var(--text)] border border-[var(--border)] focus:border-primary focus:bg-[var(--card)] outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 text-muted hover:text-[var(--text)] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={submit}
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-glow-blue cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center mt-6 pt-4 border-t border-[var(--border)]"
          >
            <span className="text-muted text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-semibold text-sm">
              Sign Up for Free
            </Link>
          </motion.div>

          {/* Chief Developer Credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-[var(--border)]/60 text-left"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden p-[1px] bg-gradient-to-tr from-primary to-indigo-500 shadow-sm flex-shrink-0">
              <img 
                src="/developer.png" 
                alt="Chief Developer" 
                className="w-full h-full object-cover rounded-full bg-[var(--background)]"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] tracking-widest font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 font-sans">
                Creative Director & Chief Developer
              </p>
              <p className="text-[10px] text-muted font-semibold mt-0.5">
                Anish M — TaskZen Founder 🚀
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium Notification Permission Modal */}
      <AnimatePresence>
        {showPermissionPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-[400px] glass-panel border border-[var(--border)] shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden"
            >
              {/* Decorative background glow inside modal */}
              <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

              {/* Glowing Bell Icon */}
              <div className="relative mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-indigo-500/10 border border-primary/20 text-primary shadow-glow-blue">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
                >
                  <Bell className="h-10 w-10 text-primary" />
                </motion.div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>

              {/* Heading */}
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text)] mb-3 leading-snug">
                Enable smart reminders and overdue alerts?
              </h2>

              {/* Description */}
              <p className="text-sm text-muted mb-8 leading-relaxed">
                Stay on top of your workflow! TaskZen will notify you when tasks are due soon, overdue, or need your immediate attention.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      const permission = await Notification.requestPermission();
                      if (permission === "granted") {
                        new Notification("🎉 Notifications Enabled!", {
                          body: "You will now receive smart reminders and overdue alerts from TaskZen.",
                          icon: "/logo.png",
                        });
                        toast.success("Awesome! Reminders are active. 🔔");
                      } else if (permission === "denied") {
                        toast.error("Permission denied. You can enable them later in settings.");
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      window.location.href = "/";
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:opacity-90 transition-all duration-300 shadow-glow-blue cursor-pointer"
                >
                  <span>Enable Notifications</span>
                </button>
                
                <button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="w-full py-3.5 rounded-2xl bg-transparent text-muted font-medium hover:text-[var(--text)] hover:bg-[var(--hover)] transition-all duration-300 cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
