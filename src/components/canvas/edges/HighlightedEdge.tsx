import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

export interface HighlightedEdgeData {
  label?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const HighlightedEdge: React.FC<EdgeProps> = ({
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as HighlightedEdgeData;
  const color = edgeData?.color || '#3B82F6';
  const intensity = edgeData?.intensity || 'medium';
  
  const glowIntensity = {
    low: 'drop-shadow(0 0 4px currentColor)',
    medium: 'drop-shadow(0 0 8px currentColor)',
    high: 'drop-shadow(0 0 12px currentColor)',
  };

  return (
    <>
      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={8}
        opacity={0.3}
        style={{
          filter: glowIntensity[intensity],
        }}
      />
      
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: selected ? 3 : 2,
        }}
      />
      
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            className={cn(
              'absolute px-3 py-1.5 text-xs font-medium rounded-full pointer-events-none',
              'bg-gray-800 text-white border border-gray-700'
            )}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              boxShadow: `0 0 12px ${color}40`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default HighlightedEdge;