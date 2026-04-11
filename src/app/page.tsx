"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'framer-motion';
import { DNACanvasSequence } from '@/components/dna-canvas-sequence';
import { DNAHelix } from '@/components/dna-helix';
import { ArrowRight, ChevronDown, Globe, Activity, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * A refined counter component that updates in discrete "milestones" 
 * to prevent jitter and excessive re-renders.
 */
function DynamicCounter({ value }: { value: MotionValue<number> }) {
  const [displayCount, setDisplayCount] = useState(0);
  const lastUpdateRef = useRef(0);

  // Milestone logic: Update display only when reaching significant jumps
  // This isolates the counter render layer from the main scroll stream.
  useMotionValueEvent(value, "change", (latest) => {
    const rounded = Math.floor(latest / 5000) * 5000;
    if (rounded !== lastUpdateRef.current) {
      setDisplayCount(rounded);
      lastUpdateRef.current = rounded;
    }
  });

  return (
    <motion.span
      key={displayCount}
      initial={{ opacity: 0.8, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block font-mono min-w-[5ch] text-red-400"
    >
      {displayCount > 0 ? displayCount.toLocaleString() : "0"}
    </motion.span>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1200vh provides the "weighted" premium scrubbing speed requested
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Balanced spring physics: lower stiffness and higher damping to prevent jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 12,
    damping: 40,
    restDelta: 0.0001
  });

  // Narrative Phase Opacity Mapping
  // Range 0 - 0.25: GLOBAL THREAT (Problem)
  const phase1Opacity = useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [0, 1, 1, 0]);
  
  // Range 0.25 - 0.50: THE ANALOGY (Idea)
  const phase2Opacity = useTransform(smoothProgress, [0.25, 0.30, 0.45, 0.50], [0, 1, 1, 0]);
  
  // Range 0.50 - 0.75: THE MECHANISM (Rising action/In-progress)
  const phase3Opacity = useTransform(smoothProgress, [0.50, 0.55, 0.70, 0.75], [0, 1, 1, 0]);
  
  // Range 0.75 - 1.00: THE EVOLUTION (Full restoration payoff)
  const phase4Opacity = useTransform(smoothProgress, [0.75, 0.80, 1.00], [0, 1, 1]);

  // Final Phase Visual Enhancements
  const finalPulse = useTransform(smoothProgress, [0.85, 0.92, 1.00], [1, 1.05, 1]);
  const finalGlow = useTransform(smoothProgress, [0.80, 0.90], [0, 1]);

  // Subtle zoom effect to heighten immersion during repair
  const dnaScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);

  // Counter Logic: 5% deadzone at the start to stabilize the initial broken state
  const attackValue = useTransform(smoothProgress, [0, 0.05, 0.25], [0, 0, 125000]);

  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  
  const phases = [
    { label: "VULNERABILITY", pos: "0%" },
    { label: "ANALOGY", pos: "25%" },
    { label: "MECHANISM", pos: "50%" },
    { label: "EVOLUTION", pos: "75%" },
    { label: "CORE", pos: "100%" }
  ];

  return (
    <main ref={containerRef} className="relative bg-[#0F0B0A] min-h-[1200vh]">
      {/* HUD: Golden Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-white/5">
        <motion.div 
          style={{ 
            width: progressBarWidth,
            background: 'linear-gradient(90deg, #CBA135, #FFD700, #FFF3B0)' 
          }}
          className="h-full relative shadow-[0_0_20px_rgba(255,215,0,0.4)]"
        >
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/40 blur-sm" />
        </motion.div>

        <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
          {phases.map((p, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-[1px] h-2 bg-white/20 mb-1" />
              <span className="text-[8px] font-bold tracking-[0.3em] text-white/30 uppercase">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* DNA Canvas Sequence (Isolated Background Layer) */}
        <motion.div 
          style={{ scale: dnaScale }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <DNACanvasSequence progress={smoothProgress} />
        </motion.div>

        {/* Final Phase Radial Glow & Shimmer */}
        <motion.div 
          style={{ opacity: finalGlow }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,161,129,0.08)_0%,transparent_70%)]" />
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatDelay: 2
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
          />
        </motion.div>

        {/* Scrim Overlays for Text Readability */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.75)_85%,rgba(0,0,0,0.95)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        </div>

        {/* NARRATIVE LAYERS: Focused on high-contrast text priority */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8">
          
          {/* PHASE 1: GLOBAL THREAT (0-25%) */}
          <motion.div 
            style={{ opacity: phase1Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <Globe className="w-12 h-12 text-red-500/40" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold cinematic-text mb-6 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              GLOBAL_<br />
              <span className="text-white/40">VULNERABILITY</span>
            </h1>
            <div className="text-lg md:text-2xl font-light text-white mb-8 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Every day, <DynamicCounter value={attackValue} /> cyber attacks are launched worldwide.
            </div>
            <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase leading-relaxed max-w-xs mx-auto">
              THE DIGITAL ECOSYSTEM IS UNDER CONSTANT SIEGE.
            </p>
          </motion.div>

          {/* PHASE 2: THE ANALOGY (25-50%) */}
          <motion.div 
            style={{ opacity: phase2Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <Activity className="w-12 h-12 text-primary/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold cinematic-text text-white mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              WHAT IF CODE<br />
              <span className="text-primary/60">WORKED LIKE DNA?</span>
            </h2>
            <p className="text-base md:text-xl font-light text-white/70 mb-8 max-w-md leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Self-aware. Self-repairing. Adaptive.<br />
              Biological structures don't just survive—they evolve.
            </p>
            <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase">Applying Biological Logic to Architecture</p>
          </motion.div>

          {/* PHASE 3: THE MECHANISM (50-75% - Rising Action) */}
          <motion.div 
            style={{ opacity: phase3Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none max-w-3xl mx-auto"
          >
            <div className="mb-6">
              <Zap className="w-12 h-12 text-yellow-500/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold cinematic-text text-white mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              DYNAMIC<br />
              <span className="text-yellow-500/70">ADAPTATION</span>
            </h2>
            <p className="text-base md:text-xl font-light text-white/80 mb-6 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Detection. Learning. Reconstruction.<br />
              Our mesh architecture identifies damage before it propagates.
            </p>
            <div className="flex items-center gap-3 py-2 px-6 border border-primary/20 bg-primary/5">
              <span className="text-xs font-bold text-primary tracking-[0.4em] uppercase animate-pulse">
                System Reconstruction in Progress
              </span>
            </div>
          </motion.div>

          {/* PHASE 4: THE EVOLUTION (75-100% - Payoff Reveal) */}
          <motion.div 
            style={{ opacity: phase4Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0B0A]/30 backdrop-blur-[2px] px-8"
          >
            <motion.div 
              style={{ scale: finalPulse }}
              className="relative mb-8"
            >
              <DNAHelix scale={0.7} />
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 blur-3xl bg-primary/20 -z-10 rounded-full" 
              />
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-3xl font-bold cinematic-text mb-6 text-white drop-shadow-[0_4px_40px_rgba(191,161,129,0.4)]"
            >
              ENGINEERED <span className="text-primary">TO ADAPT</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xs md:text-base font-light text-white/70 mb-12 max-w-xl leading-relaxed tracking-[0.2em] uppercase"
            >
              Beyond Protection. This is Living Security.<br />
              <span className="text-[10px] font-bold text-primary/60 tracking-[0.4em]">Self-healing. Intelligent. Autonomous.</span>
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col items-center gap-8 pointer-events-auto"
            >
              <Link href="/core">
                <Button size="lg" className="bg-primary text-black hover:bg-white transition-all group px-12 py-8 text-sm font-bold tracking-[0.3em] uppercase rounded-none border border-primary/50 shadow-[0_0_50px_rgba(191,161,129,0.3)]">
                  Access Core Interface
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                <p className="text-[10px] tracking-[0.6em] text-white uppercase font-bold">
                  Sequence Complete
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Cinematic Scanlines & Grain */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] opacity-10" />
      
      {/* Scroll Hint */}
      <motion.div 
        style={{ opacity: useTransform(smoothProgress, [0, 0.02], [0.6, 0]) }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[8px] tracking-[0.5em] uppercase text-white/50 font-bold">Scroll to Initialize</span>
        <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
      </motion.div>
    </main>
  );
}
