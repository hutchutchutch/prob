import React from 'react';
import { NodeProps } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';

export interface LabelNodeData {
  text: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export const LabelNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as LabelNodeData;
  const { text, showRefresh = false, onRefresh } = nodeData;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
      <span>{text}</span>
      {showRefresh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh?.();
          }}
          className="p-1 hover:bg-gray-700 rounded transition-colors group"
          title="Refresh personas"
        >
          <RefreshCw className="w-4 h-4 group-hover:text-gray-300 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default LabelNode; 