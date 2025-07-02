export type ExportFormat = 'markdown' | 'json' | 'pdf' | 'zip';

export type SharePermission = 'view' | 'comment' | 'edit';

export interface ExportSection {
  id: string;
  name: string;
  included: boolean;
}

export interface ExportOptions {
  format: ExportFormat;
  template: string;
  sections: string[];
  customBranding?: {
    companyName: string;
    logoUrl: string;
    primaryColor: string;
  };
}

export interface ExportHistory {
  id: string;
  projectId: string;
  format: ExportFormat;
  template: string;
  timestamp: string;
  fileSize?: number;
  downloadUrl?: string;
}

export interface ShareLink {
  id: string;
  url: string;
  token: string;
  projectId: string;
  permission: SharePermission;
  createdAt: string;
  expiresAt?: string;
  accessCount: number;
}

export interface ShareOptions {
  permission: SharePermission;
  expiresIn?: number; // milliseconds
}

export interface AccessHistory {
  id: string;
  shareLinkId: string;
  userEmail?: string;
  permission: SharePermission;
  accessedAt: string;
  ipAddress?: string;
}