import { useMemo } from 'react';
import { useVersionStore, VersionEvent } from '../stores/versionStore';
import { Node, Edge } from 'reactflow';

interface ReconstructedState {
  nodes: Node[];
  edges: Edge[];
  lockedItems: Set<string>;
  metadata: {
    lastUpdated: string;
    eventCount: number;
  };
}

export const useStateReconstruction = (targetEventId?: string) => {
  const { events, currentEventIndex, previewEventId, isPreviewMode } = useVersionStore();
  
  const reconstructedState = useMemo(() => {
    // Determine which event to reconstruct to
    let targetIndex: number;
    
    if (targetEventId) {
      // Reconstruct to specific event
      targetIndex = events.findIndex(e => e.id === targetEventId);
    } else if (isPreviewMode && previewEventId) {
      // Preview mode
      targetIndex = events.findIndex(e => e.id === previewEventId);
    } else {
      // Current state
      targetIndex = currentEventIndex;
    }
    
    if (targetIndex === -1) {
      return null;
    }
    
    // Start with empty state
    const state: ReconstructedState = {
      nodes: [],
      edges: [],
      lockedItems: new Set(),
      metadata: {
        lastUpdated: new Date().toISOString(),
        eventCount: targetIndex + 1,
      },
    };
    
    // Replay events up to target
    for (let i = 0; i <= targetIndex; i++) {
      const event = events[i];
      applyEventToState(state, event);
    }
    
    return state;
  }, [events, currentEventIndex, previewEventId, isPreviewMode, targetEventId]);
  
  return reconstructedState;
};

function applyEventToState(state: ReconstructedState, event: VersionEvent): void {
  const { eventType, eventData } = event;
  
  switch (eventType) {
    case 'node_added':
      if (eventData.afterState) {
        state.nodes.push(eventData.afterState);
      }
      break;
      
    case 'node_updated':
      if (eventData.afterState) {
        const index = state.nodes.findIndex(n => n.id === eventData.afterState.id);
        if (index !== -1) {
          state.nodes[index] = eventData.afterState;
        }
      }
      break;
      
    case 'node_deleted':
      if (eventData.changesDiff?.nodeId) {
        state.nodes = state.nodes.filter(n => n.id !== eventData.changesDiff.nodeId);
        // Also remove connected edges
        state.edges = state.edges.filter(
          e => e.source !== eventData.changesDiff.nodeId && e.target !== eventData.changesDiff.nodeId
        );
      }
      break;
      
    case 'edge_added':
      if (eventData.afterState) {
        state.edges.push(eventData.afterState);
      }
      break;
      
    case 'edge_removed':
      if (eventData.beforeState) {
        state.edges = state.edges.filter(
          e => !(e.source === eventData.beforeState.source && e.target === eventData.beforeState.target)
        );
      }
      break;
      
    case 'lock_toggled':
      if (eventData.metadata.nodeId) {
        if (eventData.afterState?.isLocked) {
          state.lockedItems.add(eventData.metadata.nodeId);
        } else {
          state.lockedItems.delete(eventData.metadata.nodeId);
        }
      }
      break;
      
    case 'generation':
      // Handle bulk generation events
      if (eventData.afterState?.results && eventData.afterState.generationType) {
        const { generationType, results } = eventData.afterState;
        
        // Add nodes based on generation type
        if (generationType === 'personas' || generationType === 'pain_points' || generationType === 'solutions') {
          results.forEach((item: any) => {
            if (item.node) {
              state.nodes.push(item.node);
            }
            if (item.edges) {
              state.edges.push(...item.edges);
            }
          });
        }
      }
      break;
  }
  
  // Update metadata
  state.metadata.lastUpdated = event.timestamp;
}