import { WorkflowState } from "../schemas/state.schema";
import { DEFAULT_PROMPTS } from "../prompts/defaults";

export function createInitialState(
  problemStatement: string,
  projectId?: string,
  customPrompts?: Partial<typeof DEFAULT_PROMPTS>,
  lockedItems?: Partial<WorkflowState['lockedItems']>
): WorkflowState {
  return {
    projectId: projectId || `project_${Date.now()}`,
    coreProblem: {
      id: `problem_${Date.now()}`,
      originalInput: problemStatement,
      validatedStatement: '',
      isValid: false
    },
    personas: [],
    painPoints: [],
    solutions: [],
    keyFeatures: [],
    mustHaveFeatures: [],
    userStories: [],
    finalDocuments: {},
    prompts: { ...DEFAULT_PROMPTS, ...customPrompts },
    lockedItems: {
      personas: [],
      painPoints: [],
      solutions: [],
      ...lockedItems
    },
    currentStep: 'initialize' as string,
    errors: [],
    metadata: {
      created_at: new Date().toISOString()
    }
  };
} 