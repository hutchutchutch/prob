import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

// Core Problem Node
export interface CoreProblemNodeData {
  id: string;
  problem: string;
  status: 'valid' | 'invalid';
}

export const CoreProblemNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as CoreProblemNodeData;
  return (
    <BaseNode
      variant="problem"
      selected={selected}
      showTargetHandle={false}
      className="min-w-[320px] max-w-[400px]"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">
            Core Problem
          </h3>
        </div>
        <p className="text-base leading-relaxed">{nodeData.problem}</p>
      </div>
    </BaseNode>
  );
};

export default CoreProblemNode; 