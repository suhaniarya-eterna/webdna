"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { engine, RepoFile } from '@/lib/genesys-engine';
import { FileCode, ChevronRight, Folder, GitBranch, ShieldCheck, X } from 'lucide-react';
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
    const unsubscribeRepo = engine.subscribeRepo(setFiles);
    const unsubscribeEvents = engine.subscribe((event) => {
      if (event.type === 'stage' && event.stage) {
        setCurrentStage(event.stage);
        if (event.targetFile) setActiveFile(event.targetFile);
      }
      if (event.stage === 'idle') setCurrentStage('idle');
    });
    return () => { unsubscribeRepo(); unsubscribeEvents(); };
  }, []);

  const getColorClass = (type?: string) => {
    switch (type) {
      case 'comment': return 'text-white/20 italic';
      case 'keyword': return 'text-primary/90 font-bold';
      case 'function': return 'text-blue-400/80';
      case 'string': return 'text-green-400/80';
      case 'variable': return 'text-purple-400/80';
      case 'added': return 'text-emerald-400 bg-emerald-400/5 px-1 font-bold';
      case 'removed': return 'text-rose-400 bg-rose-400/10 line-through opacity-40 px-1';
      case 'modified': return 'text-yellow-400 bg-yellow-400/5 px-1';
      default: return 'text-white/50';
    }
  };

  const currentFile = files[activeFile];
  const fileList = Object.values(files);

  return (
    <div className="flex flex-col h-full bg-[#0F0B0A] overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/5 bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded text-[10px] md:text-xs font-mono text-white/30 border border-white/5 shrink-0">
            <GitBranch className="w-3 h-3 md:w-4 md:h-4 text-primary/40" />
            <span className="uppercase tracking-tighter">main</span>
          </div>
          <div className="text-[10px] md:text-xs font-mono text-white/20 flex items-center gap-2 truncate">
            <span className="hidden sm:inline">genesys_engine</span>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-white/40 truncate">{currentFile?.path}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase transition-all duration-500",
            currentStage === 'idle' ? "bg-green-500/5 border-green-500/10 text-green-500/60" : "bg-red-500/5 border-red-500/10 text-red-400 animate-pulse"
          )}>
            <span>{currentStage}</span>
          </div>
          {isFullScreen && onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "w-48 md:w-56 border-r border-white/5 bg-black/40 flex flex-col p-3 gap-1 overflow-y-auto shrink-0 transition-all",
          !isFullScreen && "hidden lg:flex"
        )}>
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <Folder className="w-4 h-4 text-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Filesystem</span>
          </div>
          {fileList.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded text-[11px] font-mono transition-all",
                activeFile === file.name ? "bg-primary/10 text-primary" : "text-white/20 hover:bg-white/[0.02] hover:text-white/40"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className={cn("w-4 h-4 shrink-0", activeFile === file.name ? "text-primary/60" : "text-white/10")} />
                <span className="truncate">{file.name}</span>
              </div>
              {file.status !== 'original' && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  file.status === 'degraded' ? "bg-red-500 animate-pulse" : "bg-green-500/40"
                )} />
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0807] relative overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 p-6 font-mono text-[12px] md:text-[14px] leading-relaxed overflow-auto scrollbar-thin scrollbar-thumb-primary/40"
          >
            <AnimatePresence mode="popLayout">
              {currentFile?.lines.map((line, idx) => (
                <motion.div
                  key={line.id}
                  layout
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-6 py-0.5 border-l-2 transition-colors",
                    line.type === 'added' ? "border-emerald-500/40 bg-emerald-500/[0.03]" :
                    line.type === 'removed' ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-transparent"
                  )}
                >
                  <span className="w-8 text-right text-white/5 select-none shrink-0">{idx + 1}</span>
                  <span className={cn(getColorClass(line.type), "whitespace-pre")}>
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] opacity-20" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 bg-black/60 flex justify-between items-center px-6 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white/20" />
          <span className="text-[10px] uppercase tracking-[0.1em] text-white/20 font-bold">Auto-Remediation Active</span>
        </div>
        <div className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
          {currentFile?.language} // NODE_42
        </div>
      </div>
    </div>
  );
}