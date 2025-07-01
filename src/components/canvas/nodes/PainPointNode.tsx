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
  onToggleLock?: () => void;
}

export const PainPointNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PainPointNodeData;
  const { isLocked = false, onToggleLock } = nodeData;

  const severityStyles = {
    critical: 'bg-error-600',
    high: 'bg-orange-600',
    medium: 'bg-warning-600',
    low: 'bg-gray-600',
  };

  return (
    <BaseNode
      variant="pain"
      selected={selected}
      className="min-w-[300px] max-w-[350px]"
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