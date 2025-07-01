import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { ProblemInput } from '@/components/workflow';
import { Canvas } from '@/components/canvas';
import { useWorkflowStore } from '@/stores/workflowStore';
import useProjectStore from '@/stores/projectStore';

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

export function App() {
  const { currentStep } = useWorkflowStore();
  const { workspaces, activeWorkspaceId, activeProjectId } = useProjectStore();

  // Show problem input as initial screen
  if (currentStep === 'problem_input' && !activeProjectId) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="problem-input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <ProblemInput />
            </motion.div>
          </AnimatePresence>
        </div>
      </QueryClientProvider>
    );
  }

  // Main app layout with sidebar and canvas
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          activeProjectId={activeProjectId}
          onWorkspaceSelect={(id: string) => console.log('Select workspace:', id)}
          onWorkspaceCreate={() => console.log('Create workspace')}
          onProjectSelect={(id: string) => console.log('Select project:', id)}
          onNewProject={() => console.log('New project')}
          onSettings={() => console.log('Settings')}
          className="flex-shrink-0"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header with Progress Bar */}
          <header className="h-20 bg-gray-800 border-b border-gray-700 flex items-center px-6">
            <ProgressBar 
              currentStep={stepToNumber(currentStep)}
              totalSteps={7}
            />
          </header>

          {/* Canvas Area */}
          <main className="flex-1 relative bg-gray-900">
            <div className="absolute inset-0">
              <Canvas />
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;