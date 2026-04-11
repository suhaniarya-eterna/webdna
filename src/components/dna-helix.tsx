
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export function DNAHelix({ scale = 1, opacity = 1, className }: { scale?: number, opacity?: number, className?: string }) {
  const dots = Array.from({ length: 20 });

  return (
    <div 
      className={cn("dna-container flex flex-col items-center justify-center transition-all duration-1000", className)}
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <div className="dna-strand animate-dna-twist-slow">
        {dots.map((_, i) => (
          <React.Fragment key={i}>
            <div 
              className="dna-dot bg-[#BFA181] glow-pulse" 
              style={{ 
                top: `${i * 20}px`, 
                transform: `rotateY(${i * 25}deg) translateZ(40px)`,
                animationDelay: `${i * 0.1}s`
              }} 
            />
            <div 
              className="dna-dot bg-[#FDFCFB]" 
              style={{ 
                top: `${i * 20}px`, 
                transform: `rotateY(${i * 25 + 180}deg) translateZ(40px)`,
                animationDelay: `${i * 0.1 + 1}s`
              }} 
            />
            <div 
              className="absolute h-[1px] bg-white/5" 
              style={{ 
                top: `${i * 20 + 6}px`, 
                width: '80px',
                left: '10px',
                transform: `rotateY(${i * 25}deg)` 
              }} 
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
