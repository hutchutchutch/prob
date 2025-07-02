import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowStore } from '@/stores/workflowStore';
import { supabase } from '@/services/supabase/client';
import type { Workspace, Project } from './types';

export const ConnectedSidebar: React.FC = () => {
  const { user } = useAuth();
  const { projectId } = useWorkflowStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

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
          projects: ws.projects.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            updatedAt: new Date(p.updated_at)
          }))
        }));

        setWorkspaces(formattedWorkspaces);
      } catch (error) {
        console.error('[ConnectedSidebar] Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);

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
    <Sidebar
      workspaces={workspaces}
      activeProjectId={projectId || undefined}
      onWorkspaceCreate={handleWorkspaceCreate}
      onProjectSelect={handleProjectSelect}
      onSettings={handleSettings}
    />
  );
}; 