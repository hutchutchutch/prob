import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
  useNodes,
} from '@xyflow/react';

export interface FloatingEdgeData {
  animated?: boolean;
}

export const FloatingEdge: React.FC<EdgeProps> = ({
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
  source,
  target,
}) => {
  const nodes = useNodes();
  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);
  
  // Get the float offset from both nodes if they have it
  const sourceOffset = (sourceNode?.data as any)?.floatOffset || { x: 0, y: 0 };
  const targetOffset = (targetNode?.data as any)?.floatOffset || { x: 0, y: 0 };
  
  // Adjust positions by the float offset
  const adjustedSourceX = sourceX + sourceOffset.x;
  const adjustedSourceY = sourceY + sourceOffset.y;
  const adjustedTargetX = targetX + targetOffset.x;
  const adjustedTargetY = targetY + targetOffset.y;
  
  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? '#FFD700' : '#495057', // Gold when selected, obsidian-500 otherwise
        strokeWidth: selected ? 2 : 1.5,
        strokeDasharray: '5 5',
        animation: 'dash 1s linear infinite',
      }}
    />
  );
};

export default FloatingEdge;