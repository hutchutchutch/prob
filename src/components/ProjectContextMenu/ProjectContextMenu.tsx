import React, { useEffect, useRef } from 'react';
import { 
  Copy, 
  Trash2, 
  Download, 
  Archive, 
  Share2, 
  ExternalLink,
  Folder,
  Tag,
  Clock,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProjectContextMenuProps {
  projectId: string;
  position: { x: number; y: number };
  onAction: (projectId: string, action: string) => void;
  onClose: () => void;
  projectStatus?: 'draft' | 'in-progress' | 'completed' | 'archived';
}

export const ProjectContextMenu: React.FC<ProjectContextMenuProps> = ({
  projectId,
  position,
  onAction,
  onClose,
  projectStatus = 'draft',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (rect.right > innerWidth) {
        adjustedX = innerWidth - rect.width - 10;
      }

      if (rect.bottom > innerHeight) {
        adjustedY = innerHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [position]);

  const handleAction = (action: string) => {
    onAction(projectId, action);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-1 min-w-[200px]"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={() => handleAction('open')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <ExternalLink className="icon-sm" />
        Open in Canvas
      </button>

      <button
        onClick={() => handleAction('open-new-window')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <ExternalLink className="icon-sm" />
        Open in New Window
      </button>

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={() => handleAction('duplicate')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Copy className="icon-sm" />
        Duplicate Project
      </button>

      <button
        onClick={() => handleAction('export')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Download className="icon-sm" />
        Export...
      </button>

      <button
        onClick={() => handleAction('share')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Share2 className="icon-sm" />
        Share...
      </button>

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={() => handleAction('show-in-folder')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Folder className="icon-sm" />
        Show in Folder
      </button>

      <button
        onClick={() => handleAction('add-tags')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Tag className="icon-sm" />
        Add Tags...
      </button>

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={() => handleAction('regenerate')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <RefreshCw className="icon-sm" />
        Regenerate All Content
      </button>

      <button
        onClick={() => handleAction('view-history')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Clock className="icon-sm" />
        View History
      </button>

      <div className="border-t border-gray-700 my-1" />

      <button
        onClick={() => handleAction('archive')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-3"
      >
        <Archive className="icon-sm" />
        {projectStatus === 'archived' ? 'Unarchive' : 'Archive'}
      </button>

      <button
        onClick={() => handleAction('delete')}
        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 hover:text-red-300 flex items-center gap-3"
      >
        <Trash2 className="icon-sm" />
        Delete Project
      </button>
    </div>
  );
};