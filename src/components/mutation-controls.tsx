"use client";

import React, { useState } from 'react';
import { 
  Zap, ShieldAlert, Cpu, Activity, Play, 
  Terminal, ShieldCheck, Globe, Lock, 
  FileWarning, Database, Bug
} from 'lucide-react';
import { engine, MutationType } from '@/lib/genesys-engine';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MutationControls() {
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (type: MutationType) => {
    if (isSimulating) return;
    setIsSimulating(true);
    await engine.simulateMutation(type);
    setIsSimulating(false);
  };

  const groups = [
    {
      title: 'Injection',
      icon: Terminal,
      actions: [
        { id: 'SQL_INJECTION', label: 'SQL Injection', icon: Database, color: 'hover:bg-red-500/20 hover:text-red-400' },
        { id: 'XSS', label: 'XSS Attack', icon: Bug, color: 'hover:bg-orange-500/20 hover:text-orange-400' },
        { id: 'CSRF', label: 'CSRF Exploit', icon: ShieldAlert, color: 'hover:bg-purple-500/20 hover:text-purple-400' },
      ]
    },
    {
      title: 'Traffic & API',
      icon: Activity,
      actions: [
        { id: 'DDOS', label: 'DDoS Flood', icon: Activity, color: 'hover:bg-red-500/20 hover:text-red-400' },
        { id: 'BOT_SWARM', label: 'Bot Swarm', icon: Globe, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
        { id: 'API_ABUSE', label: 'Rate Flood', icon: Cpu, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
      ]
    },
    {
      title: 'Advanced',
      icon: ShieldCheck,
      actions: [
        { id: 'ZERO_DAY', label: 'Zero-Day', icon: Zap, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
        { id: 'RANSOMWARE', label: 'Ransomware', icon: Lock, color: 'hover:bg-rose-500/20 hover:text-rose-400' },
        { id: 'DATA_EXFIL', label: 'Exfiltration', icon: FileWarning, color: 'hover:bg-amber-500/20 hover:text-amber-400' },
      ]
    }
  ] as const;

  return (
    <div className="p-5 md:p-8 glass-panel space-y-6 md:space-y-8 h-full flex flex-col min-h-0 bg-white/[0.01] border-white/5 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-bold uppercase tracking-[0.2em] text-[11px] md:text-[13px] flex items-center gap-3">
          <Play className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          Mutation Simulator
        </h2>
        {isSimulating && (
          <div className="flex items-center gap-2 text-[9px] md:text-[11px] text-primary animate-pulse font-bold tracking-[0.3em] uppercase shrink-0 ml-2">
            Simulating...
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 min-h-0 -mr-2 pr-4">
        <div className="space-y-8 md:space-y-10">
          {groups.map((group) => (
            <div key={group.title} className="space-y-4 md:space-y-5">
              <div className="flex items-center gap-3 px-1">
                <group.icon className="w-4 h-4 text-white/30" />
                <span className="text-[10px] md:text-[12px] font-bold text-white/30 uppercase tracking-[0.3em]">{group.title}</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 md:gap-3">
                {group.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    disabled={isSimulating}
                    onClick={() => runSimulation(action.id as MutationType)}
                    className={cn(
                      "justify-start gap-4 h-12 md:h-14 border-white/5 bg-white/5 transition-all duration-300 rounded-xl group text-xs md:text-sm font-semibold px-4 shadow-sm",
                      action.color
                    )}
                  >
                    <action.icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110 shrink-0" />
                    <span className="tracking-tight truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="pt-4 md:pt-6 border-t border-white/5 shrink-0">
        <p className="text-[10px] md:text-[11px] text-white/20 italic text-center leading-tight">
          * Stress-test autonomous structural adaptations via live injection.
        </p>
      </div>
    </div>
  );
}