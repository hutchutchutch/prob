import React from 'react';
import { motion } from 'framer-motion';
import { useVersionStore } from '../../stores/versionStore';

interface EventPreviewProps {
  eventId: string;
  position?: 'above' | 'below';
}

const EventPreview: React.FC<EventPreviewProps> = ({ eventId, position = 'above' }) => {
  const event = useVersionStore((state) => state.getEventById(eventId));
  
  if (!event) return null;
  
  const { eventType, eventData, timestamp } = event;
  const metadata = eventData.metadata;
  
  const getPreviewContent = () => {
    switch (eventType) {
      case 'node_added':
        return (
          <>
            <h4>Added {metadata.nodeType}</h4>
            <p>{metadata.description}</p>
          </>
        );
        
      case 'node_updated':
        return (
          <>
            <h4>Updated {metadata.nodeType}</h4>
            <p>{metadata.description}</p>
            {eventData.changesDiff && (
              <div className="preview-changes">
                <span>Changes: {Object.keys(eventData.changesDiff).join(', ')}</span>
              </div>
            )}
          </>
        );
        
      case 'node_deleted':
        return (
          <>
            <h4>Deleted {metadata.nodeType}</h4>
            <p>{metadata.description}</p>
          </>
        );
        
      case 'validation':
        return (
          <>
            <h4>Validation {eventData.afterState?.success ? 'Passed' : 'Failed'}</h4>
            <p>{metadata.description}</p>
          </>
        );
        
      case 'generation':
        return (
          <>
            <h4>Generated Content</h4>
            <p>{metadata.description}</p>
            {eventData.afterState?.count && (
              <span className="preview-count">{eventData.afterState.count} items</span>
            )}
          </>
        );
        
      case 'lock_toggled':
        return (
          <>
            <h4>Lock Toggled</h4>
            <p>{metadata.description}</p>
            <span className="preview-state">
              {eventData.afterState?.isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </>
        );
        
      default:
        return (
          <>
            <h4>{eventType}</h4>
            <p>{metadata.description}</p>
          </>
        );
    }
  };
  
  return (
    <motion.div
      className={`event-preview event-preview--${position}`}
      initial={{ opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="event-preview-content">
        {getPreviewContent()}
      </div>
      <div className="event-preview-footer">
        <span className="event-preview-time">
          {new Date(timestamp).toLocaleString()}
        </span>
        <span className="event-preview-trigger">
          {metadata.triggeredBy.replace('_', ' ')}
        </span>
      </div>
    </motion.div>
  );
};

export default EventPreview;