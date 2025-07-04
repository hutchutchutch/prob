import { WorkflowStateType } from "../state/annotations";
import { withErrorHandling } from "../utils/error-handling";
import { tauriAPI } from "../../../services/tauri/api";

async function saveFinalStateNode(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  // Save the complete workflow state to the database
  await tauriAPI.saveGenerationResult(
    state.projectId,
    'complete_workflow',
    JSON.stringify({
      coreProblem: state.coreProblem,
      personas: state.personas,
      painPoints: state.painPoints,
      solutions: state.solutions,
      keyFeatures: state.keyFeatures,
      mustHaveFeatures: state.mustHaveFeatures,
      userStories: state.userStories,
      finalDocuments: state.finalDocuments
    }),
    JSON.stringify({
      ...state.metadata,
      completed_at: new Date().toISOString(),
      workflow_version: '2.0',
      total_personas: state.personas.length,
      total_solutions: state.solutions.length,
      total_user_stories: state.userStories.length,
      documents_generated: Object.keys(state.finalDocuments).length
    })
  );

  return {
    currentStep: 'completed',
    metadata: {
      ...state.metadata,
      completed_at: new Date().toISOString(),
      workflow_completed: true
    }
  };
}

export const saveFinalState = withErrorHandling(
  "saveFinalState",
  saveFinalStateNode
); 