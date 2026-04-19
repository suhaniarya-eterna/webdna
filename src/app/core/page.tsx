"use client";

import React, { useState, useEffect } from 'react';
import { LogStream } from '@/components/log-stream';
import { MutationControls } from '@/components/mutation-controls';
import { MemoryPanel } from '@/components/memory-panel';
import { LiveCodePanel } from '@/components/live-code-panel';
import { engine, RepoFile, MutationType } from '@/lib/genesys-engine';
import { cn } from '@/lib/utils';
import { ArrowLeft, Database, Layers, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoreDashboard() {
  const [isMutated, setIsMutated] = useState(false);
  const [activeMutation, setActiveMutation] = useState<MutationType | null>(null);
  const [showCodeOverlay, setShowCodeOverlay] = useState(false);
  const [files, setFiles] = useState<Record<string, RepoFile>>({});

  useEffect(() => {
    const unsubscribe = engine.subscribe((event) => {
      if (event.type === 'stage' && event.stage !== 'idle') {
        setIsMutated(true);
        if (event.mutationType) setActiveMutation(event.mutationType);
      }
      if (event.stage === 'idle') {
        setIsMutated(false);
        setActiveMutation(null);
      }
    });

    const unsubscribeRepo = engine.subscribeRepo(setFiles);

    return () => {
      unsubscribe();
      unsubscribeRepo();
    };
  }, []);

  return (
    <main className={cn(
      "min-h-screen bg-[#0F0B0A] text-white p-4 md:p-6 lg:p-10 selection:bg-primary/30 relative transition-all duration-700",
      "flex flex-col gap-6 lg:gap-10",
      activeMutation === 'RANSOMWARE' && "grayscale-[0.5] contrast-[1.2] brightness-[0.8]",
      activeMutation === 'XSS' && "animate-flicker"
    )}>
      {/* Visual Attack Effects */}
      <div className={cn(
        "flicker-overlay pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300", 
        isMutated && "opacity-100",
        activeMutation === 'DDOS' && "bg-red-500/10",
        activeMutation === 'ZERO_DAY' && "bg-yellow-500/5"
      )} />
      
      {/* Header HUD */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 shrink-0 z-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="p-4 hover:bg-white/5 rounded-full transition-colors group">
            <ArrowLeft className="w-7 h-7 text-white/40 group-hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold cinematic-text text-primary">System Core</h1>
            <p className="text-[11px] tracking-[0.4em] text-white/20 uppercase mt-2 font-bold">GENESYS_CONTROL_INTERFACE_v4.2</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Button 
            variant="outline" 
            onClick={() => setShowCodeOverlay(true)}
            className="bg-white/5 border-white/10 text-[12px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-black h-14 px-10 transition-all"
          >
            <Layers className="w-5 h-5 mr-3" />
            Show All Logic
          </Button>
          <Badge variant="outline" className={cn(
            "px-8 py-3 text-[12px] font-bold tracking-[0.3em] min-w-[240px] justify-center transition-all h-14",
            isMutated ? "text-red-400 border-red-500/30 bg-red-500/5" : "text-green-400 border-green-500/30 bg-green-500/5"
          )}>
            {isMutated ? "MUTATION_DETECTED" : "SYSTEM_HEALTHY"}
          </Badge>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 min-h-0">
        
        {/* Left Column: Logs & Node Info */}
        <div className="lg:col-span-3 flex flex-col gap-8 lg:gap-10 min-h-[400px] lg:min-h-0">
          <section className="flex-1 glass-panel overflow-hidden flex flex-col bg-white/[0.01] border-white/5">
            <LogStream />
          </section>
          
          <section className="glass-panel p-8 space-y-8 bg-white/[0.01] border-white/5 shrink-0">
            <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-primary" />
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-white/40">Node Integrity</span>
            </div>
            <div className="space-y-5">
              {['API Layer', 'Security Mesh', 'Bio-Link'].map((node) => (
                <div key={node} className="flex justify-between items-center text-[12px] uppercase">
                  <span className="text-white/20">{node}</span>
                  <span className={cn("font-mono font-bold", isMutated ? "text-red-400" : "text-green-400")}>
                    {isMutated ? "DEGRADED" : "OPTIMAL"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Center Column: Live Code Engine */}
        <div className="lg:col-span-6 flex flex-col min-h-[600px] lg:min-h-0">
          <section className="flex-1 relative bg-black/40 rounded-[2rem] border border-primary/20 overflow-hidden shadow-2xl flex flex-col">
            <LiveCodePanel />
            {isMutated && (
              <div className="absolute inset-0 pointer-events-none border-2 border-red-500/30 animate-pulse z-10 rounded-[2rem]" />
            )}
          </section>
        </div>

        {/* Right Column: Controls & Memory */}
        <div className="lg:col-span-3 flex flex-col gap-8 lg:gap-10 min-h-[400px] lg:min-h-0">
          <section className="flex-[3] min-h-0 overflow-hidden">
            <MutationControls />
          </section>

          <section className="flex-[2] min-h-0 overflow-hidden">
            <MemoryPanel />
          </section>
        </div>

      </div>

      {/* Full-Screen Code Overlay */}
      <AnimatePresence>
        {showCodeOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-6 md:p-12 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full h-full max-w-[2000px]"
            >
              <LiveCodePanel isFullScreen onClose={() => setShowCodeOverlay(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}