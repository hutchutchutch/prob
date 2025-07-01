import React, { useEffect, useState } from 'react';
import { Canvas } from '@/components/canvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { Node, Edge } from '@xyflow/react';

export function WorkflowCanvas() {
  const { currentStep, coreProblem, personas } = useWorkflowStore();
  const { addNodes, addEdges, zoomTo, resetCanvas, nodes } = useCanvasStore();
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  // Initialize the canvas with the problem input node
  useEffect(() => {
    console.log('[WorkflowCanvas] Initializing with currentStep:', currentStep);
    console.log('[WorkflowCanvas] Canvas initialized:', canvasInitialized);
    console.log('[WorkflowCanvas] Existing nodes:', nodes.length);
    
    if (currentStep === 'problem_input' && !canvasInitialized) {
      console.log('[WorkflowCanvas] Setting up problem input node...');
      
      // Clear canvas first
      resetCanvas();
      
      // Create the interactive problem input node positioned in the left column
      const problemInputNode: Node = {
        id: 'problem-input',
        type: 'problem',
        position: { x: -250, y: 0 }, // Left column center
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
        position: { x: -350, y: -120 }, // Above the CoreProblemNode
        data: { 
          text: 'Core Problem',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      const personasLabelNode: Node = {
        id: 'personas-label',
        type: 'label', 
        position: { x: 520, y: -420 }, // Above the PersonaNodes column
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

      // Create 5 PersonaNodes in skeleton state initially - positioned to barely peek from right edge
      const personaNodes: Node[] = Array.from({ length: 5 }, (_, index) => ({
        id: `persona-${index + 1}`,
        type: 'persona',
        position: { 
          x: 600, // Far right column - personas will barely peek into view
          y: -300 + (index * 150) // Vertical spacing of 150px between nodes
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
          }
        },
        draggable: true,
      }));
      
      // Create edges connecting the problem node to each persona node
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
        animated: true,
      }));
      
      console.log('[WorkflowCanvas] Adding column labels, problem input node, 5 persona skeleton nodes, and connecting edges');
      addNodes([coreProblemLabelNode, personasLabelNode, problemInputNode, ...personaNodes]);
      addEdges(edges);
      
      setCanvasInitialized(true);
      
      // Center the view on the problem node with appropriate zoom to show persona column edge
      setTimeout(() => {
        console.log('[WorkflowCanvas] Centering view on problem node...');
        zoomTo(0.8); // Reduced zoom to show more of the canvas width
      }, 100);
    }
  }, [currentStep, canvasInitialized, addNodes, zoomTo, resetCanvas, coreProblem, nodes.length]);

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
            }
          }
        });
      }
    }
  }, [coreProblem, canvasInitialized]);

  // Update PersonaNodes when personas are available
  useEffect(() => {
    if (personas.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating persona nodes with data:', personas.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Update the first 5 persona nodes with actual data
      personas.slice(0, 5).forEach((persona, index) => {
        const nodeId = `persona-${index + 1}`;
        canvasStore.updateNode(nodeId, {
          data: {
            id: nodeId,
            name: persona.name,
            industry: persona.demographics?.industry || 'Unknown',
            role: persona.demographics?.role || 'Unknown',
            painDegree: Math.floor(Math.random() * 5) + 1, // Random pain level 1-5, could be from API
            description: persona.description,
            isLocked: persona.is_locked,
            isExpanded: false,
            isSkeleton: false, // Ensure skeleton state is off
            onToggleLock: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.togglePersonaLock(persona.id);
            }
          }
        });
      });
    }
  }, [personas, canvasInitialized]);

  // Clear canvas when moving past problem input
  useEffect(() => {
    if (currentStep !== 'problem_input' && canvasInitialized) {
      console.log('[WorkflowCanvas] Moving past problem input, updating canvas...');
      // Don't clear the canvas, just let the workflow store handle the transition
      // The problem node will remain and new nodes will be added
    }
  }, [currentStep, canvasInitialized]);

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
        </div>
      )}
    </div>
  );
}