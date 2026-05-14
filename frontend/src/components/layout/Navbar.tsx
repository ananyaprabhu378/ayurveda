"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, MessageCircle, Library, Settings, Scan, Zap, Cloud, Calendar, BookOpen, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === "/login") return null;

  const links = [
    { name: "Home", href: "/", icon: Leaf },
    { name: "Consult", href: "/chat", icon: MessageCircle },
    { name: "Library", href: "/library", icon: Library },
    { name: "Scanner", href: "/scanner", icon: Scan },
    { name: "Dosha", href: "/dosha", icon: Zap },
    { name: "Weather", href: "/weather", icon: Cloud },
    { name: "Routine", href: "/routine", icon: Calendar },
    { name: "Research", href: "/research", icon: BookOpen },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 h-16 z-50"
    >
      {/* Glass navbar surface */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-xl border-b border-emerald-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="relative max-w-full mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 flex-shrink-0">
          <div className="relative w-8 h-8 rounded-full border border-emerald-500/40 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-emerald-400/70 group-hover:shadow-[0_0_20px_rgba(80,200,120,0.3)]">
            <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors" />
            <Leaf className="w-3.5 h-3.5 text-emerald-400 relative z-10 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          </div>
          <span className="font-serif text-lg font-bold text-foreground tracking-wide hidden lg:inline">
            AI <span className="text-emerald-400">Vaidya</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar max-w-[calc(100vw-120px)] sm:max-w-none px-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-1.5 text-xs font-bold uppercase tracking-tighter px-3 py-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? "text-emerald-300 bg-emerald-500/15"
                    : "text-muted-foreground/60 hover:text-emerald-300 hover:bg-emerald-500/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : ""}`} />
                <span className="hidden xl:inline">{link.name}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 rounded-full border border-emerald-500/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        {/* User / Login link */}
        <Link href="/login" className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
            <User className="w-4 h-4 text-white/40" />
          </div>
        </Link>
      </div>
    </motion.nav>
  );
}
