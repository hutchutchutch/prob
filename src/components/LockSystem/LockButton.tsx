import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { useLockManagement } from '../../hooks/useLockManagement';

interface LockButtonProps {
  nodeId: string;
  nodeType: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onLockChange?: (isLocked: boolean) => void;
}

const sizeMap = {
  small: { button: 24, icon: 14 },
  medium: { button: 32, icon: 16 },
  large: { button: 40, icon: 20 },
};

const LockButton: React.FC<LockButtonProps> = ({
  nodeId,
  nodeType,
  size = 'medium',
  className = '',
  onLockChange,
}) => {
  const { isLocked, toggleLock } = useLockManagement();
  const locked = isLocked(nodeId);
  const { button: buttonSize, icon: iconSize } = sizeMap[size];
  
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLock(nodeId, nodeType);
    onLockChange?.(!locked);
  };
  
  return (
    <motion.button
      className={`lock-button ${locked ? 'lock-button--locked' : ''} ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        backgroundColor: locked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderColor: locked ? 'var(--color-accent-500)' : 'transparent',
      }}
      transition={{ duration: 0.2 }}
      style={{
        width: buttonSize,
        height: buttonSize,
      }}
      aria-label={locked ? 'Unlock item' : 'Lock item'}
    >
      <motion.div
        animate={{ rotate: locked ? 0 : -45 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      >
        {locked ? (
          <Lock size={iconSize} className="lock-icon lock-icon--locked" />
        ) : (
          <Unlock size={iconSize} className="lock-icon" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default LockButton;