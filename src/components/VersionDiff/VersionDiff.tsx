import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiffViewer from './DiffViewer';
import { useVersionStore, VersionEvent } from '../../stores/versionStore';
import { X, GitBranch, ArrowRight } from 'lucide-react';

interface VersionDiffProps {
  baseEventId: string;
  targetEventId: string;
  onClose: () => void;
}

const VersionDiff: React.FC<VersionDiffProps> = ({
  baseEventId,
  targetEventId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges' | 'metadata'>('nodes');
  
  const baseEvent = useVersionStore((state) => state.getEventById(baseEventId));
  const targetEvent = useVersionStore((state) => state.getEventById(targetEventId));
  
  if (!baseEvent || !targetEvent) {
    return null;
  }
  
  const getTimestamp = (event: VersionEvent) => {
    return new Date(event.timestamp).toLocaleString();
  };
  
  return (
    <motion.div
      className="version-diff-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="version-diff-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="version-diff-header">
          <div className="version-diff-title">
            <GitBranch className="icon" />
            <h3>Version Comparison</h3>
          </div>
          <button
            className="btn-icon btn-icon--small"
            onClick={onClose}
            aria-label="Close diff viewer"
          >
            <X className="icon-sm" />
          </button>
        </div>
        
        <div className="version-diff-info">
          <div className="version-info">
            <span className="version-label">From:</span>
            <span className="version-time">{getTimestamp(baseEvent)}</span>
            <span className="version-description">{baseEvent.eventData.metadata.description}</span>
          </div>
          <ArrowRight className="icon-sm" />
          <div className="version-info">
            <span className="version-label">To:</span>
            <span className="version-time">{getTimestamp(targetEvent)}</span>
            <span className="version-description">{targetEvent.eventData.metadata.description}</span>
          </div>
        </div>
        
        <div className="version-diff-tabs">
          <button
            className={`version-diff-tab ${activeTab === 'nodes' ? 'version-diff-tab--active' : ''}`}
            onClick={() => setActiveTab('nodes')}
          >
            Nodes
          </button>
          <button
            className={`version-diff-tab ${activeTab === 'edges' ? 'version-diff-tab--active' : ''}`}
            onClick={() => setActiveTab('edges')}
          >
            Connections
          </button>
          <button
            className={`version-diff-tab ${activeTab === 'metadata' ? 'version-diff-tab--active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            Metadata
          </button>
        </div>
        
        <div className="version-diff-content">
          <AnimatePresence mode="wait">
            {activeTab === 'nodes' && (
              <DiffViewer
                key="nodes"
                baseData={baseEvent.eventData.afterState?.nodes || []}
                targetData={targetEvent.eventData.afterState?.nodes || []}
                type="nodes"
              />
            )}
            {activeTab === 'edges' && (
              <DiffViewer
                key="edges"
                baseData={baseEvent.eventData.afterState?.edges || []}
                targetData={targetEvent.eventData.afterState?.edges || []}
                type="edges"
              />
            )}
            {activeTab === 'metadata' && (
              <DiffViewer
                key="metadata"
                baseData={baseEvent.eventData.metadata}
                targetData={targetEvent.eventData.metadata}
                type="metadata"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VersionDiff;