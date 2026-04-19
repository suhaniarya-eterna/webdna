"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTransform, MotionValue, useMotionValueEvent } from 'framer-motion';

interface DNACanvasSequenceProps {
  progress: MotionValue<number>;
}

export function DNACanvasSequence({ progress }: DNACanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const lastIndexRef = useRef<number>(-1);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const fetchAndPreload = async () => {
      try {
        const response = await fetch('/api/frames');
        const data = await response.json();
        const framePaths: string[] = data.frames || [];

        if (framePaths.length === 0) {
          setIsLoaded(true);
          return;
        }

        setTotalFrames(framePaths.length);
        let loadedCount = 0;

        // Optimization: Start preloading all images in parallel
        framePaths.forEach((path, index) => {
          const img = new Image();
          img.src = path;
          
          img.onload = () => {
            loadedCount++;
            loadedImagesRef.current[index] = img;
            
            // Critical: Unlock the UI as soon as the first frame is ready
            if (index === 0 && !isLoaded) {
              setImages([...loadedImagesRef.current]);
              setIsLoaded(true);
            }

            // Batch update the internal state every 10 frames to keep the UI snappy
            // without overwhelming the React render cycle
            if (loadedCount % 10 === 0 || loadedCount === framePaths.length) {
              setImages([...loadedImagesRef.current]);
            }
          };

          img.onerror = () => {
            loadedCount++;
            // If the first frame fails, still try to unlock with whatever we have
            if (index === 0 && !isLoaded) {
              setIsLoaded(true);
            }
            if (loadedCount === framePaths.length) {
              setImages([...loadedImagesRef.current]);
            }
          };
        });
      } catch (error) {
        console.error("Failed to load genetic sequence frames:", error);
        setIsLoaded(true);
      }
    };

    fetchAndPreload();
  }, []);

  const frameIndex = useTransform(
    progress,
    [0, 0.05, 1],
    [0, 0, Math.max(0, totalFrames - 1)],
    { clamp: true }
  );

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    // Use current frame or fallback to the nearest loaded frame to prevent flickering
    let actualIndex = Math.floor(index);
    let image = images[actualIndex];

    // If the specific frame isn't loaded yet, find the closest previous loaded frame
    if (!image || !image.complete || image.naturalWidth === 0) {
      for (let i = actualIndex; i >= 0; i--) {
        if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
          image = images[i];
          break;
        }
      }
    }

    if (!image) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = image.width / image.height;
    
    let drawWidth, drawHeight, x, y;
    const padding = 0.85; 
    const targetWidth = canvasWidth * padding;
    const targetHeight = canvasHeight * padding;

    if (canvasRatio > imgRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
    }

    x = (canvasWidth - drawWidth) / 2;
    y = (canvasHeight - drawHeight) / 2;

    context.fillStyle = '#0F0B0A';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(image, x, y, drawWidth, drawHeight);
    lastIndexRef.current = actualIndex;
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const currentIndex = Math.floor(latest);
    if (currentIndex !== lastIndexRef.current && isLoaded) {
      drawFrame(currentIndex);
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
        
        if (isLoaded && images.length > 0) {
          drawFrame(frameIndex.get());
        }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images, isLoaded]);

  useEffect(() => {
    if (isLoaded && images.length > 0) {
      drawFrame(0);
    }
  }, [isLoaded, images]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0F0B0A]">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F0B0A] z-50">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/40">Synchronizing Genetic Sequence</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 0.72,
          filter: 'brightness(0.88) contrast(1.15)',
        }}
        className="mix-blend-screen"
      />
    </div>
  );
}
