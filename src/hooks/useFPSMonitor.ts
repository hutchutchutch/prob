import { useEffect, useRef, useCallback } from 'react';

interface FPSMonitorOptions {
  targetFPS?: number;
  sampleSize?: number;
  onFPSDrop?: (fps: number) => void;
  onFPSRecover?: (fps: number) => void;
}

export const useFPSMonitor = (
  enabled: boolean = false,
  options: FPSMonitorOptions = {}
) => {
  const {
    targetFPS = 60,
    sampleSize = 30,
    onFPSDrop,
    onFPSRecover,
  } = options;

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const fpsRef = useRef<number>(targetFPS);
  const wasDroppedRef = useRef<boolean>(false);

  const calculateFPS = useCallback(() => {
    const frameTimes = frameTimesRef.current;
    if (frameTimes.length < 2) return targetFPS;

    // Calculate average frame time
    let totalDelta = 0;
    for (let i = 1; i < frameTimes.length; i++) {
      totalDelta += frameTimes[i] - frameTimes[i - 1];
    }
    const averageDelta = totalDelta / (frameTimes.length - 1);
    
    // Convert to FPS
    return 1000 / averageDelta;
  }, [targetFPS]);

  const measureFrame = useCallback((timestamp: number) => {
    if (!enabled) return;

    // Initialize on first frame
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(measureFrame);
      return;
    }

    // Add timestamp to buffer
    frameTimesRef.current.push(timestamp);
    
    // Keep only recent samples
    if (frameTimesRef.current.length > sampleSize) {
      frameTimesRef.current.shift();
    }

    // Calculate FPS
    const currentFPS = calculateFPS();
    fpsRef.current = currentFPS;

    // Detect FPS drops and recoveries
    const isDropped = currentFPS < targetFPS * 0.8; // 80% of target
    
    if (isDropped && !wasDroppedRef.current) {
      wasDroppedRef.current = true;
      onFPSDrop?.(currentFPS);
    } else if (!isDropped && wasDroppedRef.current) {
      wasDroppedRef.current = false;
      onFPSRecover?.(currentFPS);
    }

    lastFrameTimeRef.current = timestamp;
    animationFrameRef.current = requestAnimationFrame(measureFrame);
  }, [enabled, sampleSize, calculateFPS, targetFPS, onFPSDrop, onFPSRecover]);

  // Get current FPS
  const getFPS = useCallback(() => {
    return Math.round(fpsRef.current);
  }, []);

  // Get frame time statistics
  const getFrameStats = useCallback(() => {
    const frameTimes = frameTimesRef.current;
    if (frameTimes.length < 2) {
      return {
        averageFrameTime: 16.67, // 60 FPS
        minFrameTime: 16.67,
        maxFrameTime: 16.67,
        variance: 0,
      };
    }

    const deltas: number[] = [];
    for (let i = 1; i < frameTimes.length; i++) {
      deltas.push(frameTimes[i] - frameTimes[i - 1]);
    }

    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const minDelta = Math.min(...deltas);
    const maxDelta = Math.max(...deltas);
    
    // Calculate variance
    const variance = deltas.reduce((acc, delta) => {
      return acc + Math.pow(delta - avgDelta, 2);
    }, 0) / deltas.length;

    return {
      averageFrameTime: avgDelta,
      minFrameTime: minDelta,
      maxFrameTime: maxDelta,
      variance: Math.sqrt(variance),
    };
  }, []);

  // Reset monitor
  const reset = useCallback(() => {
    frameTimesRef.current = [];
    lastFrameTimeRef.current = 0;
    fpsRef.current = targetFPS;
    wasDroppedRef.current = false;
  }, [targetFPS]);

  // Setup and cleanup
  useEffect(() => {
    if (enabled) {
      reset();
      animationFrameRef.current = requestAnimationFrame(measureFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, measureFrame, reset]);

  return {
    getFPS,
    getFrameStats,
    reset,
  };
};