import { useCallback, useEffect, useState } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useLockManagement } from './useLockManagement';
import { Node } from 'reactflow';

export const useBulkOperations = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  
  const nodes = useCanvasStore((state) => state.nodes);
  const { bulkLock, bulkUnlock, isLocked } = useLockManagement();
  
  // Handle shift+click for multi-select
  const handleNodeClick = useCallback((nodeId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      setSelectedNodes(prev => {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        } else {
          return [...prev, nodeId];
        }
      });
    } else if (event.metaKey || event.ctrlKey) {
      // Add to selection with cmd/ctrl
      setSelectedNodes(prev => [...prev, nodeId]);
    } else {
      // Single select
      setSelectedNodes([nodeId]);
    }
  }, []);
  
  // Clear selection on escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNodes([]);
        setIsSelecting(false);
        setSelectionBox(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Box selection
  const startBoxSelection = useCallback((event: React.MouseEvent) => {
    if (event.shiftKey) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setIsSelecting(true);
      setSelectionBox({
        startX: event.clientX - rect.left,
        startY: event.clientY - rect.top,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      });
    }
  }, []);
  
  const updateBoxSelection = useCallback((event: React.MouseEvent) => {
    if (isSelecting && selectionBox) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setSelectionBox({
        ...selectionBox,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      });
    }
  }, [isSelecting, selectionBox]);
  
  const endBoxSelection = useCallback(() => {
    if (isSelecting && selectionBox) {
      // Calculate which nodes are in the selection box
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);
      
      const nodesInBox = nodes.filter((node: Node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeWidth = node.width || 200;
        const nodeHeight = node.height || 100;
        
        return (
          nodeX + nodeWidth >= minX &&
          nodeX <= maxX &&
          nodeY + nodeHeight >= minY &&
          nodeY <= maxY
        );
      }).map(node => node.id);
      
      setSelectedNodes(nodesInBox);
      setIsSelecting(false);
      setSelectionBox(null);
    }
  }, [isSelecting, selectionBox, nodes]);
  
  // Bulk lock operations
  const lockSelected = useCallback(async () => {
    const unlocked = selectedNodes.filter(id => !isLocked(id));
    if (unlocked.length > 0) {
      // Determine node type from first node
      const firstNode = nodes.find((n: Node) => n.id === unlocked[0]);
      const nodeType = firstNode?.type || 'unknown';
      await bulkLock(unlocked, nodeType);
    }
  }, [selectedNodes, nodes, isLocked, bulkLock]);
  
  const unlockSelected = useCallback(async () => {
    const locked = selectedNodes.filter(id => isLocked(id));
    if (locked.length > 0) {
      await bulkUnlock(locked);
    }
  }, [selectedNodes, isLocked, bulkUnlock]);
  
  const toggleLockSelected = useCallback(async () => {
    const locked = selectedNodes.filter(id => isLocked(id));
    const unlocked = selectedNodes.filter(id => !isLocked(id));
    
    if (locked.length > 0) {
      await bulkUnlock(locked);
    }
    
    if (unlocked.length > 0) {
      const firstNode = nodes.find((n: Node) => n.id === unlocked[0]);
      const nodeType = firstNode?.type || 'unknown';
      await bulkLock(unlocked, nodeType);
    }
  }, [selectedNodes, nodes, isLocked, bulkLock, bulkUnlock]);
  
  // Select all nodes of a type
  const selectAllOfType = useCallback((nodeType: string) => {
    const nodesOfType = nodes.filter((n: Node) => n.type === nodeType).map(n => n.id);
    setSelectedNodes(nodesOfType);
  }, [nodes]);
  
  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedNodes([]);
  }, []);
  
  return {
    selectedNodes,
    isSelecting,
    selectionBox,
    handleNodeClick,
    startBoxSelection,
    updateBoxSelection,
    endBoxSelection,
    lockSelected,
    unlockSelected,
    toggleLockSelected,
    selectAllOfType,
    clearSelection,
    lockedCount: selectedNodes.filter(id => isLocked(id)).length,
    unlockedCount: selectedNodes.filter(id => !isLocked(id)).length,
  };
};