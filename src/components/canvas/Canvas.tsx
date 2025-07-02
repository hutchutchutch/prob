import React, { useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/stores/canvasStore';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './controls';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

const CanvasInner: React.FC = () => {
  console.log('[Canvas] Component rendering...');
  
  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setViewport,
  } = useCanvasStore();

  const {
    setupResponsiveCanvas,
    getEffectiveViewport
  } = useCanvasNavigation();

  console.log('[Canvas] State:', {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    viewport
  });

  // Setup responsive behavior
  useEffect(() => {
    const cleanup = setupResponsiveCanvas();
    return cleanup;
  }, [setupResponsiveCanvas]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        // edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        viewport={viewport}
        onViewportChange={setViewport}
        fitView={false} // We handle this manually with navigation hook
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false
        }}
        minZoom={0.3}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="bg-gray-900"
        proOptions={{ hideAttribution: true }}
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
        
        {/* MiniMap with improved visibility */}
        <MiniMap
          className="bg-gray-900 border border-gray-600 rounded-lg shadow-lg"
          style={{
            backgroundColor: '#111827',
            width: 200,
            height: 150,
            bottom: 120
          }}
          maskColor="rgba(17, 24, 39, 0.2)" // Lighter mask for better visibility
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
          nodeStrokeColor="#374151"
          nodeStrokeWidth={1}
          zoomable
          pannable
        />
        
        {/* Custom Canvas Controls - temporarily disabled */}
        {/* <CanvasControls /> */}
      </ReactFlow>
    </div>
  );
};

// Main Canvas Component with Provider
export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}