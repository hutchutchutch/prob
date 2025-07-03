import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, exists, createDir } from '@tauri-apps/plugin-fs';
import { join, appDataDir } from '@tauri-apps/api/path';
import { Command } from '@tauri-apps/plugin-shell';

interface WorkspaceFileData {
  version: string;
  workspaceId: string;
  lastModified: string;
  workflow: any;
  metadata?: {
    name?: string;
    description?: string;
    createdAt?: string;
  };
}

export class TauriFileSystem {
  private static readonly WORKSPACE_FILENAME = 'gauntlet-workspace.json';
  
  /**
   * Check if we're running in Tauri environment
   */
  static isTauri(): boolean {
    return typeof window !== 'undefined' && '__TAURI__' in window;
  }

  /**
   * Open directory picker dialog
   */
  static async selectDirectory(): Promise<string | null> {
    if (!this.isTauri()) {
      console.warn('Not running in Tauri environment');
      return null;
    }

    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Workspace Directory',
      });
      
      return selected as string | null;
    } catch (error) {
      console.error('Error selecting directory:', error);
      return null;
    }
  }

  /**
   * Save workspace data to a file in the selected directory
   */
  static async saveWorkspaceToDirectory(
    directory: string,
    workspaceId: string,
    data: any
  ): Promise<void> {
    if (!this.isTauri()) {
      throw new Error('Not running in Tauri environment');
    }

    const workspaceData: WorkspaceFileData = {
      version: '1.0.0',
      workspaceId,
      lastModified: new Date().toISOString(),
      workflow: data,
    };

    const filePath = await join(directory, this.WORKSPACE_FILENAME);
    const content = JSON.stringify(workspaceData, null, 2);
    
    await writeTextFile(filePath, content);
  }

  /**
   * Load workspace data from a directory
   */
  static async loadWorkspaceFromDirectory(
    directory: string
  ): Promise<WorkspaceFileData | null> {
    if (!this.isTauri()) {
      throw new Error('Not running in Tauri environment');
    }

    try {
      const filePath = await join(directory, this.WORKSPACE_FILENAME);
      
      // Check if file exists
      const fileExists = await exists(filePath);
      if (!fileExists) {
        return null;
      }

      const content = await readTextFile(filePath);
      return JSON.parse(content) as WorkspaceFileData;
    } catch (error) {
      console.error('Error loading workspace:', error);
      return null;
    }
  }

  /**
   * Export workspace data using save dialog
   */
  static async exportWorkspace(
    workspaceId: string,
    data: any,
    defaultFileName?: string
  ): Promise<void> {
    if (!this.isTauri()) {
      throw new Error('Not running in Tauri environment');
    }

    const workspaceData: WorkspaceFileData = {
      version: '1.0.0',
      workspaceId,
      lastModified: new Date().toISOString(),
      workflow: data,
    };

    const filePath = await save({
      defaultPath: defaultFileName || `workspace-${Date.now()}.json`,
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }],
      title: 'Export Workspace',
    });

    if (filePath) {
      const content = JSON.stringify(workspaceData, null, 2);
      await writeTextFile(filePath, content);
    }
  }

  /**
   * Import workspace data from file
   */
  static async importWorkspace(): Promise<WorkspaceFileData | null> {
    if (!this.isTauri()) {
      throw new Error('Not running in Tauri environment');
    }

    const selected = await open({
      multiple: false,
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }],
      title: 'Import Workspace',
    });

    if (selected && typeof selected === 'string') {
      try {
        const content = await readTextFile(selected);
        return JSON.parse(content) as WorkspaceFileData;
      } catch (error) {
        console.error('Error importing workspace:', error);
        throw new Error('Failed to parse workspace file');
      }
    }

    return null;
  }

  /**
   * Get app data directory for storing workspace metadata
   */
  static async getAppDataDirectory(): Promise<string> {
    if (!this.isTauri()) {
      throw new Error('Not running in Tauri environment');
    }

    const appDir = await appDataDir();
    const workspacesDir = await join(appDir, 'workspaces');
    
    // Ensure directory exists
    const dirExists = await exists(workspacesDir);
    if (!dirExists) {
      await createDir(workspacesDir, { recursive: true });
    }
    
    return workspacesDir;
  }

  /**
   * Save workspace metadata (directory associations, etc.)
   */
  static async saveWorkspaceMetadata(
    workspaceId: string,
    metadata: { directory?: string; [key: string]: any }
  ): Promise<void> {
    if (!this.isTauri()) {
      // Fallback to localStorage
      localStorage.setItem(`workspace_meta_${workspaceId}`, JSON.stringify(metadata));
      return;
    }

    const appDir = await this.getAppDataDirectory();
    const metaPath = await join(appDir, `${workspaceId}.meta.json`);
    await writeTextFile(metaPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Load workspace metadata
   */
  static async loadWorkspaceMetadata(workspaceId: string): Promise<any | null> {
    if (!this.isTauri()) {
      // Fallback to localStorage
      const data = localStorage.getItem(`workspace_meta_${workspaceId}`);
      return data ? JSON.parse(data) : null;
    }

    try {
      const appDir = await this.getAppDataDirectory();
      const metaPath = await join(appDir, `${workspaceId}.meta.json`);
      
      const fileExists = await exists(metaPath);
      if (!fileExists) {
        return null;
      }

      const content = await readTextFile(metaPath);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading workspace metadata:', error);
      return null;
    }
  }

  /**
   * Open terminal at specified directory
   */
  static async openTerminal(directory: string): Promise<void> {
    if (!this.isTauri()) {
      // Fallback for browser
      console.log('Opening terminal at:', directory);
      alert(`Terminal would open at: ${directory}\n\nThis feature requires the desktop app.`);
      return;
    }

    // Platform-specific terminal commands
    const platform = await invoke<string>('get_platform');
    
    let command: Command;
    switch (platform) {
      case 'darwin': // macOS
        command = new Command('open', ['-a', 'Terminal', directory]);
        break;
      case 'windows':
        command = new Command('cmd', ['/c', 'start', 'cmd', '/k', 'cd', directory]);
        break;
      case 'linux':
        // Try common terminal emulators
        command = new Command('gnome-terminal', ['--working-directory', directory]);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    try {
      await command.execute();
    } catch (error) {
      console.error('Error opening terminal:', error);
      // Try alternative terminals on Linux
      if (platform === 'linux') {
        try {
          const xterm = new Command('xterm', ['-e', `cd ${directory} && bash`]);
          await xterm.execute();
        } catch {
          const konsole = new Command('konsole', ['--workdir', directory]);
          await konsole.execute();
        }
      }
    }
  }
}