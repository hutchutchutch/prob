import { useEffect, useCallback } from 'react';
import { useVersionStore } from '../stores/versionStore';
import { useCanvasStore } from '../stores/canvasStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { Node, Edge } from 'reactflow';

export const useVersionHistory = () => {
  const { 
    addEvent, 
    events, 
    currentEventIndex,
    isPreviewMode,
    previewEventId,
    navigatePrevious,
    navigateNext,
    previewEvent,
    exitPreview,
    restoreToEvent,
    getFilteredEvents,
  } = useVersionStore();
  
  const { nodes, edges } = useCanvasStore();
  const { currentProjectId } = useWorkflowStore();
  
  // Track node changes
  const trackNodeChange = useCallback((
    changeType: 'added' | 'updated' | 'deleted',
    node: Node,
    previousNode?: Node
  ) => {
    if (!currentProjectId || isPreviewMode) return;
    
    addEvent({
      projectId: currentProjectId,
      eventType: `node_${changeType}`,
      eventData: {
        beforeState: previousNode || null,
        afterState: changeType === 'deleted' ? null : node,
        changesDiff: {
          nodeId: node.id,
          nodeType: node.type,
          changes: changeType,
        },
        metadata: {
          triggeredBy: 'user_action',
          nodeType: node.type || 'unknown',
          nodeId: node.id,
          description: `${changeType} ${node.type || 'node'}: ${node.data?.label || node.id}`,
        },
      },
    });
  }, [currentProjectId, isPreviewMode, addEvent]);
  
  // Track edge changes
  const trackEdgeChange = useCallback((
    changeType: 'added' | 'removed',
    edge: Edge
  ) => {
    if (!currentProjectId || isPreviewMode) return;
    
    addEvent({
      projectId: currentProjectId,
      eventType: `edge_${changeType}`,
      eventData: {
        beforeState: changeType === 'removed' ? edge : null,
        afterState: changeType === 'added' ? edge : null,
        metadata: {
          triggeredBy: 'user_action',
          description: `${changeType} edge from ${edge.source} to ${edge.target}`,
        },
      },
    });
  }, [currentProjectId, isPreviewMode, addEvent]);
  
  // Track validation events
  const trackValidation = useCallback((
    nodeId: string,
    nodeType: string,
    success: boolean,
    details?: any
  ) => {
    if (!currentProjectId || isPreviewMode) return;
    
    addEvent({
      projectId: currentProjectId,
      eventType: 'validation',
      eventData: {
        afterState: { nodeId, success, details },
        metadata: {
          triggeredBy: 'ai_validation',
          nodeId,
          nodeType,
          description: `${nodeType} validation ${success ? 'succeeded' : 'failed'}`,
        },
      },
    });
  }, [currentProjectId, isPreviewMode, addEvent]);
  
  // Track generation events
  const trackGeneration = useCallback((
    generationType: string,
    results: any[],
    metadata?: any
  ) => {
    if (!currentProjectId || isPreviewMode) return;
    
    addEvent({
      projectId: currentProjectId,
      eventType: 'generation',
      eventData: {
        afterState: { generationType, results, count: results.length },
        metadata: {
          triggeredBy: 'ai_generation',
          description: `Generated ${results.length} ${generationType}`,
          ...metadata,
        },
      },
    });
  }, [currentProjectId, isPreviewMode, addEvent]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Navigate with arrow keys
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
      } else if (e.key === 'Escape' && isPreviewMode) {
        e.preventDefault();
        exitPreview();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigatePrevious, navigateNext, isPreviewMode, exitPreview]);
  
  return {
    events,
    currentEventIndex,
    isPreviewMode,
    previewEventId,
    
    // Actions
    trackNodeChange,
    trackEdgeChange,
    trackValidation,
    trackGeneration,
    navigatePrevious,
    navigateNext,
    previewEvent,
    exitPreview,
    restoreToEvent,
    getFilteredEvents,
    
    // Computed values
    canNavigatePrevious: currentEventIndex > 0,
    canNavigateNext: currentEventIndex < events.length - 1,
    totalEvents: events.length,
  };
};