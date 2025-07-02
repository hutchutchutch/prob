import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { useLockStore } from '../../stores/lockStore';

interface LockIndicatorProps {
  nodeId: string;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const sizeMap = {
  small: { icon: 14, container: 20 },
  medium: { icon: 16, container: 24 },
  large: { icon: 20, container: 32 },
};

const LockIndicator: React.FC<LockIndicatorProps> = ({
  nodeId,
  size = 'medium',
  showTooltip = true,
}) => {
  const isLocked = useLockStore((state) => state.isLocked(nodeId));
  const lockInfo = useLockStore((state) => state.lockedItems.get(nodeId));
  
  if (!isLocked) return null;
  
  const { icon: iconSize, container: containerSize } = sizeMap[size];
  
  return (
    <motion.div
      className="lock-indicator"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
      style={{
        width: containerSize,
        height: containerSize,
      }}
    >
      <Lock
        size={iconSize}
        className="lock-indicator-icon"
        style={{ color: 'var(--color-accent-500)' }}
      />
      
      {showTooltip && lockInfo && (
        <div className="lock-tooltip">
          <p>Locked by you</p>
          <span className="lock-tooltip-time">
            {new Date(lockInfo.lockedAt).toLocaleString()}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default LockIndicator;