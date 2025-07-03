import React, { useState, useRef } from 'react';
import { Folder, FolderOpen, Terminal, Save, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { WorkspaceStorage } from '@/utils/workspaceStorage';

interface FileDirectoryPickerProps {
  workspaceId: string;
  currentDirectory?: string;
  onDirectorySelect: (directory: string) => void;
  onOpenTerminal?: () => void;
  onSaveWorkspace?: () => void;
  onExportWorkspace?: () => void;
  className?: string;
}

export const FileDirectoryPicker: React.FC<FileDirectoryPickerProps> = ({
  workspaceId,
  currentDirectory,
  onDirectorySelect,
  onOpenTerminal,
  onSaveWorkspace,
  onExportWorkspace,
  className
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectoryClick = async () => {
    // Try to use File System Access API first (Chrome/Edge)
    if (WorkspaceStorage.isFileSystemAccessSupported()) {
      const dirHandle = await WorkspaceStorage.selectDirectory();
      if (dirHandle) {
        onDirectorySelect(dirHandle.name);
        // Store the handle for later use
        // In a real app, you'd store this in a more persistent way
        (window as any)[`dirHandle_${workspaceId}`] = dirHandle;
        return;
      }
    }
    
    // Fallback to file input
    fileInputRef.current?.click();
  };

  const handleDirectoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Get the directory path from the first file
      const file = files[0];
      const path = file.webkitRelativePath || file.name;
      const directory = path.split('/')[0] || path;
      
      // In a real implementation, you'd get the full path
      // For now, we'll use the directory name
      onDirectorySelect(directory);
      setIsSelecting(false);
    }
  };

  const handleTerminalClick = () => {
    if (onOpenTerminal) {
      onOpenTerminal();
    } else {
      // Fallback: Try to open terminal using system command
      // This would need to be implemented with proper electron/tauri APIs
      console.log('Opening terminal at:', currentDirectory || 'default location');
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Directory Selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide">Repository Location</h4>
        
        <button
          onClick={handleDirectoryClick}
          className={cn(
            'w-full flex items-center gap-2 p-3',
            'bg-obsidian-800 hover:bg-obsidian-700',
            'border border-obsidian-700 hover:border-obsidian-600',
            'rounded-lg transition-all duration-200',
            'text-left text-sm',
            isSelecting && 'ring-2 ring-gold-500 ring-offset-2 ring-offset-obsidian-900'
          )}
        >
          <div className="flex-shrink-0">
            {currentDirectory ? (
              <FolderOpen className="w-4 h-4 text-gold-500" />
            ) : (
              <Folder className="w-4 h-4 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            {currentDirectory ? (
              <div>
                <div className="font-medium text-obsidian-50 truncate">
                  {currentDirectory.split(/[\/\\]/).pop() || currentDirectory}
                </div>
                <div className="text-xs text-slate-400 truncate" title={currentDirectory}>
                  {currentDirectory}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">
                Click to select repository folder
              </div>
            )}
          </div>
        </button>

        {/* Hidden file input for directory selection */}
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleDirectoryChange}
          className="hidden"
          accept=""
        />
      </div>

      {/* Terminal Access */}
      <button
        onClick={handleTerminalClick}
        className={cn(
          'w-full flex items-center gap-2 p-3',
          'bg-obsidian-800 hover:bg-obsidian-700',
          'border border-obsidian-700 hover:border-obsidian-600',
          'rounded-lg transition-all duration-200',
          'text-left text-sm',
          'group'
        )}
      >
        <Terminal className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
        <span className="text-obsidian-50">Open Terminal</span>
        {currentDirectory && (
          <span className="text-xs text-slate-400 ml-auto">
            in workspace
          </span>
        )}
      </button>
      
      {/* Additional Actions */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onSaveWorkspace}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 p-2',
            'bg-obsidian-800 hover:bg-obsidian-700',
            'border border-obsidian-700 hover:border-obsidian-600',
            'rounded-lg transition-all duration-200',
            'text-sm group',
            !currentDirectory && 'opacity-50 cursor-not-allowed'
          )}
          disabled={!currentDirectory}
          title="Save workspace to selected directory"
        >
          <Save className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-500 transition-colors" />
          <span className="text-obsidian-50">Save</span>
        </button>
        
        <button
          onClick={onExportWorkspace}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 p-2',
            'bg-obsidian-800 hover:bg-obsidian-700',
            'border border-obsidian-700 hover:border-obsidian-600',
            'rounded-lg transition-all duration-200',
            'text-sm group'
          )}
          title="Export workspace as file"
        >
          <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-gold-500 transition-colors" />
          <span className="text-obsidian-50">Export</span>
        </button>
      </div>
    </div>
  );
};

// Extend the HTMLInputElement interface to include webkitdirectory
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}