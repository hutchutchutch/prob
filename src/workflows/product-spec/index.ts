import { MemorySaver } from "@langchain/langgraph";
import { createProductSpecWorkflow } from "./graph";
import { createInitialState } from "./state/initial";
import { WorkflowStateType } from "./state/annotations";
import { WorkflowStateSchema } from "./schemas/state.schema";
import { DEFAULT_PROMPTS } from "./prompts/defaults";

export interface ProductSpecOptions {
  projectId?: string;
  customPrompts?: Partial<typeof DEFAULT_PROMPTS>;
  lockedItems?: Partial<WorkflowStateType['lockedItems']>;
  onNodeStart?: (node: string) => void;
  onNodeComplete?: (node: string, state: WorkflowStateType) => void;
  onError?: (error: Error, node: string) => void;
  debug?: boolean;
}

export async function runProductSpecWorkflow(
  problemStatement: string,
  options?: ProductSpecOptions
): Promise<WorkflowStateType> {
  // Create checkpointer for persistence
  const checkpointer = new MemorySaver();
  
  // Create the workflow
  const workflow = createProductSpecWorkflow({
    checkpointer
  });
  
  // Create initial state with validation
  const initialState = createInitialState(
    problemStatement,
    options?.projectId,
    options?.customPrompts,
    options?.lockedItems
  );
  
  // Validate initial state
  const validatedState = WorkflowStateSchema.parse(initialState);
  
  // Configuration for the run
  const config = {
    configurable: {
      thread_id: validatedState.projectId,
    }
  };
  
  // Run the workflow with streaming
  const stream = await workflow.stream(validatedState, config);
  
  let finalState = validatedState;
  for await (const chunk of stream) {
    // Each chunk contains updates from a node
    const [nodeName, nodeOutput] = Object.entries(chunk)[0];
    console.log(`✓ Completed: ${nodeName}`);
    
    // Call callbacks if provided
    if (options?.onNodeStart) {
      options.onNodeStart(nodeName);
    }
    
    // Merge the updates into our state
    finalState = { ...finalState, ...nodeOutput };
    
    if (options?.onNodeComplete) {
      options.onNodeComplete(nodeName, finalState);
    }
  }
  
  return finalState;
}

// Export for streaming usage
export async function* streamProductSpecWorkflow(
  problemStatement: string,
  options?: ProductSpecOptions
): AsyncGenerator<{ node: string; state: WorkflowStateType }> {
  const checkpointer = new MemorySaver();
  const workflow = createProductSpecWorkflow({ checkpointer });
  
  const initialState = createInitialState(
    problemStatement,
    options?.projectId,
    options?.customPrompts,
    options?.lockedItems
  );
  
  const config = {
    configurable: { thread_id: initialState.projectId }
  };
  
  const stream = await workflow.stream(initialState, config);
  
  let currentState = initialState;
  for await (const chunk of stream) {
    const [nodeName, nodeOutput] = Object.entries(chunk)[0];
    currentState = { ...currentState, ...nodeOutput };
    
    yield {
      node: nodeName,
      state: currentState
    };
  }
}

// Re-export types and utilities
export * from "./schemas";
export { DEFAULT_PROMPTS } from "./prompts/defaults";
export type { WorkflowStateType } from "./state/annotations"; 