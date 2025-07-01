import React from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/stores/canvasStore';
import { CanvasControls } from './controls';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

export function Canvas() {
  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setViewport,
  } = useCanvasStore();

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        viewport={viewport}
        onViewportChange={setViewport}
        fitView
        className="bg-gray-900"
      >
        {/* Background pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#374151"
        />
        
        {/* Controls */}
        <Controls
          className="bg-gray-800 border border-gray-700 rounded-lg"
          showZoom
          showFitView
          showInteractive
        />
        
        {/* MiniMap */}
        <MiniMap
          className="bg-gray-800 border border-gray-700 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node) => {
            const type = node.type || 'default';
            const colorMap: Record<string, string> = {
              problem: '#DC2626',
              persona: '#14B8A6',
              painPoint: '#F97316',
              solution: '#3B82F6',
              userStory: '#8B5CF6',
            };
            return colorMap[type] || '#6B7280';
          }}
        />
        
        {/* Custom Canvas Controls - temporarily disabled */}
        {/* <CanvasControls /> */}
      </ReactFlow>
    </div>
  );
}