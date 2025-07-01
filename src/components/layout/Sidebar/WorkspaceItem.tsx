import React from 'react';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Workspace, Project } from './types';

export interface WorkspaceItemProps {
  workspace: Workspace;
  isExpanded: boolean;
  onToggle: () => void;
  activeProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  statusColors: Record<string, string>;
  className?: string;
  isActive?: boolean;
  onSelect: () => void;
}

export const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  isExpanded,
  onToggle,
  activeProjectId,
  onProjectSelect,
  statusColors,
  className = '',
  isActive,
  onSelect,
}) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-3 rounded-md text-left transition-all duration-fast',
          'hover:bg-gray-700 hover:text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800',
          isExpanded ? 'bg-gray-700 text-white' : 'text-gray-300',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">
            {workspace.icon || '📁'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{workspace.name}</h3>
            {workspace.description && (
              <p className="text-sm text-gray-400 truncate mt-0.5">
                {workspace.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {workspace.updatedAt && (
                <>
                  <span>
                    {new Date(workspace.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600">•</span>
                </>
              )}
              <span>
                {workspace.problemCount || 0} problems
              </span>
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {workspace.projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isActive={activeProjectId === project.id}
              onSelect={() => onProjectSelect(project.id)}
              statusColor={statusColors[project.status]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Project Item Sub-component
interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  statusColor: string;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isActive,
  onSelect,
  statusColor,
}) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-2 p-2 pl-4 rounded-lg transition-colors group',
        isActive
          ? 'bg-gray-700 text-white'
          : 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
      )}
    >
      <File className="w-4 h-4" />
      <span className="flex-1 text-left text-sm truncate">
        {project.name}
      </span>
      <div
        className={cn('w-2 h-2 rounded-full', statusColor)}
        title={project.status}
      />
    </button>
  );
};