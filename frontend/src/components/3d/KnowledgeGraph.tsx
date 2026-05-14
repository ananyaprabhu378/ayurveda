"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Share2, ZoomIn, ZoomOut, Maximize2, Zap, Leaf, Flame, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamically import force graph to prevent SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

// Expanded Ayurveda Knowledge Graph Data
const RAW_DATA = {
  nodes: [
    { id: "Ayurveda", group: "root", val: 30, desc: "The 'Science of Life' - a comprehensive system of medicine." },
    
    // Doshas
    { id: "Vata", group: "dosha", val: 25, desc: "Space & Air. Governs movement and nervous system.", element: "Air" },
    { id: "Pitta", group: "dosha", val: 25, desc: "Fire & Water. Governs metabolism and digestion.", element: "Fire" },
    { id: "Kapha", group: "dosha", val: 25, desc: "Earth & Water. Governs structure and immunity.", element: "Earth" },
    
    // Herbs
    { id: "Ashwagandha", group: "herb", val: 18, desc: "Powerful adaptogen for stress and strength." },
    { id: "Turmeric", group: "herb", val: 18, desc: "King of spices. Potent anti-inflammatory." },
    { id: "Brahmi", group: "herb", val: 18, desc: "Divine herb for brain health and memory." },
    { id: "Tulsi", group: "herb", val: 18, desc: "Holy basil. Excellent for respiratory health." },
    { id: "Amla", group: "herb", val: 18, desc: "Wealth of Vitamin C and immunity." },
    { id: "Neem", group: "herb", val: 18, desc: "The village pharmacy. Pure blood purifier." },
    
    // Conditions / Diseases
    { id: "Inflammation", group: "condition", val: 15, desc: "Root of many modern chronic diseases." },
    { id: "Stress", group: "condition", val: 15, desc: "Modern plague affecting mental and physical health." },
    { id: "Digestion", group: "condition", val: 15, desc: "Agni - the digestive fire of life." },
    { id: "Immunity", group: "condition", val: 15, desc: "Ojas - the vital energy and defense." },
    { id: "Insomnia", group: "condition", val: 15, desc: "Sleep disorders and restlessness." },
    
    // Treatments / Actions
    { id: "Panchakarma", group: "treatment", val: 22, desc: "The five-fold purification process." },
    { id: "Yoga", group: "treatment", val: 20, desc: "Physical and spiritual union with the self." },
    { id: "Meditation", group: "treatment", val: 20, desc: "Cultivating mental clarity and peace." },
    { id: "Abhyanga", group: "treatment", val: 15, desc: "Self-massage with warm herbal oils." },
  ],
  links: [
    { source: "Ayurveda", target: "Vata" },
    { source: "Ayurveda", target: "Pitta" },
    { source: "Ayurveda", target: "Kapha" },
    
    { source: "Vata", target: "Stress" },
    { source: "Vata", target: "Insomnia" },
    { source: "Vata", target: "Ashwagandha" },
    
    { source: "Pitta", target: "Inflammation" },
    { source: "Pitta", target: "Digestion" },
    { source: "Pitta", target: "Brahmi" },
    { source: "Pitta", target: "Neem" },
    
    { source: "Kapha", target: "Immunity" },
    { source: "Kapha", target: "Amla" },
    { source: "Kapha", target: "Turmeric" },
    
    { source: "Stress", target: "Meditation" },
    { source: "Stress", target: "Ashwagandha" },
    { source: "Inflammation", target: "Turmeric" },
    { source: "Inflammation", target: "Neem" },
    { source: "Immunity", target: "Tulsi" },
    { source: "Immunity", target: "Amla" },
    
    { source: "Ayurveda", target: "Panchakarma" },
    { source: "Panchakarma", target: "Abhyanga" },
    { source: "Yoga", target: "Ayurveda" },
  ]
};

export default function KnowledgeGraph() {
  const fgRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<any>(null);

  useEffect(() => {
    // Initial camera position
    if (fgRef.current) {
      fgRef.current.cameraPosition({ z: 180 });
    }
  }, []);

  const handleNodeHover = (node: any) => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setHoverNode(node || null);

    if (node) {
      const neighbors = new Set();
      const links = new Set();
      
      RAW_DATA.links.forEach(link => {
        if (link.source === node.id || link.target === node.id) {
          links.add(link);
          neighbors.add(link.source);
          neighbors.add(link.target);
        }
      });

      setHighlightNodes(neighbors);
      setHighlightLinks(links);
    }
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    
    // Zoom in on node
    const distance = 80;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    
    if (fgRef.current) {
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        2000
      );
    }
  };

  const getNodeColor = (node: any) => {
    if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) return "rgba(255,255,255,0.1)";
    
    switch(node.group) {
      case "root": return "#50c878"; // Emerald
      case "dosha": return "#fbbf24"; // Amber/Gold
      case "herb": return "#34d399"; // Green
      case "condition": return "#f87171"; // Red
      case "treatment": return "#60a5fa"; // Blue
      default: return "#d1d5db";
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-black/40 backdrop-blur-xl rounded-3xl border border-emerald-500/10 overflow-hidden shadow-2xl">
      <ForceGraph3D
        ref={fgRef}
        graphData={RAW_DATA}
        nodeLabel={(node: any) => `<div class="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/30 font-serif text-sm text-emerald-400 font-bold">${node.id}</div>`}
        nodeRelSize={6}
        nodeVal={(node: any) => node.val}
        nodeColor={getNodeColor}
        nodeOpacity={0.9}
        linkWidth={(link: any) => highlightLinks.has(link) ? 3 : 1}
        linkColor={(link: any) => highlightLinks.has(link) ? "#50c878" : "rgba(80,200,120,0.15)"}
        linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.01}
        backgroundColor="rgba(0,0,0,0)"
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        showNavInfo={false}
      />
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
          <Share2 className="w-6 h-6 text-emerald-400" />
          Semantic <span className="text-emerald-400">Knowledge Graph</span>
        </h2>
        <p className="text-emerald-100/40 text-xs mt-1 uppercase tracking-widest font-medium">Interactive Cosmic Relations</p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 flex gap-2">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">Doshas</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">Herbs</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-tighter">Conditions</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl hover:bg-emerald-500/20" onClick={() => fgRef.current.cameraPosition({ z: 250 }, null, 1000)}>
          <Maximize2 className="w-4 h-4 text-emerald-400" />
        </Button>
      </div>

      {/* Interactive Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="absolute top-6 right-6 w-80 bg-card/40 backdrop-blur-xl border border-emerald-500/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mb-1">{selectedNode.group}</p>
                <h3 className="font-serif text-3xl font-bold text-white">{selectedNode.id}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedNode(null)} 
                className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/40"
              >
                <Maximize2 className="w-4 h-4 rotate-45" />
              </Button>
            </div>
            
            <div className="h-px w-full bg-emerald-500/10 mb-4" />
            
            <p className="text-emerald-100/80 leading-relaxed font-serif text-base mb-6 italic">
              "{selectedNode.desc}"
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {selectedNode.group === "dosha" ? <Zap className="w-5 h-5 text-amber-400" /> : 
                   selectedNode.group === "herb" ? <Leaf className="w-5 h-5 text-emerald-400" /> :
                   <Info className="w-5 h-5 text-white/40" />}
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Connection Level</p>
                  <p className="text-white text-sm font-medium">Primordial Resonance</p>
                </div>
              </div>
              
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 h-11">
                Explore Semantic Roots
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
