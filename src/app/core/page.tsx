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
      "min-h-screen bg-[#0F0B0A] text-white p-4 md:p-6 lg:p-8 selection:bg-primary/30 relative transition-all duration-700",
      "lg:overflow-hidden overflow-y-auto",
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
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '50vw', y: '50vh', opacity: 0 }}
              animate={{ x: i % 2 === 0 ? '110vw' : '-10vw', y: `${Math.random() * 100}vh`, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}

      <div className="max-w-[1600px] mx-auto flex flex-col lg:h-[calc(100vh-64px)] h-auto gap-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4 shrink-0">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold cinematic-text text-primary">System Core</h1>
              <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase mt-1">GENESYS_CONTROL_INTERFACE</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCodeOverlay(true)}
              className="bg-white/5 border-white/10 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-primary hover:text-black transition-all"
            >
              <Layers className="w-3 h-3 mr-2" />
              Show All Logic
            </Button>
            <Badge variant="outline" className={cn(
              "px-4 py-1 text-[10px] font-bold tracking-widest min-w-[140px] justify-center",
              isMutated ? "text-red-400 border-red-400/20 bg-red-400/5" : "text-green-400 border-green-400/20 bg-green-400/5"
            )}>
              {isMutated ? "MUTATION_DETECTED" : "SYSTEM_HEALTHY"}
            </Badge>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Panel: Logs & Health */}
          <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
            <div className="glass-panel flex-1 min-h-[400px] overflow-hidden flex flex-col border-white/5 bg-white/[0.01]">
              <LogStream />
            </div>
            
            <div className="glass-panel p-5 space-y-4 border-white/5 bg-white/[0.01] shrink-0">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Node Integrity</span>
              </div>
              <div className="space-y-3">
                {['API Layer', 'Security Mesh', 'Bio-Link'].map((node) => (
                  <div key={node} className="flex justify-between items-center text-[9px] uppercase tracking-tighter">
                    <span className="text-white/40">{node}</span>
                    <span className={cn("font-mono font-bold", isMutated ? "text-red-400" : "text-green-400")}>
                      {isMutated ? "DEGRADED" : "OPTIMAL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel: Repository Interface */}
          <div className="lg:col-span-6 flex flex-col min-h-[600px] lg:min-h-0">
            <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col bg-black/40 rounded-xl border border-primary/10">
              <LiveCodePanel />
              {isMutated && (
                <div className="absolute inset-0 pointer-events-none border-2 border-red-500/20 animate-pulse-glow z-10 rounded-xl" />
              )}
            </div>
          </div>

          {/* Right Panel: Controls & Memory */}
          <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
            <div className="flex-[1.5] min-h-[400px] lg:min-h-0 flex flex-col">
              <MutationControls />
            </div>

            <div className="flex-1 min-h-[300px] lg:min-h-0 flex flex-col">
              <MemoryPanel />
            </div>

            <div className="glass-panel p-5 space-y-4 bg-white/[0.01] border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">Logic Hardening</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(files).slice(0, 3).map(file => (
                  <div key={file.name} className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-full h-1 rounded-full",
                      file.status === 'reinforced' ? "bg-green-500" :
                      file.status === 'degraded' ? "bg-red-500" :
                      file.status === 'patched' ? "bg-blue-400" : "bg-white/10"
                    )} />
                    <span className="text-[7px] uppercase text-white/40 font-bold truncate w-full text-center tracking-tighter">{file.name}</span>
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
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md p-4 md:p-8 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full max-w-[1400px] relative"
            >
              <LiveCodePanel isFullScreen onClose={() => setShowCodeOverlay(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}