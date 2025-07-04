import { WorkflowStateType } from "../state/annotations";

export type NodeFunction<T = WorkflowStateType> = (
  state: T
) => Promise<Partial<T>>;

export function withErrorHandling<T = WorkflowStateType>(
  nodeName: string,
  nodeFunction: NodeFunction<T>
): NodeFunction<T> {
  return async (state: T): Promise<Partial<T>> => {
    console.log(`--- Node: ${nodeName} ---`);
    const startTime = Date.now();
    
    try {
      const result = await nodeFunction(state);
      
      console.log(`✓ ${nodeName} completed in ${Date.now() - startTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`✗ Error in ${nodeName}:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      
      return {
        errors: [`${nodeName} failed: ${errorMessage}`],
        metadata: {
          ...(state as any).metadata,
          [`${nodeName}_error`]: {
            message: errorMessage,
            timestamp: new Date().toISOString(),
            stack: error instanceof Error ? error.stack : undefined
          }
        }
      } as unknown as Partial<T>;
    }
  };
}

export function createNodeError(
  nodeName: string,
  error: unknown
): { errors: string[]; metadata: Record<string, any> } {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    errors: [`${nodeName} failed: ${errorMessage}`],
    metadata: {
      [`${nodeName}_error`]: {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      }
    }
  };
} 