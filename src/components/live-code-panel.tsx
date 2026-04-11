"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { engine, RepoFile } from '@/lib/genesys-engine';
import { FileCode, ChevronRight, Folder, Terminal, Search, GitBranch, ShieldCheck, Clock, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveCodePanelProps {
  isFullScreen?: boolean;
  onClose?: () => void;
}

export function LiveCodePanel({ isFullScreen, onClose }: LiveCodePanelProps) {
  const [files, setFiles] = useState<Record<string, RepoFile>>({});
  const [activeFile, setActiveFile] = useState<string>('firewall.py');
  const [currentStage, setCurrentStage] = useState<'detection' | 'response' | 'learning' | 'idle'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeRepo = engine.subscribeRepo((data) => {
      setFiles(data);
    });

    const unsubscribeEvents = engine.subscribe((event) => {
      if (event.type === 'stage' && event.stage) {
        setCurrentStage(event.stage);
        if (event.targetFile) setActiveFile(event.targetFile);
      }
      if (event.stage === 'idle') {
        setCurrentStage('idle');
      }
    });

    return () => {
      unsubscribeRepo();
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Only auto-scroll if user is already near the bottom (within 100px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom || currentStage !== 'idle') {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [files, activeFile, currentStage]);

  const getColorClass = (type?: string) => {
    switch (type) {
      case 'comment': return 'text-white/30 italic';
      case 'keyword': return 'text-primary font-bold';
      case 'function': return 'text-blue-400';
      case 'string': return 'text-green-400';
      case 'variable': return 'text-purple-400';
      case 'added': return 'text-emerald-400 bg-emerald-400/10 border-l-2 border-emerald-400 px-1';
      case 'removed': return 'text-rose-400 bg-rose-400/10 border-l-2 border-rose-400 line-through opacity-50 px-1';
      case 'modified': return 'text-yellow-400 bg-yellow-400/10 border-l-2 border-yellow-400 px-1';
      default: return 'text-white/70';
    }
  };

  const currentFile = files[activeFile];
  const folders = Array.from(new Set(Object.values(files).map(f => f.path.split('/')[1])));

  return (
    <div className={cn(
      "flex flex-col bg-[#0F0B0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500",
      isFullScreen ? "h-full w-full" : "h-full min-h-0"
    )}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded text-[9px] md:text-[10px] font-mono text-white/60 shrink-0">
            <GitBranch className="w-3 h-3 text-primary" />
            <span>main</span>
          </div>
          <div className="text-[9px] md:text-[10px] font-mono text-white/30 flex items-center gap-2 truncate">
            <span className="hidden sm:inline">genesys-core</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-white/60 truncate">{currentFile?.path}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] md:text-[9px] font-bold tracking-widest uppercase transition-all",
            currentStage === 'idle' ? "bg-green-500/5 border-green-500/20 text-green-500" : "bg-red-500/5 border-red-500/20 text-red-500 animate-pulse"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", currentStage === 'idle' ? "bg-green-500" : "bg-red-500 animate-ping")} />
            <span className="hidden xs:inline">{currentStage === 'idle' ? "Repo Stable" : `Patching: ${currentStage}`}</span>
          </div>
          {isFullScreen && onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="hidden md:flex w-56 lg:w-64 border-r border-white/10 bg-black/40 flex-col p-3 gap-1 overflow-y-auto shrink-0">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <Folder className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Repository Browser</span>
          </div>
          
          {folders.map(folder => (
            <div key={folder} className="space-y-1 mb-4">
              <div className="flex items-center gap-2 px-2 text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                <ChevronRight className="w-3 h-3" />
                <span>{folder}</span>
              </div>
              {Object.values(files).filter(f => f.path.startsWith(`/${folder}`)).map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded text-[10px] lg:text-[11px] font-mono transition-all group",
                    activeFile === file.name ? "bg-primary/10 text-primary" : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCode className={cn("w-3.5 h-3.5 shrink-0", activeFile === file.name ? "text-primary" : "text-white/20")} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {file.status !== 'original' && (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      file.status === 'degraded' ? "bg-red-500 animate-pulse" : 
                      file.status === 'patched' ? "bg-blue-400" : "bg-green-500"
                    )} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Editor Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0807] relative">
          <div 
            ref={scrollRef}
            className="flex-1 p-4 md:p-8 font-mono text-[12px] md:text-[13px] leading-relaxed overflow-y-auto selection:bg-primary/30"
          >
            <AnimatePresence initial={false}>
              {currentFile?.lines.map((line, idx) => (
                <motion.div
                  key={line.id + idx}
                  initial={line.type === 'added' ? { opacity: 0, x: -10, backgroundColor: 'rgba(16, 185, 129, 0.1)' } : { opacity: 0 }}
                  animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "flex gap-4 md:gap-6 group hover:bg-white/[0.02] py-0.5 md:py-1 border-l-2",
                    line.type === 'added' ? "border-emerald-500 bg-emerald-500/[0.04]" :
                    line.type === 'removed' ? "border-rose-500 bg-rose-500/[0.04]" :
                    line.type === 'modified' ? "border-yellow-500 bg-yellow-500/[0.04]" : "border-transparent"
                  )}
                >
                  <span className="w-8 md:w-10 text-right text-white/10 select-none text-[10px] md:text-[11px] shrink-0">{idx + 1}</span>
                  <span className={cn(getColorClass(line.type), "relative whitespace-pre font-medium")}>
                    {line.type === 'added' && <span className="mr-2 text-emerald-500/50">+</span>}
                    {line.type === 'removed' && <span className="mr-2 text-rose-500/50">-</span>}
                    {line.text}
                    {idx === currentFile.lines.length - 1 && (
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                      />
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 md:p-3 border-t border-white/5 bg-black/60 flex justify-between items-center px-4 md:px-8 shrink-0">
        <div className="flex gap-4 md:gap-8 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Search className={cn("w-3.5 h-3.5", currentStage === 'detection' ? "text-primary animate-pulse" : "text-white/20")} />
            <span className="hidden xs:inline text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/30">System Analysis Engine</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className={cn("w-3.5 h-3.5", currentStage === 'learning' ? "text-green-400" : "text-white/20")} />
            <span className="hidden xs:inline text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/30">Auto-Remediation Verification</span>
          </div>
        </div>
        <div className="text-[9px] md:text-[10px] font-mono text-white/20 tracking-widest shrink-0 truncate">UTF-8 // GENESYS_CORE_SYSTEM_PATCH_4.2.0</div>
      </div>
    </div>
  );
}