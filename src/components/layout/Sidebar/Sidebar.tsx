import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { WorkspaceItem } from './WorkspaceItem';
import type { SidebarProps } from './types';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeWorkspaceId,
  activeProjectId,
  onWorkspaceSelect,
  onWorkspaceCreate,
  onProjectSelect,
  onNewProject,
  onSettings,
  className = '',
}) => {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set());

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  return (
    <aside 
      className={cn(
        'w-80 bg-gray-800 border-r border-gray-700 flex flex-col',
        className
      )}
      style={{ width: '320px', backgroundColor: '#1F2937', borderRightColor: '#374151' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700" style={{ borderBottomColor: '#374151' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Workspaces</h2>
          <button
            onClick={onWorkspaceCreate}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            style={{ padding: '0.5rem' }}
            title="Create new workspace"
          >
            <Plus className="w-5 h-5 text-gray-400" style={{ width: '20px', height: '20px', color: '#9CA3AF' }} />
          </button>
        </div>
      </div>

      {/* Workspace List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ padding: '1rem' }}>
        {workspaces.map((workspace) => (
          <WorkspaceItem
            key={workspace.id}
            workspace={workspace}
            isExpanded={expandedWorkspaces.has(workspace.id)}
            onToggle={() => toggleWorkspace(workspace.id)}
            activeProjectId={activeProjectId}
            onProjectSelect={onProjectSelect || (() => {})}
            onSelect={() => onWorkspaceSelect?.(workspace.id)}
            isActive={activeWorkspaceId === workspace.id}
            statusColors={{
              draft: 'bg-gray-500',
              'in-progress': 'bg-yellow-500',
              completed: 'bg-green-500',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700" style={{ padding: '1rem', borderTopColor: '#374151' }}>
        <button
          onClick={onSettings}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          style={{ padding: '0.5rem 1rem', color: '#D1D5DB' }}
        >
          <Settings className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}; 