import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Shield } from 'lucide-react';
import { useLockManagement } from '../../hooks/useLockManagement';
import { useCanvasStore } from '../../stores/canvasStore';

interface BulkLockControlsProps {
  visible: boolean;
  selectedNodes: string[];
  nodeType?: string;
}

const BulkLockControls: React.FC<BulkLockControlsProps> = ({
  visible,
  selectedNodes,
  nodeType = 'mixed',
}) => {
  const { bulkLock, bulkUnlock, isLocked, getLockedCount } = useLockManagement();
  const clearSelection = useCanvasStore((state) => state.clearSelection);
  
  const lockedCount = selectedNodes.filter(nodeId => isLocked(nodeId)).length;
  const unlockedCount = selectedNodes.length - lockedCount;
  const totalLocked = getLockedCount();
  
  const handleLockAll = async () => {
    if (unlockedCount > 0) {
      const nodesToLock = selectedNodes.filter(nodeId => !isLocked(nodeId));
      await bulkLock(nodesToLock, nodeType);
    }
  };
  
  const handleUnlockAll = async () => {
    if (lockedCount > 0) {
      const nodesToUnlock = selectedNodes.filter(nodeId => isLocked(nodeId));
      await bulkUnlock(nodesToUnlock);
    }
  };
  
  const handleToggleAll = async () => {
    if (lockedCount === selectedNodes.length) {
      // All locked, unlock all
      await bulkUnlock(selectedNodes);
    } else {
      // Some or none locked, lock all
      const nodesToLock = selectedNodes.filter(nodeId => !isLocked(nodeId));
      if (nodesToLock.length > 0) {
        await bulkLock(nodesToLock, nodeType);
      }
    }
  };
  
  return (
    <AnimatePresence>
      {visible && selectedNodes.length > 1 && (
        <motion.div
          className="bulk-lock-controls"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
        >
          <div className="bulk-lock-info">
            <Shield size={16} className="bulk-lock-icon" />
            <span className="bulk-lock-count">
              {selectedNodes.length} selected
            </span>
            {lockedCount > 0 && (
              <span className="bulk-lock-locked">
                ({lockedCount} locked)
              </span>
            )}
          </div>
          
          <div className="bulk-lock-actions">
            {unlockedCount > 0 && (
              <motion.button
                className="bulk-lock-button"
                onClick={handleLockAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lock size={14} />
                <span>Lock All</span>
              </motion.button>
            )}
            
            {lockedCount > 0 && (
              <motion.button
                className="bulk-lock-button bulk-lock-button--unlock"
                onClick={handleUnlockAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Unlock size={14} />
                <span>Unlock All</span>
              </motion.button>
            )}
            
            <motion.button
              className="bulk-lock-button bulk-lock-button--toggle"
              onClick={handleToggleAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {lockedCount === selectedNodes.length ? (
                <>
                  <Unlock size={14} />
                  <span>Unlock</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Lock</span>
                </>
              )}
            </motion.button>
          </div>
          
          <div className="bulk-lock-total">
            Total locked: {totalLocked}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkLockControls;