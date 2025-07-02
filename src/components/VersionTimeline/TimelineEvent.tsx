import React from 'react';
import { motion } from 'framer-motion';
import { VersionEvent } from '../../stores/versionStore';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Zap, 
  Link,
  Unlock,
  RefreshCw
} from 'lucide-react';

interface TimelineEventProps {
  event: VersionEvent;
  index: number;
  isActive: boolean;
  isPreviewing: boolean;
  onHover: (eventId: string | null) => void;
  onClick: () => void;
  onDoubleClick: () => void;
}

const eventIcons: Record<string, React.ReactNode> = {
  node_added: <Plus className="timeline-event-icon" />,
  node_updated: <Edit3 className="timeline-event-icon" />,
  node_deleted: <Trash2 className="timeline-event-icon" />,
  validation: <CheckCircle className="timeline-event-icon" />,
  generation: <Zap className="timeline-event-icon" />,
  edge_added: <Link className="timeline-event-icon" />,
  edge_removed: <Link className="timeline-event-icon" style={{ opacity: 0.5 }} />,
  lock_toggled: <Unlock className="timeline-event-icon" />,
  refresh: <RefreshCw className="timeline-event-icon" />,
};

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  isActive,
  isPreviewing,
  onHover,
  onClick,
  onDoubleClick,
}) => {
  const timestamp = new Date(event.timestamp);
  const timeString = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const getEventLabel = () => {
    const { eventType, eventData } = event;
    const metadata = eventData.metadata;
    
    switch (eventType) {
      case 'node_added':
      case 'node_updated':
      case 'node_deleted':
        return metadata.nodeType || 'Node';
      case 'validation':
        return `${metadata.nodeType} validated`;
      case 'generation':
        return metadata.description || 'Generated';
      case 'edge_added':
      case 'edge_removed':
        return 'Connection';
      case 'lock_toggled':
        return 'Lock toggled';
      case 'refresh':
        return 'Refreshed';
      default:
        return eventType;
    }
  };
  
  return (
    <motion.div
      className={`timeline-event timeline-event--${event.eventType} ${
        isActive ? 'timeline-event--active' : ''
      } ${isPreviewing ? 'timeline-event--previewing' : ''}`}
      data-event-index={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <motion.div
        className="timeline-event-marker"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {eventIcons[event.eventType] || <Edit3 className="timeline-event-icon" />}
      </motion.div>
      
      <div className="timeline-event-details">
        <div className="timeline-event-label">{getEventLabel()}</div>
        <div className="timeline-event-time">{timeString}</div>
      </div>
      
      {/* Batch indicator for generation events */}
      {event.eventType === 'generation' && event.eventData.afterState?.count > 1 && (
        <div className="timeline-event-batch">
          {event.eventData.afterState.count}
        </div>
      )}
    </motion.div>
  );
};

export default TimelineEvent;