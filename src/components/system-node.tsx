"use client";

import React from 'react';
import { Shield, Server, Globe, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { SystemStatus } from '@/lib/genesys-engine';
import { cn } from '@/lib/utils';

interface NodeProps {
  label: string;
  type: 'api' | 'security' | 'external';
  status: SystemStatus;
}

export function SystemNode({ label, type, status }: NodeProps) {
  const icons = {
    api: Server,
    security: Shield,
    external: Globe
  };

  const Icon = icons[type];

  const statusColors = {
    healthy: 'text-green-400 border-green-400/30 bg-green-400/5',
    warning: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5 animate-pulse-glow',
    failure: 'text-red-400 border-red-400/30 bg-red-400/5 animate-flicker',
    recovery: 'text-blue-400 border-blue-400/30 bg-blue-400/5'
  };

  const StatusIcon = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    failure: XCircle,
    recovery: RefreshCw
  }[status];

  return (
    <div className={cn(
      "relative p-6 glass-panel flex flex-col items-center justify-center gap-4 transition-all duration-500",
      statusColors[status]
    )}>
      <div className="absolute top-2 right-2">
        <StatusIcon className={cn("w-4 h-4", status === 'recovery' && "animate-spin")} />
      </div>
      
      <div className="p-4 rounded-full bg-white/5">
        <Icon className="w-12 h-12" />
      </div>
      
      <div className="text-center">
        <h3 className="font-bold text-lg uppercase tracking-widest">{label}</h3>
        <p className="text-xs opacity-60 mt-1 capitalize">{status}</p>
      </div>

      {status === 'recovery' && (
        <div className="absolute inset-0 border-2 border-blue-400/50 rounded-xl animate-ping opacity-20" />
      )}
    </div>
  );
}
