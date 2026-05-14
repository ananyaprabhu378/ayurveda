"use client";

import { motion } from "framer-motion";
import { Leaf, Info, ThermometerSun, Shield } from "lucide-react";

interface HerbData {
  name: string;
  scientific: string;
  benefits: string[];
  dosha: string;
  description: string;
}

const HERBS_DB: Record<string, HerbData> = {
  ashwagandha: {
    name: "Ashwagandha",
    scientific: "Withania somnifera",
    benefits: ["Stress Relief", "Energy", "Immunity"],
    dosha: "Balances Vata & Kapha",
    description: "An ancient medicinal herb known as an adaptogen. It helps your body manage stress, lowers blood sugar levels, and boosts brain function.",
  },
  turmeric: {
    name: "Turmeric (Haldi)",
    scientific: "Curcuma longa",
    benefits: ["Anti-inflammatory", "Antioxidant", "Skin Health"],
    dosha: "Balances all, but excess can aggravate Pitta",
    description: "A bright yellow spice containing curcumin, heavily used in Ayurveda for its potent anti-inflammatory and healing properties.",
  },
  tulsi: {
    name: "Tulsi (Holy Basil)",
    scientific: "Ocimum tenuiflorum",
    benefits: ["Respiratory Health", "Stress Relief", "Detox"],
    dosha: "Balances Vata & Kapha",
    description: "Revered as the 'Queen of Herbs', Tulsi is highly regarded in Ayurveda for its spiritual significance and vast medicinal applications.",
  },
  triphala: {
    name: "Triphala",
    scientific: "Emblica officinalis, Terminalia bellirica, Terminalia chebula",
    benefits: ["Digestion", "Detox", "Eye Health"],
    dosha: "Tridoshic (Balances Vata, Pitta, Kapha)",
    description: "A traditional Ayurvedic formulation combining three fruits. It acts as a gentle bowel tonic, promotes digestion, and aids in systemic detoxification.",
  },
  brahmi: {
    name: "Brahmi",
    scientific: "Bacopa monnieri",
    benefits: ["Memory", "Focus", "Anxiety Relief"],
    dosha: "Balances Vata & Kapha",
    description: "A renowned herb for the brain. Brahmi enhances cognitive function, improves memory, and has a calming effect on the nervous system.",
  }
};

export function findMentionedHerbs(text: string): HerbData[] {
  const lowerText = text.toLowerCase();
  const mentioned: HerbData[] = [];
  
  Object.keys(HERBS_DB).forEach(key => {
    if (lowerText.includes(key) || lowerText.includes(HERBS_DB[key].name.toLowerCase().split(' ')[0])) {
      mentioned.push(HERBS_DB[key]);
    }
  });
  
  return mentioned;
}

export default function HerbCard({ herb, index = 0 }: { herb: HerbData, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mt-4 mb-2 overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/60 backdrop-blur-md shadow-xl max-w-sm group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full blur-2xl pointer-events-none" />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-serif text-lg font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
              {herb.name}
            </h4>
            <p className="text-xs text-muted-foreground italic font-serif">
              {herb.scientific}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          {herb.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-500/70 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {herb.benefits.map((benefit, i) => (
                <span key={i} className="text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
            <ThermometerSun className="w-4 h-4 text-amber-500/70" />
            <span className="font-medium text-foreground/70">{herb.dosha}</span>
          </div>
        </div>
      </div>
      
      <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-sage to-emerald-400 opacity-50" />
    </motion.div>
  );
}
