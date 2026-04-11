"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { SystemEvent, engine } from '@/lib/genesys-engine';
import { cn } from '@/lib/utils';

export function LogStream() {
  const [logs, setLogs] = useState<SystemEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = engine.subscribe((event) => {
      setLogs(prev => [...prev, event].slice(-50));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'action': return <Zap className="w-4 h-4 text-blue-400" />;
      default: return <Terminal className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <Terminal className="w-5 h-5 text-primary" />
        <h2 className="font-bold uppercase tracking-wider text-sm">System Brain Logs</h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs"
      >
        {logs.length === 0 && (
          <div className="text-white/20 italic">Awaiting system input...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="log-entry flex gap-3 group">
            <span className="text-white/20 whitespace-nowrap">
              [{log.timestamp.toLocaleTimeString([], { hour12: false })}]
            </span>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{getIcon(log.type)}</span>
              <span className={cn(
                "group-hover:text-white transition-colors",
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-green-400' :
                log.type === 'action' ? 'text-blue-400' : 'text-white/60'
              )}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
