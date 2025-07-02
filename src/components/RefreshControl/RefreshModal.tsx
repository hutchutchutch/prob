import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Lock, AlertCircle } from 'lucide-react';
import { Modal } from '../common';
import RefreshProgress from './RefreshProgress';
import RegenerationOptions from './RegenerationOptions';
import { useRefreshWorkflow } from '../../hooks/useRefreshWorkflow';
import { useLockManagement } from '../../hooks/useLockManagement';

interface RefreshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RefreshModal: React.FC<RefreshModalProps> = ({ isOpen, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    personas: true,
    painPoints: true,
    solutions: true,
    userStories: false,
    documents: false,
  });
  
  const { isRefreshing, progress, refreshItems } = useRefreshWorkflow();
  const { getLockedItemsByType } = useLockManagement();
  
  const handleRefresh = async () => {
    await refreshItems(selectedOptions);
  };
  
  const lockedCounts = {
    personas: getLockedItemsByType('persona').length,
    painPoints: getLockedItemsByType('pain_point').length,
    solutions: getLockedItemsByType('solution').length,
    userStories: getLockedItemsByType('user_story').length,
    documents: getLockedItemsByType('document').length,
  };
  
  const totalLocked = Object.values(lockedCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="refresh-modal">
        <div className="refresh-modal-header">
          <div className="refresh-modal-title">
            <RefreshCw size={20} className="refresh-modal-icon" />
            <h2>Refresh Workflow Items</h2>
          </div>
          <button
            className="btn-icon btn-icon--small"
            onClick={onClose}
            disabled={isRefreshing}
          >
            <X size={16} />
          </button>
        </div>
        
        {totalLocked > 0 && (
          <div className="refresh-modal-info">
            <Lock size={16} />
            <span>{totalLocked} items are locked and will be preserved</span>
          </div>
        )}
        
        <div className="refresh-modal-content">
          {!isRefreshing ? (
            <>
              <p className="refresh-modal-description">
                Select which items to regenerate. Locked items will remain unchanged.
              </p>
              
              <RegenerationOptions
                options={selectedOptions}
                onChange={setSelectedOptions}
                lockedCounts={lockedCounts}
                disabled={false}
              />
              
              <div className="refresh-modal-warning">
                <AlertCircle size={16} />
                <span>
                  This will replace all unlocked items in the selected categories.
                  This action cannot be undone.
                </span>
              </div>
            </>
          ) : (
            <RefreshProgress progress={progress} />
          )}
        </div>
        
        <div className="refresh-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isRefreshing}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={isRefreshing || !Object.values(selectedOptions).some(v => v)}
          >
            {isRefreshing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={16} />
                </motion.div>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                <span>Start Refresh</span>
              </>
            )}
          </button>
        </div>
        
        {progress.errors.length > 0 && (
          <div className="refresh-modal-errors">
            {progress.errors.map((error, index) => (
              <div key={index} className="refresh-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RefreshModal;