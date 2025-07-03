import { useCallback, useRef } from 'react';
import { useReactFlow, Node } from '@xyflow/react';
import { useCanvasStore } from '@/stores/canvasStore';

interface ViewportDimensions {
  width: number;
  height: number;
}

interface NodeCenteringOptions {
  padding?: number;
  zoom?: number;
  duration?: number;
  includeSidebar?: boolean;
}

export const useCanvasNavigation = () => {
  const { 
    getViewport, 
    setViewport, 
    getNode, 
    getNodes,
    fitView 
  } = useReactFlow();
  
  const { updateNode } = useCanvasStore();
  
  const viewportRef = useRef<ViewportDimensions>({ width: 0, height: 0 });

  // Get current viewport dimensions accounting for sidebar
  const getEffectiveViewport = useCallback((includeSidebar = false): ViewportDimensions => {
    const container = document.querySelector('.react-flow__renderer');
    if (!container) return { width: 1200, height: 800 }; // fallback
    
    const rect = container.getBoundingClientRect();
    const sidebarWidth = includeSidebar ? 0 : 256; // Your sidebar width
    
    return {
      width: rect.width - sidebarWidth,
      height: rect.height
    };
  }, []);

  // Center on a specific node with dynamic positioning
  const centerOnNode = useCallback((
    nodeId: string, 
    options: NodeCenteringOptions = {}
  ) => {
    const {
      padding = 100,
      zoom = 1.2,
      duration = 800,
      includeSidebar = false
    } = options;

    const node = getNode(nodeId);
    if (!node) return;

    const viewport = getEffectiveViewport(includeSidebar);
    const sidebarOffset = includeSidebar ? 0 : 256;

    // Calculate the center position accounting for node dimensions
    const nodeWidth = node.measured?.width || node.width || 320;
    const nodeHeight = node.measured?.height || node.height || 120;
    
    // Calculate viewport center, accounting for sidebar
    const viewportCenterX = (viewport.width / 2) + (sidebarOffset / 2);
    const viewportCenterY = viewport.height / 2;

    // Calculate where the node center is in flow coordinates
    const nodeCenterX = node.position.x + (nodeWidth / 2);
    const nodeCenterY = node.position.y + (nodeHeight / 2);

    // Calculate the viewport translation needed using proper React Flow mathematics
    // The viewport x and y represent canvas translation where negative values 
    // move the canvas left/up (making nodes appear right/down)
    const flowX = viewportCenterX - (nodeCenterX * zoom);
    const flowY = viewportCenterY - (nodeCenterY * zoom);

    console.log('[useCanvasNavigation] Centering calculation:', {
      nodeId,
      nodePosition: node.position,
      nodeDimensions: { width: nodeWidth, height: nodeHeight },
      nodeCenterX,
      nodeCenterY,
      viewportCenterX,
      viewportCenterY,
      sidebarOffset,
      calculatedViewport: { x: flowX, y: flowY, zoom }
    });

    // Animate to the new viewport
    setViewport(
      {
        x: flowX,
        y: flowY,
        zoom: zoom
      },
      { duration }
    );
  }, [getNode, getEffectiveViewport, setViewport]);

  // Step 1 positioning that matches the initial canvas setup exactly
  const goToStep1 = useCallback(() => {
    console.log('[useCanvasNavigation] goToStep1 called');
    
    const allNodes = getNodes();
    console.log('[useCanvasNavigation] All available nodes:', allNodes.map(n => ({ id: n.id, type: n.type })));
    
    const coreNode = getNode('problem-input');
    if (!coreNode) {
      console.warn('[useCanvasNavigation] Core node "problem-input" not found! Trying alternative IDs...');
      
      // Try alternative node IDs
      const alternativeNode = allNodes.find(node => 
        node.id.includes('problem') || 
        node.type === 'problem' ||
        node.id.includes('core')
      );
      
      if (alternativeNode) {
        console.log('[useCanvasNavigation] Found alternative core node:', alternativeNode.id);
        centerOnNode(alternativeNode.id, { padding: 100, zoom: 1.2, duration: 1000 });
      } else {
        console.error('[useCanvasNavigation] No core problem node found at all!');
      }
      return;
    }
    
    console.log('[useCanvasNavigation] Core node found:', coreNode.id, 'at position:', coreNode.position);
    
    // Use the exact same logic as the initial canvas setup in WorkflowCanvas.tsx
    // The problem node is positioned at -viewportWidth/3, so we reverse that calculation
    const problemNodeX = coreNode.position.x;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Match the initial setup exactly:
    // x: -problemNodeX + (window.innerWidth / 2) - 200
    // y: (window.innerHeight / 2) - 100  
    // zoom: 1.2
    const targetViewport = {
      x: -problemNodeX + (viewportWidth / 2) - 200,
      y: (viewportHeight / 2) - 100,
      zoom: 1.2
    };
    
    console.log('[useCanvasNavigation] Step 1 calculation (matching initial setup):', {
      problemNodeX,
      viewportWidth,
      viewportHeight,
      targetViewport
    });

    // Animate to the calculated viewport
    setViewport(targetViewport, { duration: 1000 });
  }, [getNode, getNodes, setViewport]);

  // Smart Step 2 positioning that shows CoreProblemNode and PersonaNodes in optimal persona discovery layout
  const goToStep2 = useCallback(() => {
    console.log('[useCanvasNavigation] goToStep2 called');
    
    const allNodes = getNodes();
    console.log('[useCanvasNavigation] All available nodes:', allNodes.map(n => ({ id: n.id, type: n.type })));
    
    const coreNode = getNode('problem-input');
    if (!coreNode) {
      console.warn('[useCanvasNavigation] Core node "problem-input" not found! Trying alternative IDs...');
      
      // Try alternative node IDs
      const alternativeNode = allNodes.find(node => 
        node.id.includes('problem') || 
        node.type === 'problem' ||
        node.id.includes('core')
      );
      
      if (alternativeNode) {
        console.log('[useCanvasNavigation] Found alternative node:', alternativeNode.id);
        centerOnNode(alternativeNode.id, { padding: 100, zoom: 1.0, duration: 1000 });
      } else {
        console.error('[useCanvasNavigation] No core problem node found at all!');
      }
      return;
    }

    console.log('[useCanvasNavigation] Core node found:', coreNode.id);

    // Get all nodes to understand the current layout
    // (allNodes already defined above)
    const viewport = getEffectiveViewport(false);
    
    // Find persona nodes
    const personaNodes = allNodes.filter(node => 
      node.id.startsWith('persona-') && node.id !== 'personas-label'
    );

    console.log('[useCanvasNavigation] Step 2 positioning:', {
      coreNode: coreNode.id,
      personaNodes: personaNodes.map(n => n.id),
      viewport
    });

    // Reset persona nodes to their original positions (matching WorkflowCanvas.tsx initial setup)
    const personaNodeX = 0; // Center column
    const personaStartY = -300; // Start position for first persona
    const personaSpacing = 150; // Vertical spacing between personas
    
    console.log('[useCanvasNavigation] Resetting persona nodes to original positions');
    personaNodes.forEach((node, index) => {
      const originalPosition = {
        x: personaNodeX,
        y: personaStartY + (index * personaSpacing)
      };
      
      console.log(`[useCanvasNavigation] Resetting ${node.id} to position:`, originalPosition);
      
      updateNode(node.id, {
        position: originalPosition
      });
    });

    // Calculate optimal zoom to fit both problem node and persona nodes with more focus on personas
    const sidebarOffset = 256; // Account for sidebar
    const availableWidth = viewport.width - sidebarOffset;
    const availableHeight = viewport.height;

    // Calculate bounding box of all relevant nodes (problem + personas)
    const allRelevantNodes = [coreNode, ...personaNodes];
    const bounds = allRelevantNodes.reduce((acc, node) => {
      const nodeWidth = node.measured?.width || node.width || 300;
      const nodeHeight = node.measured?.height || node.height || 150;
      
      return {
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + nodeWidth),
        maxY: Math.max(acc.maxY, node.position.y + nodeHeight)
      };
    }, {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });

    const totalWidth = bounds.maxX - bounds.minX;
    const totalHeight = bounds.maxY - bounds.minY;

    // Step 2 specific positioning: Balanced zoom for persona overview
    const padding = 100; // More padding for better overview
    const zoomX = availableWidth / (totalWidth + padding * 2);
    const zoomY = availableHeight / (totalHeight + padding * 2);
    const optimalZoom = Math.min(zoomX, zoomY, 0.9); // Slightly zoomed out for better overview

    // For Step 2, personas should be the main focus - shift very dramatically to center them
    // Calculate the actual center of just the persona nodes for better positioning
    const personaBounds = personaNodes.reduce((acc, node) => {
      const pos = node.position;
      return {
        minX: Math.min(acc.minX, pos.x),
        maxX: Math.max(acc.maxX, pos.x + (node.measured?.width || 200)),
        minY: Math.min(acc.minY, pos.y),
        maxY: Math.max(acc.maxY, pos.y + (node.measured?.height || 150))
      };
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    
    // Center on the actual persona cluster
    const layoutCenterX = personaBounds.minX + (personaBounds.maxX - personaBounds.minX) / 2;
    const layoutCenterY = personaBounds.minY + (personaBounds.maxY - personaBounds.minY) / 2;

    // Calculate the viewport position to center the layout
    const viewportCenterX = (availableWidth / 2) + sidebarOffset;
    const viewportCenterY = availableHeight / 2;

    const flowX = viewportCenterX - (layoutCenterX * optimalZoom);
    const flowY = viewportCenterY - (layoutCenterY * optimalZoom);

    console.log('[useCanvasNavigation] Step 2 calculation:', {
      bounds,
      totalWidth,
      totalHeight,
      optimalZoom,
      layoutCenter: { x: layoutCenterX, y: layoutCenterY },
      viewportCenter: { x: viewportCenterX, y: viewportCenterY },
      targetViewport: { x: flowX, y: flowY, zoom: optimalZoom }
    });

    // Animate to the calculated viewport
    setViewport(
      {
        x: flowX,
        y: flowY,
        zoom: optimalZoom
      },
      { duration: 1000 }
    );
  }, [getNode, getNodes, getEffectiveViewport, setViewport, updateNode]);

  // Progressive reveal for multi-step workflows
  const goToStep = useCallback((stepNumber: number) => {
    const stepConfigs = {
      1: { 
        nodeIds: ['problem-input'],
        zoom: 1.2,
        focus: 'problem-input'
      },
      2: { 
        nodeIds: ['problem-input', 'persona-1', 'persona-2', 'persona-3', 'persona-4', 'persona-5'],
        zoom: 0.9,
        focus: null // Let fitView handle centering
      },
      3: {
        nodeIds: ['problem-input', 'persona-1', 'persona-2', 'persona-3', 'persona-4', 'persona-5', 
                  'pain-point-1', 'pain-point-2', 'pain-point-3', 'pain-point-4', 'pain-point-5', 
                  'pain-point-6', 'pain-point-7'],
        zoom: 0.7,
        focus: null // Let fitView handle centering
      }
    };

    const config = stepConfigs[stepNumber as keyof typeof stepConfigs];
    if (!config) return;

    if (stepNumber === 1) {
      goToStep1();
      return;
    }

    // For multi-node steps, fit view to include all relevant nodes
    const relevantNodes = getNodes().filter(node => 
      config.nodeIds.includes(node.id)
    );

    if (relevantNodes.length === 0) return;

    // Calculate bounding box of relevant nodes
    const bounds = relevantNodes.reduce((acc, node) => {
      const nodeWidth = node.measured?.width || node.width || 300;
      const nodeHeight = node.measured?.height || node.height || 150;
      
      return {
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + nodeWidth),
        maxY: Math.max(acc.maxY, node.position.y + nodeHeight)
      };
    }, {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });

    const viewport = getEffectiveViewport(false);
    const padding = Math.max(100, viewport.width * 0.1);

    // Use React Flow's fitView with calculated bounds
    fitView({
      nodes: relevantNodes,
      padding,
      duration: 1200, // Slightly longer for smoother transition
      maxZoom: config.zoom,
      minZoom: config.zoom * 0.8 // Prevent over-zooming out
    });
  }, [goToStep1, getNodes, getEffectiveViewport, fitView]);

  // Responsive canvas setup that adapts to window resize
  const setupResponsiveCanvas = useCallback(() => {
    const updateViewport = () => {
      const newViewport = getEffectiveViewport(false);
      viewportRef.current = newViewport;
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, [getEffectiveViewport]);

  // Get optimal positioning for new nodes based on current viewport
  const getOptimalNodePosition = useCallback((
    nodeType: 'persona' | 'painPoint' | 'solution',
    index: number = 0
  ) => {
    const viewport = getEffectiveViewport(false);
    const currentViewport = getViewport();

    // Calculate visible area center in flow coordinates
    const visibleCenterX = (-currentViewport.x + viewport.width / 2) / currentViewport.zoom;
    const visibleCenterY = (-currentViewport.y + viewport.height / 2) / currentViewport.zoom;

    // Position strategies for different node types
    const strategies = {
      persona: {
        x: visibleCenterX + 400 + (index * 50), // Stagger to the right
        y: visibleCenterY - 200 + (index * 180)  // Vertical distribution
      },
      painPoint: {
        x: visibleCenterX + 800 + (index * 30),
        y: visibleCenterY - 150 + (index * 160)
      },
      solution: {
        x: visibleCenterX + 1200 + (index * 40),
        y: visibleCenterY - 100 + (index * 140)
      }
    };

    return strategies[nodeType];
  }, [getEffectiveViewport, getViewport]);

  return {
    centerOnNode,
    goToStep1,
    goToStep2,
    goToStep,
    setupResponsiveCanvas,
    getOptimalNodePosition,
    getEffectiveViewport
  };
}; 