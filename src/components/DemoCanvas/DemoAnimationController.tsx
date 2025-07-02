import { useReactFlow } from '@xyflow/react';
import React, { useEffect } from 'react';
import demoData from '../../data/demoFlowData.json';

interface DemoAnimationControllerProps {
  onPhaseChange?: (phase: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

export const DemoAnimationController: React.FC<DemoAnimationControllerProps> = ({
  onPhaseChange,
  onProgressUpdate,
}) => {
  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    // Set up the demo layout with just the core problem node
    const setupDemo = () => {
      // Create core problem node
      const problemNode = {
        id: 'demo-problem',
        type: 'coreProblem',
        position: { x: 100, y: 200 },
        data: {
          id: 'demo-problem',
          problem: demoData.problem.statement,
          isDemo: true,
        },
      };

      // Set only the problem node, no personas or edges
      setNodes([problemNode]);
      setEdges([]);
      
      onPhaseChange?.('Demo Ready');
      onProgressUpdate?.(100);
    };

    // Small delay to ensure canvas is ready
    setTimeout(setupDemo, 100);
  }, [setNodes, setEdges, onPhaseChange, onProgressUpdate]);

  return null;
};