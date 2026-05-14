"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";

const TempleBackground = dynamic(
  () => import("@/components/3d/TempleBackground"),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Credentials required to enter the sanctuary.");
      return;
    }

    setIsEntering(true);
    // Simulate login ritual
    setTimeout(() => {
      toast.success("Identity verified. Welcome back.");
      router.push("/");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#040a06]">
      {/* 3D Background */}
      <TempleBackground />

      {/* Decorative spinning elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
        <div className="w-[800px] h-[800px] border border-emerald-500 rounded-full animate-[spin_120s_linear_infinite]" />
      </div>

      <AnimatePresence>
        {!isEntering && (
          <motion.div
            key="login-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-md p-8 sm:p-12 mx-4"
          >
            {/* Glassmorphism Card */}
            <div className="absolute inset-0 bg-card/20 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-[0_0_50px_rgba(80,200,120,0.1)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            </div>

            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 mb-6 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(80,200,120,0.2)]"
              >
                <Leaf className="w-8 h-8 text-emerald-400" />
              </motion.div>

              <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-wide">
                Welcome <span className="text-emerald-400">Back</span>
              </h1>
              <p className="text-emerald-100/40 font-serif text-xs mb-10 text-center uppercase tracking-widest">
                Sacred Wisdom • Modern Intelligence
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Sacred Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mystical Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-emerald-600 text-white font-medium text-lg transition-all duration-500 hover:bg-emerald-500 shadow-[0_0_20px_rgba(80,200,120,0.3)] hover:-translate-y-1 overflow-hidden"
                >
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Enter Ecosystem
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-emerald-100/40 text-sm">
                  New to the sanctuary?{" "}
                  <Link href="/signup" className="text-emerald-400 font-bold hover:underline">
                    Create Sacred Account
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry Transition Overlay */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#040a06] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 10], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-emerald-500 blur-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
