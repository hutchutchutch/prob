import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVersionHistory } from '../../hooks/useVersionHistory';
import TimelineEvent from './TimelineEvent';
import TimelineControls from './TimelineControls';
import EventPreview from './EventPreview';
import { VersionEvent } from '../../stores/versionStore';
import './VersionTimeline.css';

interface VersionTimelineProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const VersionTimeline: React.FC<VersionTimelineProps> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const {
    events,
    currentEventIndex,
    isPreviewMode,
    previewEventId,
    navigatePrevious,
    navigateNext,
    previewEvent,
    exitPreview,
    restoreToEvent,
    getFilteredEvents,
    canNavigatePrevious,
    canNavigateNext,
  } = useVersionHistory();
  
  const [eventFilter, setEventFilter] = useState<string[]>([]);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to current event
  useEffect(() => {
    if (scrollContainerRef.current && currentEventIndex >= 0) {
      const container = scrollContainerRef.current;
      const eventElement = container.querySelector(`[data-event-index="${currentEventIndex}"]`);
      
      if (eventElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = eventElement.getBoundingClientRect();
        const scrollLeft = elementRect.left - containerRect.left - containerRect.width / 2 + elementRect.width / 2;
        
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [currentEventIndex]);
  
  const filteredEvents = getFilteredEvents(eventFilter);
  
  const handleEventClick = (event: VersionEvent) => {
    if (isPreviewMode && previewEventId === event.id) {
      exitPreview();
    } else {
      previewEvent(event.id);
    }
  };
  
  const handleEventDoubleClick = (event: VersionEvent) => {
    setShowConfirmRestore(event.id);
  };
  
  const confirmRestore = (eventId: string) => {
    restoreToEvent(eventId);
    setShowConfirmRestore(null);
    exitPreview();
  };
  
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const targetIndex = Math.floor(percentage * events.length);
    
    if (targetIndex >= 0 && targetIndex < events.length) {
      previewEvent(events[targetIndex].id);
    }
  };
  
  return (
    <motion.div
      className={`version-timeline ${isCollapsed ? 'version-timeline--collapsed' : ''}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: isCollapsed ? 40 : 180, 
        opacity: 1 
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <TimelineControls
        onNavigatePrevious={navigatePrevious}
        onNavigateNext={navigateNext}
        onToggleCollapse={onToggleCollapse}
        onFilterChange={setEventFilter}
        canNavigatePrevious={canNavigatePrevious}
        canNavigateNext={canNavigateNext}
        isCollapsed={isCollapsed}
        currentFilter={eventFilter}
        isPreviewMode={isPreviewMode}
        onExitPreview={exitPreview}
      />
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="timeline-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Scrubber */}
            <div
              ref={timelineRef}
              className="timeline-scrubber"
              onMouseMove={handleScrub}
              onMouseLeave={() => setHoveredEventId(null)}
            >
              <div className="timeline-track" />
              {events.length > 0 && (
                <motion.div
                  className="timeline-progress"
                  style={{
                    width: `${((currentEventIndex + 1) / events.length) * 100}%`,
                  }}
                  layout
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            
            {/* Events */}
            <div ref={scrollContainerRef} className="timeline-events-container">
              <div className="timeline-events">
                {filteredEvents.map((event, index) => {
                  const actualIndex = events.indexOf(event);
                  const isActive = actualIndex === currentEventIndex;
                  const isPreviewing = isPreviewMode && previewEventId === event.id;
                  
                  return (
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      index={actualIndex}
                      isActive={isActive}
                      isPreviewing={isPreviewing}
                      onHover={setHoveredEventId}
                      onClick={() => handleEventClick(event)}
                      onDoubleClick={() => handleEventDoubleClick(event)}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Event Preview */}
            <AnimatePresence>
              {hoveredEventId && (
                <EventPreview
                  eventId={hoveredEventId}
                  position="above"
                />
              )}
            </AnimatePresence>
            
            {/* Restore Confirmation */}
            <AnimatePresence>
              {showConfirmRestore && (
                <motion.div
                  className="restore-confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <p>Restore to this version?</p>
                  <div className="restore-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowConfirmRestore(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => confirmRestore(showConfirmRestore)}
                    >
                      Restore
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VersionTimeline;