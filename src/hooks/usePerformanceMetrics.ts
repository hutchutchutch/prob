import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  fps: {
    current: number;
    average: number;
    min: number;
    max: number;
    history: number[];
  };
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    percentUsed: number;
    history: number[];
  };
  react: {
    renderCount: number;
    renderDuration: number;
    componentCount: number;
    updateFrequency: number;
  };
  canvas: {
    nodeCount: number;
    edgeCount: number;
    viewportNodes: number;
    culledNodes: number;
  };
  network: {
    activeRequests: number;
    completedRequests: number;
    failedRequests: number;
    averageLatency: number;
    requestQueue: NetworkRequest[];
  };
  animations: {
    activeAnimations: number;
    frameTime: number;
    droppedFrames: number;
  };
}

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  status?: number;
  size?: number;
}

interface PerformanceSession {
  id: string;
  startTime: number;
  endTime?: number;
  metrics: PerformanceMetrics[];
  events: PerformanceEvent[];
}

interface PerformanceEvent {
  timestamp: number;
  type: 'bottleneck' | 'memory-leak' | 'slow-render' | 'network-spike';
  severity: 'low' | 'medium' | 'high';
  details: string;
}

const HISTORY_SIZE = 60; // Keep last 60 data points
const SAMPLE_RATE = 1000; // Sample every second

