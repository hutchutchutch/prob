import { useState, useEffect, useRef, useCallback } from 'react';
import { Node, Edge, useReactFlow } from 'reactflow';
import { AnimationSequence } from '../components/DemoCanvas/AnimationSequence';

export interface DemoAnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPhase: string;
  progress: number;
  loopCount: number;
}

export function useDemoAnimation() {
  const { setNodes, setEdges, fitView } = useReactFlow();
  const [animationState, setAnimationState] = useState<DemoAnimationState>({
    isPlaying: false,
    isPaused: false,
    currentPhase: 'idle',
    progress: 0,
    loopCount: 0,
  });
  
  const sequenceRef = useRef<AnimationSequence | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  
  // Store nodes and edges for reset
  const storeState = useCallback((nodes: Node[], edges: Edge[]) => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, []);
  
  // Reset canvas to initial state
  const resetCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setAnimationState(prev => ({
      ...prev,
      currentPhase: 'idle',
      progress: 0,
    }));
  }, [setNodes, setEdges]);
  
  // Smooth camera pan
  const panToNodes = useCallback((nodeIds: string[], duration: number = 800) => {
    setTimeout(() => {
      const nodes = nodesRef.current.filter(n => nodeIds.includes(n.id));
      if (nodes.length > 0) {
        fitView({
          nodes,
          padding: 0.2,
          duration,
        });
      }
    }, 100);
  }, [fitView]);
  
  // Add breathing animation to nodes
  const addBreathingAnimation = useCallback((nodeIds: string[]) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (nodeIds.includes(node.id)) {
          return {
            ...node,
            data: {
              ...node.data,
              isBreathing: true,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  // Add particle effect to edge
  const addEdgeParticles = useCallback((edgeId: string) => {
    setEdges(edges => 
      edges.map(edge => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            animated: true,
            style: {
              ...edge.style,
              strokeDasharray: '5 5',
            },
          };
        }
        return edge;
      })
    );
  }, [setEdges]);
  
  // Control methods
  const play = useCallback(() => {
    if (!sequenceRef.current) {
      sequenceRef.current = new AnimationSequence();
    }
    
    sequenceRef.current.start();
    setAnimationState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  }, []);
  
  const pause = useCallback(() => {
    sequenceRef.current?.pause();
    setAnimationState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);
  
  const resume = useCallback(() => {
    sequenceRef.current?.resume();
    setAnimationState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);
  
  const stop = useCallback(() => {
    sequenceRef.current?.stop();
    resetCanvas();
    setAnimationState({
      isPlaying: false,
      isPaused: false,
      currentPhase: 'idle',
      progress: 0,
      loopCount: 0,
    });
  }, [resetCanvas]);
  
  // Update animation state
  useEffect(() => {
    if (!animationState.isPlaying) return;
    
    const updateInterval = setInterval(() => {
      if (sequenceRef.current) {
        const progress = sequenceRef.current.getProgress();
        const phase = sequenceRef.current.getCurrentPhase();
        
        setAnimationState(prev => ({
          ...prev,
          currentPhase: phase,
          progress,
        }));
      }
    }, 100);
    
    return () => clearInterval(updateInterval);
  }, [animationState.isPlaying]);
  
  return {
    animationState,
    play,
    pause,
    resume,
    stop,
    panToNodes,
    addBreathingAnimation,
    addEdgeParticles,
    storeState,
  };
}