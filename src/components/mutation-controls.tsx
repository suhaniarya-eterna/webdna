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
        { id: 'SQL_INJECTION', label: 'SQL Injection', icon: Database, color: 'hover:bg-red-500/10 hover:text-red-400' },
        { id: 'XSS', label: 'XSS Attack', icon: Bug, color: 'hover:bg-orange-500/10 hover:text-orange-400' },
        { id: 'CSRF', label: 'CSRF Exploit', icon: ShieldAlert, color: 'hover:bg-purple-500/10 hover:text-purple-400' },
      ]
    },
    {
      title: 'Traffic',
      icon: Activity,
      actions: [
        { id: 'DDOS', label: 'DDoS Flood', icon: Activity, color: 'hover:bg-red-500/10 hover:text-red-400' },
        { id: 'BOT_SWARM', label: 'Bot Swarm', icon: Globe, color: 'hover:bg-blue-500/10 hover:text-blue-400' },
        { id: 'API_ABUSE', label: 'Rate Flood', icon: Cpu, color: 'hover:bg-yellow-500/10 hover:text-yellow-400' },
      ]
    },
    {
      title: 'Advanced',
      icon: ShieldCheck,
      actions: [
        { id: 'ZERO_DAY', label: 'Zero-Day', icon: Zap, color: 'hover:bg-yellow-500/10 hover:text-yellow-400' },
        { id: 'RANSOMWARE', label: 'Ransomware', icon: Lock, color: 'hover:bg-rose-500/10 hover:text-rose-400' },
        { id: 'DATA_EXFIL', label: 'Exfiltration', icon: FileWarning, color: 'hover:bg-amber-500/10 hover:text-amber-400' },
      ]
    }
  ] as const;

  return (
    <div className="p-6 glass-panel flex flex-col h-full bg-white/[0.01] border-white/5 overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
          <Play className="w-4 h-4 text-primary" />
          Mutation Simulator
        </h2>
        {isSimulating && (
          <div className="text-[9px] text-primary animate-pulse font-bold tracking-[0.2em] uppercase">
            Simulating...
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 pr-4 -mr-2">
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.title} className="space-y-4">
              <div className="flex items-center gap-3 opacity-30">
                <group.icon className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{group.title}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {group.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    disabled={isSimulating}
                    onClick={() => runSimulation(action.id as MutationType)}
                    className={cn(
                      "justify-start gap-3 h-11 border-white/5 bg-white/5 transition-all rounded-xl text-[11px] font-semibold px-4",
                      action.color
                    )}
                  >
                    <action.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}