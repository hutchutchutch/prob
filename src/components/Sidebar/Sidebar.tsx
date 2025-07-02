import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Settings, ChevronRight } from 'lucide-react';
import { WorkspaceItem } from './WorkspaceItem';
import { ProjectCard } from './ProjectCard';
import { ProjectSearch } from './ProjectSearch';
import { ProjectFilters, FilterOptions } from './ProjectFilters';
import { QuickActions } from './QuickActions';
import { ProjectContextMenu } from '../ProjectContextMenu';
import { useRecentFlows } from '@/hooks/useRecentFlows';
import { useProjectSearch } from '@/hooks/useProjectSearch';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { SidebarProps } from './types';
import { cn } from '@/utils/cn';
import './Sidebar.css';

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
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set([activeWorkspaceId || '']));
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    dateRange: 'all',
    tags: [],
    sortBy: 'recent',
  });
  const [contextMenu, setContextMenu] = useState<{
    projectId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);

  // Fetch recent flows for active workspace
  const { flows, loading, refetch, deleteFlow, duplicateFlow } = useRecentFlows({
    workspaceId: activeWorkspaceId,
    includeArchived: filters.status.includes('archived'),
  });

  // Apply search
  const { searchResults } = useProjectSearch(flows, searchTerm);

  // Apply filters and sorting
  const filteredAndSortedProjects = useMemo(() => {
    let results = searchResults;

    // Filter by status
    if (filters.status.length > 0) {
      results = results.filter(project => filters.status.includes(project.status));
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
      };
      
      if (filters.dateRange in ranges) {
        const cutoff = new Date(now.getTime() - ranges[filters.dateRange as keyof typeof ranges]);
        results = results.filter(project => new Date(project.modifiedAt) >= cutoff);
      }
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      results = results.filter(project =>
        filters.tags.some(tag => project.tags.includes(tag))
      );
    }

    // Sort
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          const aProgress = Object.values(a.progress).filter(Boolean).length;
          const bProgress = Object.values(b.progress).filter(Boolean).length;
          return bProgress - aProgress;
        case 'modified':
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        case 'recent':
        default:
          return (b.lastOpenedAt?.getTime() || 0) - (a.lastOpenedAt?.getTime() || 0);
      }
    });

    return results;
  }, [searchResults, filters]);

  // Keyboard navigation
  const {
    focusedIndex,
    setFocusedIndex,
    selectedIndices,
    isSelected,
    toggleSelection,
    selectRange,
    clearSelection,
  } = useKeyboardNavigation({
    items: filteredAndSortedProjects,
    onSelect: (project) => onProjectSelect?.(project.id),
    onOpen: (project) => onProjectSelect?.(project.id),
    onDelete: (project) => handleProjectAction(project.id, 'delete'),
    onMultiSelect: (indices) => {
      const projectIds = indices.map(i => filteredAndSortedProjects[i]?.id).filter(Boolean);
      setSelectedProjects(new Set(projectIds));
    },
  });

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

  const handleProjectAction = async (projectId: string, action: string) => {
    switch (action) {
      case 'delete':
        if (confirm('Are you sure you want to delete this project?')) {
          await deleteFlow(projectId);
          refetch();
        }
        break;
      case 'duplicate':
        const newId = await duplicateFlow(projectId);
        onProjectSelect?.(newId);
        break;
      case 'archive':
        // Handle archive
        break;
      case 'export':
        // Handle export
        break;
      case 'share':
        // Handle share
        break;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    setContextMenu({
      projectId,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProjectId(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedProjectId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    if (draggedProjectId && draggedProjectId !== targetProjectId) {
      // Handle reordering logic here
      console.log(`Reorder ${draggedProjectId} to position of ${targetProjectId}`);
    }
    setDraggedProjectId(null);
  };

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    flows.forEach(flow => flow.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [flows]);

  return (
    <aside 
      className={cn(
        'sidebar',
        className
      )}
    >
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="heading-3">Prob</h2>
        <button
          onClick={onWorkspaceCreate}
          className="btn-icon btn-icon--small"
          title="Create new workspace"
        >
          <Plus className="icon" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700">
        <QuickActions
          onNewProject={onNewProject || (() => {})}
          onImportProject={() => console.log('Import project')}
          onOpenRecent={() => console.log('Open recent')}
        />
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-700">
        <ProjectSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          className="mb-3"
        />
        <ProjectFilters
          filters={filters}
          onChange={setFilters}
          availableTags={availableTags}
        />
      </div>

      {/* Workspace List */}
      <div className="sidebar-content">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="workspace-section">
            <button
              onClick={() => {
                toggleWorkspace(workspace.id);
                onWorkspaceSelect?.(workspace.id);
              }}
              className={cn(
                'sidebar-item sidebar-item--workspace w-full',
                activeWorkspaceId === workspace.id && 'sidebar-item--active'
              )}
            >
              <ChevronRight
                className={cn(
                  'icon-sm workspace-chevron',
                  expandedWorkspaces.has(workspace.id) && 'workspace-chevron--expanded'
                )}
              />
              <div className="workspace-content">
                <h3 className="workspace-title">{workspace.name}</h3>
                {workspace.description && (
                  <p className="workspace-description body-sm">{workspace.description}</p>
                )}
              </div>
            </button>

            {/* Project List */}
            {expandedWorkspaces.has(workspace.id) && activeWorkspaceId === workspace.id && (
              <div className="px-2 pb-2">
                {loading ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Loading projects...</div>
                ) : filteredAndSortedProjects.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    {searchTerm || filters.status.length > 0 
                      ? 'No projects match your search'
                      : 'No projects yet'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAndSortedProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        id={project.id}
                        name={project.name}
                        description={project.description}
                        status={project.status}
                        progress={project.progress}
                        modifiedAt={project.modifiedAt}
                        canvasPreview={project.canvasPreview}
                        isActive={activeProjectId === project.id}
                        isSelected={selectedProjects.has(project.id) || isSelected(index)}
                        isDragging={draggedProjectId === project.id}
                        onSelect={(id) => {
                          setFocusedIndex(index);
                          onProjectSelect?.(id);
                        }}
                        onMultiSelect={(id, add) => {
                          if (add) {
                            selectedProjects.add(id);
                          } else {
                            selectedProjects.delete(id);
                          }
                          setSelectedProjects(new Set(selectedProjects));
                        }}
                        onQuickAction={handleProjectAction}
                        onContextMenu={handleContextMenu}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

      {/* Context Menu */}
      {contextMenu && (
        <ProjectContextMenu
          projectId={contextMenu.projectId}
          position={contextMenu.position}
          onAction={handleProjectAction}
          onClose={() => setContextMenu(null)}
          projectStatus={flows.find(f => f.id === contextMenu.projectId)?.status}
        />
      )}
    </aside>
  );
};