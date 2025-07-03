import React, { useEffect, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';
import { useCanvasStore } from '@/stores/canvasStore';

// Pain Point Node
export interface PainPointNodeData {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impactArea: string;
  isLocked?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
}

export const PainPointNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const nodeData = data as unknown as PainPointNodeData;
  const { isLocked = false, isSkeleton = false, onToggleLock } = nodeData;
  const { updateNode } = useCanvasStore();
  const [floatOffset, setFloatOffset] = useState({ x: 0, y: 0 });

  // Create ethereal floating effect for skeleton nodes
  useEffect(() => {
    if (!isSkeleton) return;

    // Random parameters for each node to create variety
    const baseAmplitude = 15 + Math.random() * 10; // 15-25 pixels
    const xSpeed = 0.0003 + Math.random() * 0.0002; // Vary the speed
    const ySpeed = 0.0004 + Math.random() * 0.0002;
    const phaseOffset = Math.random() * Math.PI * 2; // Random starting phase

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Create smooth sinusoidal movement
      const xOffset = Math.sin(elapsed * xSpeed + phaseOffset) * baseAmplitude;
      const yOffset = Math.sin(elapsed * ySpeed + phaseOffset + Math.PI/3) * baseAmplitude * 0.7;

      setFloatOffset({ x: xOffset, y: yOffset });
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isSkeleton]);

  const severityStyles = {
    critical: 'text-red-400 bg-red-900/30 border-red-500/30',
    high: 'text-orange-400 bg-orange-900/30 border-orange-500/30',
    medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30',
    low: 'text-gray-400 bg-gray-800/30 border-gray-500/30',
  };

  // Skeleton state with ethereal floating
  if (isSkeleton) {
    return (
      <div 
        style={{
          transform: `translate(${floatOffset.x}px, ${floatOffset.y}px)`,
          transition: 'none', // Disable transitions for smooth animation
        }}
      >
        <BaseNode
          variant="pain"
          selected={selected}
          showSourceHandle={false}
          showTargetHandle={true}
          className={cn(
            "w-[320px] max-w-[320px]",
            "opacity-70",
            "ethereal-glow", // Add ethereal glow animation
            "transition-opacity duration-1000"
          )}
        >
          <div className="space-y-6">
            {/* Skeleton Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="h-6 rounded skeleton-shimmer w-20"></div>
              <div className="w-4 h-4 rounded skeleton-shimmer"></div>
            </div>

            {/* Skeleton Description */}
            <div className="space-y-5">
              <div className="py-1">
                <div className="h-4 rounded skeleton-shimmer w-full"></div>
              </div>
              <div className="py-1">
                <div className="h-4 rounded skeleton-shimmer w-3/4"></div>
              </div>
            </div>

            {/* Skeleton Impact */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-4 rounded skeleton-shimmer w-24"></div>
            </div>
          </div>
        </BaseNode>
      </div>
    );
  }

  return (
    <BaseNode
      variant="pain"
      selected={selected}
      showSourceHandle={!!nodeData.description}
      showTargetHandle={true}
      className="w-[320px] max-w-[320px]"
    >
      <div className="space-y-3">
        {/* Header with Severity and Lock */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded border capitalize',
                severityStyles[nodeData.severity]
              )}
            >
              {nodeData.severity}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-amber-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <p className="text-base leading-relaxed break-words">"{nodeData.description}"</p>
        </div>

        {/* Impact Area */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">Impact Area</span>
            <span className="opacity-90">{nodeData.impactArea}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default PainPointNode; 