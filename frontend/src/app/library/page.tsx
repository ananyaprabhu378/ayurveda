"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, Loader2, BookOpen, Share2,
  Clock, Hash, AlertCircle, Search, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KnowledgeGraph from "@/components/3d/KnowledgeGraph";

interface Document {
  id: number;
  filename: string;
  uploaded_at: string;
  status: string;
  num_pages: number;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "indexed") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Indexed
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
        <Loader2 className="w-3 h-3 animate-spin" />
        Processing
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
      <AlertCircle className="w-3 h-3" />
      Failed
    </span>
  );
}

function DocumentCard({ doc, index }: { doc: Document; index: number }) {
  const uploadedDate = new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-emerald-500/30 hover:bg-card/70 hover:shadow-[0_0_20px_rgba(80,200,120,0.05)] transition-all duration-300"
    >
      {/* Top glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/30 transition-all duration-500 rounded-t-2xl" />

      <div className="flex items-start gap-4">
        {/* File icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
          <FileText className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-semibold text-foreground truncate mb-1 group-hover:text-emerald-300 transition-colors">
            {doc.filename}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {doc.num_pages} pages
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {uploadedDate}
            </span>
          </div>
        </div>

        {/* Status */}
        <StatusBadge status={doc.status} />
      </div>
    </motion.div>
  );
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/documents/`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Invalid file", { description: "Please upload a PDF document." });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const formData = new FormData();
    formData.append("file", file);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    try {
      const res = await fetch(`${apiUrl}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Sacred text received", { description: "Your document is being indexed into the knowledge base." });
        fetchDocuments();
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast.error("Upload failed", { description: "There was an error uploading your document." });
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1200);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const filteredDocs = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexedCount = documents.filter(d => d.status === "indexed").length;
  const processingCount = documents.filter(d => d.status === "processing").length;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-4">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gradient">Sacred Library</h1>
        </div>
        <p className="text-muted-foreground ml-13 pl-[52px]">
          Upload and manage your Ayurvedic texts. The AI Vaidya draws wisdom only from these sources.
        </p>

        {/* Stats row */}
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mt-4 pl-[52px]"
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {indexedCount} Indexed
            </div>
            {processingCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                {processingCount} Processing
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {documents.length} total text{documents.length !== 1 ? "s" : ""}
            </div>
          </motion.div>
        )}
      </motion.div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-1 gap-1">
          <TabsTrigger
            value="documents"
            className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(80,200,120,0.3)] transition-all"
          >
            <BookOpen className="w-4 h-4 mr-2" /> Indexed Texts
          </TabsTrigger>
          <TabsTrigger
            value="graph"
            className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(80,200,120,0.3)] transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" /> Knowledge Graph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1"
            >
              <div
                className={`relative rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 h-56 border-2 border-dashed ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(80,200,120,0.2)]"
                    : "border-emerald-500/25 bg-card/40 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-card/60"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleInputChange} />

                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-emerald-400 font-medium mb-3">Weaving into the knowledge base...</p>
                      <Progress value={uploadProgress} className="h-1.5 bg-emerald-950 rounded-full" />
                      <p className="text-xs text-muted-foreground mt-2">{uploadProgress}%</p>
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <Upload className="w-7 h-7 text-emerald-400" />
                      </motion.div>
                      <p className="font-serif font-semibold text-base mb-1 text-foreground">Upload Sacred Text</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Drop a PDF here or click to browse.<br />Supports any Ayurvedic text or research paper.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick tips card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-4"
              >
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">How It Works</p>
                {[
                  "Upload your PDF Ayurvedic text",
                  "AI automatically indexes & embeds content",
                  "Ask questions in the Consult tab",
                  "Responses cite exact pages",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mb-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                    {tip}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Document List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 lg:col-span-2"
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
                {/* Search bar */}
                <div className="p-4 border-b border-border/30">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      className="w-full bg-background/50 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 placeholder:text-muted-foreground/40 transition-all"
                      placeholder="Search texts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Docs */}
                <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {filteredDocs.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                      >
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm font-serif">
                          {documents.length === 0 ? "No sacred texts uploaded yet." : "No texts match your search."}
                        </p>
                        {documents.length === 0 && (
                          <p className="text-xs text-muted-foreground/50 mt-1">
                            Upload your first PDF to begin your Ayurvedic journey.
                          </p>
                        )}
                      </motion.div>
                    ) : (
                      filteredDocs.map((doc, index) => (
                        <DocumentCard key={doc.id} doc={doc} index={index} />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="graph" className="h-[600px] relative rounded-2xl overflow-hidden border border-border/40">
          <KnowledgeGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}
