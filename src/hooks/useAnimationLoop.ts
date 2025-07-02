import { useEffect, useRef, useCallback } from 'react';

interface AnimationLoopOptions {
  duration: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  easing?: (t: number) => number;
  autoStart?: boolean;
  loop?: boolean;
}

export function useAnimationLoop(options: AnimationLoopOptions) {
  const {
    duration,
    onUpdate,
    onComplete,
    easing = (t) => t, // Linear by default
    autoStart = true,
    loop = false,
  } = options;
  
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    
    onUpdate?.(easedProgress);
    
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
      
      if (loop) {
        startTimeRef.current = null;
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        isRunningRef.current = false;
      }
    }
  }, [duration, onUpdate, onComplete, easing, loop]);
  
  const start = useCallback(() => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);
  
  const stop = useCallback(() => {
    isRunningRef.current = false;
    startTimeRef.current = null;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);
  
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      stop();
    };
  }, [autoStart, start, stop]);
  
  return {
    start,
    stop,
    restart,
    isRunning: isRunningRef.current,
  };
}

// Easing functions
export const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  elasticOut: (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },
  bounceOut: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};