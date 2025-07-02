import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface RecentFlow {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  progress: {
    problem: boolean;
    personas: boolean;
    painPoints: boolean;
    solutions: boolean;
    specs: boolean;
  };
  tags: string[];
  modifiedAt: Date;
  createdAt: Date;
  canvasPreview?: string;
  lastOpenedAt?: Date;
}

interface UseRecentFlowsOptions {
  limit?: number;
  workspaceId?: string;
  includeArchived?: boolean;
}

export const useRecentFlows = (options: UseRecentFlowsOptions = {}) => {
  const { limit = 10, workspaceId, includeArchived = false } = options;
  const [flows, setFlows] = useState<RecentFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecentFlows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from Tauri backend
      const result = await invoke<RecentFlow[]>('get_recent_flows', {
        limit,
        workspaceId,
        includeArchived,
      });

      // Convert date strings to Date objects
      const processedFlows = result.map(flow => ({
        ...flow,
        modifiedAt: new Date(flow.modifiedAt),
        createdAt: new Date(flow.createdAt),
        lastOpenedAt: flow.lastOpenedAt ? new Date(flow.lastOpenedAt) : undefined,
      }));

      setFlows(processedFlows);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch recent flows:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, workspaceId, includeArchived]);

  useEffect(() => {
    fetchRecentFlows();
  }, [fetchRecentFlows]);

  const updateFlowStatus = useCallback(async (flowId: string, status: RecentFlow['status']) => {
    try {
      await invoke('update_flow_status', { flowId, status });
      
      // Update local state optimistically
      setFlows(prev => prev.map(flow => 
        flow.id === flowId ? { ...flow, status } : flow
      ));
    } catch (err) {
      console.error('Failed to update flow status:', err);
      throw err;
    }
  }, []);

  const markAsOpened = useCallback(async (flowId: string) => {
    try {
      await invoke('mark_flow_opened', { flowId });
      
      // Update local state
      setFlows(prev => prev.map(flow => 
        flow.id === flowId ? { ...flow, lastOpenedAt: new Date() } : flow
      ));
    } catch (err) {
      console.error('Failed to mark flow as opened:', err);
    }
  }, []);

  const deleteFlow = useCallback(async (flowId: string) => {
    try {
      await invoke('delete_flow', { flowId });
      
      // Remove from local state
      setFlows(prev => prev.filter(flow => flow.id !== flowId));
    } catch (err) {
      console.error('Failed to delete flow:', err);
      throw err;
    }
  }, []);

  const duplicateFlow = useCallback(async (flowId: string): Promise<string> => {
    try {
      const newFlowId = await invoke<string>('duplicate_flow', { flowId });
      
      // Refresh the list to include the new flow
      await fetchRecentFlows();
      
      return newFlowId;
    } catch (err) {
      console.error('Failed to duplicate flow:', err);
      throw err;
    }
  }, [fetchRecentFlows]);

  return {
    flows,
    loading,
    error,
    refetch: fetchRecentFlows,
    updateFlowStatus,
    markAsOpened,
    deleteFlow,
    duplicateFlow,
  };
};