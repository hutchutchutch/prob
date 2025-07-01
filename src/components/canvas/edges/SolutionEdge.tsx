import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath,
} from '@xyflow/react';
import { cn } from '@/utils/cn';

// Solution Mapping Edge with Relevance Score
export interface SolutionEdgeData {
    relevanceScore: number;
    label?: string;
  }
  
  export const SolutionEdge: React.FC<EdgeProps<SolutionEdgeData>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  
    const relevanceScore = data?.relevanceScore || 0;
    const isStrong = relevanceScore > 0.8;
    const isMedium = relevanceScore > 0.5 && relevanceScore <= 0.8;
    const isWeak = relevanceScore <= 0.5;
  
    const getStrokeColor = () => {
      if (selected) return '#2563EB';
      if (isStrong) return '#10B981';
      if (isMedium) return '#F59E0B';
      return '#6B7280';
    };
  
    const getStrokeWidth = () => {
      if (selected) return 3;
      if (isStrong) return 3;
      if (isMedium) return 2;
      return 1;
    };
  
    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: getStrokeColor(),
            strokeWidth: getStrokeWidth(),
            opacity: isWeak ? 0.5 : 1,
          }}
        />
        
        {data?.relevanceScore !== undefined && (
          <EdgeLabelRenderer>
            <div
              className={cn(
                'absolute px-2 py-1 text-xs font-medium rounded-full pointer-events-none',
                isStrong && 'bg-success-600 text-white',
                isMedium && 'bg-warning-600 text-white',
                isWeak && 'bg-gray-600 text-white'
              )}
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              }}
            >
              {Math.round(relevanceScore * 100)}%
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  };