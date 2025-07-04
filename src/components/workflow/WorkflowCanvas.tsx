import React, { useEffect, useState } from 'react';
import { Canvas } from '@/components/canvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { Node, Edge, useReactFlow } from '@xyflow/react';
import { ForceLayoutCanvas } from '@/components/canvas/ForceLayoutCanvas';

export function WorkflowCanvas() {
  console.log('[WorkflowCanvas] Component rendering...');
  
  const { currentStep, coreProblem, personas, painPoints, solutions, isGeneratingPersonas, lockedItems, focusedPainPointId, focusOnPainPoint, clearPainPointFocus } = useWorkflowStore();
  const { addNodes, addEdges, updateEdge, zoomTo, resetCanvas, nodes, edges } = useCanvasStore();
  const { goToStep1 } = useCanvasNavigation();
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [lastNodeCount, setLastNodeCount] = useState(0);
  const [lastEdgeCount, setLastEdgeCount] = useState(0);
  const [painPointsAdded, setPainPointsAdded] = useState(false);
  const [solutionsAdded, setSolutionsAdded] = useState(false);
  const [previousStep, setPreviousStep] = useState<string | null>(null);
  const [focusGroupActive, setFocusGroupActive] = useState(false);

  // Constants for node positioning
  const problemNodeX = -400; // Left side of canvas for problem node
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920; // Default to 1920 for SSR
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080; // Default to 1080 for SSR
  const personaBaseX = viewportWidth * 0.15; // Shift personas left to 15% of view width (reduced from 0.2)
  
  // Calculate vertical centering for personas (5 nodes with 150 spacing)
  // React Flow positions nodes by their top-left corner, not center
  // PersonaNode height is approximately 160px, CoreProblemNode height is approximately 180px
  // To align centers: CoreProblem center is at y=0 + 90px = 90px
  // Middle PersonaNode should have its center at 90px, so top at 90 - 80 = 10px
  const personaSpacing = 150;
  const middleNodeTopY = 10; // Top of middle node to align centers
  const personaStartY = middleNodeTopY - (2 * personaSpacing); // Start 2 nodes above middle

  // Function to initialize problem input nodes
  const initializeProblemInputNodes = () => {
    console.log('[WorkflowCanvas] Initializing problem input nodes...');
    
    // Use the component-level viewportWidth and personaBaseX
    const currentPersonaBaseX = personaBaseX;
    
    // Add core problem node
    const problemNode: Node = {
      id: 'problem-input',
      type: 'coreProblem',
      position: { x: problemNodeX, y: 0 },
      data: {
        id: 'problem-input',
        problem: '',
        status: 'empty',
        isDemo: false
      },
      draggable: false, // CoreProblemNode should never be draggable
      width: 450, // Fixed width between min and max
      height: 180, // Fixed height
    };

    // Create label node for personas column
    const personasLabelNode: Node = {
      id: 'personas-label',
      type: 'label',
      position: { x: personaBaseX, y: personaStartY - 80 }, // Aligned with personas X position and above the top persona
      data: {
        text: 'Personas',
        showRefresh: true,
        onRefresh: async () => {
          console.log('[WorkflowCanvas] Refresh personas clicked');
          const workflowStore = useWorkflowStore.getState();
          await workflowStore.regeneratePersonas();
        }
      },
      draggable: false,
      selectable: false,
      zIndex: 100, // Higher z-index to ensure it's above other nodes
    };

    // Create skeleton persona nodes
    const personaNodes: Node[] = [];
    for (let i = 1; i <= 5; i++) {
      personaNodes.push({
        id: `persona-${i}`,
        type: 'persona',
        position: {
          x: currentPersonaBaseX,
          y: personaStartY + ((i - 1) * personaSpacing)
        },
        data: {
          id: `persona-${i}`,
          name: '',
          industry: '',
          role: '',
          painDegree: 0,
          description: '',
          isLocked: false,
          isExpanded: false,
          isSkeleton: true, // Start in skeleton state
          isRefreshing: false,
          onToggleLock: () => {
            console.log(`Toggle lock for persona ${i}`);
          },
          onToggleExpand: () => {
            const canvasStore = useCanvasStore.getState();
            const currentNode = canvasStore.getNodeById(`persona-${i}`);
            if (currentNode) {
              const isCurrentlyExpanded = (currentNode.data as any).isExpanded || false;
              const heightDiff = isCurrentlyExpanded ? -160 : 160;
              
              // Update node data
              canvasStore.updateNode(`persona-${i}`, {
                data: {
                  ...currentNode.data,
                  isExpanded: !isCurrentlyExpanded
                }
              });
              
              // Handle node expansion and shift other nodes
              canvasStore.handleNodeExpansion(`persona-${i}`, heightDiff);
            }
          }
        },
        draggable: true,
      });
    }

    // Create edges from problem to personas
    const personaEdges: Edge[] = [];
    for (let i = 1; i <= 5; i++) {
      personaEdges.push({
        id: `problem-to-persona-${i}`,
        source: 'problem-input',
        target: `persona-${i}`,
        type: 'default',
        style: { 
          stroke: '#6B7280', 
          strokeWidth: 2,
          opacity: 0.7 
        },
        animated: false, // Will be animated when personas are generated
      });
    }

    console.log('[WorkflowCanvas] Adding initial nodes:', {
      problemNode: 1,
      labelNodes: 1,
      personaNodes: personaNodes.length,
      edges: personaEdges.length
    });

    addNodes([problemNode, personasLabelNode, ...personaNodes]);
    addEdges(personaEdges);
  };

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
    if (!canvasInitialized) {
      console.log('[WorkflowCanvas] Initializing canvas for workflow...');
      // Clear any existing state before initializing
      resetCanvas();
      setCanvasInitialized(true);
    }
  }, []); // Remove canvasInitialized from dependencies to prevent re-initialization

  // Handle step transitions and reset from focus group mode
  useEffect(() => {
    if (!canvasInitialized) return;

    console.log('[WorkflowCanvas] Current step updated:', currentStep, 'Previous step:', previousStep);
    
    // If leaving focus group mode, reset the canvas and rebuild for the new step
    if (previousStep === 'focus_group' && currentStep !== 'focus_group' && focusGroupActive) {
      console.log('[WorkflowCanvas] Leaving focus group mode - resetting canvas');
      setFocusGroupActive(false);
      setPainPointsAdded(false);
      setSolutionsAdded(false);
      setCanvasInitialized(false);
      resetCanvas();
      
      // Re-initialize after a short delay
      setTimeout(() => {
        setCanvasInitialized(true);
      }, 50);
    }
    
    // Handle step-specific node initialization
    if (currentStep === 'problem_input' && nodes.length === 0 && !focusGroupActive) {
      // Only initialize if nodes haven't been added yet
      initializeProblemInputNodes();
    }
    
    if (currentStep === 'problem_input' && coreProblem && nodes.length > 0 && !focusGroupActive) {
      // Center view on problem node after problem is validated
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
    
    // Update previous step
    setPreviousStep(currentStep);
  }, [currentStep, canvasInitialized, addNodes, zoomTo, resetCanvas, coreProblem, previousStep, focusGroupActive]); // Remove nodes.length dependency

  // NOTE: Navigation is now handled by ProgressSteps component in App.tsx
  // This effect previously had competing navigation logic that interfered with ProgressSteps
  // Removed to allow smooth single-click navigation from ProgressSteps

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
        width: 450, // Maintain fixed width
        height: 180, // Maintain fixed height
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
            isRefreshing: false, // Remove refreshing state
            onToggleLock: () => {
              console.log(`Toggle lock for persona ${i}`);
            },
            onToggleExpand: () => {
              const canvasStore = useCanvasStore.getState();
              const currentNode = canvasStore.getNodeById(nodeId);
              if (currentNode) {
                const isCurrentlyExpanded = (currentNode.data as any).isExpanded || false;
                const heightDiff = isCurrentlyExpanded ? -160 : 160;
                
                canvasStore.updateNode(nodeId, {
                  data: {
                    ...currentNode.data,
                    isExpanded: !isCurrentlyExpanded
                  }
                });
                
                canvasStore.handleNodeExpansion(nodeId, heightDiff);
              }
            }
          }
        });
      }
    }
  }, [coreProblem, canvasInitialized]);

  // Update persona nodes' refreshing state when generation status changes
  useEffect(() => {
    if (canvasInitialized && nodes.some(n => n.type === 'persona')) {
      console.log('[WorkflowCanvas] Updating persona nodes refreshing state:', isGeneratingPersonas);
      const canvasStore = useCanvasStore.getState();
      
      // Update all persona nodes with refreshing state
      for (let i = 1; i <= 5; i++) {
        const nodeId = `persona-${i}`;
        const currentNode = canvasStore.getNodeById(nodeId);
        if (currentNode) {
          canvasStore.updateNode(nodeId, {
            data: {
              ...currentNode.data,
              isRefreshing: isGeneratingPersonas
            }
          });
        }
      }
    }
  }, [isGeneratingPersonas, canvasInitialized]); // Remove nodes dependency to prevent infinite loop

  // Handle step transitions - add pain point skeletons when reaching persona discovery
  useEffect(() => {
    console.log('[WorkflowCanvas] Step transition effect triggered:', {
      currentStep,
      canvasInitialized,
      painPointsAdded,
      coreProblemValidated: coreProblem?.is_validated
    });

    // Add pain point skeletons immediately when reaching persona discovery step
    if (currentStep === 'persona_discovery' && canvasInitialized && !painPointsAdded && coreProblem?.is_validated && !focusGroupActive) {
      console.log('[WorkflowCanvas] Reached persona discovery step - adding pain point skeleton nodes');
      
      const canvasStore = useCanvasStore.getState();
      
      // Calculate positions for pain points in two columns (right third of screen)
      const viewportWidth = window.innerWidth;
      const painPointBaseX = viewportWidth * 0.45; // Moved right from 38.33% to 45% for more spacing from personas
      const painPointColumn1X = painPointBaseX - 170; // Reduced from 220 to bring columns closer together
      const painPointColumn2X = painPointBaseX + 170; // Reduced from 220 to bring columns closer together
      
      // Calculate vertical centering for pain points (tallest column has 4 nodes)
      const painPointSpacing = 240; // Further increased vertical spacing to prevent overlap
      // Align pain points with personas - start slightly higher than personas
      const painPointStartY = personaStartY - 60; // Start 60px above first persona for visual balance
      
      console.log('[WorkflowCanvas] Pain point positioning calculations:', {
        viewportWidth,
        painPointBaseX,
        painPointColumn1X,
        painPointColumn2X,
        columnSpacing: painPointColumn2X - painPointColumn1X,
        painPointStartY,
        painPointSpacing
      });

      // Add Pain Points column label (centered between the two columns)
      const painPointsLabelNode: Node = {
        id: 'pain-points-label',
        type: 'label',
        position: { x: painPointBaseX, y: painPointStartY - 120 }, // Centered above both columns
        data: {
          text: 'Pain Points',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      // Create pain point skeleton nodes - 7 total, arranged in two columns
      const painPointNodes: Node[] = [];

      // Create 7 pain points total, positioned in two columns (3 left, 4 right)
      for (let painIndex = 0; painIndex < 7; painIndex++) {
        const painPointId = `pain-point-${painIndex + 1}`;
        
        // Determine column and position within column
        const isFirstColumn = painIndex < 3;
        const columnX = isFirstColumn ? painPointColumn1X : painPointColumn2X;
        const columnIndex = isFirstColumn ? painIndex : painIndex - 3;
        const positionY = painPointStartY + (columnIndex * painPointSpacing);
        
        console.log(`[WorkflowCanvas] Creating ${painPointId} at position:`, {
          painIndex,
          isFirstColumn,
          columnX,
          columnIndex,
          positionY,
          column: isFirstColumn ? 'left' : 'right'
        });
        
        painPointNodes.push({
          id: painPointId,
          type: 'painPoint',
          position: {
            x: columnX, // Column-specific X position
            y: positionY // Y position based on index within column
          },
          data: {
            id: painPointId,
            description: '',
            severity: 'medium' as const,
            impactArea: '',
            isLocked: false,
            isSkeleton: true, // Show skeleton state
            isRefreshing: false, // Initially not refreshing
            onToggleLock: () => {
              console.log(`Toggle lock for pain point ${painIndex + 1}`);
            },
            onFocus: () => {
              console.log(`Focus on pain point ${painIndex + 1}`);
            }
          },
          draggable: true,
        });
      }

      // Add edges from each persona to pain points (initially not animated)
      const painPointEdges: Edge[] = [];
      for (let personaIndex = 1; personaIndex <= 5; personaIndex++) {
        for (let painIndex = 1; painIndex <= 7; painIndex++) {
          painPointEdges.push({
            id: `persona-${personaIndex}-to-pain-${painIndex}`,
            source: `persona-${personaIndex}`,
            target: `pain-point-${painIndex}`,
            type: 'default',
            style: { 
              stroke: '#6B7280', 
              strokeWidth: 1,
              opacity: 0.3 
            },
            animated: false, // Start with solid edges
          });
        }
      }

      console.log('[WorkflowCanvas] Adding pain point nodes and edges:', {
        painPointNodes: painPointNodes.length,
        painPointEdges: painPointEdges.length,
        labelNodes: 1
      });

      addNodes([painPointsLabelNode, ...painPointNodes]);
      addEdges(painPointEdges);
      
      setPainPointsAdded(true);
      
      console.log('[WorkflowCanvas] Pain point skeleton nodes added successfully');
    }
  }, [currentStep, canvasInitialized, painPointsAdded, coreProblem, addNodes, addEdges, setPainPointsAdded, focusGroupActive]);

  // Handle persona generation state - animate edges and add pain points
  useEffect(() => {
    console.log('[WorkflowCanvas] Persona generation state changed:', {
      isGeneratingPersonas,
      painPointsAdded,
      canvasInitialized,
      coreProblemValidated: coreProblem?.is_validated
    });

    // Only animate edges when persona generation starts (pain points already added by step transition)
    if (isGeneratingPersonas && canvasInitialized && painPointsAdded && coreProblem?.is_validated) {
      console.log('[WorkflowCanvas] Persona generation started - animating edges');
      
      const canvasStore = useCanvasStore.getState();
      
      // Animate the problem-to-persona edges
      for (let i = 1; i <= 5; i++) {
        canvasStore.updateEdge(`problem-to-persona-${i}`, {
          animated: true
        });
      }

      // Animate persona-to-pain-point edges
      for (let personaIndex = 1; personaIndex <= 5; personaIndex++) {
        for (let painIndex = 1; painIndex <= 7; painIndex++) {
          canvasStore.updateEdge(`persona-${personaIndex}-to-pain-${painIndex}`, {
            animated: true,
            style: { 
              stroke: '#F59E0B', 
              strokeWidth: 2,
              opacity: 0.6 
            }
          });
        }
      }

      console.log('[WorkflowCanvas] Edge animations started for persona generation');
    }
  }, [isGeneratingPersonas, canvasInitialized, painPointsAdded, coreProblem, updateEdge]);

  // Update PersonaNodes when personas are available
  useEffect(() => {
    console.log('[WorkflowCanvas] Personas effect triggered:', {
      personaCount: personas.length,
      canvasInitialized,
      isGeneratingPersonas
    });
    
    if (personas.length > 0 && canvasInitialized) {
      console.log('[WorkflowCanvas] Updating persona nodes with data:', personas.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Find persona with highest pain_degree
      let highestPainPersona: any = null;
      let highestPainDegree = 0;
      let highestPainIndex = -1;
      
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
        
        // Get locked state from current store state
        const currentLockedItems = useWorkflowStore.getState().lockedItems;
        
        const updatedData = {
          id: nodeId,
          name: persona.name,
          industry: persona.demographics?.industry || 'Unknown',
          role: persona.demographics?.role || 'Unknown',
          painDegree: (persona as any).pain_degree || (persona as any).painDegree || Math.floor(Math.random() * 5) + 1,
          description: persona.description,
          isLocked: currentLockedItems.personas.has(persona.id),
          isExpanded: currentNode?.data?.isExpanded || false, // Preserve expanded state
          isSkeleton: false, // Ensure skeleton state is off
          isRefreshing: isGeneratingPersonas, // Set based on current generation state
          onToggleLock: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.togglePersonaLock(persona.id);
          },
          onToggleExpand: () => {
            const canvasStore = useCanvasStore.getState();
            const currentNode = canvasStore.getNodeById(nodeId);
            if (currentNode) {
              const isCurrentlyExpanded = (currentNode.data as any).isExpanded || false;
              const heightDiff = isCurrentlyExpanded ? -160 : 160;
              
              canvasStore.updateNode(nodeId, {
                data: {
                  ...currentNode.data,
                  isExpanded: !isCurrentlyExpanded
                }
              });
              
              canvasStore.handleNodeExpansion(nodeId, heightDiff);
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
        
        // Check if this persona has the highest pain degree
        const painDegree = (persona as any).pain_degree || (persona as any).painDegree || updatedData.painDegree;
        if (painDegree > highestPainDegree) {
          highestPainDegree = painDegree;
          highestPainPersona = persona;
          highestPainIndex = index;
        }
      });
      
      // If personas are generated (no longer generating), update edges and create pain point connections
      if (!isGeneratingPersonas) {
        console.log('[WorkflowCanvas] Persona generation complete - updating edges and creating pain point connections');
        
        // Make all problem-to-persona edges solid and grey by default
        for (let i = 1; i <= 5; i++) {
          const edgeId = `problem-to-persona-${i}`;
          canvasStore.updateEdge(edgeId, {
            animated: false,
            style: {
              stroke: '#6B7280', // Default grey
              strokeWidth: 2,
              opacity: 0.7
            }
          });
        }
        
        // Color the edge to the highest pain persona gold
        if (highestPainIndex >= 0) {
          console.log('[WorkflowCanvas] Highlighting edge to highest pain persona:', highestPainPersona.name, 'with pain degree:', highestPainDegree);
          const goldEdgeId = `problem-to-persona-${highestPainIndex + 1}`;
          canvasStore.updateEdge(goldEdgeId, {
            animated: false,
            style: {
              stroke: '#FFD700', // Gold color
              strokeWidth: 3, // Slightly thicker
              opacity: 1 // Full opacity
            }
          });
        }

        // Now update the persona-to-pain-point edges to animated state
        if (painPointsAdded) {
          console.log('[WorkflowCanvas] Updating persona-to-pain-point edges to animated state');
          
          // Update existing edges to animated state (they were already created in step transition)
          for (let personaIndex = 1; personaIndex <= 5; personaIndex++) {
            for (let painIndex = 1; painIndex <= 7; painIndex++) {
              const edgeId = `persona-${personaIndex}-to-pain-${painIndex}`;
              canvasStore.updateEdge(edgeId, {
                animated: true,
                style: {
                  stroke: '#F97316', // Orange color for pain point connections
                  strokeWidth: 1.5, // Thinner for many connections
                  opacity: 0.5 // Slightly higher opacity when animated
                }
              });
            }
          }
          
          console.log('[WorkflowCanvas] Updated persona-to-pain-point edges to animated state');
        }
      }
    }
  }, [personas, canvasInitialized, isGeneratingPersonas, painPointsAdded, addEdges]); // Remove lockedItems dependency

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
           isRefreshing: false, // Remove refreshing state
           onToggleLock: () => {
             const workflowStore = useWorkflowStore.getState();
             workflowStore.togglePainPointLock(painPoint.id);
           },
           onFocus: () => {
             console.log(`Focus on pain point ${painPoint.id}`);
             focusOnPainPoint(painPoint.id);
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

  // Handle solution generation when moving to solution_generation step
  useEffect(() => {
    console.log('[WorkflowCanvas] Solution generation step check:', {
      currentStep,
      solutionsAdded,
      canvasInitialized,
      painPointsLength: painPoints.length
    });

    if (currentStep === 'solution_generation' && canvasInitialized && !solutionsAdded && painPoints.length > 0 && !focusGroupActive) {
      console.log('[WorkflowCanvas] Moving to solution generation step - adding solution nodes');
      
      const canvasStore = useCanvasStore.getState();
      
      // Calculate positions for solutions in two columns (right of pain points)
      const viewportWidth = window.innerWidth;
      const solutionBaseX = viewportWidth * 0.75; // Moved right from 71.67% to 75% to maintain spacing with shifted pain points
      const solutionColumn1X = solutionBaseX - 110; // First column - moved right to split the difference with second column
      const solutionColumn2X = solutionBaseX + 220; // Second column  
      const solutionSpacing = 200; // Slightly more spacing for solution nodes
      
      // Calculate vertical centering for solutions (8 nodes, 4 per column)
      const solutionTallestHeight = 3 * solutionSpacing; // 3 gaps between 4 nodes
      const solutionStartY = -(solutionTallestHeight / 2); // Center vertically

      console.log('[WorkflowCanvas] Solution positioning calculations:', {
        viewportWidth,
        solutionBaseX,
        solutionColumn1X,
        solutionColumn2X,
        columnSpacing: solutionColumn2X - solutionColumn1X,
        solutionStartY,
        solutionSpacing
      });

      // Add Solutions column label (centered between the two columns)
      const solutionsLabelNode: Node = {
        id: 'solutions-label',
        type: 'label',
        position: { x: solutionBaseX, y: solutionStartY - 120 }, // Centered above both columns
        data: {
          text: 'Solutions',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      // Create solution skeleton nodes - 8 total, arranged in two columns (4 in each)
      const solutionNodes: Node[] = [];
      const solutionEdges: Edge[] = [];

      // Create 8 solutions total, positioned in two columns (4 in each)
      for (let solutionIndex = 0; solutionIndex < 8; solutionIndex++) {
        const solutionId = `solution-${solutionIndex + 1}`;
        
        // Determine column and position within column
        const isFirstColumn = solutionIndex < 4;
        const columnX = isFirstColumn ? solutionColumn1X : solutionColumn2X;
        const columnIndex = isFirstColumn ? solutionIndex : solutionIndex - 4;
        const positionY = solutionStartY + (columnIndex * solutionSpacing);
        
        console.log(`[WorkflowCanvas] Creating ${solutionId} at position:`, {
          solutionIndex,
          isFirstColumn,
          columnX,
          columnIndex,
          positionY,
          column: isFirstColumn ? 'left' : 'right'
        });
        
        solutionNodes.push({
          id: solutionId,
          type: 'solution',
          position: {
            x: columnX,
            y: positionY
          },
          data: {
            id: solutionId,
            title: '',
            description: '',
            solutionType: 'feature' as const,
            complexity: 'medium' as const,
            isLocked: false,
            isSelected: false,
            isSkeleton: true, // Start in skeleton state
            isRefreshing: false, // Initially not refreshing
            onToggleLock: () => {
              console.log(`Toggle lock for solution ${solutionId}`);
            },
            onToggleSelect: () => {
              console.log(`Toggle selection for solution ${solutionId}`);
            }
          },
          draggable: true,
        });

        // Create edges from each persona to each solution for focus group mode
        for (let personaIndex = 0; personaIndex < 5; personaIndex++) {
          const personaId = `persona-${personaIndex + 1}`;
          
          solutionEdges.push({
            id: `persona-${personaIndex + 1}-to-solution-${solutionIndex + 1}`,
            source: personaId,
            target: solutionId,
            type: 'default',
            style: {
              stroke: '#FFD700', // Gold color for solution connections
              strokeWidth: 1.5,
              opacity: 0.2 // Very low opacity since there are many edges
            },
            animated: true, // Animated edges for solutions
          });
        }
      }

      // Add all solution nodes and edges
      console.log('[WorkflowCanvas] Adding solution skeleton nodes:', {
        labelNode: 1,
        nodeCount: solutionNodes.length,
        edgeCount: solutionEdges.length
      });
      
      addNodes([solutionsLabelNode, ...solutionNodes]);
      addEdges(solutionEdges);
      
      setSolutionsAdded(true);
    }
  }, [currentStep, canvasInitialized, solutionsAdded, painPoints.length, addNodes, addEdges, focusGroupActive]);

  // Update solution nodes when solutions are available from the edge function
  useEffect(() => {
    console.log('[WorkflowCanvas] Solutions update effect triggered:', {
      solutionsLength: solutions.length,
      canvasInitialized,
      solutionsAdded
    });
    
    if (solutions.length > 0 && canvasInitialized && solutionsAdded) {
      console.log('[WorkflowCanvas] Updating solution nodes with data:', solutions.length);
      
      const canvasStore = useCanvasStore.getState();
      
      // Update the first 8 solution nodes with actual data
      solutions.slice(0, 8).forEach((solution, index) => {
        const nodeId = `solution-${index + 1}`;
        console.log('[WorkflowCanvas] Updating solution node:', nodeId, 'with data:', {
          title: solution.title,
          description: solution.description,
          complexity: solution.feasibility_score
        });
        
        // Get the current node to preserve existing properties
        const currentNode = canvasStore.getNodeById(nodeId);
        console.log('[WorkflowCanvas] Current solution node before update:', currentNode);
        
        if (currentNode) {
          // Get locked state from current store state
          const currentLockedItems = useWorkflowStore.getState().lockedItems;
          
          const updatedData = {
            ...currentNode.data,
            id: nodeId,
            title: solution.title,
            description: solution.description,
            solutionType: solution.solution_type as 'feature' | 'integration' | 'automation' | 'analytics',
            complexity: solution.complexity as 'low' | 'medium' | 'high',
            isLocked: currentLockedItems.solutions.has(solution.id),
            isSelected: false,
            isSkeleton: false, // Remove skeleton state
            isRefreshing: false,
            onToggleLock: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.toggleSolutionLock(solution.id);
            },
            onToggleSelect: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.toggleSolutionSelection(solution.id);
            }
          };
          
          canvasStore.updateNode(nodeId, {
            data: updatedData
          });
          
          console.log('[WorkflowCanvas] Solution node updated:', nodeId);
        }
      });
      
      // If we have more than 8 solutions, log a warning
      if (solutions.length > 8) {
        console.warn('[WorkflowCanvas] More than 8 solutions available, only showing first 8');
      }
    }
  }, [solutions, canvasInitialized, solutionsAdded]);

  // Handle focus group mode - create special layout with solutions in a row and personas around center
  useEffect(() => {
    console.log('[WorkflowCanvas] Focus group mode check:', {
      currentStep,
      canvasInitialized,
      personasLength: personas.length,
      solutionsLength: solutions.length
    });

    if (currentStep === 'focus_group' && canvasInitialized && personas.length > 0 && solutions.length > 0) {
      console.log('[WorkflowCanvas] Entering focus group mode - creating special layout');
      
      // Set focus group active flag
      setFocusGroupActive(true);
      
      // Clear canvas for focus group view
      resetCanvas();
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position solutions in a row beneath the progress steps (top of view)
      const solutionRowY = -300; // Near top of canvas
      const solutionRowStartX = -(viewportWidth * 0.3); // Start left of center
      const solutionSpacing = 380; // Space between solution cards
      
      // Create solution row nodes (first 4 solutions)
      const solutionRowNodes: Node[] = [];
      solutions.slice(0, 4).forEach((solution, index) => {
        solutionRowNodes.push({
          id: `solution-row-${index + 1}`,
          type: 'solution',
          position: {
            x: solutionRowStartX + (index * solutionSpacing),
            y: solutionRowY
          },
          data: {
            id: `solution-row-${index + 1}`,
            title: solution.title,
            description: solution.description,
            solutionType: solution.solution_type as 'feature' | 'integration' | 'automation' | 'analytics',
            complexity: solution.complexity as 'low' | 'medium' | 'high',
            isLocked: lockedItems.solutions.has(solution.id),
            isSelected: false,
            isSkeleton: false,
            isRefreshing: false,
            onToggleLock: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.toggleSolutionLock(solution.id);
            },
            onToggleSelect: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.toggleSolutionSelection(solution.id);
            }
          },
          draggable: false, // Fixed position for focus group
        });
      });
      
      // Position the central solution (best solution or first one)
      const centralSolution = solutions[0]; // Use first solution as central
      const centralX = 0;
      const centralY = 100;
      
      const centralSolutionNode: Node = {
        id: 'central-solution',
        type: 'solution',
        position: { x: centralX - 190, y: centralY }, // Center accounting for node width
        data: {
          id: 'central-solution',
          title: centralSolution.title,
          description: centralSolution.description,
          solutionType: centralSolution.solution_type as 'feature' | 'integration' | 'automation' | 'analytics',
          complexity: centralSolution.complexity as 'low' | 'medium' | 'high',
          isLocked: lockedItems.solutions.has(centralSolution.id),
          isSelected: true, // Highlight central solution
          isSkeleton: false,
          isRefreshing: false,
          onToggleLock: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.toggleSolutionLock(centralSolution.id);
          },
          onToggleSelect: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.toggleSolutionSelection(centralSolution.id);
          }
        },
        draggable: false,
      };
      
      // Position personas in a circle around the central solution
      const radius = 400; // Distance from center
      const personaNodes: Node[] = [];
      const personaEdges: Edge[] = [];
      
      // Position 5 personas: 2 left, 1 bottom, 2 right
      const personaPositions = [
        { x: centralX - radius - 100, y: centralY - 100 }, // Left top
        { x: centralX - radius - 100, y: centralY + 100 }, // Left bottom
        { x: centralX, y: centralY + radius - 50 }, // Bottom center
        { x: centralX + radius - 100, y: centralY + 100 }, // Right bottom
        { x: centralX + radius - 100, y: centralY - 100 }, // Right top
      ];
      
      personas.slice(0, 5).forEach((persona, index) => {
        const position = personaPositions[index];
        const nodeId = `focus-persona-${index + 1}`;
        
        personaNodes.push({
          id: nodeId,
          type: 'persona',
          position: position,
          data: {
            id: nodeId,
            name: persona.name,
            industry: persona.demographics?.industry || 'Unknown',
            role: persona.demographics?.role || 'Unknown',
            painDegree: (persona as any).pain_degree || (persona as any).painDegree || 3,
            description: persona.description,
            isLocked: lockedItems.personas.has(persona.id),
            isExpanded: false,
            isSkeleton: false,
            isRefreshing: false,
            onToggleLock: () => {
              const workflowStore = useWorkflowStore.getState();
              workflowStore.togglePersonaLock(persona.id);
            }
          },
          draggable: false, // Fixed position for focus group
        });
        
        // Create edge from persona to central solution
        personaEdges.push({
          id: `${nodeId}-to-central`,
          source: nodeId,
          target: 'central-solution',
          type: 'focusGroup',
          data: {
            quote: getPersonaQuote(persona, centralSolution),
            personaName: persona.name,
            personaId: persona.id,
            solutionId: centralSolution.id,
            isHighlighted: index === 0 // Highlight first persona's connection
          },
          style: {
            stroke: '#FFD700',
            strokeWidth: 2,
            opacity: 0.8
          },
          animated: true,
        });
      });
      
      // Add label for Focus Group view
      const focusGroupLabel: Node = {
        id: 'focus-group-label',
        type: 'label',
        position: { x: 0, y: -450 },
        data: {
          text: 'Focus Group: Persona Feedback',
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };
      
      // Add all nodes and edges
      console.log('[WorkflowCanvas] Adding focus group nodes:', {
        solutionRow: solutionRowNodes.length,
        centralSolution: 1,
        personas: personaNodes.length,
        edges: personaEdges.length
      });
      
      addNodes([focusGroupLabel, ...solutionRowNodes, centralSolutionNode, ...personaNodes]);
      addEdges(personaEdges);
      
      // Center the view
      setTimeout(() => {
        const canvasStore = useCanvasStore.getState();
        canvasStore.setViewport({
          x: viewportWidth / 2,
          y: viewportHeight / 2 - 100,
          zoom: 0.8
        });
      }, 100);
    }
  }, [currentStep, canvasInitialized, personas, solutions, resetCanvas, addNodes, addEdges, lockedItems]);
  
  // Helper function to generate persona quotes
  const getPersonaQuote = (persona: any, solution: any) => {
    const quotes = [
      `As a ${persona.demographics?.role}, this would solve my biggest challenge`,
      `This ${solution.solution_type} would save our team hours every week`,
      `Finally, a solution that understands the ${persona.demographics?.industry} industry`,
      `I've been waiting for something like this in my role`,
      `My team would adopt this immediately`
    ];
    
    // Use persona index to select a consistent quote
    const index = personas.findIndex(p => p.id === persona.id);
    return quotes[index % quotes.length];
  };

  // Handle pain point focus mode - show focused view with persona, pain point, and solutions
  useEffect(() => {
    console.log('[WorkflowCanvas] Pain point focus mode check:', {
      focusedPainPointId,
      canvasInitialized,
      painPointsLength: painPoints.length,
      solutionsLength: solutions.length
    });

    if (focusedPainPointId && canvasInitialized && painPoints.length > 0) {
      console.log('[WorkflowCanvas] Entering pain point focus mode');
      
      const canvasStore = useCanvasStore.getState();
      
      // Find the focused pain point
      const focusedPainPoint = painPoints.find(p => p.id === focusedPainPointId);
      if (!focusedPainPoint) {
        console.error('[WorkflowCanvas] Focused pain point not found:', focusedPainPointId);
        return;
      }

      // Find the associated persona
      const associatedPersona = personas.find(p => p.id === focusedPainPoint.persona_id);
      if (!associatedPersona) {
        console.error('[WorkflowCanvas] Associated persona not found:', focusedPainPoint.persona_id);
        return;
      }

      console.log('[WorkflowCanvas] Creating focused view for:', {
        painPoint: focusedPainPoint.title,
        persona: associatedPersona.name
      });

      // Clear the canvas for focused view
      resetCanvas();

      // Calculate positions for focused view
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Center the persona node
      const personaX = -200;
      const personaY = -100;
      
      // Position pain point below persona
      const painPointX = personaX;
      const painPointY = personaY + 200;
      
      // Position solutions to the right of pain point
      const solutionBaseX = personaX + 400;
      const solutionStartY = painPointY - 100;
      const solutionSpacing = 120;

      // Create focused persona node
      const focusedPersonaNode: Node = {
        id: 'focused-persona',
        type: 'persona',
        position: { x: personaX, y: personaY },
        data: {
          id: 'focused-persona',
          name: associatedPersona.name,
          industry: associatedPersona.demographics?.industry || 'Unknown',
          role: associatedPersona.demographics?.role || 'Unknown',
          painDegree: (associatedPersona as any).pain_degree || (associatedPersona as any).painDegree || 3,
          description: associatedPersona.description,
          isLocked: lockedItems.personas.has(associatedPersona.id),
          isExpanded: true, // Expand in focused view
          isSkeleton: false,
          isRefreshing: false,
          onToggleLock: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.togglePersonaLock(associatedPersona.id);
          }
        },
        draggable: false, // Fixed position in focused view
      };

      // Create focused pain point node
      const focusedPainPointNode: Node = {
        id: 'focused-pain-point',
        type: 'painPoint',
        position: { x: painPointX, y: painPointY },
        data: {
          id: 'focused-pain-point',
          description: focusedPainPoint.description,
          severity: focusedPainPoint.severity === 1 ? 'low' : 
                   focusedPainPoint.severity === 2 ? 'medium' :
                   focusedPainPoint.severity === 3 ? 'high' :
                   focusedPainPoint.severity === 4 ? 'high' : 'critical',
          impactArea: focusedPainPoint.impact,
          isLocked: lockedItems.painPoints.has(focusedPainPoint.id),
          isSkeleton: false,
          isRefreshing: false,
          onToggleLock: () => {
            const workflowStore = useWorkflowStore.getState();
            workflowStore.togglePainPointLock(focusedPainPoint.id);
          },
          onFocus: () => {
            // Already focused, could implement unfocus or ignore
            console.log('[WorkflowCanvas] Already focused on this pain point');
          }
        },
        draggable: false, // Fixed position in focused view
      };

      // Create solution nodes (show up to 5 solutions)
      const solutionNodes: Node[] = [];
      const solutionEdges: Edge[] = [];

      // Get solutions related to this pain point (from solutionMappings)
      const relatedSolutions = solutions.filter(solution => {
        // Check if this solution addresses the focused pain point
        return painPoints.some(pp => pp.id === focusedPainPointId); // For now, show all solutions
      }).slice(0, 5);

      if (relatedSolutions.length === 0) {
        // Show placeholder solutions if no specific solutions found
        for (let i = 0; i < 3; i++) {
          const solutionId = `focused-solution-${i + 1}`;
          solutionNodes.push({
            id: solutionId,
            type: 'solution',
            position: {
              x: solutionBaseX,
              y: solutionStartY + (i * solutionSpacing)
            },
            data: {
              id: solutionId,
              title: 'Solution coming soon...',
              description: 'Solutions will be generated based on this pain point',
              solutionType: 'feature' as const,
              complexity: 'medium' as const,
              isLocked: false,
              isSelected: false,
              isSkeleton: true,
              isRefreshing: false,
              onToggleLock: () => console.log(`Toggle lock for ${solutionId}`),
              onToggleSelect: () => console.log(`Toggle selection for ${solutionId}`)
            },
            draggable: false,
          });
        }
      } else {
        // Show actual solutions
        relatedSolutions.forEach((solution, index) => {
          const solutionId = `focused-solution-${solution.id}`;
          solutionNodes.push({
            id: solutionId,
            type: 'solution',
            position: {
              x: solutionBaseX,
              y: solutionStartY + (index * solutionSpacing)
            },
            data: {
              id: solutionId,
              title: solution.title,
              description: solution.description,
              solutionType: 'feature' as const,
              complexity: solution.feasibility_score <= 3 ? 'low' : 
                         solution.feasibility_score <= 6 ? 'medium' : 'high',
              isLocked: lockedItems.solutions.has(solution.id),
              isSelected: false,
              isSkeleton: false,
              isRefreshing: false,
              onToggleLock: () => {
                const workflowStore = useWorkflowStore.getState();
                workflowStore.toggleSolutionLock(solution.id);
              },
              onToggleSelect: () => {
                const workflowStore = useWorkflowStore.getState();
                workflowStore.toggleSolutionSelection(solution.id);
              }
            },
            draggable: false,
          });
          
          // Create edge from pain point to solution
          solutionEdges.push({
            id: `pain-to-solution-${solution.id}`,
            source: 'focused-pain-point',
            target: solutionId,
            type: 'default',
            style: {
              stroke: '#10B981', // Green color for solution connections
              strokeWidth: 2,
              opacity: 0.8
            },
            animated: true,
          });
        });
      }

      // Create edge from persona to pain point
      const personaToPainEdge: Edge = {
        id: 'persona-to-pain-focused',
        source: 'focused-persona',
        target: 'focused-pain-point',
        type: 'default',
        style: {
          stroke: '#F97316', // Orange color
          strokeWidth: 3,
          opacity: 1
        },
        animated: false,
      };

      // Add back button (as a label node)
      const backButtonNode: Node = {
        id: 'back-button',
        type: 'label',
        position: { x: personaX - 100, y: personaY - 150 },
        data: {
          text: '← Back to Overview',
          showRefresh: false,
          onClick: () => {
            console.log('[WorkflowCanvas] Back button clicked');
            clearPainPointFocus();
          }
        },
        draggable: false,
        selectable: true,
      };

      // Add title for focused view
      const titleNode: Node = {
        id: 'focused-title',
        type: 'label',
        position: { x: personaX + 50, y: personaY - 150 },
        data: {
          text: `Focus: ${focusedPainPoint.title}`,
          showRefresh: false
        },
        draggable: false,
        selectable: false,
      };

      console.log('[WorkflowCanvas] Adding focused view nodes:', {
        personas: 1,
        painPoints: 1,
        solutions: solutionNodes.length,
        edges: solutionEdges.length + 1,
        labels: 2
      });

      // Add all nodes and edges for focused view
      addNodes([
        backButtonNode,
        titleNode,
        focusedPersonaNode,
        focusedPainPointNode,
        ...solutionNodes
      ]);
      
      addEdges([personaToPainEdge, ...solutionEdges]);

      // Center the view on the focused content
      setTimeout(() => {
        canvasStore.setViewport({
          x: -personaX + (viewportWidth / 2) - 200,
          y: -personaY + (viewportHeight / 2) - 50,
          zoom: 1.0
        });
      }, 100);
    }
     }, [focusedPainPointId, canvasInitialized, painPoints, personas, solutions, lockedItems, resetCanvas, addNodes, addEdges, clearPainPointFocus]);

  // Handle clearing pain point focus - restore main view
  useEffect(() => {
    console.log('[WorkflowCanvas] Pain point focus clear check:', {
      focusedPainPointId,
      canvasInitialized,
      currentStep
    });

    // If focus is cleared and we have initialized canvas, restore the main view
    if (!focusedPainPointId && canvasInitialized && currentStep !== 'problem_input') {
      console.log('[WorkflowCanvas] Restoring main view after focus clear');
      
      // Trigger a re-initialization to restore the main view
      // We do this by temporarily clearing canvasInitialized and letting the main effects rebuild
      setCanvasInitialized(false);
      
      // Force a small delay then re-initialize
      setTimeout(() => {
        setCanvasInitialized(true);
      }, 50);
    }
  }, [focusedPainPointId, canvasInitialized, currentStep]);
  
    // NOTE: Removed competing step change navigation - now handled by ProgressSteps in App.tsx

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