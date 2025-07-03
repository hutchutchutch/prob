import React, { useEffect, useState, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ConnectedSidebar } from '@/components/layout/Sidebar';
import { ProgressSteps } from '@/components/common/LoadingStates';
import { PainPointDropdown } from '@/components/common';
import { WorkflowCanvas } from '@/components/workflow';
import { DemoCanvas } from '@/components/DemoCanvas';
import { AuthDebug } from '@/components/debug/AuthDebug';
import { PerformanceOverlay } from '@/components/PerformanceMonitor';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useUIStore } from '@/stores/uiStore';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase/client';
import type { WorkflowStep } from '@/types/workflow.types';
import './App.css';

// Container component that positions dropdown relative to step 3
function PainPointDropdownContainer({ 
  onPainPointSelect, 
  onGoToProblem 
}: {
  onPainPointSelect: (painPointId: string) => void;
  onGoToProblem: () => void;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const positionDropdown = () => {
      const step3Element = document.querySelector('[data-step-index="2"]');
      if (step3Element) {
        const rect = step3Element.getBoundingClientRect();
        const progressContainer = document.querySelector('.bg-obsidian-800');
        const containerRect = progressContainer?.getBoundingClientRect();
        
        if (containerRect) {
          setPosition({
            top: rect.bottom - containerRect.top + 8, // 8px gap below step 3
            left: rect.left - containerRect.left + (rect.width / 2) // Center align with step 3
          });
        }
      }
    };

    // Position immediately
    positionDropdown();
    
    // Reposition on window resize
    window.addEventListener('resize', positionDropdown);
    return () => window.removeEventListener('resize', positionDropdown);
  }, []);

  return (
    <div 
      className="absolute z-50 transform -translate-x-1/2"
      style={{ top: position.top, left: position.left }}
      data-pain-point-dropdown
    >
      <PainPointDropdown
        onPainPointSelect={onPainPointSelect}
        onGoToProblem={onGoToProblem}
        className="shadow-2xl"
      />
    </div>
  );
}

