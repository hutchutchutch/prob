import React, { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FPSCounterProps {
  fps: {
    current: number;
    average: number;
    min: number;
    max: number;
    history: number[];
  };
  targetFPS?: number;
  showGraph?: boolean;
  className?: string;
}

export const FPSCounter: React.FC<FPSCounterProps> = ({
  fps,
  targetFPS = 60,
  showGraph = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine color based on FPS
  const getFPSColor = (value: number) => {
    if (value >= targetFPS * 0.9) return '#10B981'; // Green
    if (value >= targetFPS * 0.6) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Draw FPS graph
  useEffect(() => {
    if (!showGraph || !canvasRef.current || fps.history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions
    const padding = 4;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    const stepX = width / (fps.history.length - 1);
    
    // Draw background grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);

    // Draw target line
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    const targetY = padding + height - (targetFPS / 120) * height;
    ctx.beginPath();
    ctx.moveTo(padding, targetY);
    ctx.lineTo(canvas.width - padding, targetY);
    ctx.stroke();

    // Draw FPS line
    ctx.strokeStyle = getFPSColor(fps.current);
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    fps.history.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = padding + height - (value / 120) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw current value dot
    if (fps.history.length > 0) {
      const lastX = padding + (fps.history.length - 1) * stepX;
      const lastY = padding + height - (fps.history[fps.history.length - 1] / 120) * height;
      
      ctx.fillStyle = getFPSColor(fps.current);
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [fps, targetFPS, showGraph]);

  return (
    <div className={cn('bg-gray-800 rounded-lg p-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">FPS</span>
        </div>
        <div className={cn(
          'text-lg font-mono font-bold',
          fps.current >= targetFPS * 0.9 ? 'text-green-500' :
          fps.current >= targetFPS * 0.6 ? 'text-yellow-500' :
          'text-red-500'
        )}>
          {Math.round(fps.current)}
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

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-gray-500">Avg</div>
          <div className="font-mono text-gray-300">{Math.round(fps.average)}</div>
        </div>
        <div>
          <div className="text-gray-500">Min</div>
          <div className="font-mono text-gray-300">{Math.round(fps.min)}</div>
        </div>
        <div>
          <div className="text-gray-500">Max</div>
          <div className="font-mono text-gray-300">{Math.round(fps.max)}</div>
        </div>
      </div>
    </div>
  );
};