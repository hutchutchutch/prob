import React, { useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import * as d3 from 'd3-force';
import { useCanvasStore } from '@/stores/canvasStore';

interface ForceLayoutCanvasProps {
  children: React.ReactNode;
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  isSelected: boolean;
}

export const ForceLayoutCanvas: React.FC<ForceLayoutCanvasProps> = ({ children }) => {
  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(null);
  const { 
    nodes, 
    updateNode, 
    forceLayoutMode, 
    selectedPersonaId 
  } = useCanvasStore();

  useEffect(() => {
    if (!forceLayoutMode || !selectedPersonaId) {
      // Stop simulation if force layout is disabled
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      return;
    }

    console.log('[ForceLayoutCanvas] Starting force simulation for persona:', selectedPersonaId);

    // Filter to persona nodes only
    const personaNodes = nodes.filter(node => node.type === 'persona');
    if (personaNodes.length === 0) return;

    // Find the selected persona
    const selectedNode = personaNodes.find(node => node.id === selectedPersonaId);
    if (!selectedNode) return;

    // Create simulation nodes with current positions
    const simulationNodes: SimulationNode[] = personaNodes.map(node => ({
      id: node.id,
      x: node.position.x + 160, // Center of node (assuming 320px width)
      y: node.position.y + 100, // Center of node (assuming 200px height)
      fx: node.id === selectedPersonaId ? node.position.x + 160 : undefined, // Fix selected node
      fy: node.id === selectedPersonaId ? node.position.y + 100 : undefined,
      isSelected: node.id === selectedPersonaId
    }));

    // Create d3 force simulation
    const simulation = d3.forceSimulation(simulationNodes)
      .force('center', d3.forceCenter(selectedNode.position.x + 160, selectedNode.position.y + 100))
      .force('charge', d3.forceManyBody()
        .strength((d: any) => d.isSelected ? 0 : -200) // Selected node has no repulsion
        .distanceMax(300)
      )
      .force('collision', d3.forceCollide()
        .radius((d: any) => d.isSelected ? 200 : 180) // Selected node has larger radius
      )
      .force('link', d3.forceRadial(250, selectedNode.position.x + 160, selectedNode.position.y + 100)
        .radius((d: any) => d.isSelected ? 0 : 250) // Other nodes orbit around selected
        .strength(0.3)
      )
      .alpha(0.8)
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    // Update node positions on each tick
    simulation.on('tick', () => {
      simulationNodes.forEach(simNode => {
        const reactFlowNode = personaNodes.find(node => node.id === simNode.id);
        if (reactFlowNode && simNode.id !== selectedPersonaId) {
          // Don't move the selected persona
          updateNode(simNode.id, {
            position: {
              x: (simNode.x || 0) - 160, // Convert back to top-left position
              y: (simNode.y || 0) - 100
            }
          });
        }
      });
    });

    // Store simulation reference
    simulationRef.current = simulation;

    // Cleanup on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [forceLayoutMode, selectedPersonaId, nodes, updateNode]);

  return <>{children}</>;
}; 