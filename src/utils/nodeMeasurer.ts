import { useCallback } from 'react';
import { Node } from '@xyflow/react';

interface NodeMeasurements {
  width: number;
  height: number;
  actualPosition: { x: number; y: number };
  boundingRect: DOMRect | null;
}

interface CenteringCalculation {
  targetX: number;
  targetY: number;
  optimalZoom: number;
  requiredPadding: number;
}

export class NodeMeasurer {
  private static instance: NodeMeasurer;
  private measurementCache = new Map<string, NodeMeasurements>();

  static getInstance(): NodeMeasurer {
    if (!NodeMeasurer.instance) {
      NodeMeasurer.instance = new NodeMeasurer();
    }
    return NodeMeasurer.instance;
  }

  // Measure actual DOM dimensions of a node
  measureNode(nodeId: string): NodeMeasurements | null {
    // Check cache first
    if (this.measurementCache.has(nodeId)) {
      return this.measurementCache.get(nodeId)!;
    }

    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
    if (!nodeElement) return null;

    const rect = nodeElement.getBoundingClientRect();
    const measurements: NodeMeasurements = {
      width: rect.width,
      height: rect.height,
      actualPosition: { x: rect.left, y: rect.top },
      boundingRect: rect
    };

    // Cache for performance
    this.measurementCache.set(nodeId, measurements);
    
    // Clear cache after 5 seconds to handle dynamic content
    setTimeout(() => {
      this.measurementCache.delete(nodeId);
    }, 5000);

    return measurements;
  }

  // Calculate optimal centering for CoreProblemNode
  calculateCenteringForProblemNode(
    nodeId: string = 'core-problem'
  ): CenteringCalculation | null {
    const measurements = this.measureNode(nodeId);
    if (!measurements) return null;

    // Get viewport dimensions accounting for UI elements
    const sidebar = document.querySelector('[data-sidebar]');
    const header = document.querySelector('[data-header]');
    
    const sidebarWidth = sidebar?.getBoundingClientRect().width || 256;
    const headerHeight = header?.getBoundingClientRect().height || 80;
    
    const availableWidth = window.innerWidth - sidebarWidth;
    const availableHeight = window.innerHeight - headerHeight;

    // Calculate optimal zoom based on content and screen size
    const contentToScreenRatio = Math.min(
      availableWidth / (measurements.width * 2), // 2x for breathing room
      availableHeight / (measurements.height * 2)
    );
    
    const optimalZoom = Math.max(0.5, Math.min(1.8, contentToScreenRatio));

    // Calculate center position in available space
    const centerX = sidebarWidth + (availableWidth / 2);
    const centerY = headerHeight + (availableHeight / 2);

    // Account for zoom level in positioning
    const zoomedNodeWidth = measurements.width * optimalZoom;
    const zoomedNodeHeight = measurements.height * optimalZoom;

    const targetX = centerX - (zoomedNodeWidth / 2);
    const targetY = centerY - (zoomedNodeHeight / 2);

    // Dynamic padding based on screen size and content
    const requiredPadding = Math.max(
      60, // Minimum padding
      Math.min(availableWidth, availableHeight) * 0.1 // 10% of smaller dimension
    );

    return {
      targetX,
      targetY,
      optimalZoom,
      requiredPadding
    };
  }

  // Get smart positioning for Step 1 that adapts to content length
  getStep1Positioning(): CenteringCalculation | null {
    const calculation = this.calculateCenteringForProblemNode();
    if (!calculation) return null;

    // Check if CoreProblemNode has content to adjust zoom accordingly
    const problemElement = document.querySelector('[data-id="core-problem"]');
    const textContent = problemElement?.textContent || '';
    
    // Adjust zoom based on text length (longer content = zoom out slightly)
    const textLengthFactor = Math.max(0.8, Math.min(1.2, 100 / textContent.length));
    calculation.optimalZoom *= textLengthFactor;

    return calculation;
  }

  // Clear cache when nodes change
  clearCache(nodeId?: string): void {
    if (nodeId) {
      this.measurementCache.delete(nodeId);
    } else {
      this.measurementCache.clear();
    }
  }
}

// React hook wrapper for the measurer
export const useNodeMeasurer = () => {
  const measurer = NodeMeasurer.getInstance();

  const measureAndCenter = useCallback((nodeId: string = 'core-problem') => {
    // Clear cache to get fresh measurements
    measurer.clearCache(nodeId);
    
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      const calculation = measurer.getStep1Positioning();
      if (calculation) {
        return calculation;
      }
    }, 50);
  }, [measurer]);

  return {
    measureNode: measurer.measureNode.bind(measurer),
    calculateCentering: measurer.calculateCenteringForProblemNode.bind(measurer),
    getStep1Positioning: measurer.getStep1Positioning.bind(measurer),
    clearCache: measurer.clearCache.bind(measurer),
    measureAndCenter
  };
}; 