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
        'sidebar',
        className
      )}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="heading-3">Workspaces</h2>
        <button
          onClick={onWorkspaceCreate}
          className="btn-icon btn-icon--small"
          title="Create new workspace"
        >
          <Plus className="icon" />
        </button>
      </div>

      {/* Workspace List */}
      <div className="sidebar-content">
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
              draft: 'status-dot--draft',
              'in-progress': 'status-dot--progress',
              completed: 'status-dot--completed',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          onClick={onSettings}
          className="sidebar-item"
        >
          <Settings className="icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}; 