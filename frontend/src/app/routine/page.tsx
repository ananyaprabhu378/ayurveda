"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, Clock, Moon, Sun, Coffee, Zap, Droplets, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import ForestBackground from "@/components/3d/ForestBackground";

interface RoutineItem {
  time: string;
  activity: string;
  description: string;
  icon: React.ReactNode;
  category: "ritual" | "nutrition" | "movement" | "rest";
}

const MOCK_ROUTINE: RoutineItem[] = [
  {
    time: "05:30 AM",
    activity: "Brahma Muhurta Ritual",
    description: "Wake up during the 'ambrosial hours' for mental clarity. Practice gratitude and deep breathing.",
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    category: "ritual",
  },
  {
    time: "06:00 AM",
    activity: "Tongue Scraping & Oil Pulling",
    description: "Cleanse the sensory organs. Use a copper scraper and organic sesame oil.",
    icon: <Droplets className="w-5 h-5 text-blue-400" />,
    category: "ritual",
  },
  {
    time: "06:30 AM",
    activity: "Yoga & Pranayama",
    description: "Gentle Surya Namaskar followed by alternate nostril breathing to balance Vata.",
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    category: "movement",
  },
  {
    time: "08:30 AM",
    activity: "Nourishing Breakfast",
    description: "Warm oatmeal with soaked almonds and a dash of cinnamon. Sip on warm ginger tea.",
    icon: <Coffee className="w-5 h-5 text-orange-400" />,
    category: "nutrition",
  },
  {
    time: "01:00 PM",
    activity: "Principal Meal (Lunch)",
    description: "The largest meal when Agni is strongest. Kitchari with seasonal vegetables and ghee.",
    icon: <Sun className="w-5 h-5 text-yellow-400" />,
    category: "nutrition",
  },
  {
    time: "06:00 PM",
    activity: "Light Dinner",
    description: "Steamed greens and mung dal soup. Avoid heavy proteins and raw salads.",
    icon: <Leaf className="w-5 h-5 text-emerald-400" />,
    category: "nutrition",
  },
  {
    time: "09:30 PM",
    activity: "Sleep Preparation",
    description: "Digital detox. Warm milk with nutmeg and Ashwagandha. Foot massage with Brahmi oil.",
    icon: <Moon className="w-5 h-5 text-indigo-400" />,
    category: "rest",
  },
];

export default function RoutineGeneratorPage() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [formData, setFormData] = useState({
    stress: "moderate",
    sleep: "irregular",
    energy: "low",
    goal: "balance",
  });

  const handleGenerate = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("result");
    }, 2500);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      <ForestBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
            <Clock className="w-3 h-3" /> Personalized Wellness
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            AI Healing <span className="text-emerald-400 text-gradient">Routine Generator</span>
          </h1>
          <p className="text-emerald-100/60 max-w-2xl mx-auto">
            Sync your daily rhythm with the laws of nature. Our AI constructs a bespoke Ayurvedic schedule based on your current vital signs and wellness aspirations.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 md:p-12 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-4">Stress Levels</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      value={formData.stress}
                      onChange={(e) => setFormData({...formData, stress: e.target.value})}
                    >
                      <option value="low">Low - Feeling Balanced</option>
                      <option value="moderate">Moderate - Busy Schedule</option>
                      <option value="high">High - Overwhelmed / Burnout</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-4">Sleep Quality</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      value={formData.sleep}
                      onChange={(e) => setFormData({...formData, sleep: e.target.value})}
                    >
                      <option value="good">Sound & Restorative</option>
                      <option value="irregular">Irregular / Interrupted</option>
                      <option value="insomnia">Difficulty Falling Asleep</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-4">Vital Energy</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      value={formData.energy}
                      onChange={(e) => setFormData({...formData, energy: e.target.value})}
                    >
                      <option value="high">High & Constant</option>
                      <option value="moderate">Moderate Energy</option>
                      <option value="low">Low / Frequent Fatigue</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-4">Wellness Goal</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    >
                      <option value="detox">Deep Detoxification</option>
                      <option value="balance">Hormonal & Mental Balance</option>
                      <option value="strength">Physical Strength & Ojas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <Button
                  onClick={handleGenerate}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-12 h-14 text-lg font-medium shadow-[0_0_30px_rgba(80,200,120,0.3)] transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" /> Weave My Routine
                </Button>
              </div>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-xl font-serif text-white mb-2 italic">Consulting the Circadian Rhythms...</p>
              <p className="text-emerald-100/40 text-sm">Aligning Dinacharya with your vital markers.</p>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Summary Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Protocol Ready</h3>
                  <p className="text-emerald-100/60 text-sm leading-relaxed mb-6">
                    We've balanced your {formData.goal} goal with your {formData.stress} stress profile. This routine optimizes your circadian rhythm.
                  </p>
                  
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-emerald-400">
                      <Zap className="w-4 h-4" /> Optimized for {formData.energy} energy
                    </div>
                    <div className="flex items-center gap-3 text-xs text-blue-400">
                      <Moon className="w-4 h-4" /> Enhances {formData.sleep} sleep
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="w-full border-emerald-500/20 hover:bg-emerald-500/10 h-12 rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Modify Parameters
                </Button>
              </div>

              {/* Timeline */}
              <div className="lg:col-span-2">
                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-emerald-500/0 before:via-emerald-500/30 before:to-emerald-500/0">
                  {MOCK_ROUTINE.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border border-emerald-500/30 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(80,200,120,0.1)]">
                        {item.icon}
                      </div>
                      <div className="bg-card/20 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:border-emerald-500/20 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{item.time}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-tighter ${
                            item.category === "ritual" ? "border-amber-500/30 text-amber-500 bg-amber-500/5" :
                            item.category === "nutrition" ? "border-orange-500/30 text-orange-500 bg-orange-500/5" :
                            item.category === "movement" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" :
                            "border-indigo-500/30 text-indigo-500 bg-indigo-500/5"
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{item.activity}</h4>
                        <p className="text-emerald-100/40 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
