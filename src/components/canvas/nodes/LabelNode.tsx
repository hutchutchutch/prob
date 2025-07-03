import React, { useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useWorkflowStore } from '@/stores/workflowStore';

export interface LabelNodeData {
  text: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onClick?: () => void;
}

export const LabelNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LabelNodeData;
  const { text, showRefresh = false, onRefresh, onClick } = nodeData;
  const isGeneratingPersonas = useWorkflowStore(state => state.isGeneratingPersonas);

  return (
    <div 
      className={cn(
        "flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider",
        onClick && "cursor-pointer hover:text-gray-300 transition-colors"
      )}
      onClick={onClick}
    >
      <span>{text}</span>
      {showRefresh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh?.();
          }}
          className={cn(
            "p-1.5 rounded transition-all duration-200 group",
            isGeneratingPersonas 
              ? "bg-gold-500/20" 
              : "hover:bg-gold-500/20"
          )}
          title="Refresh personas"
          disabled={isGeneratingPersonas}
        >
          <RefreshCw className={cn(
            "w-4 h-4 transition-all duration-200",
            isGeneratingPersonas 
              ? "animate-spin text-gold-500" 
              : "text-gray-400 group-hover:text-gold-500"
          )} />
        </button>
      )}
    </div>
  );
};

export default LabelNode; 