import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLockManagement } from '@/hooks/useLockManagement';
import { LockTooltip } from '@/components/LockSystem';

interface LockToggleProps {
  nodeId: string;
  nodeType: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
  onLockChange?: (isLocked: boolean) => void;
}

const sizeMap = {
  sm: { button: 24, icon: 14 },
  md: { button: 32, icon: 16 },
  lg: { button: 40, icon: 20 },
};

export const LockToggle: React.FC<LockToggleProps> = ({
  nodeId,
  nodeType,
  size = 'sm',
  className,
  showTooltip = true,
  onLockChange,
}) => {
  const { isLocked, toggleLock } = useLockManagement();
  const locked = isLocked(nodeId);
  const [isHovered, setIsHovered] = React.useState(false);
  const { button: buttonSize, icon: iconSize } = sizeMap[size];
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLock(nodeId, nodeType);
    onLockChange?.(!locked);
  };
  
  return (
    <>
      <motion.button
        className={cn(
          'lock-button',
          locked && 'lock-button--locked',
          className
        )}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      
      {showTooltip && (
        <LockTooltip
          nodeId={nodeId}
          visible={isHovered && locked}
          position="top"
        />
      )}
    </>
  );
};

export default LockToggle; 