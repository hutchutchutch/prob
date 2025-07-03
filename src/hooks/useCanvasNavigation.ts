import { useCallback, useRef } from 'react';
import { useReactFlow, Node } from '@xyflow/react';

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

  // Smart Step 1 positioning that adapts to content
  const goToStep1 = useCallback(() => {
    const coreNode = getNode('problem-input');
    if (!coreNode) return;

    // Get all nodes to understand the current layout
    const allNodes = getNodes();
    const viewport = getEffectiveViewport(false);

    // Calculate optimal zoom based on screen size
    const baseZoom = Math.min(
      viewport.width / 1200,  // Normalize to base width
      viewport.height / 800   // Normalize to base height
    );
    
    const optimalZoom = Math.max(0.8, Math.min(1.5, baseZoom * 1.2));

    // Dynamic padding based on screen size
    const dynamicPadding = Math.max(50, viewport.width * 0.08);

    centerOnNode('problem-input', {
      padding: dynamicPadding,
      zoom: optimalZoom,
      duration: 1000
    });
  }, [centerOnNode, getNode, getNodes, getEffectiveViewport]);

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
    goToStep,
    setupResponsiveCanvas,
    getOptimalNodePosition,
    getEffectiveViewport
  };
}; 