"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Sparkles, BookOpen, 
  Leaf, PenTool, RefreshCw, Database, ChevronRight, 
  Target, Info, AlertCircle, FileText, Activity
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HerbCard, { findMentionedHerbs } from "./HerbCard";

// --- Semantic Retrieval Panel ---
function SemanticRetrievalPanel({ message }: { message: any }) {
  if (!message.retrieval_metadata || !message.citations) return null;

  const { confidence, count, status } = message.retrieval_metadata;
  const citations = message.citations;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-6 border border-emerald-500/20 rounded-3xl bg-emerald-950/20 backdrop-blur-md overflow-hidden shadow-inner"
    >
      <div className="px-5 py-4 border-b border-emerald-500/10 flex items-center justify-between bg-emerald-500/5">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Semantic Retrieval Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <Target className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">{confidence}% Match</span>
          </div>
          <div className="text-[10px] text-emerald-100/40 uppercase font-bold">{count} Chunks Found</div>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {citations.map((cit: any, idx: number) => (
          <div key={idx} className="group relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors" />
            <div className="pl-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                  <FileText className="w-3 h-3" /> {cit.source} <span className="text-emerald-100/20">•</span> Page {cit.page}
                </div>
                <div className="text-[10px] font-bold text-emerald-100/40">{cit.score}% Similarity</div>
              </div>
              <p className="text-xs text-emerald-100/60 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                "{cit.snippet}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-emerald-500/5 border-t border-emerald-500/10 flex items-center gap-2">
        <Info className="w-3 h-3 text-emerald-400/50" />
        <span className="text-[8px] uppercase tracking-widest text-emerald-100/30">
          Grounded Generation Active • Non-Internet Mode Enabled
        </span>
      </div>
    </motion.div>
  );
}

// --- Retrieval Animation ---
function RetrievalAnimation() {
  return (
    <div className="relative w-full h-24 overflow-hidden rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
      </div>
      
      {/* Moving Vector Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          initial={{ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 100, opacity: 0 }}
          animate={{ 
            x: [(Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300], 
            y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Semantic Node Ring */}
      <motion.div
        className="w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1], rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-10 h-10 border border-emerald-500/50 rounded-full animate-pulse" />
      </motion.div>

      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-emerald-400 animate-pulse">Performing Semantic Vector Search</span>
      </div>
    </div>
  );
}

// --- Breathing AI Orb ---
function AIOrb({ isGenerating }: { isGenerating: boolean }) {
  return (
    <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500/20"
        animate={isGenerating
          ? { scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }
          : { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }
        }
        transition={{ repeat: Infinity, duration: isGenerating ? 1.2 : 3, ease: "easeInOut" }}
      />
      <motion.div
        className="relative w-8 h-8 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center"
        animate={isGenerating
          ? { scale: [0.9, 1.05, 0.9], boxShadow: ["0 0 10px rgba(80,200,120,0.3)", "0 0 25px rgba(80,200,120,0.7)", "0 0 10px rgba(80,200,120,0.3)"] }
          : {}
        }
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      >
        <Sparkles className={`w-4 h-4 text-emerald-400 ${isGenerating ? "animate-pulse" : ""}`} />
      </motion.div>
    </div>
  );
}

// --- Ancient Manuscript Card ---
function ManuscriptMessage({ content, isNew }: { content: string; isNew?: boolean }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, height: 0, y: 20 } : false}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      className="relative w-full overflow-hidden"
    >
      <div className="relative rounded-2xl rounded-bl-none overflow-hidden group">
        <div className="absolute inset-0 border border-emerald-500/15 group-hover:border-emerald-500/40 transition-colors duration-700" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.2, 0], 
                scale: [0, 1, 0.5],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100]
              }}
              transition={{ 
                duration: 4 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-emerald-400 rounded-full blur-[1px]"
            />
          ))}
        </div>

        <div className="relative bg-card/80 backdrop-blur-md px-6 py-6 shadow-2xl">
          <div className="absolute top-4 right-4 opacity-5">
            <PenTool className="w-12 h-12 text-emerald-400" />
          </div>

          <motion.div
            initial={isNew ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-lg leading-relaxed text-emerald-50/90 whitespace-pre-wrap selection:bg-emerald-500/30"
          >
            {content}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function SanskritDivider() {
  return (
    <div className="flex items-center gap-3 opacity-20 my-2">
      <div className="flex-1 h-px bg-emerald-500/50" />
      <Leaf className="w-3 h-3 text-emerald-500" />
      <div className="flex-1 h-px bg-emerald-500/50" />
    </div>
  );
}

export default function ChatInterface() {
  const { messages, addMessage, sessionId, isGenerating, setGenerating, isAudioEnabled, toggleAudio, user } = useStore();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showRetrievalPanel, setShowRetrievalPanel] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Web Speech API
  const handleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const userQuery = input;
    setInput("");
    addMessage({ id: Date.now().toString(), role: 'user', content: userQuery });
    setGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session_id: sessionId, 
          query: userQuery, 
          language: "en",
          user_id: user?.id 
        })
      });
      if (res.ok) {
        const data = await res.json();
        addMessage({ 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: data.answer, 
          citations: data.citations,
          retrieval_metadata: data.retrieval_metadata
        });
        speakText(data.answer);
      } else {
        const errorData = await res.json().catch(() => ({ detail: "Unknown disruption in the cosmic link." }));
        throw new Error(errorData.detail || "API Error");
      }
    } catch (e: any) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `My apologies, the cosmic link to the ancient texts was disrupted: ${e.message}`
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden rounded-2xl">
      {/* Decorative corner glows */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-br-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-tl-full blur-2xl pointer-events-none" />

      {/* --- Header --- */}
      <div className="relative flex-shrink-0 h-16 border-b border-emerald-500/10 flex items-center justify-between px-6 bg-background/30 backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="flex items-center gap-3">
          <AIOrb isGenerating={isGenerating} />
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground leading-none">AI Vaidya</h2>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Grounded AI Mode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowRetrievalPanel(!showRetrievalPanel)}
            className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 h-8 border ${showRetrievalPanel ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'text-muted-foreground border-white/5'}`}
          >
            Retrieval Engine
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleAudio}
            className="text-muted-foreground hover:text-emerald-400 rounded-full hover:bg-emerald-500/10 transition-all">
            {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* --- Chat Area --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full flex flex-col items-center justify-center text-center py-16 px-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150" />
              <div className="relative w-24 h-24 rounded-full border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center animate-glow">
                <BookOpen className="w-10 h-10 text-emerald-400" />
              </div>
            </motion.div>
            <p className="font-serif text-3xl font-semibold text-white mb-3">Grounded Intelligence</p>
            <p className="font-serif text-lg text-emerald-100/60 max-w-sm leading-relaxed italic">
              "I draw knowledge ONLY from indexed Ayurvedic texts. No internet search, no hallucinations."
            </p>
            <SanskritDivider />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400 uppercase font-bold">
                <Target className="w-3 h-3" /> Vector Similarity
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400 uppercase font-bold">
                <Database className="w-3 h-3" /> RAG Grounded
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-4'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mt-1 shadow-inner">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
              )}

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end max-w-[80%]' : 'items-start max-w-[85%]'}`}>
                {msg.role === 'user' ? (
                  <div className="rounded-3xl rounded-br-none px-6 py-4 bg-emerald-600/90 text-white shadow-xl shadow-emerald-900/20 backdrop-blur-md border border-white/10">
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <ManuscriptMessage content={msg.content} isNew={index === messages.length - 1} />
                    {showRetrievalPanel && <SemanticRetrievalPanel message={msg} />}
                  </div>
                )}

                {/* Herb Cards */}
                {msg.role === 'assistant' && (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {findMentionedHerbs(msg.content).map((herb, idx) => (
                      <HerbCard key={herb.name} herb={herb} index={idx} />
                    ))}
                  </div>
                )}

                {/* Citations Footer */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 flex flex-wrap gap-2 w-full"
                  >
                    {msg.citations.slice(0, 2).map((cit, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-1.5 text-[9px] text-emerald-100/40 uppercase font-bold">
                        <BookOpen className="w-3 h-3 text-emerald-400/50" /> {cit.source} (p.{cit.page})
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking / Loading indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 w-full max-w-[85%]"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
              <div className="bg-card/40 backdrop-blur-md border border-emerald-500/15 rounded-3xl rounded-bl-none px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="text-xs text-emerald-100/60 font-serif italic">Synthesizing Grounded Answer...</span>
              </div>
            </div>
            
            {/* Visual Retrieval Feedback */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-14"
            >
              <RetrievalAnimation />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* --- Input Area --- */}
      <div className="flex-shrink-0 p-6 border-t border-emerald-500/10 bg-background/30 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <form
          onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire about Ayurvedic wisdom..."
              className="pr-12 h-16 rounded-3xl bg-card/50 border-emerald-500/20 backdrop-blur-xl font-serif text-lg focus-visible:ring-emerald-500 focus-visible:border-emerald-400/40 placeholder:text-emerald-100/20 transition-all shadow-inner"
              disabled={isGenerating}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                isListening
                  ? 'text-red-400 bg-red-500/10 animate-pulse'
                  : 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'
              }`}
              onClick={handleListen}
              disabled={isGenerating}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
          </div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              size="icon"
              className={`h-16 w-16 rounded-3xl text-white shadow-2xl transition-all duration-300 ${
                !input.trim() || isGenerating
                  ? 'bg-emerald-900/40 cursor-not-allowed opacity-50'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
              }`}
              disabled={!input.trim() || isGenerating}
            >
              <Send className="w-6 h-6" />
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
