import React from 'react';
import { Plus, Upload, FolderOpen, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuickActionsProps {
  onNewProject: () => void;
  onImportProject?: () => void;
  onOpenRecent?: () => void;
  onSettings?: () => void;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewProject,
  onImportProject,
  onOpenRecent,
  onSettings,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        onClick={onNewProject}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors group"
      >
        <Plus className="icon group-hover:scale-110 transition-transform" />
        <div className="text-left">
          <div className="font-medium">New Project</div>
          <div className="text-xs opacity-80">Start from a problem statement</div>
        </div>
      </button>

      {onImportProject && (
        <button
          onClick={onImportProject}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors group"
        >
          <Upload className="icon group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-medium">Import Project</div>
            <div className="text-xs text-gray-400">From existing documentation</div>
          </div>
        </button>
      )}

      {onOpenRecent && (
        <button
          onClick={onOpenRecent}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors group"
        >
          <FolderOpen className="icon group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-medium">Open Recent</div>
            <div className="text-xs text-gray-400">Continue where you left off</div>
          </div>
        </button>
      )}

      {onSettings && (
        <button
          onClick={onSettings}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors mt-auto"
        >
          <Settings className="icon-sm" />
          <span className="text-sm">Preferences</span>
        </button>
      )}
    </div>
  );
};