import { WorkflowStateType } from "../state/annotations";
import { withErrorHandling } from "../utils/error-handling";
import { llmClient } from "../utils/llm-client";
import { ProblemValidationResponseSchema } from "../schemas/api.schema";

async function validateProblemNode(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  const { originalInput } = state.coreProblem;
  
  const prompt = `
    Analyze this problem statement and provide validation feedback.
    
    Problem Statement: "${originalInput}"
    
    Evaluate if this is a clear, actionable problem statement that could guide 
    product development. Provide constructive feedback and a refined version.
    
    Respond with JSON matching this structure:
    {
      "isValid": boolean,
      "feedback": "constructive feedback string",
      "validatedProblem": "refined, actionable problem statement"
    }
  `;
  
  const analysis = await llmClient.callWithSchema(
    prompt,
    ProblemValidationResponseSchema
  );
  
  return {
    coreProblem: {
      ...state.coreProblem,
      isValid: analysis.isValid,
      feedback: analysis.feedback,
      validatedStatement: analysis.validatedProblem
    }
  };
}

export const validateProblem = withErrorHandling(
  "validateProblem",
  validateProblemNode
); 