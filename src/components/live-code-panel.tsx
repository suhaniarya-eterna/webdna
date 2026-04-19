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
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      
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
      case 'comment': return 'text-white/20 italic';
      case 'keyword': return 'text-primary/90 font-bold';
      case 'function': return 'text-blue-400/80';
      case 'string': return 'text-green-400/80';
      case 'variable': return 'text-purple-400/80';
      case 'added': return 'text-emerald-400 bg-emerald-400/10 px-1 font-bold';
      case 'removed': return 'text-rose-400 bg-rose-400/10 line-through opacity-40 px-1';
      case 'modified': return 'text-yellow-400 bg-yellow-400/5 px-1';
      default: return 'text-white/60';
    }
  };

  const currentFile = files[activeFile];
  const folders = Array.from(new Set(Object.values(files).map(f => f.path.split('/')[1])));

  return (
    <div className={cn(
      "flex flex-col bg-[#0F0B0A] border border-white/5 rounded-xl overflow-hidden shadow-2xl transition-all duration-700",
      isFullScreen ? "h-full w-full" : "h-full min-h-0"
    )}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/40 shrink-0 border border-white/5">
            <GitBranch className="w-3 h-3 text-primary/60" />
            <span className="hidden xs:inline uppercase tracking-tighter">main</span>
          </div>
          <div className="text-[10px] font-mono text-white/20 flex items-center gap-2 truncate">
            <span className="hidden sm:inline">genesys_engine</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-white/40 truncate">{currentFile?.path}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-500",
            currentStage === 'idle' ? "bg-green-500/5 border-green-500/10 text-green-500/60" : "bg-red-500/5 border-red-500/10 text-red-400 animate-pulse"
          )}>
            <div className={cn("w-1 h-1 rounded-full", currentStage === 'idle' ? "bg-green-500/40" : "bg-red-400 animate-ping")} />
            <span>{currentStage === 'idle' ? "STABLE" : currentStage}</span>
          </div>
          {isFullScreen && onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="hidden lg:flex w-56 border-r border-white/5 bg-black/40 flex-col p-3 gap-1 overflow-y-auto shrink-0 scrollbar-hide">
          <div className="flex items-center gap-2 px-2 py-2 mb-2 border-b border-white/5">
            <Folder className="w-3 h-3 text-primary/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Filesystem</span>
          </div>
          
          {folders.map(folder => (
            <div key={folder} className="space-y-0.5 mb-4">
              <div className="flex items-center gap-2 px-2 text-[8px] font-bold text-white/10 uppercase tracking-tighter mb-1">
                <ChevronRight className="w-2.5 h-2.5" />
                <span>{folder}</span>
              </div>
              {Object.values(files).filter(f => f.path.startsWith(`/${folder}`)).map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[10px] font-mono transition-all group",
                    activeFile === file.name ? "bg-primary/5 text-primary" : "text-white/20 hover:bg-white/[0.02] hover:text-white/60"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={cn("w-3 h-3 shrink-0", activeFile === file.name ? "text-primary/60" : "text-white/10")} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {file.status !== 'original' && (
                    <motion.div 
                      layoutId={`status-${file.name}`}
                      className={cn(
                        "w-1 h-1 rounded-full shrink-0",
                        file.status === 'degraded' ? "bg-red-500 animate-pulse" : 
                        file.status === 'patched' ? "bg-blue-400" : "bg-green-500/40"
                      )} 
                    />
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
            className="flex-1 p-4 md:p-8 font-mono text-[11px] md:text-[12px] leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-white/5"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {currentFile?.lines.map((line, idx) => (
                <motion.div
                  key={line.id}
                  layout
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: idx * 0.01 }}
                  className={cn(
                    "flex gap-4 group hover:bg-white/[0.01] py-0.5 border-l-2 transition-colors",
                    line.type === 'added' ? "border-emerald-500/40 bg-emerald-500/[0.03]" :
                    line.type === 'removed' ? "border-rose-500/40 bg-rose-500/[0.03]" :
                    line.type === 'modified' ? "border-yellow-500/40 bg-yellow-500/[0.02]" : "border-transparent"
                  )}
                >
                  <span className="w-8 text-right text-white/5 select-none text-[10px] shrink-0 font-light">{idx + 1}</span>
                  <span className={cn(getColorClass(line.type), "relative whitespace-pre font-medium")}>
                    {line.type === 'added' && <span className="mr-2 text-emerald-500/30 font-bold">+</span>}
                    {line.type === 'removed' && <span className="mr-2 text-rose-500/30 font-bold">-</span>}
                    {line.text}
                    {idx === currentFile.lines.length - 1 && (
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-1.5 h-3.5 bg-primary/40 ml-1 align-middle"
                      />
                    )}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] opacity-20" />
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-white/5 bg-black/60 flex justify-between items-center px-6 shrink-0">
        <div className="flex gap-6 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <Search className={cn("w-3 h-3 transition-colors", currentStage === 'detection' ? "text-primary animate-pulse" : "text-white/10")} />
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold">Heuristic Engine</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className={cn("w-3 h-3 transition-colors", currentStage === 'learning' ? "text-green-500/60" : "text-white/10")} />
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold">Auto-Remediation</span>
          </div>
        </div>
        <div className="text-[8px] font-mono text-white/10 tracking-widest shrink-0 truncate ml-4 uppercase">
          GENESYS_NODE_42 // {currentFile?.language}
        </div>
      </div>
    </div>
  );
}