export const usePerformanceMetrics = (enabled: boolean = false) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: {
      current: 60,
      average: 60,
      min: 60,
      max: 60,
      history: [],
    },
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      percentUsed: 0,
      history: [],
    },
    react: {
      renderCount: 0,
      renderDuration: 0,
      componentCount: 0,
      updateFrequency: 0,
    },
    canvas: {
      nodeCount: 0,
      edgeCount: 0,
      viewportNodes: 0,
      culledNodes: 0,
    },
    network: {
      activeRequests: 0,
      completedRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      requestQueue: [],
    },
    animations: {
      activeAnimations: 0,
      frameTime: 0,
      droppedFrames: 0,
    },
  });

  const [session, setSession] = useState<PerformanceSession | null>(null);
  const [events, setEvents] = useState<PerformanceEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const renderCountRef = useRef(0);
  const networkRequestsRef = useRef<Map<string, NetworkRequest>>(new Map());
  const animationFrameRef = useRef<number>();
  const observerRef = useRef<PerformanceObserver>();

  // FPS calculation
  const calculateFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;
    
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      frameCountRef.current = 0;
      lastFrameTimeRef.current = currentTime;
      
      return fps;
    }
    
    frameCountRef.current++;
    return metrics.fps.current;
  }, [metrics.fps.current]);

  // Memory monitoring
  const getMemoryInfo = useCallback(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      return {
        usedJSHeapSize: memoryInfo.usedJSHeapSize,
        totalJSHeapSize: memoryInfo.totalJSHeapSize,
        jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
        percentUsed: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  }, []);

  // Network monitoring
  const setupNetworkMonitoring = useCallback(() => {
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      const startTime = performance.now();
      
      const request: NetworkRequest = {
        id: requestId,
        url: args[0].toString(),
        method: args[1]?.method || 'GET',
        startTime,
      };
      
      networkRequestsRef.current.set(requestId, request);
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        request.endTime = endTime;
        request.status = response.status;
        
        return response;
      } catch (error) {
        request.endTime = performance.now();
        request.status = 0;
        throw error;
      }
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Performance Observer for React
  const setupPerformanceObserver = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.startsWith('⚛️')) {
            renderCountRef.current++;
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
      observerRef.current = observer;
    }
  }, []);

  // Detect performance bottlenecks
  const detectBottlenecks = useCallback(() => {
    const currentMetrics = metrics;
    const newEvents: PerformanceEvent[] = [];

    // FPS drop detection
    if (currentMetrics.fps.current < 30) {
      newEvents.push({
        timestamp: Date.now(),
        type: 'bottleneck',
        severity: currentMetrics.fps.current < 20 ? 'high' : 'medium',
        details: `FPS dropped to ${currentMetrics.fps.current}`,
      });
    }

    // Memory leak detection
    if (currentMetrics.memory.percentUsed > 90) {
      newEvents.push({
        timestamp: Date.now(),
        type: 'memory-leak',
        severity: 'high',
        details: `Memory usage at ${currentMetrics.memory.percentUsed.toFixed(1)}%`,
      });
    }

    // Slow render detection
    if (currentMetrics.react.renderDuration > 16) {
      newEvents.push({
        timestamp: Date.now(),
        type: 'slow-render',
        severity: currentMetrics.react.renderDuration > 50 ? 'high' : 'medium',
        details: `Render took ${currentMetrics.react.renderDuration.toFixed(2)}ms`,
      });
    }

    // Network spike detection
    if (currentMetrics.network.activeRequests > 10) {
      newEvents.push({
        timestamp: Date.now(),
        type: 'network-spike',
        severity: 'medium',
        details: `${currentMetrics.network.activeRequests} concurrent requests`,
      });
    }

    if (newEvents.length > 0) {
      setEvents(prev => [...prev, ...newEvents]);
    }
  }, [metrics]);

  // Main update loop
  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const fps = calculateFPS();
    const memoryInfo = getMemoryInfo();
    
    // Get network stats
    const activeRequests = Array.from(networkRequestsRef.current.values())
      .filter(req => !req.endTime).length;
    const completedRequests = Array.from(networkRequestsRef.current.values())
      .filter(req => req.endTime && req.status && req.status >= 200 && req.status < 300).length;
    const failedRequests = Array.from(networkRequestsRef.current.values())
      .filter(req => req.endTime && (!req.status || req.status >= 400)).length;
    
    // Calculate average latency
    const completedWithLatency = Array.from(networkRequestsRef.current.values())
      .filter(req => req.endTime)
      .map(req => req.endTime! - req.startTime);
    const averageLatency = completedWithLatency.length > 0
      ? completedWithLatency.reduce((a, b) => a + b, 0) / completedWithLatency.length
      : 0;

    setMetrics(prev => ({
      fps: {
        current: fps,
        average: prev.fps.history.length > 0
          ? (prev.fps.history.reduce((a, b) => a + b, 0) + fps) / (prev.fps.history.length + 1)
          : fps,
        min: Math.min(prev.fps.min, fps),
        max: Math.max(prev.fps.max, fps),
        history: [...prev.fps.history.slice(-HISTORY_SIZE + 1), fps],
      },
      memory: memoryInfo ? {
        ...memoryInfo,
        history: [...prev.memory.history.slice(-HISTORY_SIZE + 1), memoryInfo.percentUsed],
      } : prev.memory,
      react: {
        ...prev.react,
        renderCount: renderCountRef.current,
        updateFrequency: renderCountRef.current / (performance.now() / 1000),
      },
      canvas: prev.canvas, // Updated externally
      network: {
        activeRequests,
        completedRequests,
        failedRequests,
        averageLatency,
        requestQueue: Array.from(networkRequestsRef.current.values()).slice(-10),
      },
      animations: prev.animations, // Updated externally
    }));

    // Detect bottlenecks
    detectBottlenecks();

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  }, [enabled, calculateFPS, getMemoryInfo, detectBottlenecks]);

  // Canvas metrics update
  const updateCanvasMetrics = useCallback((canvasData: Partial<PerformanceMetrics['canvas']>) => {
    setMetrics(prev => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        ...canvasData,
      },
    }));
  }, []);

  // Animation metrics update
  const updateAnimationMetrics = useCallback((animationData: Partial<PerformanceMetrics['animations']>) => {
    setMetrics(prev => ({
      ...prev,
      animations: {
        ...prev.animations,
        ...animationData,
      },
    }));
  }, []);

  // Recording controls
  const startRecording = useCallback(() => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    setSession({
      id: sessionId,
      startTime: Date.now(),
      metrics: [],
      events: [],
    });
    setIsRecording(true);
    setEvents([]);
  }, []);

  const stopRecording = useCallback(() => {
    if (session) {
      setSession(prev => prev ? {
        ...prev,
        endTime: Date.now(),
        events,
      } : null);
    }
    setIsRecording(false);
  }, [session, events]);

  const exportSession = useCallback(() => {
    if (session) {
      const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-session-${session.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [session]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    networkRequestsRef.current.clear();
    renderCountRef.current = 0;
    setEvents([]);
    setMetrics(prev => ({
      ...prev,
      fps: {
        current: 60,
        average: 60,
        min: 60,
        max: 60,
        history: [],
      },
      memory: {
        ...prev.memory,
        history: [],
      },
      network: {
        activeRequests: 0,
        completedRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        requestQueue: [],
      },
    }));
  }, []);

  // Setup and cleanup
  useEffect(() => {
    if (enabled) {
      const cleanupNetwork = setupNetworkMonitoring();
      setupPerformanceObserver();
      animationFrameRef.current = requestAnimationFrame(updateMetrics);

      return () => {
        cleanupNetwork();
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [enabled, setupNetworkMonitoring, setupPerformanceObserver, updateMetrics]);

  // Record metrics periodically when recording
  useEffect(() => {
    if (isRecording && session) {
      const interval = setInterval(() => {
        setSession(prev => prev ? {
          ...prev,
          metrics: [...prev.metrics, metrics],
        } : null);
      }, SAMPLE_RATE);

      return () => clearInterval(interval);
    }
  }, [isRecording, session, metrics]);

  return {
    metrics,
    events,
    isRecording,
    session,
    updateCanvasMetrics,
    updateAnimationMetrics,
    startRecording,
    stopRecording,
    exportSession,
    clearMetrics,
  };
};