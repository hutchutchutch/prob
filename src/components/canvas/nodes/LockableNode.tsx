import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { LockToggle } from '../controls/LockToggle';
import { LockIndicator } from '@/components/LockSystem';
import { useLockStore } from '@/stores/lockStore';

interface LockableNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    content?: string;
    [key: string]: any;
  };
  selected?: boolean;
  variant: 'problem' | 'persona' | 'pain' | 'solution';
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  children?: React.ReactNode;
}

export const LockableNode: React.FC<LockableNodeProps> = ({
  id,
  data,
  selected,
  variant,
  showSourceHandle = true,
  showTargetHandle = true,
  children,
}) => {
  const [showLockButton, setShowLockButton] = useState(false);
  const isLocked = useLockStore((state) => state.isLocked(id));
  
  const variantClasses = {
    problem: 'gradient-problem',
    persona: 'gradient-persona',
    pain: 'gradient-pain',
    solution: 'gradient-solution',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setShowLockButton(true)}
      onMouseLeave={() => setShowLockButton(false)}
      className={cn(
        'canvas-node text-white relative',
        variantClasses[variant],
        selected && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900',
        isLocked && 'canvas-node--locked'
      )}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
        />
      )}
      
      {/* Lock Indicator - Always visible when locked */}
      {isLocked && (
        <LockIndicator nodeId={id} size="small" showTooltip={false} />
      )}
      
      {/* Lock Toggle - Visible on hover */}
      <motion.div
        initial={false}
        animate={{
          opacity: showLockButton || isLocked ? 1 : 0,
          scale: showLockButton || isLocked ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2"
      >
        <LockToggle
          nodeId={id}
          nodeType={data.type}
          size="sm"
          showTooltip={true}
        />
      </motion.div>
      
      {/* Node Content */}
      <div className="node-content">
        <h3 className="text-sm font-semibold mb-2">{data.label}</h3>
        {data.content && (
          <p className="text-xs opacity-90">{data.content}</p>
        )}
        {children}
      </div>
      
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
        />
      )}
    </motion.div>
  );
};

// Example usage for different node types
export const LockablePersonaNode: React.FC<{ id: string; data: any }> = (props) => (
  <LockableNode {...props} variant="persona">
    {props.data.painDegree && (
      <div className="mt-2 text-xs">
        <span className="opacity-70">Pain Level:</span>
        <span className="ml-1 font-medium">{props.data.painDegree}/10</span>
      </div>
    )}
  </LockableNode>
);

export const LockablePainPointNode: React.FC<{ id: string; data: any }> = (props) => (
  <LockableNode {...props} variant="pain">
    {props.data.severity && (
      <div className="mt-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                i < props.data.severity
                  ? 'bg-orange-400'
                  : 'bg-gray-600'
              )}
            />
          ))}
        </div>
      </div>
    )}
  </LockableNode>
);

export const LockableSolutionNode: React.FC<{ id: string; data: any }> = (props) => (
  <LockableNode {...props} variant="solution">
    {props.data.votingResults && (
      <div className="mt-2 flex items-center gap-1 text-xs">
        <span className="opacity-70">Votes:</span>
        <span className="font-medium">{props.data.votingResults.totalVotes}</span>
        <div className="flex gap-0.5 ml-2">
          {Array.from({ length: Math.min(props.data.votingResults.totalVotes, 10) }, (_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          ))}
        </div>
      </div>
    )}
  </LockableNode>
);