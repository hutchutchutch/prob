import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import useProjectStore from '@/stores/projectStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Map workflow steps to numeric values
const stepToNumber = (step: string): number => {
  const stepMap: Record<string, number> = {
    'problem_input': 1,
    'persona_discovery': 2,
    'pain_points': 3,
    'solution_generation': 4,
    'user_stories': 5,
    'architecture': 6,
    'export': 7,
  };
  return stepMap[step] || 1;
};

// Demo workspace data for development
const DEMO_WORKSPACES = [
  {
    id: 'ws-1',
    name: 'Product Ideas',
    description: 'Personal product concepts and experiments',
    icon: '💡',
    user_id: 'demo-user',
    folder_path: null,
    is_active: true,
    problemCount: 2,
    updatedAt: new Date().toISOString(),
    projects: [
      { 
        id: 'proj-1', 
        name: 'Dog Walking App', 
        status: 'in-progress' as const,
        updatedAt: new Date()
      },
      { 
        id: 'proj-2', 
        name: 'Meal Prep Service', 
        status: 'draft' as const,
        updatedAt: new Date()
      },
    ]
  },
  {
    id: 'ws-2', 
    name: 'Client Projects',
    description: 'Client work and consulting',
    icon: '💼',
    user_id: 'demo-user',
    folder_path: null,
    is_active: true,
    problemCount: 1,
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    projects: [
      { 
        id: 'proj-3', 
        name: 'E-commerce Platform', 
        status: 'completed' as const,
        updatedAt: new Date(Date.now() - 172800000) // 2 days ago
      },
    ]
  }
];

export function App() {
  const { currentStep } = useWorkflowStore();
  const { workspaces, activeWorkspaceId, activeProjectId, setActiveWorkspace } = useProjectStore();

  // Initialize with demo data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && workspaces.length === 0) {
      console.log('[App] Initializing with demo workspaces');
      // Set demo workspaces directly in the store
      useProjectStore.setState({ 
        workspaces: DEMO_WORKSPACES as any,
        activeWorkspaceId: DEMO_WORKSPACES[0].id
      });
    }
  }, [workspaces.length]);

  // Debug logging
  useEffect(() => {
    console.log('[App] Current workflow state:', {
      currentStep,
      activeWorkspaceId,
      activeProjectId,
      workspaces: workspaces.length
    });
  }, [currentStep, activeWorkspaceId, activeProjectId, workspaces]);

  // Always show the main app layout with sidebar and canvas
  // The canvas will handle showing different content based on workflow state
  return (
    <QueryClientProvider client={queryClient}>
      <div 
        className="flex h-screen bg-gray-900 text-white overflow-hidden"
        style={{ backgroundColor: '#111827', color: '#ffffff', minHeight: '100vh' }}
      >
        {/* Debug info */}
        <div className="absolute top-0 left-0 z-50 bg-red-600 text-white p-2 text-xs">
          Debug: App Rendered, Step: {currentStep}
        </div>
        
        {/* Sidebar */}
        <div className="border-4 border-red-500" style={{ borderColor: 'red' }}>
          <Sidebar
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            activeProjectId={activeProjectId}
            onWorkspaceSelect={(id: string) => {
              console.log('[App] Select workspace:', id);
              setActiveWorkspace(id);
            }}
            onWorkspaceCreate={() => {
              console.log('[App] Create workspace');
              // TODO: Implement workspace creation
            }}
            onProjectSelect={(id: string) => {
              console.log('[App] Select project:', id);
              // TODO: Implement project selection
            }}
            onNewProject={() => {
              console.log('[App] New project');
              // Reset workflow for new project
              useWorkflowStore.getState().resetWorkflow();
            }}
            onSettings={() => {
              console.log('[App] Settings');
              // TODO: Implement settings
            }}
            className="flex-shrink-0"
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative border-4 border-green-500" style={{ borderColor: 'green' }}>
          {/* Header with Progress Bar */}
          <header 
            className="h-20 bg-gray-800 border-b border-gray-700 flex items-center px-6 z-10 border-4 border-blue-500"
            style={{ backgroundColor: '#1F2937', borderColor: 'blue' }}
          >
            <ProgressBar 
              currentStep={stepToNumber(currentStep)}
              totalSteps={7}
            />
          </header>

          {/* Workflow Canvas - handles all workflow states */}
          <main 
            className="flex-1 relative bg-gray-900 border-4 border-yellow-500"
            style={{ backgroundColor: '#111827', borderColor: 'yellow' }}
          >
            <WorkflowCanvas />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;