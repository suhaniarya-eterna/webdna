"use client";

import React, { useEffect, useState } from 'react';
import { BrainCircuit, Fingerprint } from 'lucide-react';
import { engine } from '@/lib/genesys-engine';

export function MemoryPanel() {
  const [memory, setMemory] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setMemory(engine.getMemory());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const entries = Object.entries(memory);

  return (
    <div className="p-6 glass-panel">
      <h2 className="font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
        <BrainCircuit className="w-4 h-4 text-secondary" />
        Genetic Memory (Immune Memory)
      </h2>
      
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/20 border-2 border-dashed border-white/5 rounded-lg">
            <Fingerprint className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No antibodies generated yet.</p>
          </div>
        ) : (
          entries.map(([mutation, action]) => (
            <div key={mutation} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-secondary/50 transition-all">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-white/40 font-bold tracking-tighter">Event</span>
                <span className="text-xs font-bold text-secondary">{mutation}</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase text-white/40 font-bold tracking-tighter">Antibody</span>
                <span className="text-xs font-bold text-green-400 group-hover:text-white transition-colors">{action}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 p-3 bg-secondary/5 rounded border border-secondary/10">
        <p className="text-[10px] text-secondary/60 italic leading-relaxed">
          * Antibodies are stored after successful DNA-guided recovery and applied instantly to future mutations.
        </p>
      </div>
    </div>
  );
}
