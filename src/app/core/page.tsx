"use client";

import React, { useState, useEffect } from 'react';
import { LogStream } from '@/components/log-stream';
import { MutationControls } from '@/components/mutation-controls';
import { MemoryPanel } from '@/components/memory-panel';
import { LiveCodePanel } from '@/components/live-code-panel';
import { engine, RepoFile, MutationType } from '@/lib/genesys-engine';
import { cn } from '@/lib/utils';
import { Shield, ArrowLeft, Database, Layers, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
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

    const unsubscribeRepo = engine.subscribeRepo((data) => {
      setFiles(data);
    });

    return () => {
      unsubscribe();
      unsubscribeRepo();
    };
  }, []);

  return (
    <main className={cn(
      "min-h-screen bg-[#0F0B0A] text-white p-4 md:p-8 lg:p-16 selection:bg-primary/30 relative transition-all duration-700",
      "lg:h-screen lg:overflow-hidden overflow-y-auto flex flex-col",
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
      
      {activeMutation === 'DATA_EXFIL' && (
        <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden opacity-30">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '50vw', y: '50vh', opacity: 0 }}
              animate={{ x: i % 2 === 0 ? '110vw' : '-10vw', y: `${Math.random() * 100}vh`, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
              className="absolute w-1.5 h-1.5 bg-primary rounded-full blur-[2px]"
            />
          ))}
        </div>
      )}

      <div className="max-w-[2200px] mx-auto w-full flex flex-col lg:h-full gap-8 md:gap-12 relative z-10 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 md:pb-12 gap-8 shrink-0">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="p-4 hover:bg-white/5 rounded-full transition-colors group">
              <ArrowLeft className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold cinematic-text text-primary">System Core</h1>
              <p className="text-[10px] md:text-[12px] tracking-[0.6em] text-white/30 uppercase mt-3 font-bold">GENESYS_CONTROL_INTERFACE_v4.2</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowCodeOverlay(true)}
              className="bg-white/5 border-white/10 text-[12px] md:text-[13px] font-bold tracking-[0.4em] uppercase hover:bg-primary hover:text-black transition-all h-14 md:h-16 px-10 md:px-12 shadow-2xl"
            >
              <Layers className="w-5 h-5 mr-4" />
              <span>Show All Logic</span>
            </Button>
            <Badge variant="outline" className={cn(
              "px-8 py-3.5 text-[12px] md:text-[14px] font-bold tracking-[0.4em] min-w-[240px] md:min-w-[300px] justify-center transition-colors duration-500 h-14 md:h-16 shadow-inner",
              isMutated ? "text-red-400 border-red-400/20 bg-red-400/5" : "text-green-400 border-green-400/20 bg-green-400/5"
            )}>
              {isMutated ? "MUTATION_DETECTED" : "SYSTEM_HEALTHY"}
            </Badge>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 flex-1 min-h-0">
          
          {/* Left Panel: Logs & Health */}
          <div className="lg:col-span-3 flex flex-col gap-8 md:gap-12 lg:min-h-0 min-h-[500px]">
            <div className="glass-panel flex-1 min-h-0 overflow-hidden flex flex-col border-white/5 bg-white/[0.01] shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              <LogStream />
            </div>
            
            <div className="glass-panel p-8 space-y-8 border-white/5 bg-white/[0.01] shrink-0 shadow-xl">
              <div className="flex items-center gap-5">
                <Database className="w-6 h-6 text-primary" />
                <span className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/60">Node Integrity</span>
              </div>
              <div className="space-y-6">
                {['API Layer', 'Security Mesh', 'Bio-Link'].map((node) => (
                  <div key={node} className="flex justify-between items-center text-[11px] md:text-[12px] uppercase tracking-tighter">
                    <span className="text-white/40 font-medium">{node}</span>
                    <span className={cn("font-mono font-bold", isMutated ? "text-red-400" : "text-green-400")}>
                      {isMutated ? "DEGRADED" : "OPTIMAL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel: Repository Interface */}
          <div className="lg:col-span-6 flex flex-col lg:min-h-0 min-h-[600px]">
            <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col bg-black/40 rounded-[2rem] border border-primary/10 shadow-[0_0_100px_rgba(0,0,0,0.6)]">
              <LiveCodePanel />
              {isMutated && (
                <div className="absolute inset-0 pointer-events-none border-[6px] border-red-500/20 animate-pulse z-10 rounded-[2rem]" />
              )}
            </div>
          </div>

          {/* Right Panel: Controls & Memory */}
          <div className="lg:col-span-3 flex flex-col gap-8 md:gap-12 lg:min-h-0 min-h-[500px]">
            <div className="flex-[2] min-h-0 flex flex-col">
              <MutationControls />
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <MemoryPanel />
            </div>

            <div className="glass-panel p-8 space-y-8 bg-white/[0.01] border-white/5 shrink-0 shadow-xl">
              <div className="flex items-center gap-5">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/60">Logic Hardening</span>
              </div>
              <div className="grid grid-cols-3 gap-5">
                {Object.values(files).slice(0, 3).map(file => (
                  <div key={file.name} className="flex flex-col items-center gap-3.5">
                    <div className={cn(
                      "w-full h-2 rounded-full transition-colors duration-500 shadow-sm",
                      file.status === 'reinforced' ? "bg-green-500" :
                      file.status === 'degraded' ? "bg-red-500" :
                      file.status === 'patched' ? "bg-blue-400" : "bg-white/10"
                    )} />
                    <span className="text-[9px] md:text-[10px] uppercase text-white/40 font-bold truncate w-full text-center tracking-tighter">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full-Screen Code Overlay */}
      <AnimatePresence>
        {showCodeOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl p-6 md:p-12 lg:p-24 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full h-full max-w-[2000px] relative"
            >
              <LiveCodePanel isFullScreen onClose={() => setShowCodeOverlay(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
