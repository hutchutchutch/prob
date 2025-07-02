import { useState, useCallback } from 'react';
import { useLockManagement } from './useLockManagement';
import { useVersionStore } from '../stores/versionStore';
import { useWorkflowStore } from '../stores/workflowStore';
import { supabase } from '../services/supabase/client';

interface RefreshOptions {
  personas?: boolean;
  painPoints?: boolean;
  solutions?: boolean;
  userStories?: boolean;
  documents?: boolean;
}

interface RefreshProgress {
  total: number;
  completed: number;
  currentStep: string;
  errors: string[];
}

export const useRefreshWorkflow = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [progress, setProgress] = useState<RefreshProgress>({
    total: 0,
    completed: 0,
    currentStep: '',
    errors: [],
  });
  
  const { getLockedItemsByType } = useLockManagement();
  const { addEvent } = useVersionStore();
  const { currentProjectId } = useWorkflowStore();
  
  const refreshItems = useCallback(async (options: RefreshOptions) => {
    if (!currentProjectId) return;
    
    setIsRefreshing(true);
    const steps: Array<{ name: string; type: string; refresh: boolean }> = [];
    
    // Build refresh steps based on options
    if (options.personas) steps.push({ name: 'Personas', type: 'persona', refresh: true });
    if (options.painPoints) steps.push({ name: 'Pain Points', type: 'pain_point', refresh: true });
    if (options.solutions) steps.push({ name: 'Solutions', type: 'solution', refresh: true });
    if (options.userStories) steps.push({ name: 'User Stories', type: 'user_story', refresh: true });
    if (options.documents) steps.push({ name: 'Documents', type: 'document', refresh: true });
    
    setProgress({
      total: steps.length,
      completed: 0,
      currentStep: '',
      errors: [],
    });
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      setProgress(prev => ({
        ...prev,
        currentStep: `Refreshing ${step.name}...`,
      }));
      
      try {
        // Get locked items of this type
        const lockedIds = getLockedItemsByType(step.type);
        
        // Call appropriate edge function based on type
        let result;
        switch (step.type) {
          case 'persona':
            result = await refreshPersonas(currentProjectId, lockedIds);
            break;
          case 'pain_point':
            result = await refreshPainPoints(currentProjectId, lockedIds);
            break;
          case 'solution':
            result = await refreshSolutions(currentProjectId, lockedIds);
            break;
          case 'user_story':
            result = await refreshUserStories(currentProjectId, lockedIds);
            break;
          case 'document':
            result = await refreshDocuments(currentProjectId, lockedIds);
            break;
        }
        
        // Track refresh in version history
        addEvent({
          projectId: currentProjectId,
          eventType: 'refresh',
          eventData: {
            afterState: { 
              type: step.type, 
              refreshed: result?.count || 0,
              locked: lockedIds.length,
            },
            metadata: {
              triggeredBy: 'user_refresh',
              description: `Refreshed ${step.name} (${lockedIds.length} locked)`,
              lockedItems: lockedIds,
            },
          },
        });
        
        setProgress(prev => ({
          ...prev,
          completed: i + 1,
        }));
      } catch (error) {
        console.error(`Error refreshing ${step.name}:`, error);
        setProgress(prev => ({
          ...prev,
          errors: [...prev.errors, `Failed to refresh ${step.name}`],
          completed: i + 1,
        }));
      }
    }
    
    setIsRefreshing(false);
    setProgress(prev => ({
      ...prev,
      currentStep: 'Refresh complete',
    }));
    
    // Clear progress after a delay
    setTimeout(() => {
      setProgress({
        total: 0,
        completed: 0,
        currentStep: '',
        errors: [],
      });
    }, 3000);
  }, [currentProjectId, getLockedItemsByType, addEvent]);
  
  // Edge function calls
  const refreshPersonas = async (projectId: string, lockedIds: string[]) => {
    const { data, error } = await supabase.functions.invoke('generate-personas', {
      body: { projectId, lockedIds, refresh: true },
    });
    
    if (error) throw error;
    return data;
  };
  
  const refreshPainPoints = async (projectId: string, lockedIds: string[]) => {
    const { data, error } = await supabase.functions.invoke('generate-pain-points', {
      body: { projectId, lockedIds, refresh: true },
    });
    
    if (error) throw error;
    return data;
  };
  
  const refreshSolutions = async (projectId: string, lockedIds: string[]) => {
    const { data, error } = await supabase.functions.invoke('generate-solutions', {
      body: { projectId, lockedIds, refresh: true },
    });
    
    if (error) throw error;
    return data;
  };
  
  const refreshUserStories = async (projectId: string, lockedIds: string[]) => {
    const { data, error } = await supabase.functions.invoke('generate-user-stories', {
      body: { projectId, lockedIds, refresh: true },
    });
    
    if (error) throw error;
    return data;
  };
  
  const refreshDocuments = async (projectId: string, lockedIds: string[]) => {
    const { data, error } = await supabase.functions.invoke('generate-documents', {
      body: { projectId, lockedIds, refresh: true },
    });
    
    if (error) throw error;
    return data;
  };
  
  return {
    isRefreshing,
    progress,
    refreshItems,
  };
};