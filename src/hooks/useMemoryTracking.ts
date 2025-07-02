import { useState, useEffect, useCallback, useRef } from 'react';

interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  percentUsed: number;
  delta: number;
}

interface MemoryLeakDetection {
  isLeaking: boolean;
  growthRate: number; // MB per minute
  confidence: number; // 0-1
  timeDetected?: number;
}

interface UseMemoryTrackingOptions {
  sampleInterval?: number; // ms
  historySize?: number;
  leakThreshold?: number; // MB per minute
  onMemoryLeak?: (detection: MemoryLeakDetection) => void;
  onMemoryWarning?: (percentUsed: number) => void;
}

export const useMemoryTracking = (
  enabled: boolean = false,
  options: UseMemoryTrackingOptions = {}
) => {
  const {
    sampleInterval = 5000, // 5 seconds
    historySize = 120, // 10 minutes of data at 5s intervals
    leakThreshold = 10, // 10 MB per minute
    onMemoryLeak,
    onMemoryWarning,
  } = options;

  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [currentMemory, setCurrentMemory] = useState<MemorySnapshot | null>(null);
  const [leakDetection, setLeakDetection] = useState<MemoryLeakDetection>({
    isLeaking: false,
    growthRate: 0,
    confidence: 0,
  });

  const lastSnapshotRef = useRef<MemorySnapshot | null>(null);
  const warningTriggeredRef = useRef<Set<number>>(new Set());

  // Check if performance.memory is available
  const isMemoryAPIAvailable = useCallback(() => {
    return 'memory' in performance;
  }, []);

  // Take memory snapshot
  const takeSnapshot = useCallback((): MemorySnapshot | null => {
    if (!isMemoryAPIAvailable()) return null;

    const memoryInfo = (performance as any).memory;
    const timestamp = Date.now();
    
    const snapshot: MemorySnapshot = {
      timestamp,
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
      jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      percentUsed: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100,
      delta: 0,
    };

    // Calculate delta from last snapshot
    if (lastSnapshotRef.current) {
      snapshot.delta = snapshot.usedJSHeapSize - lastSnapshotRef.current.usedJSHeapSize;
    }

    lastSnapshotRef.current = snapshot;
    return snapshot;
  }, [isMemoryAPIAvailable]);

  // Analyze memory trend for leak detection
  const analyzeMemoryTrend = useCallback((history: MemorySnapshot[]) => {
    if (history.length < 10) return null; // Need sufficient data

    // Get recent snapshots (last 2 minutes)
    const recentSnapshots = history.slice(-24); // 24 * 5s = 2 minutes
    if (recentSnapshots.length < 2) return null;

    // Calculate linear regression
    const n = recentSnapshots.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    recentSnapshots.forEach((snapshot, i) => {
      const x = i;
      const y = snapshot.usedJSHeapSize / (1024 * 1024); // Convert to MB
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    // Calculate slope (growth rate in MB per sample)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Convert to MB per minute
    const growthRatePerMinute = slope * (60000 / sampleInterval);
    
    // Calculate R-squared for confidence
    const meanY = sumY / n;
    let ssTotal = 0, ssResidual = 0;
    
    recentSnapshots.forEach((snapshot, i) => {
      const y = snapshot.usedJSHeapSize / (1024 * 1024);
      const yPredicted = (slope * i) + (sumY - slope * sumX) / n;
      ssTotal += Math.pow(y - meanY, 2);
      ssResidual += Math.pow(y - yPredicted, 2);
    });
    
    const rSquared = 1 - (ssResidual / ssTotal);
    const confidence = Math.max(0, Math.min(1, rSquared));

    return {
      growthRate: growthRatePerMinute,
      confidence,
      isLeaking: growthRatePerMinute > leakThreshold && confidence > 0.7,
    };
  }, [sampleInterval, leakThreshold]);

  // Check memory warnings
  const checkMemoryWarnings = useCallback((snapshot: MemorySnapshot) => {
    const warningThresholds = [50, 75, 90]; // Percentage thresholds
    
    warningThresholds.forEach(threshold => {
      if (snapshot.percentUsed >= threshold && !warningTriggeredRef.current.has(threshold)) {
        warningTriggeredRef.current.add(threshold);
        onMemoryWarning?.(snapshot.percentUsed);
      } else if (snapshot.percentUsed < threshold && warningTriggeredRef.current.has(threshold)) {
        warningTriggeredRef.current.delete(threshold);
      }
    });
  }, [onMemoryWarning]);

  // Get memory statistics
  const getMemoryStats = useCallback(() => {
    if (snapshots.length === 0) return null;

    const usedSizes = snapshots.map(s => s.usedJSHeapSize);
    const percentages = snapshots.map(s => s.percentUsed);

    return {
      current: currentMemory,
      average: {
        usedSize: usedSizes.reduce((a, b) => a + b, 0) / usedSizes.length,
        percentUsed: percentages.reduce((a, b) => a + b, 0) / percentages.length,
      },
      peak: {
        usedSize: Math.max(...usedSizes),
        percentUsed: Math.max(...percentages),
        timestamp: snapshots[usedSizes.indexOf(Math.max(...usedSizes))].timestamp,
      },
      growth: {
        total: snapshots.length > 1 
          ? snapshots[snapshots.length - 1].usedJSHeapSize - snapshots[0].usedJSHeapSize
          : 0,
        rate: leakDetection.growthRate,
      },
    };
  }, [snapshots, currentMemory, leakDetection]);

  // Force garbage collection (Chrome DevTools only)
  const forceGC = useCallback(() => {
    if ('gc' in window) {
      (window as any).gc();
      // Take a snapshot after GC
      setTimeout(() => {
        const snapshot = takeSnapshot();
        if (snapshot) {
          setCurrentMemory(snapshot);
        }
      }, 100);
    } else {
      console.warn('Garbage collection is not exposed. Run Chrome with --js-flags="--expose-gc"');
    }
  }, [takeSnapshot]);

  // Export memory data
  const exportMemoryData = useCallback(() => {
    const data = {
      snapshots,
      stats: getMemoryStats(),
      leakDetection,
      metadata: {
        sampleInterval,
        duration: snapshots.length > 0 
          ? snapshots[snapshots.length - 1].timestamp - snapshots[0].timestamp
          : 0,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [snapshots, getMemoryStats, leakDetection, sampleInterval]);

  // Clear history
  const clearHistory = useCallback(() => {
    setSnapshots([]);
    lastSnapshotRef.current = null;
    warningTriggeredRef.current.clear();
    setLeakDetection({
      isLeaking: false,
      growthRate: 0,
      confidence: 0,
    });
  }, []);

  // Main sampling loop
  useEffect(() => {
    if (!enabled || !isMemoryAPIAvailable()) return;

    const interval = setInterval(() => {
      const snapshot = takeSnapshot();
      if (!snapshot) return;

      setCurrentMemory(snapshot);
      setSnapshots(prev => {
        const updated = [...prev, snapshot].slice(-historySize);
        
        // Analyze for memory leaks
        const trend = analyzeMemoryTrend(updated);
        if (trend) {
          const detection: MemoryLeakDetection = {
            ...trend,
            timeDetected: trend.isLeaking && !leakDetection.isLeaking 
              ? Date.now() 
              : leakDetection.timeDetected,
          };
          
          setLeakDetection(detection);
          
          if (detection.isLeaking && !leakDetection.isLeaking) {
            onMemoryLeak?.(detection);
          }
        }
        
        return updated;
      });

      // Check warnings
      checkMemoryWarnings(snapshot);
    }, sampleInterval);

    return () => clearInterval(interval);
  }, [
    enabled,
    isMemoryAPIAvailable,
    takeSnapshot,
    historySize,
    analyzeMemoryTrend,
    checkMemoryWarnings,
    sampleInterval,
    leakDetection.isLeaking,
    onMemoryLeak,
  ]);

  return {
    currentMemory,
    snapshots,
    leakDetection,
    stats: getMemoryStats(),
    isAvailable: isMemoryAPIAvailable(),
    forceGC,
    exportMemoryData,
    clearHistory,
  };
};