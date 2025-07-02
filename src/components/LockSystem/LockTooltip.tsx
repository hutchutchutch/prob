import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Clock, User } from 'lucide-react';
import { useLockStore } from '../../stores/lockStore';
import { formatDistanceToNow } from 'date-fns';

interface LockTooltipProps {
  nodeId: string;
  visible: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const LockTooltip: React.FC<LockTooltipProps> = ({
  nodeId,
  visible,
  position = 'top',
}) => {
  const lockInfo = useLockStore((state) => state.lockedItems.get(nodeId));
  
  if (!lockInfo || !visible) return null;
  
  const positionClasses = {
    top: 'lock-tooltip--top',
    bottom: 'lock-tooltip--bottom',
    left: 'lock-tooltip--left',
    right: 'lock-tooltip--right',
  };
  
  const remainingTime = lockInfo.expiresAt
    ? formatDistanceToNow(new Date(lockInfo.expiresAt), { addSuffix: true })
    : null;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`lock-tooltip-container ${positionClasses[position]}`}
          initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="lock-tooltip-content">
            <div className="lock-tooltip-header">
              <Lock size={14} className="lock-tooltip-icon" />
              <span>Locked</span>
            </div>
            
            <div className="lock-tooltip-info">
              <div className="lock-tooltip-row">
                <User size={12} />
                <span>Locked by you</span>
              </div>
              
              <div className="lock-tooltip-row">
                <Clock size={12} />
                <span>
                  {formatDistanceToNow(new Date(lockInfo.lockedAt), { addSuffix: true })}
                </span>
              </div>
              
              {remainingTime && (
                <div className="lock-tooltip-expiry">
                  Expires {remainingTime}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LockTooltip;