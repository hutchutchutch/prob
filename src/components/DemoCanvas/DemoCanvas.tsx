import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DemoAnimationController } from './DemoAnimationController';
import {
  DemoProblemNode,
  DemoPersonaNode,
  DemoPainPointNode,
  DemoSolutionNode,
} from './DemoNodes';

interface DemoCanvasProps {
  className?: string;
  showControls?: boolean;
  onPhaseChange?: (phase: string) => void;
  onProgressUpdate?: (progress: number) => void;
}

const nodeTypes: NodeTypes = {
  demoProblem: DemoProblemNode,
  demoPersona: DemoPersonaNode,
  demoPain: DemoPainPointNode,
  demoSolution: DemoSolutionNode,
};

const DemoCanvasContent: React.FC<DemoCanvasProps> = ({
  className = '',
  showControls = false,
  onPhaseChange,
  onProgressUpdate,
}) => {
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 };
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <ReactFlow
        defaultNodes={[]}
        defaultEdges={[]}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.5}
        maxZoom={1.5}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#374151"
        />
        
        <DemoAnimationController
          onPhaseChange={onPhaseChange}
          onProgressUpdate={onProgressUpdate}
        />
      </ReactFlow>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-gray-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-transparent to-gray-900/20" />
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-full p-2">
          <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-accent-500 transition-all duration-300"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DemoCanvas: React.FC<DemoCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DemoCanvasContent {...props} />
    </ReactFlowProvider>
  );
};