import { Node, Edge } from '@xyflow/react';

export async function animateCanvasTransition(
  currentNodes: Node[],
  newNodes: Node[],
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void,
  newEdges: Edge[]
) {
  // Simple implementation for now
  setNodes(newNodes);
  
  // Add edges after a short delay
  setTimeout(() => {
    setEdges(newEdges);
  }, 300);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}