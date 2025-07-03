import React, { useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';

// Persona Node
export interface PersonaNodeData {
  id: string;
  name: string;
  industry: string;
  role: string;
  painDegree: number;
  description?: string;
  isLocked?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isSkeleton = false, onToggleLock } = nodeData;
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle node click to expand/collapse
  const handleNodeClick = () => {
    if (isSkeleton) return;
    setIsExpanded(!isExpanded);
  };

  // Render fire icons for pain rating
  const renderPainRating = (painLevel: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Flame
            key={index}
            className={cn(
              'w-3 h-3',
              index < painLevel 
                ? 'text-gold-500 fill-gold-500/50' 
                : 'text-gray-500 fill-gray-600/30'
            )}
          />
        ))}
      </div>
    );
  };

  // Skeleton state
  if (isSkeleton) {
    return (
      <BaseNode
        variant="persona"
        selected={selected}
        showSourceHandle={false}
        showTargetHandle={true}
        className={cn(
          "min-w-[280px]",
          "shadow-lg shadow-teal-500/20", // Add ethereal glow with teal color
          "transition-shadow duration-1000"
        )}
      >
          <div className="space-y-6">
            {/* Skeleton Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="h-6 rounded skeleton-shimmer w-32"></div>
              <div className="w-4 h-4 rounded skeleton-shimmer"></div>
            </div>

            {/* Skeleton Details */}
            <div className="space-y-5 text-sm">
              <div className="flex items-center gap-4 py-1">
                <div className="h-4 rounded skeleton-shimmer w-24"></div>
              </div>
              <div className="flex items-center gap-4 py-1">
                <div className="h-4 rounded skeleton-shimmer w-28"></div>
              </div>
              <div className="flex items-center gap-4 py-1">
                <div className="h-4 rounded skeleton-shimmer w-20"></div>
              </div>
            </div>
          </div>
        </BaseNode>
    );
  }

  // Normal state
  return (
    <BaseNode
      variant="persona"
      selected={selected}
      showSourceHandle={!!nodeData.name}
      showTargetHandle={true}
      className={cn(
        'min-w-[280px] transition-all duration-300',
        isExpanded && 'min-h-[200px]'
      )}
    >
      <div 
        className="space-y-3 cursor-pointer"
        onClick={handleNodeClick}
      >
        {/* Header with Lock */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{nodeData.name || 'Loading...'}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className="p-1 hover:bg-teal-600/20 rounded transition-colors"
          >
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Industry</span>
            <span className="opacity-90">{nodeData.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Role</span>
            <span className="opacity-90">{nodeData.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Pain Level</span>
            <div className="flex items-center gap-2 flex-1">
              {renderPainRating(nodeData.painDegree)}
            </div>
          </div>
        </div>

        {/* Expanded Description */}
        {isExpanded && nodeData.description && (
          <div className="pt-3 border-t border-teal-600/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Description</span>
              <p className="text-sm opacity-80 leading-relaxed">
                {nodeData.description}
              </p>
            </div>
          </div>
        )}

        {/* Expand/Collapse Indicator */}
        <div className="flex justify-center pt-2">
          <div className={cn(
            "text-xs text-teal-400 opacity-60 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}>
            ▼
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default PersonaNode; 