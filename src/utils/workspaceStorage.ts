import { WorkflowState } from '@/stores/workflowStore';
import { TauriFileSystem } from '@/services/tauri/fileSystem';

interface WorkspaceStorageConfig {
  workspaceId: string;
  directory: string;
}

interface WorkspaceData {
  version: string;
  workspaceId: string;
  lastModified: string;
  workflow: Partial<WorkflowState>;
  metadata?: {
    name?: string;
    description?: string;
    createdAt?: string;
  };
}

export class WorkspaceStorage {
  private static readonly STORAGE_VERSION = '1.0.0';
  private static readonly FILENAME = 'gauntlet-workspace.json';

  /**
   * Save workspace data to a file in the selected directory
   * Uses Tauri API when available, falls back to localStorage
   */
  static async saveWorkspace(
    config: WorkspaceStorageConfig,
    workflowState: Partial<WorkflowState>
  ): Promise<void> {
    const workspaceData: WorkspaceData = {
      version: this.STORAGE_VERSION,
      workspaceId: config.workspaceId,
      lastModified: new Date().toISOString(),
      workflow: workflowState,
    };

    try {
      // Use Tauri API if available
      if (TauriFileSystem.isTauri()) {
        await TauriFileSystem.saveWorkspaceToDirectory(
          config.directory,
          config.workspaceId,
          workflowState
        );
        
        // Also save metadata
        await TauriFileSystem.saveWorkspaceMetadata(config.workspaceId, {
          directory: config.directory,
          lastSaved: new Date().toISOString(),
        });
      } else {
        // Fallback to localStorage for web
        const key = `workspace_data_${config.workspaceId}`;
        localStorage.setItem(key, JSON.stringify(workspaceData));
        localStorage.setItem(`workspace_dir_${config.workspaceId}`, config.directory);
      }
      
      console.log('[WorkspaceStorage] Saved workspace data:', {
        workspaceId: config.workspaceId,
        directory: config.directory,
      });
    } catch (error) {
      console.error('[WorkspaceStorage] Error saving workspace:', error);
      throw new Error('Failed to save workspace data');
    }
  }

  /**
   * Load workspace data from the selected directory
   */
  static async loadWorkspace(
    config: WorkspaceStorageConfig
  ): Promise<WorkspaceData | null> {
    try {
      // Use Tauri API if available
      if (TauriFileSystem.isTauri()) {
        const data = await TauriFileSystem.loadWorkspaceFromDirectory(config.directory);
        
        if (data) {
          // Validate version compatibility
          if (data.version !== this.STORAGE_VERSION) {
            console.warn('[WorkspaceStorage] Version mismatch:', {
              stored: data.version,
              current: this.STORAGE_VERSION,
            });
          }
        }
        
        return data;
      } else {
        // Fallback to localStorage
        const key = `workspace_data_${config.workspaceId}`;
        const data = localStorage.getItem(key);
        
        if (!data) {
          return null;
        }

        const workspaceData = JSON.parse(data) as WorkspaceData;
        
        // Validate version compatibility
        if (workspaceData.version !== this.STORAGE_VERSION) {
          console.warn('[WorkspaceStorage] Version mismatch:', {
            stored: workspaceData.version,
            current: this.STORAGE_VERSION,
          });
        }

        return workspaceData;
      }
    } catch (error) {
      console.error('[WorkspaceStorage] Error loading workspace:', error);
      return null;
    }
  }

  /**
   * Export workspace data as a downloadable file
   */
  static async exportWorkspace(
    workspaceId: string,
    workflowState: Partial<WorkflowState>,
    filename?: string
  ): Promise<void> {
    // Use Tauri API if available
    if (TauriFileSystem.isTauri()) {
      await TauriFileSystem.exportWorkspace(
        workspaceId,
        workflowState,
        filename || `workspace-${workspaceId}-${new Date().toISOString().split('T')[0]}.json`
      );
    } else {
      // Fallback to browser download
      const workspaceData: WorkspaceData = {
        version: this.STORAGE_VERSION,
        workspaceId,
        lastModified: new Date().toISOString(),
        workflow: workflowState,
      };

      const blob = new Blob([JSON.stringify(workspaceData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${this.FILENAME}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Import workspace data from a file
   */
  static async importWorkspace(file?: File): Promise<WorkspaceData | null> {
    // Use Tauri API if available
    if (TauriFileSystem.isTauri()) {
      const data = await TauriFileSystem.importWorkspace();
      
      if (data) {
        // Validate the imported data
        if (!data.version || !data.workspaceId || !data.workflow) {
          throw new Error('Invalid workspace file format');
        }
      }
      
      return data;
    } else if (file) {
      // Fallback to FileReader for browser
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content) as WorkspaceData;
            
            // Validate the imported data
            if (!data.version || !data.workspaceId || !data.workflow) {
              throw new Error('Invalid workspace file format');
            }
            
            resolve(data);
          } catch (error) {
            reject(new Error('Failed to parse workspace file'));
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }
    
    return null;
  }

  /**
   * Get the directory path for a workspace
   */
  static async getWorkspaceDirectory(workspaceId: string): Promise<string | null> {
    if (TauriFileSystem.isTauri()) {
      const metadata = await TauriFileSystem.loadWorkspaceMetadata(workspaceId);
      return metadata?.directory || null;
    }
    
    return localStorage.getItem(`workspace_dir_${workspaceId}`);
  }

  /**
   * Check if File System Access API is available
   */
  static isFileSystemAccessSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  /**
   * Use File System Access API to select a directory (Chrome/Edge only)
   */
  static async selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isFileSystemAccessSupported()) {
      console.warn('[WorkspaceStorage] File System Access API not supported');
      return null;
    }

    try {
      // @ts-ignore - TypeScript doesn't know about this API yet
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      return dirHandle;
    } catch (error) {
      // User cancelled or error occurred
      console.log('[WorkspaceStorage] Directory selection cancelled or failed:', error);
      return null;
    }
  }

  /**
   * Save workspace using File System Access API
   */
  static async saveWorkspaceToFileSystem(
    dirHandle: FileSystemDirectoryHandle,
    workspaceId: string,
    workflowState: Partial<WorkflowState>
  ): Promise<void> {
    try {
      const workspaceData: WorkspaceData = {
        version: this.STORAGE_VERSION,
        workspaceId,
        lastModified: new Date().toISOString(),
        workflow: workflowState,
      };

      // Create or overwrite the workspace file
      const fileHandle = await dirHandle.getFileHandle(this.FILENAME, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(workspaceData, null, 2));
      await writable.close();
      
      console.log('[WorkspaceStorage] Saved to file system');
    } catch (error) {
      console.error('[WorkspaceStorage] Error saving to file system:', error);
      throw error;
    }
  }
}