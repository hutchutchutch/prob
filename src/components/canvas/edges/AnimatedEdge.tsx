import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface AnimatedEdgeData {
  label?: string;
  animated?: boolean;
}

export const AnimatedEdge: React.FC<EdgeProps> = ({
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as AnimatedEdgeData;
  const isAnimated = edgeData?.animated !== false;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={cn(
          isAnimated && 'animate-pulse',
          selected && 'stroke-primary-500'
        )}
        style={{
          stroke: selected ? '#3B82F6' : '#4B5563',
          strokeWidth: selected ? 2 : 1,
          strokeDasharray: isAnimated ? '5 5' : 'none',
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-md border border-gray-700 pointer-events-none"
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

export default AnimatedEdge;

