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
  onToggleLock?: () => void;
  onToggleSelect?: () => void;
}

export const SolutionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as SolutionNodeData;
  const { isLocked = false, isSelected = false, onToggleLock, onToggleSelect } = nodeData;

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