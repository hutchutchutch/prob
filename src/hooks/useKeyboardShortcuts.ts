import { useEffect } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const { currentStep, proceedToNextStep } = useWorkflowStore.getState();
        if (currentStep === 'problem_input') {
          proceedToNextStep();
        }
      }
      
      // Cmd/Ctrl + R to refresh (regenerate)
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        // Add regeneration logic here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}