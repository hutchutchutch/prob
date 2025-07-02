import React, { useRef, useEffect } from 'react';
import { HardDrive, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MemoryGraphProps {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    percentUsed: number;
    history: number[];
  };
  leakDetection?: {
    isLeaking: boolean;
    growthRate: number;
    confidence: number;
  };
  showGraph?: boolean;
  className?: string;
}

export const MemoryGraph: React.FC<MemoryGraphProps> = ({
  memory,
  leakDetection,
  showGraph = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get memory color based on usage
  const getMemoryColor = (percent: number) => {
    if (percent < 50) return '#10B981'; // Green
    if (percent < 75) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Draw memory graph
  useEffect(() => {
    if (!showGraph || !canvasRef.current || memory.history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions
    const padding = 4;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    const stepX = width / Math.max(1, memory.history.length - 1);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.1)'); // Red at top
    gradient.addColorStop(0.25, 'rgba(245, 158, 11, 0.1)'); // Yellow
    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)'); // Green
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(padding, padding, width, height);

    // Draw threshold lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);
    
    // 75% line
    const line75Y = padding + height * 0.25;
    ctx.beginPath();
    ctx.moveTo(padding, line75Y);
    ctx.lineTo(canvas.width - padding, line75Y);
    ctx.stroke();
    
    // 50% line
    const line50Y = padding + height * 0.5;
    ctx.beginPath();
    ctx.moveTo(padding, line50Y);
    ctx.lineTo(canvas.width - padding, line50Y);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw memory usage line
    ctx.beginPath();
    ctx.strokeStyle = getMemoryColor(memory.percentUsed);
    ctx.lineWidth = 2;
    
    memory.history.forEach((percent, index) => {
      const x = padding + index * stepX;
      const y = padding + height - (percent / 100) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Fill area under line
    ctx.lineTo(padding + (memory.history.length - 1) * stepX, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    
    const areaGradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    const currentColor = getMemoryColor(memory.percentUsed);
    areaGradient.addColorStop(0, currentColor + '40');
    areaGradient.addColorStop(1, currentColor + '10');
    ctx.fillStyle = areaGradient;
    ctx.fill();

    // Draw current value dot
    if (memory.history.length > 0) {
      const lastX = padding + (memory.history.length - 1) * stepX;
      const lastY = padding + height - (memory.history[memory.history.length - 1] / 100) * height;
      
      ctx.fillStyle = getMemoryColor(memory.percentUsed);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [memory, showGraph]);

  return (
    <div className={cn('bg-gray-800 rounded-lg p-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Memory</span>
          {leakDetection?.isLeaking && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-900/30 rounded">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400">Leak</span>
            </div>
          )}
        </div>
        <div className={cn(
          'text-sm font-mono font-bold',
          memory.percentUsed < 50 ? 'text-green-500' :
          memory.percentUsed < 75 ? 'text-yellow-500' :
          'text-red-500'
        )}>
          {memory.percentUsed.toFixed(1)}%
        </div>
      </div>

      {showGraph && (
        <canvas
          ref={canvasRef}
          width={180}
          height={60}
          className="w-full h-[60px] mb-2"
        />
      )}

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Used</span>
          <span className="font-mono text-gray-300">{formatBytes(memory.usedJSHeapSize)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Total</span>
          <span className="font-mono text-gray-300">{formatBytes(memory.totalJSHeapSize)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Limit</span>
          <span className="font-mono text-gray-300">{formatBytes(memory.jsHeapSizeLimit)}</span>
        </div>
        {leakDetection && leakDetection.isLeaking && (
          <div className="flex justify-between text-xs pt-1 border-t border-gray-700">
            <span className="text-red-400">Growth</span>
            <span className="font-mono text-red-400">
              +{leakDetection.growthRate.toFixed(1)} MB/min
            </span>
          </div>
        )}
      </div>
    </div>
  );
};