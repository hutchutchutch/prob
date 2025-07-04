import { invoke } from '@tauri-apps/api/core';

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  tokens_used?: number;
}

export interface WorkflowState {
  id: string;
  project_id: string;
  current_step: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  name: string;
  description: string;
  tool_name: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  next_steps: string[];
  completed: boolean;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  steps: WorkflowStep[];
  initial_step: string;
}

export class LangGraphService {
  // Core LangGraph tools
  static async callLLM(request: LLMRequest): Promise<LLMResponse> {
    try {
      return await invoke('call_llm', { request });
    } catch (error) {
      console.error('Failed to call LLM:', error);
      throw error;
    }
  }

  static async queryLocalSQLite(query: string, params: string[] = []): Promise<any[]> {
    try {
      const result = await invoke('query_local_sqlite', { query, params });
      return JSON.parse(result as string);
    } catch (error) {
      console.error('Failed to query local SQLite:', error);
      throw error;
    }
  }

  static async getProblemContext(problemId?: string): Promise<any> {
    try {
      const result = await invoke('get_problem_context', { problemId });
      return JSON.parse(result as string);
    } catch (error) {
      console.error('Failed to get problem context:', error);
      throw error;
    }
  }

  static async saveGenerationResult(
    problemId: string,
    resultType: string,
    content: string,
    metadata?: string
  ): Promise<void> {
    try {
      await invoke('save_generation_result', {
        problemId,
        resultType,
        content,
        metadata
      });
    } catch (error) {
      console.error('Failed to save generation result:', error);
      throw error;
    }
  }

  static async getAvailableTools(): Promise<any[]> {
    try {
      return await invoke('get_available_tools');
    } catch (error) {
      console.error('Failed to get available tools:', error);
      throw error;
    }
  }

  // LangGraph orchestrator methods
  static async executeWorkflow(
    workflowName: string,
    projectId: string,
    initialData: Record<string, any>
  ): Promise<WorkflowState> {
    try {
      const result = await invoke('execute_langgraph_workflow', {
        workflowName,
        projectId,
        initialData
      });
      return result as WorkflowState;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      throw error;
    }
  }

  static async listWorkflows(): Promise<string[]> {
    try {
      return await invoke('list_langgraph_workflows');
    } catch (error) {
      console.error('Failed to list workflows:', error);
      throw error;
    }
  }

  static async getWorkflowDefinition(workflowName: string): Promise<WorkflowDefinition> {
    try {
      const result = await invoke('get_langgraph_workflow_definition', {
        workflowName
      });
      return result as WorkflowDefinition;
    } catch (error) {
      console.error('Failed to get workflow definition:', error);
      throw error;
    }
  }

  // High-level workflow methods
  static async runProblemToSolutionWorkflow(
    projectId: string,
    problemInput: string
  ): Promise<WorkflowState> {
    const initialData = {
      problem_input: problemInput
    };

    return this.executeWorkflow('problem_to_solution', projectId, initialData);
  }

  static async validateProblem(problemInput: string): Promise<{
    validated_problem: string;
    is_valid: boolean;
    feedback: string;
  }> {
    const request: LLMRequest = {
      prompt: `Please analyze this problem statement and provide a refined, validated version:

${problemInput}

Provide:
1. A clear, refined problem statement
2. Whether the problem is valid and solvable
3. Any recommendations for improvement

Format your response as JSON with keys: validated_problem, is_valid, feedback`,
      model: 'gemini-pro',
      temperature: 0.7,
      max_tokens: 1024
    };

    try {
      const response = await this.callLLM(request);
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to validate problem:', error);
      throw error;
    }
  }

  static async generatePersonas(validatedProblem: string): Promise<Array<{
    name: string;
    demographics: string;
    role: string;
    goals: string[];
    pain_points: string[];
    tech_level: string;
  }>> {
    const request: LLMRequest = {
      prompt: `Based on this problem: ${validatedProblem}

Generate 3-5 detailed user personas who would be affected by this problem. For each persona, provide:
1. Name and basic demographics
2. Role/occupation
3. Goals and motivations
4. Pain points related to this problem
5. Technical proficiency level

Format as JSON array with objects containing: name, demographics, role, goals, pain_points, tech_level`,
      model: 'gemini-pro',
      temperature: 0.8,
      max_tokens: 2048
    };

    try {
      const response = await this.callLLM(request);
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to generate personas:', error);
      throw error;
    }
  }

  static async generateSolutions(
    validatedProblem: string,
    personas: any[]
  ): Promise<Array<{
    name: string;
    description: string;
    target_personas: string[];
    technical_approach: string;
    business_impact: string;
    complexity: number;
  }>> {
    const request: LLMRequest = {
      prompt: `Problem: ${validatedProblem}

Personas: ${JSON.stringify(personas)}

Generate 3-5 key solutions that address this problem for these personas. For each solution:
1. Solution name
2. Description
3. Which personas it serves
4. Technical approach
5. Business impact
6. Implementation complexity (1-10)

Format as JSON array with objects containing: name, description, target_personas, technical_approach, business_impact, complexity`,
      model: 'gemini-pro',
      temperature: 0.8,
      max_tokens: 2048
    };

    try {
      const response = await this.callLLM(request);
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to generate solutions:', error);
      throw error;
    }
  }

  // Utility methods
  static async testConnection(): Promise<boolean> {
    try {
      const tools = await this.getAvailableTools();
      return tools.length > 0;
    } catch (error) {
      console.error('LangGraph connection test failed:', error);
      return false;
    }
  }

  static async healthCheck(): Promise<{
    llm_available: boolean;
    database_available: boolean;
    workflows_available: boolean;
  }> {
    try {
      const [llmTest, dbTest, workflowsTest] = await Promise.allSettled([
        this.callLLM({ prompt: 'test', model: 'gemini-pro' }),
        this.queryLocalSQLite('SELECT 1'),
        this.listWorkflows()
      ]);

      return {
        llm_available: llmTest.status === 'fulfilled',
        database_available: dbTest.status === 'fulfilled',
        workflows_available: workflowsTest.status === 'fulfilled'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        llm_available: false,
        database_available: false,
        workflows_available: false
      };
    }
  }
} 