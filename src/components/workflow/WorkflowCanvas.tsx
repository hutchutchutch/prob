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
              workflowStore.regeneratePersonas();
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
      canvasInitialized,
      coreProblemValidated: coreProblem?.is_validated
    });

    // Only add pain points AFTER a problem has been validated and submitted
    if (isGeneratingPersonas && canvasInitialized && !painPointsAdded && coreProblem?.is_validated) {
      console.log('[WorkflowCanvas] Persona generation started - animating edges and adding pain point skeletons');
      
      const canvasStore = useCanvasStore.getState();
      
      // Animate the problem-to-persona edges
      for (let i = 1; i <= 5; i++) {
        canvasStore.updateEdge(`problem-to-persona-${i}`, {
          animated: true
        });
      }

      // Calculate positions for pain points in two columns (right third of screen)
      const viewportWidth = window.innerWidth;
      const painPointBaseX = viewportWidth / 3; // Base position for pain points
      const painPointColumn1X = painPointBaseX - 220; // First column (3 nodes) - increased spacing
      const painPointColumn2X = painPointBaseX + 220; // Second column (4 nodes) - increased spacing
      const painPointStartY = -300; // Start position for first pain point
      const painPointSpacing = 180; // Increased vertical spacing for better separation
      
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
            isSkeleton: true, // Start in skeleton state
            onToggleLock: () => {
              console.log(`Toggle lock for pain point ${painPointId}`);
            },
            onFocus: () => {
              console.log(`Focus on pain point ${painPointId}`);
              focusOnPainPoint(painPointId);
            }
          },
          draggable: true,
        });
      }

      // Add pain point nodes first (without edges yet)
      console.log('[WorkflowCanvas] Adding pain point skeleton nodes:', {
        labelNode: 1,
        nodeCount: painPointNodes.length
      });
      
      addNodes([painPointsLabelNode, ...painPointNodes]);
      setPainPointsAdded(true);
      
      // NOTE: Canvas navigation is now handled by ProgressSteps in App.tsx
      // NOTE: Edges will be created later when personas have source handles ready
    }
  }, [isGeneratingPersonas, canvasInitialized, painPointsAdded, coreProblem, addNodes, addEdges, updateEdge, zoomTo]);

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
        
        const updatedData = {
          id: nodeId,
          name: persona.name,
          industry: persona.demographics?.industry || 'Unknown',
          role: persona.demographics?.role || 'Unknown',
          painDegree: (persona as any).pain_degree || (persona as any).painDegree || Math.floor(Math.random() * 5) + 1,
          description: persona.description,
          isLocked: lockedItems.personas.has(persona.id),
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

        // Now create the persona-to-pain-point edges since personas have source handles
        if (painPointsAdded) {
          console.log('[WorkflowCanvas] Creating persona-to-pain-point edges now that personas have source handles');
          
          const painPointEdges: Edge[] = [];
          
          // Create edges from each persona to each pain point (many-to-many relationship)
          for (let painIndex = 0; painIndex < 7; painIndex++) {
            const painPointId = `pain-point-${painIndex + 1}`;
            
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
          
          console.log('[WorkflowCanvas] Adding persona-to-pain-point edges:', {
            edgeCount: painPointEdges.length
          });
          
          addEdges(painPointEdges);
        }
      }
    }
  }, [personas, canvasInitialized, isGeneratingPersonas, painPointsAdded, addEdges, lockedItems]);

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

    if (currentStep === 'solution_generation' && canvasInitialized && !solutionsAdded && painPoints.length > 0) {
      console.log('[WorkflowCanvas] Moving to solution generation step - adding solution nodes');
      
      const canvasStore = useCanvasStore.getState();
      
      // Calculate positions for solutions in two columns (right of pain points)
      const viewportWidth = window.innerWidth;
      const solutionBaseX = (viewportWidth / 3) * 2; // Right third of screen
      const solutionColumn1X = solutionBaseX - 220; // First column
      const solutionColumn2X = solutionBaseX + 220; // Second column  
      const solutionStartY = -300; // Same vertical start as pain points
      const solutionSpacing = 200; // Slightly more spacing for solution nodes
      
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
  }, [currentStep, canvasInitialized, solutionsAdded, painPoints.length, addNodes, addEdges]);

  // Handle focus group mode - add quotes to edges between personas and solutions
  useEffect(() => {
    console.log('[WorkflowCanvas] Focus group mode check:', {
      currentStep,
      canvasInitialized,
      solutionsAdded,
      personasLength: personas.length,
      solutionsLength: solutions.length
    });

    if (currentStep === 'focus_group' && canvasInitialized && solutionsAdded && personas.length > 0) {
      console.log('[WorkflowCanvas] Entering focus group mode - updating edges with quotes');
      
      const canvasStore = useCanvasStore.getState();
      
      // Sample quotes for demo purposes - in real app, these would come from API
      const sampleQuotes = [
        "This would save me hours every week",
        "Finally, a solution that understands our workflow",
        "I've been waiting for something like this",
        "This addresses my biggest pain point",
        "My team would love this feature"
      ];
      
      // Update existing edges to focus group type with quotes
      let quoteIndex = 0;
      for (let personaIndex = 0; personaIndex < Math.min(5, personas.length); personaIndex++) {
        for (let solutionIndex = 0; solutionIndex < 8; solutionIndex++) {
          const edgeId = `persona-${personaIndex + 1}-to-solution-${solutionIndex + 1}`;
          const persona = personas[personaIndex];
          
          // Only add quotes to some edges (e.g., high-value connections)
          if (Math.random() > 0.7 && persona) { // 30% chance to show quote
            canvasStore.updateEdge(edgeId, {
              type: 'focusGroup',
              data: {
                quote: sampleQuotes[quoteIndex % sampleQuotes.length],
                personaName: persona.name,
                personaId: persona.id,
                solutionId: `solution-${solutionIndex + 1}`,
                isHighlighted: Math.random() > 0.8 // 20% chance to highlight
              }
            });
            quoteIndex++;
          }
        }
      }
      
      console.log('[WorkflowCanvas] Focus group mode edges updated with quotes');
    }
  }, [currentStep, canvasInitialized, solutionsAdded, personas, solutions]);

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