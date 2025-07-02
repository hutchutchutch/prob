import React, { useEffect, useState } from 'react';
import { Canvas } from '@/components/canvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { Node, Edge, useReactFlow } from '@xyflow/react';

export function WorkflowCanvas() {
  console.log('[WorkflowCanvas] Component rendering...');
  
  const { currentStep, coreProblem, personas, painPoints, isGeneratingPersonas } = useWorkflowStore();
  const { addNodes, addEdges, updateEdge, zoomTo, resetCanvas, nodes, edges } = useCanvasStore();
  const { goToStep1, goToStep } = useCanvasNavigation();
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [lastNodeCount, setLastNodeCount] = useState(0);
  const [lastEdgeCount, setLastEdgeCount] = useState(0);
  const [painPointsAdded, setPainPointsAdded] = useState(false);

  console.log('[WorkflowCanvas] Initial state:', {
    currentStep,
    coreProblem,
    canvasInitialized,
    nodeCount: nodes.length,
    edgeCount: edges.length
  });

  // Debug canvas state changes
  useEffect(() => {
    if (nodes.length !== lastNodeCount || edges.length !== lastEdgeCount) {
      console.log('[WorkflowCanvas] Canvas state changed:', {
        nodeCount: `${lastNodeCount} -> ${nodes.length}`,
        edgeCount: `${lastEdgeCount} -> ${edges.length}`,
        nodes: nodes.map(n => ({ id: n.id, type: n.type })),
        edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target }))
      });
      setLastNodeCount(nodes.length);
      setLastEdgeCount(edges.length);
      
      // Track what caused the change
      if (nodes.length === 0 && lastNodeCount > 0) {
        console.error('[WorkflowCanvas] CANVAS CLEARED! Nodes went from', lastNodeCount, 'to 0');
        console.trace('Canvas clear stack trace');
      }
    }
  }, [nodes, edges, lastNodeCount, lastEdgeCount]);

  // Initialize the canvas with the problem input node
  useEffect(() => {
    console.log('[WorkflowCanvas] Initialization effect triggered:', {
      currentStep,
      canvasInitialized,
      nodeCount: nodes.length
    });
    
    // Don't re-initialize if we already have nodes (prevent clearing)
    if (nodes.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Canvas already has nodes, skipping initialization');
      return;
    }
    
    if (currentStep === 'problem_input' && !canvasInitialized) {
      console.log('[WorkflowCanvas] Setting up problem input node...');
      
      // Clear canvas first
      resetCanvas();
      
      // Calculate center position based on viewport
      // Position the CoreProblemNode more to the left with better spacing
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const problemNodeX = -viewportWidth / 3; // Move further left
      const problemNodeY = 0; // Vertical center

      // Create the interactive problem input node positioned at calculated center
      const problemInputNode: Node = {
        id: 'problem-input',
        type: 'problem',
        position: { x: problemNodeX, y: problemNodeY },
        data: { 
          id: 'problem-input',
          problem: coreProblem?.description || '',
          status: coreProblem?.is_validated ? 'valid' : 'editing',
          isDemo: false
        },
        draggable: false, // CoreProblemNode should never be draggable
      };

      // Create column label nodes
      const coreProblemLabelNode: Node = {
        id: 'core-problem-label',
        type: 'label',
        position: { x: problemNodeX, y: problemNodeY - 120 }, // Centered above CoreProblemNode
        data: { 
          text: 'Define the Core Problem',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      // Calculate positions for personas column (center third of screen)
      const personaNodeX = 0; // Center of viewport in React Flow coordinates
      const personaStartY = -300; // Start position for first persona
      const personaSpacing = 150; // Vertical spacing between personas

      const personasLabelNode: Node = {
        id: 'personas-label',
        type: 'label', 
        position: { x: personaNodeX, y: personaStartY - 120 }, // Centered above PersonaNodes column
        data: {
          text: 'Personas',
          showRefresh: true,
          onRefresh: () => {
            console.log('[WorkflowCanvas] Refreshing personas...');
            const workflowStore = useWorkflowStore.getState();
            if (workflowStore.coreProblem) {
              workflowStore.generatePersonas();
            }
          }
        },
        draggable: false,
        selectable: false,
      };

      // Create 5 PersonaNodes in skeleton state initially - positioned in center column
      const personaNodes: Node[] = Array.from({ length: 5 }, (_, index) => ({
        id: `persona-${index + 1}`,
        type: 'persona',
        position: { 
          x: personaNodeX, // Center column
          y: personaStartY + (index * personaSpacing) // Vertical spacing between nodes
        },
        data: {
          id: `persona-${index + 1}`,
          name: '',
          industry: '',
          role: '',
          painDegree: 0,
          description: '',
          isLocked: false,
          isExpanded: false,
          isSkeleton: !coreProblem?.description, // Skeleton state when no problem
          onToggleLock: () => {
            // TODO: Implement persona locking
            console.log(`Toggle lock for persona ${index + 1}`);
          },
          onToggleExpand: () => {
            const canvasStore = useCanvasStore.getState();
            const currentNode = canvasStore.getNodeById(`persona-${index + 1}`);
            if (currentNode) {
              canvasStore.updateNode(`persona-${index + 1}`, {
                data: {
                  ...currentNode.data,
                  isExpanded: !(currentNode.data as any).isExpanded
                }
              });
            }
          }
        },
        draggable: true,
      }));
      
      // Create edges connecting the problem node to each persona node
      // Initially solid (not animated) until persona generation starts
      const edges: Edge[] = personaNodes.map((personaNode, index) => ({
        id: `problem-to-persona-${index + 1}`,
        source: 'problem-input',
        target: personaNode.id,
        type: 'default',
        style: { 
          stroke: '#6B7280', 
          strokeWidth: 2,
          opacity: 0.7 
        },
        animated: false, // Start with solid edges
      }));
      
      console.log('[WorkflowCanvas] Adding initial nodes:', {
        labels: 2,
        problemNode: 1,
        personaNodes: personaNodes.length,
        edges: edges.length
      });
      
      addNodes([coreProblemLabelNode, personasLabelNode, problemInputNode, ...personaNodes]);
      addEdges(edges);
      
      setCanvasInitialized(true);
      
      // Center the view on the problem node with appropriate zoom for Step 1
      setTimeout(() => {
        console.log('[WorkflowCanvas] Centering view on problem node for Step 1...');
        // Zoom to show just the problem node nicely centered
        const canvasStore = useCanvasStore.getState();
        canvasStore.setViewport({
          x: -problemNodeX + (window.innerWidth / 2) - 200, // Center on problem node (accounting for node width)
          y: (window.innerHeight / 2) - 100, // Center vertically
          zoom: 1.2 // More zoomed in for better focus
        });
      }, 100);
    }
  }, [currentStep, canvasInitialized, addNodes, zoomTo, resetCanvas, coreProblem, nodes.length]);

  // Handle navigation when step changes
  useEffect(() => {
    if (!canvasInitialized) return;

    console.log('[WorkflowCanvas] Step changed, handling navigation for:', currentStep);
    
    // Navigate to appropriate view based on current step
    switch (currentStep) {
      case 'problem_input':
        // Center on the CoreProblemNode for Step 1
        setTimeout(() => {
          console.log('[WorkflowCanvas] Navigating to Step 1 - Problem Input');
          goToStep1();
        }, 100);
        break;
      
      case 'persona_discovery':
        // Could add navigation to persona section
        console.log('[WorkflowCanvas] Step 2 - Persona Discovery (no specific navigation yet)');
        break;
        
      case 'pain_points':
        // Could add navigation to pain points section
        console.log('[WorkflowCanvas] Step 3 - Pain Points (no specific navigation yet)');
        break;
        
      default:
        console.log('[WorkflowCanvas] No specific navigation for step:', currentStep);
    }
  }, [currentStep, canvasInitialized, goToStep1]);

  // Update the problem node when core problem changes
  useEffect(() => {
    if (coreProblem && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating problem node with validated problem');
      
      // Update the problem input node
      const canvasStore = useCanvasStore.getState();
      canvasStore.updateNode('problem-input', {
        data: {
          id: 'problem-input',
          problem: coreProblem.description,
          status: 'valid',
          isDemo: false
        },
        draggable: false, // CoreProblemNode should never be draggable
      });

      // Update persona nodes to remove skeleton state (they'll be populated by the personas effect)
      for (let i = 1; i <= 5; i++) {
        const nodeId = `persona-${i}`;
        canvasStore.updateNode(nodeId, {
          data: {
            id: nodeId,
            name: '',
            industry: '',
            role: '',
            painDegree: 0,
            description: '',
            isLocked: false,
            isExpanded: false,
            isSkeleton: false, // Remove skeleton state
            onToggleLock: () => {
              console.log(`Toggle lock for persona ${i}`);
            },
            onToggleExpand: () => {
              const canvasStore = useCanvasStore.getState();
              const currentNode = canvasStore.getNodeById(nodeId);
              if (currentNode) {
                canvasStore.updateNode(nodeId, {
                  data: {
                    ...currentNode.data,
                    isExpanded: !(currentNode.data as any).isExpanded
                  }
                });
              }
            }
          }
        });
      }
    }
  }, [coreProblem, canvasInitialized]);

  // Handle persona generation state - animate edges and add pain points
  useEffect(() => {
    console.log('[WorkflowCanvas] Persona generation state changed:', {
      isGeneratingPersonas,
      painPointsAdded,
      canvasInitialized
    });

    if (isGeneratingPersonas && canvasInitialized && !painPointsAdded) {
      console.log('[WorkflowCanvas] Persona generation started - animating edges and adding pain points');
      
      const canvasStore = useCanvasStore.getState();
      
      // Animate the problem-to-persona edges
      for (let i = 1; i <= 5; i++) {
        canvasStore.updateEdge(`problem-to-persona-${i}`, {
          animated: true
        });
      }

      // Calculate positions for pain points column (right third of screen)
      const viewportWidth = window.innerWidth;
      const painPointNodeX = viewportWidth / 3; // Right side, mirroring the problem node position
      const painPointStartY = -300; // Start position for first pain point
      const painPointSpacing = 150; // Same vertical spacing as personas

      // Add Pain Points column label
      const painPointsLabelNode: Node = {
        id: 'pain-points-label',
        type: 'label',
        position: { x: painPointNodeX, y: painPointStartY - 120 }, // Right of personas column
        data: {
          text: 'Pain Points',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      // Create pain point skeleton nodes - 7 total, card-sized like personas
      const painPointNodes: Node[] = [];
      const painPointEdges: Edge[] = [];

      // Create 7 pain points total, positioned vertically
      for (let painIndex = 0; painIndex < 7; painIndex++) {
        const painPointId = `pain-point-${painIndex + 1}`;
        
        painPointNodes.push({
          id: painPointId,
          type: 'painPoint',
          position: {
            x: painPointNodeX, // Pain points column
            y: painPointStartY + (painIndex * painPointSpacing) // Same vertical spacing as personas
          },
          data: {
            id: painPointId,
            description: '',
            severity: 'medium' as const,
            impactArea: '',
            isLocked: false,
            isSkeleton: true, // Start in skeleton state
            onToggleLock: () => {
              console.log(`Toggle lock for pain point ${painPointId}`);
            }
          },
          draggable: true,
        });

        // Create animated edges from each persona to each pain point
        // This creates a many-to-many relationship visualization
        for (let personaIndex = 0; personaIndex < 5; personaIndex++) {
          const personaNodeId = `persona-${personaIndex + 1}`;
          
          painPointEdges.push({
            id: `persona-${personaIndex + 1}-to-pain-${painIndex + 1}`,
            source: personaNodeId,
            target: painPointId,
            type: 'default',
            style: {
              stroke: '#F97316', // Orange color for pain point connections
              strokeWidth: 1.5, // Thinner for many connections
              opacity: 0.3 // Lower opacity since there are many edges
            },
            animated: true, // Animated edges for pain points
          });
        }
      }

      // Add all pain point nodes and edges
      console.log('[WorkflowCanvas] Adding pain point skeleton nodes:', {
        labelNode: 1,
        nodeCount: painPointNodes.length,
        edgeCount: painPointEdges.length
      });
      
      addNodes([painPointsLabelNode, ...painPointNodes]);
      addEdges(painPointEdges);
      
      setPainPointsAdded(true);
      
      // Adjust viewport to show all three columns
      setTimeout(() => {
        const canvasStore = useCanvasStore.getState();
        // Recalculate positions for zoom calculation
        const vw = window.innerWidth;
        const problemX = -vw / 3;
        const painPointX = vw / 3;
        
        // Calculate zoom level based on viewport width to fit all columns
        const totalWidth = painPointX - problemX + 400; // Add some padding
        const zoomLevel = Math.min(0.8, window.innerWidth / totalWidth);
        
        canvasStore.setViewport({
          x: 0, // Center horizontally
          y: (window.innerHeight / 2) - 100, // Center vertically
          zoom: zoomLevel
        });
      }, 100);
    }
  }, [isGeneratingPersonas, canvasInitialized, painPointsAdded, addNodes, addEdges, updateEdge, zoomTo]);

  // Update PersonaNodes when personas are available
  useEffect(() => {
    console.log('[WorkflowCanvas] Personas effect triggered:', {
      personaCount: personas.length,
      canvasInitialized
    });
    
    if (personas.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating persona nodes with data:', personas.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Update the first 5 persona nodes with actual data
      personas.slice(0, 5).forEach((persona, index) => {
        const nodeId = `persona-${index + 1}`;
        console.log('[WorkflowCanvas] Updating persona node:', nodeId, 'with data:', {
          name: persona.name,
          industry: persona.demographics?.industry,
          role: persona.demographics?.role,
          description: persona.description
        });
        
        // Get the current node to preserve existing properties
        const currentNode = canvasStore.getNodeById(nodeId);
        console.log('[WorkflowCanvas] Current node before update:', currentNode);
        
        const updatedData = {
          id: nodeId,
          name: persona.name,
          industry: persona.demographics?.industry || 'Unknown',
          role: persona.demographics?.role || 'Unknown',
          painDegree: (persona as any).pain_degree || (persona as any).painDegree || Math.floor(Math.random() * 5) + 1,
          description: persona.description,
          isLocked: persona.is_locked || false,
          isExpanded: currentNode?.data?.isExpanded || false, // Preserve expanded state
          isSkeleton: false, // Ensure skeleton state is off
          onToggleLock: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.togglePersonaLock(persona.id);
          },
          onToggleExpand: () => {
            const canvasStore = useCanvasStore.getState();
            const currentNode = canvasStore.getNodeById(nodeId);
            if (currentNode) {
              canvasStore.updateNode(nodeId, {
                data: {
                  ...currentNode.data,
                  isExpanded: !(currentNode.data as any).isExpanded
                }
              });
            }
          }
        };
        
        console.log('[WorkflowCanvas] About to update with data:', updatedData);
        
        canvasStore.updateNode(nodeId, {
          data: updatedData
        });
        
        // Verify the update worked
        const updatedNode = canvasStore.getNodeById(nodeId);
        console.log('[WorkflowCanvas] Node after update:', updatedNode);
      });
    }
  }, [personas, canvasInitialized]);

  // Update PainPointNodes when pain points are available
  useEffect(() => {
    console.log('[WorkflowCanvas] Pain points effect triggered:', {
      painPointCount: painPoints.length,
      canvasInitialized
    });
    
    if (painPoints.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating pain point nodes with data:', painPoints.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Update the first 7 pain point nodes with actual data
      painPoints.slice(0, 7).forEach((painPoint, index) => {
        const nodeId = `pain-point-${index + 1}`;
                 console.log('[WorkflowCanvas] Updating pain point node:', nodeId, 'with data:', {
           id: painPoint.id,
           title: painPoint.title,
           description: painPoint.description,
           severity: painPoint.severity,
           impact: painPoint.impact,
           isLocked: painPoint.is_locked
         });
        
        // Get the current node to preserve existing properties
        const currentNode = canvasStore.getNodeById(nodeId);
        console.log('[WorkflowCanvas] Current pain point node before update:', currentNode);
        
                 const updatedData = {
           id: nodeId,
           title: painPoint.title,
           description: painPoint.description,
           severity: painPoint.severity === 1 ? 'low' : 
                    painPoint.severity === 2 ? 'medium' :
                    painPoint.severity === 3 ? 'high' :
                    painPoint.severity === 4 ? 'high' : 'critical',
           impactArea: painPoint.impact,
           isLocked: painPoint.is_locked || false,
           isSkeleton: false, // Ensure skeleton state is off
           onToggleLock: () => {
             const workflowStore = useWorkflowStore.getState();
             workflowStore.togglePainPointLock(painPoint.id);
           }
         };
        
        console.log('[WorkflowCanvas] About to update pain point with data:', updatedData);
        
        canvasStore.updateNode(nodeId, {
          data: updatedData
        });
        
        // Verify the update worked
        const updatedNode = canvasStore.getNodeById(nodeId);
        console.log('[WorkflowCanvas] Pain point node after update:', updatedNode);
      });
    }
  }, [painPoints, canvasInitialized]);

  // Handle step changes and canvas adjustments
  useEffect(() => {
    console.log('[WorkflowCanvas] Step change detected:', currentStep, 'canvasInitialized:', canvasInitialized);
    
    if (currentStep !== 'problem_input' && canvasInitialized) {
      console.log('[WorkflowCanvas] Moving past problem input, updating canvas...');
      console.log('[WorkflowCanvas] Current step:', currentStep);
      
      if (currentStep === 'persona_discovery') {
        console.log('[WorkflowCanvas] Entering persona discovery, adjusting canvas view...');
        // Adjust the canvas view to show both problem and persona columns
        const vw = window.innerWidth;
        const problemX = -vw / 3;
        const personaX = 0; // Center column
        
        // Calculate appropriate zoom to show problem and persona columns
        const columnsWidth = Math.abs(personaX - problemX) + 600; // Add padding for node widths
        const zoomLevel = Math.min(0.8, window.innerWidth / columnsWidth);
        
        const canvasStore = useCanvasStore.getState();
        canvasStore.setViewport({
          x: -problemX / 2, // Center between problem and persona columns
          y: (window.innerHeight / 2) - 200, // Center vertically on personas
          zoom: zoomLevel
        });
      }
    }
  }, [currentStep, canvasInitialized, zoomTo]);

  return (
    <div className="relative w-full h-full">
      {/* React Flow Canvas */}
      <Canvas />

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded text-xs text-gray-400 z-30">
          <div>Step: {currentStep}</div>
          <div>Problem: {coreProblem ? 'Validated' : 'Not validated'}</div>
          <div>Canvas Init: {canvasInitialized ? 'Yes' : 'No'}</div>
          <div>Nodes: {nodes.length}</div>
          <div>Edges: {edges.length}</div>
          <div>Personas: {personas.length}</div>
          <div>Generating: {isGeneratingPersonas ? 'Yes' : 'No'}</div>
          <div>Pain Points: {painPointsAdded ? 'Added' : 'Not added'}</div>
        </div>
      )}
    </div>
  );
}