"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Sparkles, CheckCircle, Info, RefreshCw, X, Leaf, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ForestBackground from "@/components/3d/ForestBackground";

interface HerbInfo {
  name: string;
  scientific: string;
  uses: string[];
  dosha: string;
  properties: string;
  confidence: number;
}

const MOCK_HERBS: HerbInfo[] = [
  {
    name: "Ashwagandha",
    scientific: "Withania somnifera",
    uses: ["Stress reduction", "Immune support", "Energy boost"],
    dosha: "Balances Vata & Kapha",
    properties: "Adaptogenic, rejuvenative, tonic",
    confidence: 98.4,
  },
  {
    name: "Tulsi (Holy Basil)",
    scientific: "Ocimum tenuiflorum",
    uses: ["Respiratory health", "Stress relief", "Detoxification"],
    dosha: "Balances Vata & Kapha, increases Pitta slightly",
    properties: "Anti-microbial, adaptogenic, antioxidant",
    confidence: 96.7,
  },
  {
    name: "Brahmi",
    scientific: "Bacopa monnieri",
    uses: ["Memory enhancement", "Focus", "Anxiety relief"],
    dosha: "Balances all three Doshas (Tridoshic)",
    properties: "Nootropic, nerve tonic, cooling",
    confidence: 94.2,
  },
  {
    name: "Neem",
    scientific: "Azadirachta indica",
    uses: ["Skin health", "Blood purification", "Immune system"],
    dosha: "Balances Pitta & Kapha, increases Vata",
    properties: "Anti-fungal, anti-bacterial, blood purifier",
    confidence: 97.1,
  }
];

export default function HerbScannerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<HerbInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    if (!image) return;
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setResult(MOCK_HERBS[Math.floor(Math.random() * MOCK_HERBS.length)]);
            toast.success("Herb identified successfully!");
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      <ForestBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" /> AI Vision Technology
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Sacred <span className="text-emerald-400 text-gradient">Herb Scanner</span>
          </h1>
          <p className="text-emerald-100/60 max-w-2xl mx-auto">
            Identify ancient Ayurvedic plants and herbs instantly. Our AI models analyze botanical signatures to uncover medicinal secrets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Scanner View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl border-2 border-emerald-500/30 bg-card/40 backdrop-blur-xl overflow-hidden relative group">
              <AnimatePresence mode="wait">
                {!image ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-emerald-500/5 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-xl font-serif font-semibold text-white mb-2">Ready to Scan</p>
                    <p className="text-sm text-emerald-100/40">Upload a photo of a leaf or herb to begin the ritual of identification.</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <img src={image} className="w-full h-full object-cover" alt="Scanner preview" />
                    
                    {/* Futuristic Scan UI */}
                    {isScanning && (
                      <div className="absolute inset-0 z-20">
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] z-30"
                        />
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-background/80 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/50 shadow-2xl">
                            <p className="text-emerald-400 text-sm font-medium animate-pulse flex items-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Botanical Signatures...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isScanning && !result && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={startScan}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 h-12 shadow-2xl"
                        >
                          <Sparkles className="w-4 h-4 mr-2" /> Initialize Scan
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative corners */}
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-emerald-500/50 rounded-br-xl pointer-events-none" />
            </div>

            {image && !isScanning && (
              <div className="mt-4 flex justify-between items-center px-2">
                <button onClick={reset} className="text-emerald-100/40 hover:text-white transition-colors text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Discard
                </button>
                {result && (
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Scan Complete
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Result View */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/10 p-8 h-full min-h-[400px] flex flex-col justify-center"
                >
                  <p className="text-emerald-100/60 text-sm mb-6 text-center italic">Processing through neural Ayurvedic wisdom nodes...</p>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs text-emerald-400/70 mb-2 uppercase tracking-tighter">
                        <span>Molecular Mapping</span>
                        <span>{Math.floor(scanProgress)}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-1 bg-emerald-950" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-emerald-400/70 mb-2 uppercase tracking-tighter">
                        <span>Taxonomic Comparison</span>
                        <span>{Math.floor(scanProgress * 0.8)}%</span>
                      </div>
                      <Progress value={scanProgress * 0.8} className="h-1 bg-emerald-950" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-emerald-400/70 mb-2 uppercase tracking-tighter">
                        <span>Ayurvedic Correlation</span>
                        <span>{Math.floor(scanProgress * 0.6)}%</span>
                      </div>
                      <Progress value={scanProgress * 0.6} className="h-1 bg-emerald-950" />
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-8 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/30 uppercase">
                      Match: {result.confidence}%
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                      <Leaf className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-white">{result.name}</h2>
                      <p className="text-emerald-400/70 italic text-sm font-serif">{result.scientific}</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <Info className="w-3 h-3" /> Medicinal Properties
                      </h3>
                      <p className="text-emerald-100/80 text-sm leading-relaxed">{result.properties}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" /> Ayurveda Uses
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.uses.map((use, i) => (
                          <span key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-1.5 text-xs text-emerald-100/70">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/20 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-tighter">Dosha Correlation</p>
                          <p className="text-white text-sm font-medium">{result.dosha}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={reset} variant="outline" className="mt-4 border-emerald-500/30 hover:bg-emerald-500/10">
                      Scan Another Herb
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-10 h-full flex flex-col justify-center items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Info className="w-8 h-8 text-emerald-100/20" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-4">How to Scan</h3>
                  <div className="space-y-4 max-w-xs text-left">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
                      <p className="text-sm text-emerald-100/40">Upload a clear photo of the plant part or leaf.</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
                      <p className="text-sm text-emerald-100/40">Our AI identifies taxonomic features and correlates with ancient texts.</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">3</span>
                      <p className="text-sm text-emerald-100/40">Receive detailed Ayurvedic medicinal profile and uses.</p>
                    </div>
                  </div>
                  <div className="mt-10 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-100/60 leading-relaxed italic">
                      Always consult with a qualified Ayurvedic practitioner before starting any herbal treatment. AI results are for educational purposes only.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
