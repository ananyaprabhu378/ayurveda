"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, BookOpen, Leaf, PenTool, RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HerbCard, { findMentionedHerbs } from "./HerbCard";

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
      {/* Animated Parchment Scroll Unfolding */}
      <div className="relative rounded-2xl rounded-bl-none overflow-hidden group">
        {/* Glowing Sanskrit Border Effect */}
        <div className="absolute inset-0 border border-emerald-500/15 group-hover:border-emerald-500/40 transition-colors duration-700" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
        
        {/* Floating Ink Particles (Simulated with CSS) */}
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
          {/* Subtle Decorative Icon */}
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
  const { messages, addMessage, sessionId, isGenerating, setGenerating, isAudioEnabled, toggleAudio } = useStore();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, query: userQuery, language: "en" })
      });
      if (res.ok) {
        const data = await res.json();
        addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: data.answer, citations: data.citations });
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
            <p className="text-xs text-emerald-400/70 mt-0.5">
              {isGenerating ? "Consulting the ancient texts..." : "Awaiting your query..."}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleAudio}
          className="text-muted-foreground hover:text-emerald-400 rounded-full hover:bg-emerald-500/10 transition-all">
          {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
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
            <p className="font-serif text-3xl font-semibold text-white mb-3">Namaste</p>
            <p className="font-serif text-lg text-emerald-100/60 max-w-sm leading-relaxed italic">
              "I draw knowledge only from the sacred texts you have provided. Ask the ancient wisdom."
            </p>
            <SanskritDivider />
            <p className="text-xs text-emerald-100/40 tracking-widest uppercase mt-4">Upload texts in the Sacred Library to begin</p>
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
                  <ManuscriptMessage content={msg.content} isNew={index === messages.length - 1} />
                )}

                {/* Herb Cards */}
                {msg.role === 'assistant' && (
                  <div className="flex flex-col gap-2 w-full mt-2">
                    {findMentionedHerbs(msg.content).map((herb, idx) => (
                      <HerbCard key={herb.name} herb={herb} index={idx} />
                    ))}
                  </div>
                )}

                {/* Citations */}
                {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 space-y-2 w-full"
                  >
                    <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-bold px-1">Source Index</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cit, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-emerald-100/70 hover:bg-emerald-500/15 transition-all cursor-pointer">
                          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                          <span className="truncate max-w-[140px] font-medium">{cit.source}</span>
                          <span className="text-emerald-500/30">|</span>
                          <span className="font-bold">p.{cit.page}</span>
                        </div>
                      ))}
                    </div>
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
            className="flex items-start gap-4"
          >
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
              <span className="text-xs text-emerald-100/60 font-serif italic">Consulting ancient scripts...</span>
            </div>
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
