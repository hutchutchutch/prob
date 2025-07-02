import React from 'react';
import { RefreshButton } from '@/components/RefreshControl';
import { BulkLockControls } from '@/components/LockSystem';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { useCanvasStore } from '@/stores/canvasStore';
import { useLockManagement } from '@/hooks/useLockManagement';
import { Lock, Unlock, RefreshCw } from 'lucide-react';

/**
 * Example component showing how to integrate lock and refresh controls
 * into a React Flow canvas interface
 */
export const LockRefreshExample: React.FC = () => {
  const nodes = useCanvasStore((state) => state.nodes);
  const {
    selectedNodes,
    isSelecting,
    selectionBox,
    handleNodeClick,
    startBoxSelection,
    updateBoxSelection,
    endBoxSelection,
  } = useBulkOperations();
  
  return (
    <div className="relative w-full h-full">
      {/* React Flow Canvas would go here */}
      <div 
        className="react-flow-wrapper"
        onMouseDown={startBoxSelection}
        onMouseMove={updateBoxSelection}
        onMouseUp={endBoxSelection}
      >
        {/* Your React Flow component */}
      </div>
      
      {/* Selection Box */}
      {isSelecting && selectionBox && (
        <div
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}
      
      {/* Floating Refresh Button */}
      <RefreshButton position="bottom-right" />
      
      {/* Bulk Lock Controls - Shows when multiple nodes are selected */}
      <BulkLockControls
        visible={selectedNodes.length > 1}
        selectedNodes={selectedNodes}
        nodeType="mixed"
      />
      
      {/* Example of column refresh buttons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <RefreshColumnButton type="personas" count={5} />
        <RefreshColumnButton type="painPoints" count={7} />
        <RefreshColumnButton type="solutions" count={6} />
      </div>
    </div>
  );
};

// Column-specific refresh button
const RefreshColumnButton: React.FC<{
  type: string;
  count: number;
}> = ({ type, count }) => {
  const { getLockedItemsByType } = useLockManagement();
  const lockedCount = getLockedItemsByType(type).length;
  
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white capitalize">{type}</h4>
        <span className="text-xs text-gray-400">
          {count - lockedCount} / {count} unlocked
        </span>
      </div>
      <button
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 
                   bg-gray-700 hover:bg-gray-600 rounded-md transition-colors
                   text-xs text-gray-300 hover:text-white"
        onClick={() => {
          // Handle column refresh
          console.log(`Refreshing ${type}`);
        }}
        disabled={count === lockedCount}
      >
        <RefreshCw size={12} />
        <span>Refresh Unlocked</span>
      </button>
    </div>
  );
};

// Example of right-click context menu for lock/unlock
export const NodeContextMenu: React.FC<{
  nodeId: string;
  nodeType: string;
  x: number;
  y: number;
  onClose: () => void;
}> = ({ nodeId, nodeType, x, y, onClose }) => {
  const { isLocked, toggleLock } = useLockManagement();
  const locked = isLocked(nodeId);
  
  return (
    <div
      className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700 
                   flex items-center gap-2 text-gray-300 hover:text-white"
        onClick={() => {
          toggleLock(nodeId, nodeType);
          onClose();
        }}
      >
        {locked ? (
          <>
            <Unlock size={14} />
            <span>Unlock Node</span>
          </>
        ) : (
          <>
            <Lock size={14} />
            <span>Lock Node</span>
          </>
        )}
      </button>
      {/* Other context menu items */}
    </div>
  );
};