"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, Info, CheckCircle, Leaf, Zap, Droplets, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ForestBackground from "@/components/3d/ForestBackground";

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: "vata" | "pitta" | "kapha";
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "sleep",
    text: "How would you describe your typical sleep pattern?",
    options: [
      { label: "Light, irregular, or interrupted", value: "vata" },
      { label: "Sound, medium duration, feel rested", value: "pitta" },
      { label: "Deep, long, difficulty waking up", value: "kapha" },
    ],
  },
  {
    id: "digestion",
    text: "How is your digestion and appetite?",
    options: [
      { label: "Irregular, prone to gas or bloating", value: "vata" },
      { label: "Strong, intense, cannot skip meals", value: "pitta" },
      { label: "Slow, steady, can easily skip meals", value: "kapha" },
    ],
  },
  {
    id: "temperature",
    text: "How does your body react to temperatures?",
    options: [
      { label: "Averse to cold, hands/feet often cold", value: "vata" },
      { label: "Averse to heat, sweat easily", value: "pitta" },
      { label: "Averse to damp/cold, prefer dry heat", value: "kapha" },
    ],
  },
  {
    id: "energy",
    text: "What is your typical energy level throughout the day?",
    options: [
      { label: "Bursts of energy, but tires easily", value: "vata" },
      { label: "Steady, focused, driven energy", value: "pitta" },
      { label: "Consistent, slow-burning, strong stamina", value: "kapha" },
    ],
  },
  {
    id: "emotions",
    text: "How do you typically react to stress?",
    options: [
      { label: "Anxiety, worry, or fear", value: "vata" },
      { label: "Irritability, anger, or frustration", value: "pitta" },
      { label: "Calmness, withdrawal, or stubbornness", value: "kapha" },
    ],
  },
];

interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  primary: "vata" | "pitta" | "kapha";
}

