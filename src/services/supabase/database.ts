import { supabase } from './client';

export interface Workspace {
  id: string;
  user_id?: string;
  name: string;
  folder_path?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  status: string;
  current_step: string;
  langgraph_state?: any;
  created_at: string;
  updated_at: string;
}

export const databaseService = {
  // Workspace operations
  async createWorkspace(name: string, folderPath?: string): Promise<Workspace> {
    console.log('[databaseService] Creating workspace:', name);
    
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        folder_path: folderPath,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('[databaseService] Error creating workspace:', error);
      throw error;
    }
    
    console.log('[databaseService] Workspace created:', data);
    return data;
  },

  async getWorkspaces(): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[databaseService] Error fetching workspaces:', error);
      throw error;
    }
    
    return data || [];
  },

  async getOrCreateDefaultWorkspace(): Promise<Workspace> {
    console.log('[databaseService] Getting or creating default workspace');
    
    // First try to get existing default workspace
    const { data: existing, error: fetchError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('name', 'Default Workspace')
      .single();
    
    if (existing && !fetchError) {
      console.log('[databaseService] Found existing default workspace:', existing.id);
      return existing;
    }
    
    // Create default workspace if it doesn't exist
    console.log('[databaseService] Creating default workspace');
    return this.createWorkspace('Default Workspace', '/default');
  },

  // Project operations
  async createProject(workspaceId: string, name: string): Promise<Project> {
    console.log('[databaseService] Creating project:', name, 'in workspace:', workspaceId);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        workspace_id: workspaceId,
        name,
        status: 'problem_input',
        current_step: 'problem_input'
      })
      .select()
      .single();
    
    if (error) {
      console.error('[databaseService] Error creating project:', error);
      throw error;
    }
    
    console.log('[databaseService] Project created:', data);
    return data;
  },

  async getProjects(workspaceId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[databaseService] Error fetching projects:', error);
      throw error;
    }
    
    return data || [];
  },

  async updateProjectStep(projectId: string, step: string): Promise<void> {
    console.log('[databaseService] Updating project step:', projectId, 'to:', step);
    
    const { error } = await supabase
      .from('projects')
      .update({
        current_step: step,
        status: step
      })
      .eq('id', projectId);
    
    if (error) {
      console.error('[databaseService] Error updating project step:', error);
      throw error;
    }
  },

  // Canvas state operations
  async saveCanvasState(projectId: string, nodes: any[], edges: any[], viewport?: any): Promise<void> {
    console.log('[databaseService] Saving canvas state for project:', projectId);
    
    const { error } = await supabase
      .from('canvas_states')
      .insert({
        project_id: projectId,
        nodes,
        edges,
        viewport
      });
    
    if (error) {
      console.error('[databaseService] Error saving canvas state:', error);
      throw error;
    }
  },

  async getLatestCanvasState(projectId: string): Promise<{ nodes: any[], edges: any[], viewport?: any } | null> {
    const { data, error } = await supabase
      .from('canvas_states')
      .select('nodes, edges, viewport')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('[databaseService] Error fetching canvas state:', error);
      throw error;
    }
    
    return data;
  }
};

export default databaseService; 