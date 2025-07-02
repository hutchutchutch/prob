import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowStore } from '@/stores/workflowStore';

export const AuthDebug: React.FC = () => {
  const { user, session, loading, error } = useAuth();
  const { projectId, coreProblem, personas } = useWorkflowStore();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 p-4 rounded-lg text-xs text-white z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug Info</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Auth Status:</strong> {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
        </div>
        
        {user && (
          <div>
            <strong>User:</strong> {user.email} ({user.id.slice(0, 8)}...)
          </div>
        )}
        
        {error && (
          <div className="text-red-400">
            <strong>Auth Error:</strong> {error}
          </div>
        )}
        
        <div>
          <strong>Project ID:</strong> {projectId ? projectId.slice(0, 8) + '...' : 'None'}
        </div>
        
        <div>
          <strong>Core Problem:</strong> {coreProblem ? 'Set' : 'None'}
        </div>
        
        <div>
          <strong>Personas:</strong> {personas.length}
        </div>
        
        {session && (
          <div>
            <strong>Session:</strong> Valid (expires: {new Date(session.expires_at! * 1000).toLocaleTimeString()})
          </div>
        )}
      </div>
    </div>
  );
}; 