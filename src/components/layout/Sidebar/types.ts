import type { Project as DBProject } from '@/types/database.types';

export interface Workspace {
  id: string;
  name: string;
  projects: ProjectWithGoldiDocs[];
  icon?: string;
  description?: string;
  updatedAt?: string;
  problemCount?: number;
}

export interface ProjectWithGoldiDocs extends DBProject {
  goldiDocs?: GoldiDocsStatus;
}

// Legacy Project interface for backwards compatibility  
export interface Project extends ProjectWithGoldiDocs {}

export interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  activeProjectId?: string;
  onWorkspaceSelect?: (workspaceId: string) => void;
  onWorkspaceCreate?: () => void;
  onProjectSelect?: (projectId: string) => void;
  onNewProject?: () => void;
  onSettings?: () => void;
  onDirectorySelect?: (workspaceId: string, directory: string) => void;
  onOpenTerminal?: (workspaceId: string) => void;
  onSaveWorkspace?: (workspaceId: string) => void;
  onExportWorkspace?: (workspaceId: string) => void;
  workspaceDirectory?: Record<string, string>;
  className?: string;
}

// GoldiDocs Types
export type DocumentType = 'PV' | 'FR' | 'SA' | 'DF' | 'ER' | 'DS';
export type DocumentStatus = 'complete' | 'processing' | 'pending' | 'error' | 'drift';

export interface DocumentStatusInfo {
  type: DocumentType;
  status: DocumentStatus;
  generatedAt?: Date;
  error?: string;
  progress?: number;
}

export interface GoldiDocsStatus {
  documents: DocumentStatusInfo[];
  totalCount: number;
  completedCount: number;
}

export const DOCUMENT_NAMES: Record<DocumentType, string> = {
  PV: 'Product Vision',
  FR: 'Functional Requirements',
  SA: 'System Architecture',
  DF: 'Data Flow Diagram',
  ER: 'Entity Relationship Diagram',
  DS: 'Design System',
};