// Component that uses canvas navigation inside ReactFlowProvider
function AppContent() {
  const { currentStep, setCurrentStep } = useWorkflowStore();
  const { goToStep1, goToStep2, goToStep } = useCanvasNavigation();
  const [showPainPointDropdown, setShowPainPointDropdown] = useState(false);

  // Map workflow step to progress step index
  const getProgressStepIndex = (step: string): number => {
    const stepMap: Record<string, number> = {
      'problem_input': 0,
      'persona_discovery': 1,
      'pain_points': 2,
      'solution_generation': 3,
      'focus_group': 4,
      'user_stories': 5,
      'architecture': 6 // Maps to our "documentation" step
    };
    return stepMap[step] || 0;
  };

  // Map progress step index back to workflow step
  const getWorkflowStep = (stepIndex: number): WorkflowStep => {
    const stepMap: Record<number, WorkflowStep> = {
      0: 'problem_input',
      1: 'persona_discovery',
      2: 'pain_points',
      3: 'solution_generation',
      4: 'focus_group',
      5: 'user_stories',
      6: 'architecture'
    };
    return stepMap[stepIndex] || 'problem_input';
  };

  // Handle step click for navigation
  const handleStepClick = (stepIndex: number) => {
    console.log('[App] Step clicked:', stepIndex);
    console.log('[App] Available navigation functions:', { goToStep1: typeof goToStep1, goToStep2: typeof goToStep2, goToStep: typeof goToStep });
    
    // Special handling for Step 3 (Pain Points) - show dropdown instead of immediate navigation
    if (stepIndex === 2) {
      console.log('[App] Pain Points step clicked - showing dropdown');
      setShowPainPointDropdown(true);
      return;
    }
    
    // Update workflow step
    const workflowStep = getWorkflowStep(stepIndex);
    setCurrentStep(workflowStep);
    
    // Navigate canvas based on step
    navigateToStep(stepIndex);
  };

  // Handle pain point selection from dropdown
  const handlePainPointSelect = (painPointId: string) => {
    console.log('[App] Pain point selected:', painPointId);
    setShowPainPointDropdown(false);
    
    // Update workflow step to pain_points and navigate
    setCurrentStep('pain_points');
    goToStep(3);
  };

  // Handle "Enter Problem" CTA from dropdown
  const handleGoToProblem = () => {
    console.log('[App] Going back to problem step');
    setShowPainPointDropdown(false);
    
    // Navigate to Step 1 (Problem) - let the automatic navigation handle the smooth transition
    setCurrentStep('problem_input');
    // Removed direct goToStep1() call to prevent double navigation and jarring transition
  };

  // Navigate canvas to appropriate view based on step index
  const navigateToStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Problem
        console.log('[App] Calling goToStep1...');
        goToStep1();
        break;
      case 1: // Persona
        console.log('[App] Calling goToStep2...');
        goToStep2();
        break;
      case 2: // Pain Points
        console.log('[App] Pain Points - using same view as Step 2');
        goToStep2(); // Use the same view as Step 2
        break;
      case 3: // Solutions
        goToStep(4);
        break;
      case 4: // Focus Group
        goToStep(5); // Navigate to focus group view
        break;
      case 5: // User Stories
      case 6: // Documentation
        // Use step 4 layout for remaining steps for now
        goToStep(4);
        break;
      default:
        goToStep1();
    }
  };

  // Watch for workflow step changes and automatically navigate canvas
  useEffect(() => {
    const stepIndex = getProgressStepIndex(currentStep);
    console.log('[App] Workflow step changed to:', currentStep, '-> step index:', stepIndex);
    console.log('[App] Automatically navigating canvas to match workflow step');
    
    // Slightly longer delay to ensure smooth transitions, especially from dropdown interactions
    setTimeout(() => {
      navigateToStep(stepIndex);
    }, 300);
  }, [currentStep]);

  // Close pain point dropdown when clicking elsewhere or when no selection is made
  useEffect(() => {
    if (showPainPointDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        const dropdown = document.querySelector('[data-pain-point-dropdown]');
        const step3Element = document.querySelector('[data-step-index="2"]');
        
        if (dropdown && !dropdown.contains(event.target as Node) && 
            step3Element && !step3Element.contains(event.target as Node)) {
          console.log('[App] Clicking outside pain point dropdown - showing Step 2 view');
          setShowPainPointDropdown(false);
          // Fallback to Step 2 behavior when no pain point is selected
          setCurrentStep('persona_discovery');
          goToStep2();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPainPointDropdown, goToStep2, setCurrentStep]);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Fixed Progress Bar at top of screen */}
      <div className="fixed top-0 left-64 right-0 z-50 bg-obsidian-800 border-b border-obsidian-700 py-8 px-12">
        <ProgressSteps 
          currentStep={getProgressStepIndex(currentStep)}
          variant="horizontal"
          size="md"
          className="max-w-none"
          onStepClick={handleStepClick}
        />
        
        {/* Pain Point Dropdown Overlay */}
        {showPainPointDropdown && (
          <PainPointDropdownContainer
            onPainPointSelect={handlePainPointSelect}
            onGoToProblem={handleGoToProblem}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 z-40">
        <ConnectedSidebar />
      </div>

      {/* Main Content - adjusted for fixed sidebar and progress bar */}
      <div className="ml-64 flex-1 flex flex-col pt-24"> {/* Added ml-64 for sidebar offset */}
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden"> {/* Added overflow-hidden */}
          <WorkflowCanvas />
        </div>
      </div>
      
      {/* Debug component for development */}
      <AuthDebug />
    </div>
  );
}

export default function App() {
  console.log('[App] Component mounting...');
  
  const { user, loading: authLoading } = useAuth();
  const { resetWorkflow, setProjectId, projectId } = useWorkflowStore();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false);
  const [workspaceInitialized, setWorkspaceInitialized] = useState(false);
  const initializingRef = React.useRef(false);

  console.log('[App] Initial render state:', {
    user: user?.email,
    authLoading,
    isInitializing,
    showPerformanceOverlay
  });

  useEffect(() => {
    const initializeWorkspace = async () => {
      if (!user || workspaceInitialized || initializingRef.current) return;
      
      initializingRef.current = true;
      
      try {
        setIsInitializing(true);
        console.log('[App] Starting workspace initialization for user:', user.id);
        
        // Create or get user record in our custom users table
        console.log('[App] Creating/getting user record...');
        let { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('[App] Error checking user:', userCheckError);
          throw new Error('Failed to check user record');
        }
        
        if (!existingUser) {
          console.log('[App] User record not found, creating new user record');
          // Create new user record
          const { data: newUser, error: createUserError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email!
            })
            .select()
            .single();
          
          if (createUserError) {
            console.error('[App] Failed to create user record:', createUserError);
            throw new Error('Failed to create user record');
          }
          
          console.log('[App] Created new user record:', newUser.id);
        } else {
          console.log('[App] Using existing user record:', existingUser.id);
        }
        
        // Create or get workspace
        console.log('[App] Creating/getting workspace...');
        let { data: existingWorkspace, error: wsCheckError } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .eq('name', 'Default Workspace')
          .single();
        
        let workspaceId: string;
        
        if (wsCheckError && wsCheckError.code !== 'PGRST116') {
          console.error('[App] Error checking workspace:', wsCheckError);
          throw new Error('Failed to check workspace');
        }
        
        if (!existingWorkspace) {
          console.log('[App] Workspace not found, creating new workspace');
          // Create new workspace
          const { data: newWorkspace, error: createWsError } = await supabase
            .from('workspaces')
            .insert({
              user_id: user.id,
              name: 'Default Workspace',
              is_active: true
            })
            .select()
            .single();
          
          if (createWsError) {
            console.error('[App] Failed to create workspace:', createWsError);
            throw new Error('Failed to create workspace');
          }
          
          workspaceId = newWorkspace.id;
          console.log('[App] Created new workspace:', workspaceId);
        } else {
          workspaceId = existingWorkspace.id;
          console.log('[App] Using existing workspace:', workspaceId);
        }
        
        // Create a new project for this session
        const projectId = crypto.randomUUID();
        console.log('[App] Creating new project:', projectId);
        
        const { data: newProject, error: createProjectError } = await supabase
          .from('projects')
          .insert({
            id: projectId,
            workspace_id: workspaceId,
            name: `Project ${new Date().toLocaleDateString()}`,
            status: 'problem_input',
            current_step: 'problem_input'
          })
          .select()
          .single();
        
        if (createProjectError) {
          console.error('[App] Failed to create project:', createProjectError);
          throw new Error('Failed to create project');
        }
        
        console.log('[App] Created project:', newProject);
        
        // Set the project ID in the workflow store
        setProjectId(projectId);
        console.log('[App] Workspace initialization complete');
        console.log('[App] Final state after init:', {
          user: user.id,
          workspaceId,
          projectId,
          isInitializing,
          initError
        });
        
        setWorkspaceInitialized(true);
      } catch (error) {
        console.error('[App] Workspace initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize workspace');
      } finally {
        console.log('[App] Setting isInitializing to false');
        setIsInitializing(false);
        // Don't reset initializingRef here - keep it true to prevent re-runs
      }
    };
    
    // Initialize workspace when user changes
    if (user && !workspaceInitialized) {
      // Only reset workflow if we don't have a project ID or if the user actually changed
      // This prevents resetting the workflow on every re-render
      const currentProjectId = useWorkflowStore.getState().projectId;
      
      if (!currentProjectId) {
        console.log('[App] No project ID found, resetting workflow');
        resetWorkflow();
      } else {
        console.log('[App] Project ID exists, preserving workflow state:', currentProjectId);
      }
      
      initializeWorkspace();
    }
  }, [user?.id]); // Use user.id instead of user object to prevent re-renders

  // Add keyboard shortcut for performance overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowPerformanceOverlay(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show demo canvas if not authenticated
  if (!user) {
    return <DemoCanvas className="h-screen" />;
  }

  // Show workspace initialization loading
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing workspace...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('[App] Rendering main app with user:', user.id, 'projectId:', useWorkflowStore.getState().projectId);

  return (
    <ReactFlowProvider>
      <AppContent />
      
      {/* Performance Monitor Overlay */}
      <PerformanceOverlay 
        isOpen={showPerformanceOverlay}
        onClose={() => setShowPerformanceOverlay(false)}
      />
    </ReactFlowProvider>
  );
}