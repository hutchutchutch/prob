import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { QuoteNode, QuoteNodeData } from '../nodes/QuoteNode';
import { cn } from '@/utils/cn';

export interface FocusGroupEdgeData {
  quote?: string;
  personaName?: string;
  personaId?: string;
  solutionId?: string;
  isHighlighted?: boolean;
}

export const FocusGroupEdge: React.FC<EdgeProps<FocusGroupEdgeData>> = ({
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

  const hasQuote = data?.quote && data?.personaName;
  const isHighlighted = data?.isHighlighted || selected;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={cn(
          'transition-all duration-300',
          isHighlighted && 'drop-shadow-lg'
        )}
        style={{
          stroke: isHighlighted ? '#FFD700' : '#6B7280', // Gold when highlighted, grey otherwise
          strokeWidth: isHighlighted ? 3 : 2,
          opacity: isHighlighted ? 1 : 0.6,
          strokeDasharray: hasQuote ? 'none' : '5 5', // Solid line when has quote
        }}
      />
      
      {hasQuote && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-auto"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            <QuoteNode 
              data={{
                quote: data.quote!,
                personaName: data.personaName!,
                personaId: data.personaId || '',
                solutionId: data.solutionId || ''
              } as QuoteNodeData}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default FocusGroupEdge;