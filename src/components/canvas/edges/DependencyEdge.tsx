import React from 'react';
import {
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface DependencyEdgeData {
  label?: string;
  type?: 'blocks' | 'requires' | 'optional';
}

export const DependencyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeData = data as DependencyEdgeData;
  const dependencyType = edgeData?.type || 'requires';
  
  const typeStyles = {
    blocks: {
      stroke: '#EF4444',
      dashArray: '8 4',
    },
    requires: {
      stroke: '#F59E0B',
      dashArray: '5 5',
    },
    optional: {
      stroke: '#6B7280',
      dashArray: '2 4',
    },
  };

  const style = typeStyles[dependencyType];

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3B82F6' : style.stroke,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: style.dashArray,
          opacity: dependencyType === 'optional' ? 0.6 : 1,
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'absolute px-2 py-1 text-xs font-medium rounded pointer-events-none',
              dependencyType === 'blocks' && 'bg-error-600/20 text-error-400 border border-error-600/30',
              dependencyType === 'requires' && 'bg-warning-600/20 text-warning-400 border border-warning-600/30',
              dependencyType === 'optional' && 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DependencyEdge;