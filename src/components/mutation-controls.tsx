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
      title: 'Injection Vectors',
      icon: Terminal,
      actions: [
        { id: 'SQL_INJECTION', label: 'SQL Injection', icon: Database, color: 'hover:bg-red-500/20 hover:text-red-400' },
        { id: 'XSS', label: 'Cross-Site Scripting', icon: Bug, color: 'hover:bg-orange-500/20 hover:text-orange-400' },
        { id: 'CSRF', label: 'CSRF Attack', icon: ShieldAlert, color: 'hover:bg-purple-500/20 hover:text-purple-400' },
      ]
    },
    {
      title: 'Traffic & API',
      icon: Activity,
      actions: [
        { id: 'DDOS', label: 'DDoS Flood', icon: Activity, color: 'hover:bg-red-500/20 hover:text-red-400' },
        { id: 'BOT_SWARM', label: 'Bot Swarm', icon: Globe, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
        { id: 'API_ABUSE', label: 'API Rate Flood', icon: Cpu, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
      ]
    },
    {
      title: 'Advanced Threats',
      icon: ShieldCheck,
      actions: [
        { id: 'ZERO_DAY', label: 'Zero-Day Exploit', icon: Zap, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
        { id: 'RANSOMWARE', label: 'Ransomware', icon: Lock, color: 'hover:bg-rose-500/20 hover:text-rose-400' },
        { id: 'DATA_EXFIL', label: 'Data Exfiltration', icon: FileWarning, color: 'hover:bg-amber-500/20 hover:text-amber-400' },
      ]
    }
  ] as const;

  return (
    <div className="p-6 glass-panel space-y-6 h-full flex flex-col min-h-0 bg-white/[0.01] border-white/5">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          Mutation Simulator
        </h2>
        {isSimulating && (
          <div className="flex items-center gap-2 text-[9px] text-primary animate-pulse font-bold tracking-widest uppercase">
            Simulation Active
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-6 pr-4">
          {groups.map((group) => (
            <div key={group.title} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <group.icon className="w-3 h-3 text-white/30" />
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{group.title}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {group.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    disabled={isSimulating}
                    onClick={() => runSimulation(action.id as MutationType)}
                    className={cn(
                      "justify-start gap-3 h-10 border-white/5 bg-white/5 transition-all duration-300 rounded-lg group text-[11px] font-semibold",
                      action.color
                    )}
                  >
                    <action.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="tracking-tight">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t border-white/5 shrink-0">
        <p className="text-[9px] text-white/20 italic text-center">
          * Each simulation triggers unique structural and logical adaptations.
        </p>
      </div>
    </div>
  );
}
