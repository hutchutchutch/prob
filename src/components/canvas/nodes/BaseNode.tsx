import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

// Base Node Wrapper
interface BaseNodeProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  variant: 'problem' | 'persona' | 'pain' | 'solution';
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  className,
  selected,
  variant,
  showSourceHandle = true,
  showTargetHandle = true,
}) => {
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
      className={cn(
        'canvas-node text-white',
        variantClasses[variant],
        selected && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900',
        className
      )}
    >
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
        />
      )}
      {children}
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

export default BaseNode;