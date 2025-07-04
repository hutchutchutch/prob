import React, { useState, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BaseNode } from './BaseNode';
import { useCanvasStore } from '@/stores/canvasStore';

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
  isExpanded?: boolean;
  onToggleLock?: () => void;
  onToggleExpand?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isSkeleton = false, isRefreshing = false, onToggleLock, isExpanded: expandedFromProps = false } = nodeData;
  const [isExpanded, setIsExpanded] = useState(expandedFromProps);
  
  // Import canvas store
  const { handleNodeExpansion } = useCanvasStore();
  
  // Sync expanded state with props
  useEffect(() => {
    setIsExpanded(expandedFromProps);
  }, [expandedFromProps]);

  // Handle node click to expand/collapse
  const handleNodeClick = () => {
    if (isSkeleton) return;
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    
    // Notify canvas about expansion change
    if (nodeData.onToggleExpand) {
      // Use the provided handler which already handles node shifting
      nodeData.onToggleExpand();
    } else {
      // Fallback: directly handle expansion if no handler provided
      const heightDiff = newExpanded ? 160 : -160;
      handleNodeExpansion(id, heightDiff);
    }
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
          <div className="space-y-6 pointer-events-none">
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
        isExpanded ? 'w-[400px]' : '', // Wider when expanded, height handled by content
        // Add animated gold border when refreshing and not locked
        nodeData.isRefreshing && !nodeData.isLocked && 'gold-pulse-border'
      )}
      style={{
        minHeight: isExpanded ? '320px' : '160px',
        height: isExpanded ? 'auto' : '160px'
      }}
    >
      <div 
        className={cn(
          "flex flex-col relative h-full",
          isExpanded ? "space-y-3 p-1" : "space-y-3"
        )}
      >
        {/* Header with Lock */}
        <div className="flex items-start justify-between cursor-pointer" onClick={handleNodeClick} onMouseDown={(e) => e.stopPropagation()}>
          <h3 className={cn(
            "font-bold",
            isExpanded ? "text-lg" : "text-lg"
          )}>{nodeData.name || 'Loading...'}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
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
          "text-sm cursor-pointer",
          isExpanded ? "space-y-2" : "space-y-3",
          isExpanded ? "flex-1 flex flex-col" : ""
        )} onClick={handleNodeClick} onMouseDown={(e) => e.stopPropagation()}>
          <div className="space-y-2">
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
          </div>

          {/* Expanded Description */}
          {isExpanded && nodeData.description && (
            <div className="pt-3 mt-2 border-t border-gold-600/30 flex-1 min-h-0">
              <p className="text-xs opacity-80 leading-relaxed pr-4 pb-8">
                {nodeData.description}
              </p>
            </div>
          )}
        </div>

        {/* Expand/Collapse Indicator */}
        {!isSkeleton && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <div className={cn(
              "text-xs text-gold-500 opacity-60 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}>
              ▼
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default PersonaNode; 