import React, { useEffect } from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/stores/canvasStore';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { CanvasControls } from './controls';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';

export const Canvas: React.FC = () => {
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
        edgeTypes={edgeTypes}
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
        className="bg-obsidian-900"
        proOptions={{ hideAttribution: true }}
      >
        {/* Background pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#495057" /* var(--color-obsidian-500) */
        />
        
        {/* Controls */}
        <Controls
          className="bg-obsidian-800 border border-obsidian-700 rounded-lg shadow-obsidian-deep"
          showZoom
          showFitView
          showInteractive
        />
        
        {/* MiniMap with improved visibility */}
        <MiniMap
          className="bg-obsidian-800 border border-obsidian-700 rounded-lg shadow-obsidian-deep"
          style={{
            backgroundColor: '#16191C', // obsidian-800
            width: 200,
            height: 150,
            bottom: 120
          }}
          maskColor="rgba(5, 7, 8, 0.2)" // Lighter mask for better visibility
          nodeColor={(node) => {
            const type = node.type || 'default';
            const colorMap: Record<string, string> = {
              problem: '#16191C', // Obsidian-800 for problems
              persona: '#16191C', // Obsidian-800 for personas
              painPoint: '#16191C', // Obsidian-800 for pain points
              solution: '#D4AF37', // Metallic gold for solutions
              userStory: '#16191C', // Obsidian-800 for user stories
              coreProblem: '#D4AF37', // Metallic gold for core problems
            };
            return colorMap[type] || '#495057'; // Obsidian-500 default
          }}
          nodeStrokeColor="#FFD700" // Gold border for visibility
          nodeStrokeWidth={2}
          zoomable
          pannable
        />
        
        {/* Custom Canvas Controls - temporarily disabled */}
        {/* <CanvasControls /> */}
      </ReactFlow>
    </div>
  );
};

// Canvas component is now directly exported above