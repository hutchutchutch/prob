import { WorkflowStateType } from "../state/annotations";

export function shouldContinueAfterValidation(
  state: WorkflowStateType
): "continue" | "end" {
  if (!state.coreProblem.isValid) {
    console.log("Problem validation failed, ending workflow");
    return "end";
  }
  
  return "continue";
}

export function shouldRetryOnError(
  state: WorkflowStateType
): "retry" | "continue" | "end" {
  const recentErrors = state.errors.slice(-3);
  const hasRepeatingErrors = recentErrors.length === 3 && 
    new Set(recentErrors).size === 1;
  
  if (hasRepeatingErrors) {
    console.log("Repeated errors detected, ending workflow");
    return "end";
  }
  
  if (state.errors.length > 0 && state.errors.length < 3) {
    return "retry";
  }
  
  return "continue";
}

export function shouldGenerateDocuments(
  state: WorkflowStateType
): "generate" | "skip" {
  // Only generate documents if we have the necessary components
  const hasRequiredData = 
    state.personas.length > 0 &&
    state.solutions.length > 0 &&
    state.userStories.length > 0;
    
  return hasRequiredData ? "generate" : "skip";
} 