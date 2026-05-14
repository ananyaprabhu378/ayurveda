"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, BookOpen, Leaf, Scan, Cloud, Calendar } from "lucide-react";
import Link from "next/link";
import ForestBackground from "@/components/3d/ForestBackground";

export default function LandingPage() {
  const features = [
    { name: "Consult", icon: Sparkles, desc: "RAG-powered AI consultations based on sacred texts.", href: "/chat", color: "text-emerald-400" },
    { name: "Scanner", icon: Scan, desc: "Identify medicinal herbs via advanced botanical vision.", href: "/scanner", color: "text-blue-400" },
    { name: "Dosha", icon: Zap, desc: "Personalized constitution analysis and chakra balance.", href: "/dosha", color: "text-amber-400" },
    { name: "Weather", icon: Cloud, desc: "Real-time atmospheric effects on your vital energies.", href: "/weather", color: "text-indigo-400" },
    { name: "Routine", icon: Calendar, desc: "Circadian-aligned daily rituals for longevity.", href: "/routine", color: "text-orange-400" },
    { name: "Research", icon: BookOpen, desc: "Synthesize complex studies into healing insights.", href: "/research", color: "text-emerald-400" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Immersive 3D Forest Background */}
      <ForestBackground />

      <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6">
        {/* Animated Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl text-center"
        >
          {/* Futuristic Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(80,200,120,0.1)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Ayurveda Ecosystem
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
            Ancient Wisdom <br />
            <span className="text-emerald-400 text-gradient">Futuristic Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/60 max-w-2xl mx-auto mb-12 leading-relaxed font-serif italic">
            Experience the world's most immersive Ayurvedic AI ecosystem. Bridging sacred traditions with advanced retrieval and visionary technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login">
              <Button className="group bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 h-16 text-lg font-medium shadow-[0_0_40px_rgba(80,200,120,0.3)] transition-all hover:scale-105 active:scale-95">
                Enter Ecosystem <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-100 rounded-full px-10 h-16 text-lg transition-all backdrop-blur-md">
                Sacred Library
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
        >
          {features.map((feature, i) => (
            <Link key={i} href={feature.href}>
              <div className="group relative bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-8 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:-translate-y-2 overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-serif font-bold text-white mb-3">{feature.name}</h3>
                <p className="text-emerald-100/40 text-sm leading-relaxed">{feature.desc}</p>
                
                {/* Decorative background glow */}
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Floating AI Orb Visual in center background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      </div>
    </div>
  );
}

function Button({ children, className, variant = "primary", ...props }: any) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-500",
    outline: "border-emerald-500/20 text-emerald-100 hover:bg-emerald-500/10",
    ghost: "text-emerald-400 hover:bg-emerald-500/10"
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
