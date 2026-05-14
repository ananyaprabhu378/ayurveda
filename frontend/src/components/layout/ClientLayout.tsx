"use client";

import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

const ForestBackground = dynamic(
  () => import("@/components/3d/ForestBackground"),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isDark } = useStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      {/* Cinematic background - fixed behind everything */}
      <ForestBackground />

      {/* Ambient radial glow at top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0">
        <div className="w-full h-full bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
      </div>
    </>
  );
}
