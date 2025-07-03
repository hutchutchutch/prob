import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';

// Solution Node
export interface SolutionNodeData {
  id: string;
  title: string;
  description: string;
  solutionType: 'feature' | 'integration' | 'automation' | 'analytics';
  complexity: 'low' | 'medium' | 'high';
  isLocked?: boolean;
  isSelected?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
  onToggleSelect?: () => void;
}

export const SolutionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as SolutionNodeData;
  const { isLocked = false, isSelected = false, isSkeleton = false, onToggleLock, onToggleSelect } = nodeData;

  const typeIcons = {
    feature: '⚡',
    integration: '🔗',
    automation: '🤖',
    analytics: '📊',
  };

  const complexityColors = {
    low: 'text-success-400',
    medium: 'text-warning-400',
    high: 'text-error-400',
  };

  // Skeleton state
  if (isSkeleton) {
    return (
      <BaseNode
        variant="solution"
        selected={selected}
        showSourceHandle={false}
        showTargetHandle={true}
        className={cn(
          "min-w-[320px] max-w-[380px]",
          "shadow-lg shadow-gold-500/20", // Gold glow for solution nodes
          "transition-shadow duration-1000"
        )}
      >
        <div className="space-y-6">
          {/* Skeleton Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded skeleton-shimmer"></div>
              <div className="h-6 rounded skeleton-shimmer w-40"></div>
            </div>
            <div className="w-4 h-4 rounded skeleton-shimmer"></div>
          </div>

          {/* Skeleton Description */}
          <div className="space-y-5">
            <div className="py-1">
              <div className="h-4 rounded skeleton-shimmer w-full"></div>
            </div>
            <div className="py-1">
              <div className="h-4 rounded skeleton-shimmer w-4/5"></div>
            </div>
          </div>

          {/* Skeleton Tags */}
          <div className="flex items-center gap-3">
            <div className="h-6 rounded-full skeleton-shimmer w-24"></div>
            <div className="h-4 rounded skeleton-shimmer w-28"></div>
          </div>
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode
      variant="solution"
      selected={selected}
      showSourceHandle={false}
      className="min-w-[320px] max-w-[380px]"
    >
      <div className="space-y-3">
        {/* Header with Selection and Lock */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className="mt-0.5 hover:scale-110 transition-transform"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5 opacity-60" />
              )}
            </button>
            <h3 className="text-lg font-bold">{nodeData.title}</h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className="p-1 hover:bg-blue-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Description */}
        <p className="text-sm opacity-90 leading-relaxed line-clamp-2">
          {nodeData.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-900/30 rounded-full">
            <span>{typeIcons[nodeData.solutionType]}</span>
            <span className="capitalize">{nodeData.solutionType}</span>
          </div>
          <div className={cn('font-medium', complexityColors[nodeData.complexity])}>
            {nodeData.complexity} complexity
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default SolutionNode; 