import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Terminal } from '../Terminal';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowStore } from '@/stores/workflowStore';
import useProjectStore from '@/stores/projectStore';
import { supabase } from '@/services/supabase/client';
import { WorkspaceStorage } from '@/utils/workspaceStorage';
import { TauriFileSystem } from '@/services/tauri/fileSystem';
import type { Workspace, Project } from './types';
import './Sidebar.css';

export const ConnectedSidebar: React.FC = () => {
  const { user } = useAuth();
  const workflowStore = useWorkflowStore();
  const { projectId } = workflowStore;
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | undefined>();
  const [workspaceDirectories, setWorkspaceDirectories] = useState<Record<string, string>>({});
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalWorkingDir, setTerminalWorkingDir] = useState<string>('/');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      
      try {
        // Fetch workspaces with their projects
        const { data: workspacesData, error } = await supabase
          .from('workspaces')
          .select(`
            id,
            name,
            created_at,
            updated_at,
            projects (
              id,
              name,
              status,
              updated_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[ConnectedSidebar] Error fetching workspaces:', error);
          return;
        }

        const formattedWorkspaces: Workspace[] = workspacesData.map(ws => ({
          id: ws.id,
          name: ws.name,
          updatedAt: ws.updated_at,
          projects: [] // Projects will be loaded from projectStore
        }));

        setWorkspaces(formattedWorkspaces);
        
        // Set the first workspace as active if none is selected
        if (formattedWorkspaces.length > 0 && !activeWorkspaceId) {
          const firstWorkspaceId = formattedWorkspaces[0].id;
          setActiveWorkspaceId(firstWorkspaceId);
          
          // Load directory for the first workspace
          const savedDir = await WorkspaceStorage.getWorkspaceDirectory(firstWorkspaceId);
          if (savedDir) {
            setWorkspaceDirectories({ [firstWorkspaceId]: savedDir });
          }
          
          // Load projects for the first workspace
          const projectStore = useProjectStore.getState();
          await projectStore.loadProjects(firstWorkspaceId);
        }
      } catch (error) {
        console.error('[ConnectedSidebar] Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);

  // Subscribe to project store updates
  const projects = useProjectStore(state => state.projects);
  
  // Update workspaces with projects from the store
  const workspacesWithProjects = workspaces.map(workspace => ({
    ...workspace,
    projects: workspace.id === activeWorkspaceId 
      ? projects.filter(p => p.workspace_id === workspace.id)
      : workspace.projects
  }));

  const handleWorkspaceCreate = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          user_id: user.id,
          name: `Workspace ${workspaces.length + 1}`,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('[ConnectedSidebar] Error creating workspace:', error);
        return;
      }

      // Refresh workspaces
      setWorkspaces(prev => [
        {
          id: data.id,
          name: data.name,
          updatedAt: data.updated_at,
          projects: []
        },
        ...prev
      ]);
    } catch (error) {
      console.error('[ConnectedSidebar] Error creating workspace:', error);
    }
  };

  const handleProjectSelect = (selectedProjectId: string) => {
    // TODO: Load the selected project into the workflow store
    console.log('[ConnectedSidebar] Project selected:', selectedProjectId);
  };

  const handleSettings = () => {
    // TODO: Open settings modal
    console.log('[ConnectedSidebar] Settings clicked');
  };

  const handleDirectorySelect = (workspaceId: string, directory: string) => {
    console.log('[ConnectedSidebar] Directory selected:', { workspaceId, directory });
    
    // Store the directory selection in local state
    setWorkspaceDirectories(prev => ({
      ...prev,
      [workspaceId]: directory
    }));
    
    // In a real implementation, you would:
    // 1. Save this to local storage or user preferences
    // 2. Use this directory to save/load workspace data
    localStorage.setItem(`workspace_dir_${workspaceId}`, directory);
  };

  const handleOpenTerminal = async (workspaceId: string) => {
    const directory = workspaceDirectories[workspaceId];
    console.log('[ConnectedSidebar] Opening embedded terminal for workspace:', workspaceId, 'at:', directory);
    
    if (!directory) {
      alert('Please select a repository directory first');
      return;
    }
    
    // Toggle terminal visibility and set working directory
    if (terminalVisible && terminalWorkingDir === directory) {
      // If terminal is already open for this directory, close it
      setTerminalVisible(false);
    } else {
      // Open terminal with new directory
      setTerminalWorkingDir(directory);
      setTerminalVisible(true);
    }
  };

  const handleWorkspaceSelect = async (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    
    // Load saved directory for this workspace
    const savedDir = await WorkspaceStorage.getWorkspaceDirectory(workspaceId);
    if (savedDir) {
      setWorkspaceDirectories(prev => ({
        ...prev,
        [workspaceId]: savedDir
      }));
    }
    
    // Load projects for this workspace
    const projectStore = useProjectStore.getState();
    await projectStore.loadProjects(workspaceId);
  };

  const handleSaveWorkspace = async (workspaceId: string) => {
    const directory = workspaceDirectories[workspaceId];
    if (!directory) {
      alert('Please select a directory first');
      return;
    }

    try {
      // Get current workflow state
      const workflowState = {
        currentStep: workflowStore.currentStep,
        projectId: workflowStore.projectId,
        coreProblem: workflowStore.coreProblem,
        personas: workflowStore.personas,
        painPoints: workflowStore.painPoints,
        solutions: workflowStore.solutions,
        userStories: workflowStore.userStories,
        lockedItems: workflowStore.lockedItems,
      };
      
      await WorkspaceStorage.saveWorkspace(
        { workspaceId, directory },
        workflowState
      );
      
      console.log('[ConnectedSidebar] Workspace saved successfully');
      // You could show a success toast here
    } catch (error) {
      console.error('[ConnectedSidebar] Error saving workspace:', error);
      alert('Failed to save workspace');
    }
  };

  const handleExportWorkspace = async (workspaceId: string) => {
    try {
      const workflowState = {
        currentStep: workflowStore.currentStep,
        projectId: workflowStore.projectId,
        coreProblem: workflowStore.coreProblem,
        personas: workflowStore.personas,
        painPoints: workflowStore.painPoints,
        solutions: workflowStore.solutions,
        userStories: workflowStore.userStories,
        lockedItems: workflowStore.lockedItems,
      };
      const workspace = workspaces.find(w => w.id === workspaceId);
      const filename = `${workspace?.name || 'workspace'}-${new Date().toISOString().split('T')[0]}.json`;
      
      await WorkspaceStorage.exportWorkspace(
        workspaceId,
        workflowState,
        filename
      );
      
      console.log('[ConnectedSidebar] Workspace exported successfully');
    } catch (error) {
      console.error('[ConnectedSidebar] Error exporting workspace:', error);
      alert('Failed to export workspace');
    }
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="heading-3">Workspaces</h2>
        </div>
        <div className="sidebar-content">
          <div className="p-4 text-gray-400">Loading...</div>
        </div>
      </aside>
    );
  }

  return (
    <>
      <div className={`sidebar-wrapper ${terminalVisible ? 'terminal-open' : ''}`}>
        <Sidebar
          workspaces={workspacesWithProjects}
          activeWorkspaceId={activeWorkspaceId}
          activeProjectId={projectId || undefined}
          onWorkspaceSelect={handleWorkspaceSelect}
          onWorkspaceCreate={handleWorkspaceCreate}
          onProjectSelect={handleProjectSelect}
          onSettings={handleSettings}
          onDirectorySelect={handleDirectorySelect}
          onOpenTerminal={handleOpenTerminal}
          onSaveWorkspace={handleSaveWorkspace}
          onExportWorkspace={handleExportWorkspace}
          workspaceDirectory={workspaceDirectories}
        />
        <Terminal 
          workingDirectory={terminalWorkingDir}
          isVisible={terminalVisible}
          onClose={() => setTerminalVisible(false)}
        />
      </div>
    </>
  );
}; 