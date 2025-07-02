import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Trash2, 
  Play, 
  Pause,
  Minimize2,
  Maximize2,
  Activity
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { FPSCounter } from './FPSCounter';
import { MemoryGraph } from './MemoryGraph';
import { RenderMetrics } from './RenderMetrics';
import { NetworkMonitor } from './NetworkMonitor';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { useFPSMonitor } from '@/hooks/useFPSMonitor';
import { useMemoryTracking } from '@/hooks/useMemoryTracking';

interface PerformanceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    fps: true,
    memory: true,
    render: true,
    network: false,
  });

  const {
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
  } = usePerformanceMetrics(isOpen);

  const { getFPS } = useFPSMonitor(isOpen, {
    onFPSDrop: (fps) => {
      console.warn(`FPS dropped to ${fps}`);
    },
  });

  const { 
    currentMemory,
    leakDetection,
    stats,
    isAvailable: isMemoryAvailable,
    forceGC,
  } = useMemoryTracking(isOpen, {
    onMemoryLeak: (detection) => {
      console.warn('Memory leak detected:', detection);
    },
    onMemoryWarning: (percent) => {
      console.warn(`Memory usage at ${percent.toFixed(1)}%`);
    },
  });

  // Update canvas metrics from external source
  const handleCanvasUpdate = useCallback((data: {
    nodeCount: number;
    edgeCount: number;
    viewportNodes: number;
  }) => {
    updateCanvasMetrics({
      ...data,
      culledNodes: data.nodeCount - data.viewportNodes,
    });
  }, [updateCanvasMetrics]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Minimize/maximize with M
      if (e.key === 'm' && !e.metaKey && !e.ctrlKey) {
        setIsMinimized(prev => !prev);
      }

      // Clear metrics with C
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        clearMetrics();
      }

      // Toggle recording with R
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording, clearMetrics, startRecording, stopRecording]);

  if (!isOpen) return null;

  // Expose update function to global scope for easy integration
  useEffect(() => {
    if (isOpen) {
      (window as any).__updatePerformanceMetrics = {
        canvas: handleCanvasUpdate,
        animations: updateAnimationMetrics,
      };
    }
    return () => {
      delete (window as any).__updatePerformanceMetrics;
    };
  }, [isOpen, handleCanvasUpdate, updateAnimationMetrics]);

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl',
        'transition-all duration-300',
        isMinimized ? 'w-[200px]' : 'w-[400px]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Performance Monitor</span>
          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-900/30 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400">REC</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-gray-400" />
            ) : (
              <Minimize2 className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            title="Close (Cmd+Shift+P)"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Minimized View */}
      {isMinimized && (
        <div className="p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">FPS</span>
            <span className={cn(
              'text-lg font-mono font-bold',
              metrics.fps.current >= 50 ? 'text-green-500' :
              metrics.fps.current >= 30 ? 'text-yellow-500' :
              'text-red-500'
            )}>
              {Math.round(metrics.fps.current)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Memory</span>
            <span className={cn(
              'text-sm font-mono',
              metrics.memory.percentUsed < 50 ? 'text-green-500' :
              metrics.memory.percentUsed < 75 ? 'text-yellow-500' :
              'text-red-500'
            )}>
              {metrics.memory.percentUsed.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Nodes</span>
            <span className="text-sm font-mono text-gray-300">
              {metrics.canvas.viewportNodes}/{metrics.canvas.nodeCount}
            </span>
          </div>
        </div>
      )}

      {/* Full View */}
      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                  isRecording 
                    ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                )}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-3 h-3" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Record
                  </>
                )}
              </button>
              {session && !isRecording && (
                <button
                  onClick={exportSession}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              )}
              <button
                onClick={clearMetrics}
                className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                title="Clear metrics (C)"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
            {isMemoryAvailable && (
              <button
                onClick={forceGC}
                className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors"
                title="Force garbage collection (requires --expose-gc flag)"
              >
                Force GC
              </button>
            )}
          </div>

          {/* Metrics Sections */}
          <div className="max-h-[600px] overflow-y-auto">
            {/* FPS Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleSection('fps')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-300">Frame Rate</span>
                {expandedSections.fps ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.fps && (
                <div className="px-3 pb-3">
                  <FPSCounter fps={metrics.fps} />
                </div>
              )}
            </div>

            {/* Memory Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleSection('memory')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-300">Memory Usage</span>
                {expandedSections.memory ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.memory && (
                <div className="px-3 pb-3">
                  <MemoryGraph 
                    memory={metrics.memory}
                    leakDetection={leakDetection}
                  />
                </div>
              )}
            </div>

            {/* Render Metrics Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleSection('render')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-300">Render Performance</span>
                {expandedSections.render ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.render && (
                <div className="px-3 pb-3">
                  <RenderMetrics
                    react={metrics.react}
                    canvas={metrics.canvas}
                    animations={metrics.animations}
                  />
                </div>
              )}
            </div>

            {/* Network Section */}
            <div className="border-b border-gray-700">
              <button
                onClick={() => toggleSection('network')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-300">Network Activity</span>
                {expandedSections.network ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.network && (
                <div className="px-3 pb-3">
                  <NetworkMonitor network={metrics.network} />
                </div>
              )}
            </div>

            {/* Performance Events */}
            {events.length > 0 && (
              <div className="p-3">
                <div className="text-sm font-medium text-gray-300 mb-2">Performance Events</div>
                <div className="space-y-1 max-h-[100px] overflow-y-auto">
                  {events.slice(-5).reverse().map((event, index) => (
                    <div
                      key={`${event.timestamp}-${index}`}
                      className={cn(
                        'text-xs p-2 rounded',
                        event.severity === 'high' ? 'bg-red-900/30 text-red-400' :
                        event.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-blue-900/30 text-blue-400'
                      )}
                    >
                      <div className="flex justify-between">
                        <span>{event.details}</span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-700 text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-800 rounded">Cmd+Shift+P</kbd> to toggle
          </div>
        </>
      )}
    </div>
  );
};