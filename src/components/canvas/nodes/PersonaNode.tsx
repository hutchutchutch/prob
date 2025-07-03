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
  isRefreshing?: boolean;
  onToggleLock?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isSkeleton = false, isRefreshing = false, onToggleLock } = nodeData;
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
          "shadow-lg shadow-gold-500/20", // Add ethereal glow with gold color
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
        isExpanded && 'w-[336px] h-[240px]', // 1.2x width (280 * 1.2 = 336), 1.5x height (160 * 1.5 = 240)
        // Add animated gold border when refreshing and not locked
        nodeData.isRefreshing && !nodeData.isLocked && 'gold-pulse-border'
      )}
    >
      <div 
        className={cn(
          "cursor-pointer h-full flex flex-col relative",
          isExpanded ? "space-y-2" : "space-y-3"
        )}
        onClick={handleNodeClick}
      >
        {/* Header with Lock */}
        <div className="flex items-start justify-between">
          <h3 className={cn(
            "font-bold",
            isExpanded ? "text-lg" : "text-lg"
          )}>{nodeData.name || 'Loading...'}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            className={cn(
              "p-1 rounded transition-all flex-shrink-0",
              isLocked 
                ? "bg-gold-500 border border-gold-600 hover:bg-gold-600" 
                : "hover:bg-teal-600/20"
            )}
          >
            {isLocked ? (
              <Lock className="w-4 h-4 text-obsidian-950" />
            ) : (
              <Unlock className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {/* Details */}
        <div className={cn(
          "text-sm flex-1",
          isExpanded ? "space-y-2" : "space-y-3"
        )}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gold-500 uppercase tracking-wide min-w-0 flex-shrink-0">Industry</span>
            <span className="opacity-90 truncate">{nodeData.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gold-500 uppercase tracking-wide min-w-0 flex-shrink-0">Role</span>
            <span className="opacity-90 truncate">{nodeData.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gold-500 uppercase tracking-wide min-w-0 flex-shrink-0">Pain Level</span>
            <div className="flex items-center gap-2">
              {renderPainRating(nodeData.painDegree)}
            </div>
          </div>

          {/* Expanded Description */}
          {isExpanded && nodeData.description && (
            <div className="pt-2 border-t border-gold-600/30">
              <p className="text-xs opacity-80 leading-relaxed">
                {nodeData.description}
              </p>
            </div>
          )}
        </div>

        {/* Expand/Collapse Indicator - moved to bottom right */}
        <div className="absolute bottom-2 right-2">
          <div className={cn(
            "text-xs text-gold-500 opacity-60 transition-transform duration-200",
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