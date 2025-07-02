import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';

interface TimelineControlsProps {
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onToggleCollapse?: () => void;
  onFilterChange: (filter: string[]) => void;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
  isCollapsed: boolean;
  currentFilter: string[];
  isPreviewMode: boolean;
  onExitPreview: () => void;
}

const eventTypes = [
  { value: 'node_added', label: 'Nodes Added', color: 'var(--color-success-500)' },
  { value: 'node_updated', label: 'Nodes Updated', color: 'var(--color-primary-500)' },
  { value: 'node_deleted', label: 'Nodes Deleted', color: 'var(--color-error-500)' },
  { value: 'validation', label: 'Validations', color: 'var(--color-accent-500)' },
  { value: 'generation', label: 'Generations', color: 'var(--color-node-solution)' },
];

const TimelineControls: React.FC<TimelineControlsProps> = ({
  onNavigatePrevious,
  onNavigateNext,
  onToggleCollapse,
  onFilterChange,
  canNavigatePrevious,
  canNavigateNext,
  isCollapsed,
  currentFilter,
  isPreviewMode,
  onExitPreview,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleFilter = (eventType: string) => {
    if (currentFilter.includes(eventType)) {
      onFilterChange(currentFilter.filter(f => f !== eventType));
    } else {
      onFilterChange([...currentFilter, eventType]);
    }
  };
  
  return (
    <div className="timeline-controls">
      <div className="timeline-controls-left">
        <button
          className="btn-icon btn-icon--small"
          onClick={onNavigatePrevious}
          disabled={!canNavigatePrevious}
          aria-label="Previous event"
        >
          <ChevronLeft className="icon-sm" />
        </button>
        
        <button
          className="btn-icon btn-icon--small"
          onClick={onNavigateNext}
          disabled={!canNavigateNext}
          aria-label="Next event"
        >
          <ChevronRight className="icon-sm" />
        </button>
        
        <div className="timeline-controls-separator" />
        
        <motion.button
          className={`btn-icon btn-icon--small ${showFilters ? 'btn-icon--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Filter events"
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="icon-sm" />
        </motion.button>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="timeline-filters"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {eventTypes.map(type => (
                <label
                  key={type.value}
                  className={`timeline-filter ${
                    currentFilter.length === 0 || currentFilter.includes(type.value) 
                      ? 'timeline-filter--active' 
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={currentFilter.length === 0 || currentFilter.includes(type.value)}
                    onChange={() => toggleFilter(type.value)}
                  />
                  <span 
                    className="timeline-filter-dot" 
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="timeline-filter-label">{type.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="timeline-controls-center">
        {isPreviewMode && (
          <motion.div
            className="preview-mode-indicator"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <RotateCcw className="icon-sm" />
            <span>Preview Mode</span>
            <button
              className="preview-exit-btn"
              onClick={onExitPreview}
              aria-label="Exit preview"
            >
              <X className="icon-sm" />
            </button>
          </motion.div>
        )}
      </div>
      
      <div className="timeline-controls-right">
        {onToggleCollapse && (
          <button
            className="btn-icon btn-icon--small"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand timeline' : 'Collapse timeline'}
          >
            {isCollapsed ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TimelineControls;