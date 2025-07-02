import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Trash2, Download, Archive, Share2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { format, formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  progress: {
    problem: boolean;
    personas: boolean;
    painPoints: boolean;
    solutions: boolean;
    specs: boolean;
  };
  modifiedAt: Date;
  canvasPreview?: string;
  isActive?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect: (id: string) => void;
  onMultiSelect?: (id: string, add: boolean) => void;
  onQuickAction?: (id: string, action: 'duplicate' | 'delete' | 'export' | 'archive' | 'share') => void;
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  status,
  progress,
  modifiedAt,
  canvasPreview,
  isActive,
  isSelected,
  isDragging,
  onSelect,
  onMultiSelect,
  onQuickAction,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Calculate progress percentage
  const progressSteps = Object.values(progress);
  const completedSteps = progressSteps.filter(Boolean).length;
  const progressPercentage = (completedSteps / progressSteps.length) * 100;

  // Status colors
  const statusColors = {
    draft: 'bg-gray-500',
    'in-progress': 'bg-yellow-500',
    completed: 'bg-green-500',
    archived: 'bg-gray-600',
  };

  // Format dates
  const relativeTime = formatDistanceToNow(modifiedAt, { addSuffix: true });
  const absoluteTime = format(modifiedAt, 'PPp');

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(e.target as Node) &&
        cardRef.current &&
        !cardRef.current.contains(e.target as Node)
      ) {
        setShowQuickActions(false);
      }
    };

    if (showQuickActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showQuickActions]);

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onMultiSelect?.(id, true);
    } else if (e.shiftKey) {
      // Shift selection logic would be handled by parent
      onMultiSelect?.(id, true);
    } else {
      onSelect(id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(e, id);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'project-card relative group rounded-lg border transition-all duration-200 cursor-pointer',
        'hover:border-gray-600 hover:shadow-lg',
        isActive && 'border-blue-500 bg-gray-800',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900',
        isDragging && 'opacity-50',
        !isActive && 'border-gray-700 bg-gray-800/50'
      )}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      draggable
      onDragStart={(e) => onDragStart?.(e, id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, id)}
    >
      {/* Multi-select checkbox */}
      {onMultiSelect && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onMultiSelect(id, e.target.checked);
            }}
            className="checkbox"
          />
        </div>
      )}

      {/* Quick actions button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowQuickActions(!showQuickActions);
          }}
          className="btn-icon btn-icon--small"
        >
          <MoreVertical className="icon-sm" />
        </button>

        {/* Quick actions menu */}
        {showQuickActions && (
          <div
            ref={actionsRef}
            className="absolute right-0 top-8 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-[160px]"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(id, 'duplicate');
                setShowQuickActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            >
              <Copy className="icon-sm" />
              Duplicate
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(id, 'export');
                setShowQuickActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            >
              <Download className="icon-sm" />
              Export
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(id, 'share');
                setShowQuickActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            >
              <Share2 className="icon-sm" />
              Share
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(id, 'archive');
                setShowQuickActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
            >
              <Archive className="icon-sm" />
              {status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            <div className="border-t border-gray-700 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAction?.(id, 'delete');
                setShowQuickActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center gap-2"
            >
              <Trash2 className="icon-sm" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Canvas preview thumbnail */}
      {canvasPreview && (
        <div className="h-24 bg-gray-900 rounded-t-lg overflow-hidden mb-3">
          <img
            src={canvasPreview}
            alt="Canvas preview"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      )}

      <div className="p-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('w-2 h-2 rounded-full', statusColors[status])} />
          <span className="text-xs text-gray-400 capitalize">{status.replace('-', ' ')}</span>
        </div>

        {/* Project name */}
        <h3 className="font-medium text-white mb-1 truncate">{name}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Progress segments */}
        <div className="flex gap-1 mb-3">
          <div
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              progress.problem ? 'bg-green-500' : 'bg-gray-700'
            )}
            title="Problem"
          />
          <div
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              progress.personas ? 'bg-green-500' : 'bg-gray-700'
            )}
            title="Personas"
          />
          <div
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              progress.painPoints ? 'bg-green-500' : 'bg-gray-700'
            )}
            title="Pain Points"
          />
          <div
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              progress.solutions ? 'bg-green-500' : 'bg-gray-700'
            )}
            title="Solutions"
          />
          <div
            className={cn(
              'flex-1 h-1 rounded-full transition-colors',
              progress.specs ? 'bg-green-500' : 'bg-gray-700'
            )}
            title="Specifications"
          />
        </div>

        {/* Progress percentage */}
        <div className="text-xs text-gray-500 mb-2">
          {Math.round(progressPercentage)}% complete
        </div>

        {/* Modified time */}
        <div
          className="flex items-center gap-1 text-xs text-gray-500"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Clock className="w-3 h-3" />
          <span>{relativeTime}</span>
          
          {/* Absolute time tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
              {absoluteTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};