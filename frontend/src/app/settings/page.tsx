"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Languages, Volume2, VolumeX, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
];

function SettingRow({
  icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 hover:border-emerald-500/20 hover:bg-card/60 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/20 transition-all duration-500" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/15 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const { isDark, toggleTheme, language, setLanguage, isAudioEnabled, toggleAudio } = useStore();

  const handleSave = () => {
    toast.success("Preferences saved", {
      description: "Your AI Vaidya experience has been updated.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gradient">Settings</h1>
        </div>
        <p className="text-muted-foreground pl-[52px]">
          Personalise your AI Vaidya experience.
        </p>
      </motion.div>

      <div className="space-y-3">
        <SettingRow
          icon={isDark ? <Moon className="w-5 h-5 text-emerald-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          title="Theme Mode"
          description={isDark ? "Currently in Mystical Dark mode" : "Currently in Parchment Light mode"}
          delay={0.1}
        >
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="rounded-xl border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-sm transition-all"
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </Button>
        </SettingRow>

        <SettingRow
          icon={<Languages className="w-5 h-5 text-emerald-400" />}
          title="Response Language"
          description="Choose the language for AI Vaidya's answers"
          delay={0.2}
        >
          <div className="relative">
            <select
              className="appearance-none bg-background/50 border border-border/60 rounded-xl px-4 py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 cursor-pointer hover:border-emerald-500/40 transition-all"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </SettingRow>

        <SettingRow
          icon={isAudioEnabled
            ? <Volume2 className="w-5 h-5 text-emerald-400" />
            : <VolumeX className="w-5 h-5 text-muted-foreground" />
          }
          title="Voice Responses"
          description={isAudioEnabled ? "AI Vaidya will speak its answers aloud" : "Text-to-speech is currently disabled"}
          delay={0.3}
        >
          <Button
            variant="outline"
            onClick={toggleAudio}
            className={`rounded-xl text-sm transition-all ${
              isAudioEnabled
                ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                : "border-border/60 hover:border-emerald-500/30 hover:bg-emerald-500/5"
            }`}
          >
            {isAudioEnabled ? "Disable Voice" : "Enable Voice"}
          </Button>
        </SettingRow>
      </div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-end"
      >
        <Button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 h-11 shadow-[0_0_20px_rgba(80,200,120,0.3)] hover:shadow-[0_0_30px_rgba(80,200,120,0.4)] transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Save Preferences
        </Button>
      </motion.div>
    </div>
  );
}
