"use client";

import React, { useEffect, useState } from 'react';
import { BrainCircuit, Fingerprint, ShieldCheck } from 'lucide-react';
import { engine, RepoFile } from '@/lib/genesys-engine';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function MemoryPanel() {
  const [memory, setMemory] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, RepoFile>>({});

  useEffect(() => {
    const unsubscribeRepo = engine.subscribeRepo(setFiles);
    const interval = setInterval(() => {
      setMemory(engine.getMemory());
    }, 500);
    return () => {
      unsubscribeRepo();
      clearInterval(interval);
    };
  }, []);

  const entries = Object.entries(memory);
  const fileList = Object.values(files);

  return (
    <div className="p-6 glass-panel flex flex-col h-full bg-white/[0.01] border-white/5 overflow-hidden">
      <h2 className="font-bold uppercase tracking-[0.2em] text-[11px] mb-6 flex items-center gap-3 shrink-0">
        <BrainCircuit className="w-4 h-4 text-primary" />
        Genetic Memory
      </h2>
      
      <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
        {/* Logic Hardening Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">
            <ShieldCheck className="w-3 h-3" />
            Logic Hardening
          </div>
          <div className="space-y-4">
            {fileList.map(file => (
              <div key={file.name} className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-mono">
                  <span className="text-white/40">{file.name}</span>
                  <span className={cn(
                    "font-bold",
                    file.integrity > 80 ? "text-green-400" : "text-yellow-400"
                  )}>{file.integrity}%</span>
                </div>
                <Progress value={file.integrity} className="h-1 bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        {/* Antibodies Section */}
        <div className="space-y-3">
          <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">Antibodies</div>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-white/10 border border-dashed border-white/5 rounded-lg">
              <Fingerprint className="w-6 h-6 mb-2 opacity-30" />
              <p className="text-[9px] uppercase tracking-tighter">No vaccinations stored</p>
            </div>
          ) : (
            entries.map(([mutation, action]) => (
              <div key={mutation} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase text-white/20 font-bold tracking-tighter">EVENT</span>
                  <span className="text-[10px] font-bold text-white/60">{mutation}</span>
                </div>
                <div className="flex flex-col text-right gap-0.5">
                  <span className="text-[8px] uppercase text-white/20 font-bold tracking-tighter">ANTIBODY</span>
                  <span className="text-[10px] font-bold text-primary">{action}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 shrink-0">
        <p className="text-[9px] text-white/20 italic leading-tight text-center">
          * Antibodies grant 80% acceleration to repeat mutations.
        </p>
      </div>
    </div>
  );
}