import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Lock, Unlock } from 'lucide-react';
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
  onToggleLock?: () => void;
}

export const PersonaNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as PersonaNodeData;
  const { isLocked = false, isExpanded = false, onToggleLock } = nodeData;

  return (
    <BaseNode
      variant="persona"
      selected={selected}
      showSourceHandle={isExpanded}
      className={cn(
        'min-w-[280px]',
        isExpanded ? 'min-w-[350px]' : ''
      )}
    >
      <div className="space-y-3">
        {/* Header with Lock */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{nodeData.name}</h3>
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
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏢</span>
            <span className="opacity-90">{nodeData.industry}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="opacity-90">{nodeData.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div className="flex items-center gap-2 flex-1">
              <span className="opacity-90">Pain Level:</span>
              <PainLevelIndicator level={nodeData.painDegree} maxLevel={5} showLabel={true} />
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