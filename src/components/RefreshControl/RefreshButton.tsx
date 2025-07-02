import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Lock } from 'lucide-react';
import { useLockManagement } from '../../hooks/useLockManagement';
import RefreshModal from './RefreshModal';

interface RefreshButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const positionClasses = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
};

const RefreshButton: React.FC<RefreshButtonProps> = ({
  position = 'bottom-right',
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const { getLockedCount } = useLockManagement();
  const lockedCount = getLockedCount();
  
  return (
    <>
      <motion.button
        className={`refresh-button fixed ${positionClasses[position]} ${className}`}
        onClick={() => setShowModal(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="refresh-button-content">
          <RefreshCw size={24} className="refresh-button-icon" />
          {lockedCount > 0 && (
            <motion.div
              className="refresh-button-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <Lock size={12} />
              <span>{lockedCount}</span>
            </motion.div>
          )}
        </div>
        
        <motion.div
          className="refresh-button-tooltip"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Refresh Unlocked Items
          {lockedCount > 0 && <span> ({lockedCount} locked)</span>}
        </motion.div>
      </motion.button>
      
      <RefreshModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default RefreshButton;