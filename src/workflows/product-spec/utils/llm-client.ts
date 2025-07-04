import { z } from 'zod';
import { tauriAPI } from '../../../services/tauri/api';

export class LLMClient {
  async callWithSchema<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options?: {
      temperature?: number;
      maxRetries?: number;
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await tauriAPI.callLlm({ 
          prompt,
          temperature: options?.temperature 
        });
        
        // Try to parse JSON response
        const parsed = JSON.parse(response.content);
        
        // Validate with Zod schema
        const validated = schema.parse(parsed);
        
        return validated;
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof z.ZodError) {
          console.warn(`Attempt ${attempt}: Schema validation failed`, error.errors);
          // Add schema information to prompt for retry
          if (attempt < maxRetries) {
            prompt = `${prompt}\n\nIMPORTANT: Response must match this exact structure:\n${JSON.stringify(schema._def, null, 2)}`;
          }
        } else {
          console.warn(`Attempt ${attempt}: LLM call failed`, error);
        }
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
  }
}

export const llmClient = new LLMClient(); 