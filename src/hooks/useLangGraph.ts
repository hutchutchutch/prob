import { useState, useCallback } from 'react';
import { LangGraphOrchestrator, AppState, workflowUtils } from '../services/langgraph/orchestrator';
import { LangGraphService } from '../services/tauri/langgraph';
import { tauriAPI } from '../services/tauri/api';

interface UseLangGraphOptions {
  onStepComplete?: (step: string, state: AppState) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: { currentStep: string; progressPercentage: number }) => void;
}

export function useLangGraph(options: UseLangGraphOptions = {}) {
  const [orchestrator] = useState(() => new LangGraphOrchestrator());
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ currentStep: '', progressPercentage: 0 });

  // Execute the complete problem-to-solution workflow
  const runProblemToSolutionWorkflow = useCallback(async (
    problemStatement: string,
    projectId?: string
  ): Promise<AppState | null> => {
    if (!problemStatement.trim()) {
      const errorMsg = 'Problem statement is required';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    }

    setIsRunning(true);
    setError(null);
    setProgress({ currentStep: 'starting', progressPercentage: 0 });

    try {
      const result = await orchestrator.executeProblemToSolutionWorkflow(
        problemStatement,
        projectId,
        (step, state) => {
          setCurrentState(state);
          const progressInfo = workflowUtils.getWorkflowProgress(state);
          setProgress(progressInfo);
          
          options.onStepComplete?.(step, state);
          options.onProgress?.(progressInfo);
        }
      );

      setCurrentState(result);
      setProgress({ currentStep: 'complete', progressPercentage: 100 });
      return result;
    } catch (err) {
      const errorMsg = `Workflow failed: ${err}`;
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [orchestrator, options]);

  // Execute a single step
  const runStep = useCallback(async (
    stepName: string,
    state?: AppState
  ): Promise<AppState | null> => {
    if (!state && !currentState) {
      const errorMsg = 'No state available for step execution';
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    }

    setIsRunning(true);
    setError(null);

    try {
      const result = await orchestrator.executeStep(stepName, state || currentState!);
      setCurrentState(result);
      
      const progressInfo = workflowUtils.getWorkflowProgress(result);
      setProgress(progressInfo);
      
      options.onStepComplete?.(stepName, result);
      options.onProgress?.(progressInfo);
      
      return result;
    } catch (err) {
      const errorMsg = `Step ${stepName} failed: ${err}`;
      setError(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, [orchestrator, currentState, options]);

  // Validate a problem statement
  const validateProblem = useCallback(async (problemInput: string) => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await LangGraphService.validateProblem(problemInput);
      return result;
    } catch (err) {
      const errorMsg = `Problem validation failed: ${err}`;
      setError(errorMsg);
      options.onError?.(errorMsg);
      throw err;
    } finally {
      setIsRunning(false);
    }
  }, [options]);

  // Generate personas
  const generatePersonas = useCallback(async (validatedProblem: string) => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await LangGraphService.generatePersonas(validatedProblem);
      return result;
    } catch (err) {
      const errorMsg = `Persona generation failed: ${err}`;
      setError(errorMsg);
      options.onError?.(errorMsg);
      throw err;
    } finally {
      setIsRunning(false);
    }
  }, [options]);

  // Generate solutions
  const generateSolutions = useCallback(async (
    validatedProblem: string,
    personas: any[]
  ) => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await LangGraphService.generateSolutions(validatedProblem, personas);
      return result;
    } catch (err) {
      const errorMsg = `Solution generation failed: ${err}`;
      setError(errorMsg);
      options.onError?.(errorMsg);
      throw err;
    } finally {
      setIsRunning(false);
    }
  }, [options]);

  // Test connection to backend
  const testConnection = useCallback(async () => {
    try {
      const isConnected = await tauriAPI.testLangGraphConnection();
      return isConnected;
    } catch (err) {
      setError(`Connection test failed: ${err}`);
      return false;
    }
  }, []);

  // Health check
  const healthCheck = useCallback(async () => {
    try {
      const health = await tauriAPI.langGraphHealthCheck();
      return health;
    } catch (err) {
      setError(`Health check failed: ${err}`);
      return {
        llm_available: false,
        database_available: false,
        workflows_available: false
      };
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setCurrentState(null);
    setError(null);
    setProgress({ currentStep: '', progressPercentage: 0 });
  }, []);

  // Create initial state
  const createInitialState = useCallback((problemStatement: string, projectId?: string) => {
    const state = workflowUtils.createInitialState(problemStatement, projectId);
    setCurrentState(state);
    return state;
  }, []);

  // Utility functions
  const isWorkflowComplete = useCallback(() => {
    return currentState ? workflowUtils.isWorkflowComplete(currentState) : false;
  }, [currentState]);

  const hasErrors = useCallback(() => {
    return currentState ? workflowUtils.hasErrors(currentState) : false;
  }, [currentState]);

  const getWorkflowProgress = useCallback(() => {
    return currentState ? workflowUtils.getWorkflowProgress(currentState) : {
      currentStep: '',
      completedSteps: [],
      totalSteps: 0,
      progressPercentage: 0
    };
  }, [currentState]);

  return {
    // State
    isRunning,
    currentState,
    error,
    progress,
    
    // Actions
    runProblemToSolutionWorkflow,
    runStep,
    validateProblem,
    generatePersonas,
    generateSolutions,
    
    // Utilities
    testConnection,
    healthCheck,
    reset,
    createInitialState,
    
    // Computed values
    isWorkflowComplete: isWorkflowComplete(),
    hasErrors: hasErrors(),
    workflowProgress: getWorkflowProgress(),
  };
}

// Export types for convenience
export type { AppState, UseLangGraphOptions }; 