export default function DoshaAnalyzerPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "vata" | "pitta" | "kapha">>({});

  const handleAnswer = (value: "vata" | "pitta" | "kapha") => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("results");
    }
  };

  const results = useMemo((): DoshaResult => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(answers).forEach((val) => counts[val]++);
    
    const total = QUESTIONS.length;
    const vata = (counts.vata / total) * 100;
    const pitta = (counts.pitta / total) * 100;
    const kapha = (counts.kapha / total) * 100;

    let primary: "vata" | "pitta" | "kapha" = "vata";
    if (pitta >= vata && pitta >= kapha) primary = "pitta";
    if (kapha >= vata && kapha >= pitta) primary = "kapha";

    return { vata, pitta, kapha, primary };
  }, [answers]);

  const getDoshaInfo = (dosha: "vata" | "pitta" | "kapha") => {
    const info = {
      vata: {
        title: "Vata Dosha",
        element: "Air & Space",
        icon: <Zap className="w-8 h-8 text-blue-400" />,
        color: "from-blue-600 to-indigo-600",
        desc: "You are like the wind—quick, creative, and lively. When in balance, you are imaginative and energetic. When out of balance, you may experience anxiety, dry skin, or irregular digestion.",
        herbs: ["Ashwagandha", "Shatavari", "Ginger"],
        foods: ["Warm soups", "Nuts", "Root vegetables"],
      },
      pitta: {
        title: "Pitta Dosha",
        element: "Fire & Water",
        icon: <Flame className="w-8 h-8 text-orange-400" />,
        color: "from-orange-600 to-red-600",
        desc: "You have a fiery nature—sharp, determined, and passionate. When in balance, you are a focused leader with strong digestion. When out of balance, you may experience irritability or inflammation.",
        herbs: ["Amla", "Brahmi", "Aloe Vera"],
        foods: ["Cooling fruits", "Leafy greens", "Coconut"],
      },
      kapha: {
        title: "Kapha Dosha",
        element: "Earth & Water",
        icon: <Droplets className="w-8 h-8 text-emerald-400" />,
        color: "from-emerald-600 to-teal-600",
        desc: "You are the steady earth—calm, nurturing, and stable. When in balance, you are loyal and strong. When out of balance, you may feel lethargic, gain weight easily, or experience congestion.",
        herbs: ["Tulsi", "Turmeric", "Triphala"],
        foods: ["Spicy foods", "Light grains", "Warm teas"],
      },
    };
    return info[dosha];
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      <ForestBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(80,200,120,0.1)]">
                <Sparkles className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                Discover Your <span className="text-emerald-400 text-gradient">Dosha</span>
              </h1>
              <p className="text-emerald-100/60 max-w-xl mx-auto mb-12 text-lg leading-relaxed">
                Ayurveda defines three primary energies or "Doshas" that govern our physical and mental states. Take our cinematic assessment to find your unique balance.
              </p>
              <Button
                onClick={() => setStep("quiz")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-12 h-14 text-lg font-medium shadow-[0_0_30px_rgba(80,200,120,0.3)] transition-all hover:scale-105"
              >
                Begin Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                  <span className="text-emerald-100/40 text-xs">{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-3xl font-serif font-bold text-white mb-10 leading-tight">
                {QUESTIONS[currentQuestion].text}
              </h2>

              <div className="grid gap-4">
                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:border-emerald-500/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-400 group-hover:text-emerald-400 transition-colors">
                        {idx === 0 ? "A" : idx === 1 ? "B" : "C"}
                      </div>
                      <span className="text-white text-lg group-hover:text-emerald-50">{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-12 flex justify-between">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="text-emerald-100/40 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-0"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Chakra Wheel / Dosha Meter */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 flex flex-col items-center">
                  <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-10">Energy Balance</h3>
                  
                  {/* Custom animated Chakra/Meter */}
                  <div className="relative w-48 h-48 mb-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96" cy="96" r="80"
                        fill="none" stroke="currentColor"
                        strokeWidth="8" className="text-white/5"
                      />
                      <motion.circle
                        cx="96" cy="96" r="80"
                        fill="none" stroke="currentColor"
                        strokeWidth="12" strokeDasharray="502"
                        className="text-blue-500"
                        initial={{ strokeDashoffset: 502 }}
                        animate={{ strokeDashoffset: 502 - (502 * results.vata) / 100 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                      <motion.circle
                        cx="96" cy="96" r="80"
                        fill="none" stroke="currentColor"
                        strokeWidth="12" strokeDasharray="502"
                        className="text-orange-500"
                        initial={{ strokeDashoffset: 502 }}
                        animate={{ strokeDashoffset: 502 - (502 * results.pitta) / 100 }}
                        style={{ strokeDashoffset: 502 - (502 * (results.vata + results.pitta)) / 100, strokeDasharray: `502` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-serif font-bold text-white">{Math.round(results[results.primary])}%</span>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">{results.primary}</span>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-400 font-bold uppercase">Vata</span>
                      <span className="text-xs text-white">{Math.round(results.vata)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${results.vata}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-orange-400 font-bold uppercase">Pitta</span>
                      <span className="text-xs text-white">{Math.round(results.pitta)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${results.pitta}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-emerald-400 font-bold uppercase">Kapha</span>
                      <span className="text-xs text-white">{Math.round(results.kapha)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${results.kapha}%` }} />
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => { setStep("intro"); setAnswers({}); setCurrentQuestion(0); }}
                  className="w-full border-emerald-500/20 hover:bg-emerald-500/10 h-12 rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retake Assessment
                </Button>
              </div>

              {/* Insights and Recommendations */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`bg-gradient-to-br ${getDoshaInfo(results.primary).color} rounded-3xl p-1 shadow-2xl overflow-hidden`}
                >
                  <div className="bg-background/40 backdrop-blur-xl rounded-[23px] p-8 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                        {getDoshaInfo(results.primary).icon}
                      </div>
                      <div>
                        <p className="text-xs text-white/60 uppercase font-bold tracking-widest mb-1">Your Primary Nature</p>
                        <h2 className="text-4xl font-serif font-bold text-white">{getDoshaInfo(results.primary).title}</h2>
                      </div>
                    </div>
                    <p className="text-white/80 text-lg leading-relaxed mb-6 font-serif italic">
                      "{getDoshaInfo(results.primary).desc}"
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-white/60">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Element: {getDoshaInfo(results.primary).element}
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-6"
                  >
                    <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Leaf className="w-4 h-4" /> Recommended Herbs
                    </h4>
                    <div className="space-y-4">
                      {getDoshaInfo(results.primary).herbs.map((herb, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-white font-medium">{herb}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-6"
                  >
                    <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Dietary Guidance
                    </h4>
                    <div className="space-y-4">
                      {getDoshaInfo(results.primary).foods.map((food, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-white font-medium">{food}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
