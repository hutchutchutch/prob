import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/utils/cn';

// Base Node Wrapper
interface BaseNodeProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  variant: 'problem' | 'persona' | 'pain' | 'solution';
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  sourceHandlePosition?: 'left' | 'right' | 'top' | 'bottom';
  targetHandlePosition?: 'left' | 'right' | 'top' | 'bottom';
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  children,
  className,
  selected,
  variant,
  showSourceHandle = true,
  showTargetHandle = true,
  sourceHandlePosition = 'right',
  targetHandlePosition = 'left',
}) => {
  const variantClasses = {
    problem: 'gradient-problem',
    persona: 'gradient-persona',
    pain: 'gradient-pain',
    solution: 'gradient-solution',
  };

  const positionMap = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,
    bottom: Position.Bottom,
  };

  return (
    <div
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
          position={positionMap[targetHandlePosition]}
          id="target"
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
          isConnectable={true}
        />
      )}
      {children}
      {showSourceHandle && (
        <Handle
          type="source"
          position={positionMap[sourceHandlePosition]}
          id="source"
          className="!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-900"
          isConnectable={true}
        />
      )}
    </div>
  );
};

export default BaseNode;