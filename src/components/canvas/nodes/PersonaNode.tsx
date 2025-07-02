import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { BaseNode } from './BaseNode';
import { PainLevelIndicator } from './PainLevelIndicator';

// Persona Node
export interface PersonaNodeData {
  id: string;
  name: string;
  industry: string;
  role: string;
  painDegree: number;
  description?: string;
  isLocked?: boolean;
  isExpanded?: boolean;
  isSkeleton?: boolean;
  onToggleLock?: () => void;
  onToggleExpand?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isExpanded = false, isSkeleton = false, onToggleLock, onToggleExpand } = nodeData;

  // Debug logging
  console.log('[PersonaNode] Rendering with data:', {
    rawData: data,
    nodeData,
    name: nodeData.name,
    industry: nodeData.industry,
    role: nodeData.role,
    isSkeleton,
    hasName: !!nodeData.name,
    hasIndustry: !!nodeData.industry
  });

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
                ? 'text-orange-400 fill-orange-400/50' 
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
        className="min-w-[280px] opacity-60"
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
      showSourceHandle={!!nodeData.name} // Show source handle when persona has data
      showTargetHandle={true}
      className={cn(
        'min-w-[280px]',
        isExpanded ? 'min-w-[350px]' : ''
      )}
    >
      <div 
        className="space-y-3 cursor-pointer"
        onClick={() => onToggleExpand?.()}
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-teal-600/30"
          >
            <p className="text-sm opacity-80 leading-relaxed">
              {nodeData.description}
            </p>
          </motion.div>
        )}
      </div>
    </BaseNode>
  );
};

export default PersonaNode; 