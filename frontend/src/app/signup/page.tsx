"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Leaf, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";

const TempleBackground = dynamic(
  () => import("@/components/3d/TempleBackground"),
  { ssr: false }
);

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Please fill in all sacred fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.name
        })
      });

      if (res.ok) {
        toast.success("Account created! You may now login.");
        router.push("/login");
      } else {
        const error = await res.json();
        toast.error(error.detail || "The ritual failed. Please try again.");
      }
    } catch (e) {
      toast.error("Cosmic connection lost. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#040a06]">
      {/* 3D Background */}
      <TempleBackground />

      {/* Decorative spinning elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
        <div className="w-[1000px] h-[1000px] border border-emerald-500 rounded-full animate-[spin_180s_linear_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-lg p-8 sm:p-12 mx-4"
      >
        {/* Glassmorphism Card */}
        <div className="absolute inset-0 bg-card/20 backdrop-blur-2xl rounded-[40px] border border-emerald-500/20 shadow-[0_0_80px_rgba(80,200,120,0.1)] overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-30" />
        </div>

        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-14 h-14 mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(80,200,120,0.2)]"
          >
            <Leaf className="w-7 h-7 text-emerald-400" />
          </motion.div>

          <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">
            Create <span className="text-emerald-400">Sacred Account</span>
          </h1>
          <p className="text-emerald-100/40 font-serif text-sm mb-10 text-center">
            Begin your journey into the futuristic Ayurveda ecosystem.
          </p>

          <form onSubmit={handleSignup} className="w-full space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="email"
                placeholder="Sacred Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mystical Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg transition-all duration-500 hover:bg-emerald-500 shadow-[0_0_30px_rgba(80,200,120,0.3)] hover:shadow-[0_0_50px_rgba(80,200,120,0.6)] disabled:opacity-50 overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Weaving Wisdom...
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Initiate Soul Link
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-emerald-100/40 text-sm">
              Already a seeker of wisdom?{" "}
              <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
