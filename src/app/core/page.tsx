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
      "min-h-screen bg-[#0F0B0A] text-white p-4 md:p-6 lg:p-8 selection:bg-primary/30 relative transition-all duration-700",
      "flex flex-col gap-6 lg:gap-8",
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-3 hover:bg-white/5 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-white/40 group-hover:text-primary" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold cinematic-text text-primary">System Core</h1>
            <p className="text-[10px] tracking-[0.4em] text-white/20 uppercase mt-1 font-bold">GENESYS_CONTROL_INTERFACE_v4.2</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setShowCodeOverlay(true)}
            className="bg-white/5 border-white/5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-black h-12 px-8"
          >
            <Layers className="w-4 h-4 mr-3" />
            Show All Logic
          </Button>
          <Badge variant="outline" className={cn(
            "px-6 py-2.5 text-[11px] font-bold tracking-[0.3em] min-w-[200px] justify-center transition-all h-12",
            isMutated ? "text-red-400 border-red-500/20 bg-red-500/5" : "text-green-400 border-green-500/20 bg-green-500/5"
          )}>
            {isMutated ? "MUTATION_DETECTED" : "SYSTEM_HEALTHY"}
          </Badge>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-0 overflow-hidden lg:overflow-visible">
        
        {/* Left Column: Logs & Node Info */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8 min-h-[400px] lg:min-h-0">
          <section className="flex-1 glass-panel overflow-hidden flex flex-col bg-white/[0.01] border-white/5">
            <LogStream />
          </section>
          
          <section className="glass-panel p-6 space-y-6 bg-white/[0.01] border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">Node Integrity</span>
            </div>
            <div className="space-y-4">
              {['API Layer', 'Security Mesh', 'Bio-Link'].map((node) => (
                <div key={node} className="flex justify-between items-center text-[11px] uppercase">
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
        <div className="lg:col-span-6 flex flex-col min-h-[500px] lg:min-h-0">
          <section className="flex-1 relative bg-black/40 rounded-[1.5rem] border border-primary/10 overflow-hidden shadow-2xl flex flex-col">
            <LiveCodePanel />
            {isMutated && (
              <div className="absolute inset-0 pointer-events-none border-2 border-red-500/20 animate-pulse z-10 rounded-[1.5rem]" />
            )}
          </section>
        </div>

        {/* Right Column: Controls & Memory */}
        <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8 min-h-[400px] lg:min-h-0">
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-4 md:p-8 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full h-full max-w-[1800px]"
            >
              <LiveCodePanel isFullScreen onClose={() => setShowCodeOverlay(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}