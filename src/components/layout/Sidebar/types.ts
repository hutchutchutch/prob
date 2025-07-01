export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
  icon?: string;
  description?: string;
  updatedAt?: string;
  problemCount?: number;
}

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'in-progress' | 'completed';
  updatedAt: Date;
}

export interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  activeProjectId?: string;
  onWorkspaceSelect?: (workspaceId: string) => void;
  onWorkspaceCreate?: () => void;
  onProjectSelect?: (projectId: string) => void;
  onNewProject?: () => void;
  onSettings?: () => void;
  className?: string;
}