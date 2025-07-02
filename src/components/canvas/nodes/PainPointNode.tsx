import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';

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

export const PainPointNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PainPointNodeData;
  const { isLocked = false, isSkeleton = false, onToggleLock } = nodeData;

  const severityStyles = {
    critical: 'bg-error-600',
    high: 'bg-orange-600',
    medium: 'bg-warning-600',
    low: 'bg-gray-600',
  };

  // Skeleton state
  if (isSkeleton) {
    return (
      <BaseNode
        variant="pain"
        selected={selected}
        showSourceHandle={false}
        showTargetHandle={true}
        className="min-w-[280px] opacity-60"
      >
        <div className="space-y-3">
          {/* Skeleton Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="h-6 bg-gray-600 rounded skeleton-shimmer w-20"></div>
            <div className="w-4 h-4 bg-gray-600 rounded skeleton-shimmer"></div>
          </div>

          {/* Skeleton Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-full"></div>
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-3/4"></div>
          </div>

          {/* Skeleton Impact */}
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-12"></div>
            <div className="h-4 bg-gray-600 rounded skeleton-shimmer w-24"></div>
          </div>
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode
      variant="pain"
      selected={selected}
      className="min-w-[280px]"
    >
      <div className="space-y-3">
        {/* Header with Severity and Lock */}
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full capitalize',
              severityStyles[nodeData.severity]
            )}
          >
            {nodeData.severity}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-orange-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed">"{nodeData.description}"</p>

        {/* Impact Area */}
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span>Impact:</span>
          <span className="font-medium">{nodeData.impactArea}</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default PainPointNode; 