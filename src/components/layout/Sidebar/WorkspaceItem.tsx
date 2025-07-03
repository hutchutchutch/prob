import React from 'react';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Workspace, ProjectWithGoldiDocs } from './types';
import { GoldiDocsProgress } from './GoldiDocsProgress';

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
    <div className="workspace-item">
      <button
        onClick={onToggle}
        className={cn(
          'sidebar-item sidebar-item--workspace',
          isExpanded && 'sidebar-item--active',
          className
        )}
      >
        <ChevronRight className={cn('icon icon-sm workspace-chevron', isExpanded && 'workspace-chevron--expanded')} />
        <div className="workspace-content">
          <h3 className="workspace-title">{workspace.name}</h3>
          {workspace.description && (
            <p className="body-sm workspace-description">
              {workspace.description}
            </p>
          )}
          <div className="workspace-meta">
            {workspace.updatedAt && (
              <>
                <span className="workspace-meta-item">
                  {new Date(workspace.updatedAt).toLocaleDateString()}
                </span>
                <span className="workspace-meta-separator">•</span>
              </>
            )}
            <span className="workspace-meta-item">
              {workspace.problemCount || 0} problems
            </span>
          </div>
        </div>
      </button>

      {isExpanded && workspace.projects.length > 0 && (
        <div className="project-list">
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
  project: ProjectWithGoldiDocs;
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
    <div className="project-item-wrapper">
      <button
        onClick={onSelect}
        className={cn(
          'project-item',
          isActive && 'project-item--active'
        )}
      >
        <File className="icon icon-sm" />
        <span className="project-name">
          {project.name}
        </span>
        <div
          className={cn('status-dot', statusColor)}
          title={project.status}
        />
      </button>
      
      {project.goldiDocs && (
        <GoldiDocsProgress
          projectId={project.id}
          status={project.goldiDocs}
        />
      )}
    </div>
  );
};