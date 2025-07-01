import React, { useState } from 'react';
import { RefreshCw, Lock, Unlock, ZoomIn, ZoomOut, Maximize2, Grid } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from '@/components/common/Button';
import { SimpleTooltip } from '@/components/common/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

// Refresh Button Component
export interface RefreshButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  count?: number;
  lockedCount?: number;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  label,
  onClick,
  loading = false,
  count,
  lockedCount = 0,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-gray-800/90 backdrop-blur-sm',
        'border border-gray-700 rounded-lg text-white',
        'hover:bg-gray-700/90 hover:border-gray-600',
        'transition-all duration-base',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <RefreshCw
        className={cn(
          'w-4 h-4',
          loading && 'animate-spin'
        )}
      />
      <span className="text-sm font-medium">
        {loading ? 'Regenerating...' : `Regenerate ${label}`}
      </span>
      {count !== undefined && (
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-xs text-gray-400">
            {count - lockedCount} of {count}
          </span>
          {lockedCount > 0 && (
            <Lock className="w-3 h-3 text-warning-500" />
          )}
        </div>
      )}
    </motion.button>
  );
};

// Lock Toggle Component
export interface LockToggleProps {
  isLocked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export const LockToggle: React.FC<LockToggleProps> = ({
  isLocked,
  onToggle,
  size = 'sm',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  return (
    <SimpleTooltip content={isLocked ? 'Unlock' : 'Lock'}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={cn(
          'flex items-center justify-center rounded-lg',
          'bg-gray-800/50 hover:bg-gray-700/50',
          'border border-gray-700 hover:border-gray-600',
          'transition-all duration-fast',
          sizeClasses[size]
        )}
      >
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="locked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Lock className="w-4 h-4 text-warning-500" />
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.2 }}
            >
              <Unlock className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </SimpleTooltip>
  );
};

// Canvas Control Panel
interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleGrid: () => void;
  showGrid: boolean;
  zoomLevel: number;
  className?: string;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  showGrid,
  zoomLevel,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700', className)}>
      <SimpleTooltip content="Zoom in">
        <IconButton
          icon={ZoomIn}
          size="sm"
          onClick={onZoomIn}
          aria-label="Zoom in"
        />
      </SimpleTooltip>
      
      <div className="px-2 text-xs font-medium text-gray-400 min-w-[3rem] text-center">
        {Math.round(zoomLevel)}%
      </div>
      
      <SimpleTooltip content="Zoom out">
        <IconButton
          icon={ZoomOut}
          size="sm"
          onClick={onZoomOut}
          aria-label="Zoom out"
        />
      </SimpleTooltip>
      
      <div className="w-px h-6 bg-gray-700 mx-1" />
      
      <SimpleTooltip content="Fit to view">
        <IconButton
          icon={Maximize2}
          size="sm"
          onClick={onFitView}
          aria-label="Fit to view"
        />
      </SimpleTooltip>
      
      <SimpleTooltip content={showGrid ? 'Hide grid' : 'Show grid'}>
        <IconButton
          icon={Grid}
          size="sm"
          onClick={onToggleGrid}
          className={cn(showGrid && 'bg-gray-700')}
          aria-label={showGrid ? 'Hide grid' : 'Show grid'}
        />
      </SimpleTooltip>
    </div>
  );
}

export default CanvasControls;

// Selection Counter
export interface SelectionCounterProps {
  selected: number;
  total: number;
  label: string;
}

export const SelectionCounter: React.FC<SelectionCounterProps> = ({
  selected,
  total,
  label,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 bg-primary-600/10 backdrop-blur-sm border border-primary-600 rounded-full"
    >
      <span className="text-sm font-medium text-primary-400">
        {selected} of {total} {label} selected
      </span>
    </motion.div>
  );
};

// Bulk Actions Bar
export interface BulkActionsProps {
  selectedCount: number;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onClearSelection: () => void;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }>;
}

export const BulkActionsBar: React.FC<BulkActionsProps> = ({
  selectedCount,
  onLockAll,
  onUnlockAll,
  onClearSelection,
  actions = [],
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex items-center gap-3 px-4 py-3 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg"
    >
      <span className="text-sm text-gray-400">
        {selectedCount} items selected
      </span>
      
      <div className="h-4 w-px bg-gray-700" />
      
      <div className="flex items-center gap-2">
        <button
          onClick={onLockAll}
          className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          Lock All
        </button>
        <button
          onClick={onUnlockAll}
          className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          Unlock All
        </button>
        
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-1.5"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1" />
      
      <button
        onClick={onClearSelection}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Clear
      </button>
    </motion.div>
  );
};