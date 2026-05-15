"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, FileText, Sparkles, Filter, Info, ArrowRight, CheckCircle, Loader2, Library, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/store/useStore";
import ForestBackground from "@/components/3d/ForestBackground";

interface ResearchPaper {
  id: number;
  filename: string;
  num_pages: number;
  uploaded_at: string;
}

export default function ResearchAssistantPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<"summary" | "findings" | "beginner">("summary");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { sessionId } = useStore();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/documents/`);
      if (res.ok) {
        const data = await res.json();
        setPapers(data.filter((doc: any) => doc.status === "indexed"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyze = async (mode: typeof analysisMode) => {
    if (!selectedPaper) return;
    setAnalysisMode(mode);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    let query = "";
    if (mode === "summary") query = `Provide a comprehensive scientific summary of the paper ${selectedPaper.filename}. Focus on methodology and conclusions.`;
    if (mode === "findings") query = `Extract the key medicinal findings and herb effectiveness mentioned in ${selectedPaper.filename}. List them clearly.`;
    if (mode === "beginner") query = `Explain the core concepts and findings of the paper ${selectedPaper.filename} as if I am a complete beginner with no medical background.`;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, query: query, language: "en" })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data.answer);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 px-6 overflow-hidden">
      <ForestBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wider mb-4">
              <Terminal className="w-3 h-3" /> Advanced Intelligence Mode
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              Ayurveda <span className="text-emerald-400 text-gradient">Research Assistant</span>
            </h1>
            <p className="text-emerald-100/60 max-w-2xl">
              Synthesize complex Ayurvedic studies into actionable insights. Our AI cross-references scientific terminology with ancient pharmacological principles.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 rounded-xl" onClick={fetchPapers}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh Papers
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Papers Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-6 h-[600px] flex flex-col">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Library className="w-4 h-4" /> Indexed Repository
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {papers.length === 0 ? (
                  <div className="text-center py-20">
                    <FileText className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-emerald-100/20 text-xs italic">No research papers indexed. Upload some in the Sacred Library.</p>
                  </div>
                ) : (
                  papers.map((paper) => (
                    <button
                      key={paper.id}
                      onClick={() => { setSelectedPaper(paper); setAnalysisResult(null); }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                        selectedPaper?.id === paper.id 
                        ? "bg-emerald-500/10 border-emerald-500/50" 
                        : "bg-white/5 border-white/5 hover:border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                          selectedPaper?.id === paper.id ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5 border-white/10"
                        }`}>
                          <FileText className={`w-4 h-4 ${selectedPaper?.id === paper.id ? "text-emerald-400" : "text-white/40"}`} />
                        </div>
                        <span className={`text-xs font-bold truncate flex-1 ${selectedPaper?.id === paper.id ? "text-white" : "text-white/60"}`}>
                          {paper.filename}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-emerald-100/20">
                        <span>{paper.num_pages} Pages</span>
                        <span>{new Date(paper.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {selectedPaper ? (
              <div className="bg-card/30 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-8 h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">{selectedPaper.filename}</h2>
                    <p className="text-emerald-400 text-xs uppercase tracking-widest font-bold">Ready for Deep Analysis</p>
                  </div>
                  <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                    {[
                      { id: "summary", label: "Executive Summary" },
                      { id: "findings", label: "Medicinal Findings" },
                      { id: "beginner", label: "Beginner Mode" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => handleAnalyze(mode.id as any)}
                        disabled={isAnalyzing}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          analysisMode === mode.id 
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                          : "text-white/40 hover:text-white"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {isAnalyzing ? (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-32 flex flex-col items-center"
                      >
                        <div className="relative w-16 h-16 mb-6">
                          <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
                          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400/50" />
                        </div>
                        <p className="text-lg font-serif text-white mb-2 italic">Synthesizing Paper Intelligence...</p>
                        <p className="text-emerald-100/40 text-sm">Extracting semantic findings from {selectedPaper.num_pages} pages.</p>
                      </motion.div>
                    ) : analysisResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-invert max-w-none"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-serif font-bold text-white m-0">AI Intelligence Output</h3>
                            <p className="text-[10px] text-emerald-400 uppercase font-bold m-0">{analysisMode} Mode Activated</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 font-serif leading-relaxed text-lg text-emerald-50/90 whitespace-pre-wrap shadow-inner">
                          {analysisResult}
                        </div>
                        
                        <div className="mt-8 flex gap-4">
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex-1">
                            <h4 className="text-[10px] text-emerald-400 uppercase font-bold mb-2">Key Highlight</h4>
                            <p className="text-xs text-white/60 italic leading-relaxed">
                              This analysis represents an AI-synthesized understanding of the source material. Always refer to original citations for clinical decisions.
                            </p>
                          </div>
                          <Button className="rounded-2xl border-emerald-500/20 hover:bg-emerald-500/10 h-auto py-4 px-6">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Save Analysis
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center opacity-40"
                      >
                        <Search className="w-20 h-20 text-white/5 mb-6" />
                        <p className="text-lg font-serif text-white mb-2">Select an analysis mode above</p>
                        <p className="text-emerald-100/40 text-sm">Choose how you want the AI to synthesize the paper.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="bg-card/20 backdrop-blur-xl rounded-3xl border border-white/5 p-20 h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <Library className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Awaiting Source Selection</h2>
                <p className="text-emerald-100/40 max-w-md mx-auto leading-relaxed">
                  Select a research paper from your repository to initialize the AI Research Assistant. If you haven't uploaded any papers, visit the <span className="text-emerald-400 font-bold">Sacred Library</span>.
                </p>
                <Button className="mt-10 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-full px-8 hover:bg-emerald-500 hover:text-white transition-all">
                  Visit Library <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  )
}
