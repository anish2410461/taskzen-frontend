import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    try {
      setLoading(true);
      await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      
      toast.success("Account created successfully! Welcome! 🎉");
      
      // Delay briefly so the user has time to read the success message
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Registration failed. Email might already exist.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[var(--background)] grid-bg px-4">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px] animate-float-slower pointer-events-none" />

      {/* Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] glass-panel border border-[var(--border)] shadow-2xl rounded-3xl p-8 md:p-10 z-10 relative"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
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
            Join TaskZen to master your goals and tasks.
          </motion.p>
        </div>

        <div className="space-y-4">
          {/* Full Name Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-1.5"
          >
            <label className="text-sm font-semibold text-[var(--text)] opacity-80 pl-1">Full Name</label>
            <div className="relative flex items-center group">
              <User className="absolute left-4 text-muted group-focus-within:text-primary transition-colors duration-300" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--input)] text-[var(--text)] border border-[var(--border)] focus:border-primary focus:bg-[var(--card)] outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
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
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-1.5"
          >
            <label className="text-sm font-semibold text-[var(--text)] opacity-80 pl-1">Password</label>
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

          {/* Sign Up Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
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
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-6 pt-4 border-t border-[var(--border)]"
          >
            <span className="text-muted text-sm">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-semibold text-sm">
              Sign In
            </Link>
          </motion.div>

          {/* Chief Developer Credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
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
    </div>
  );
};

export default Signup;
