import { invoke } from '@tauri-apps/api/core'
import type { Workspace, CanvasState } from '@/types/database.types'

export const tauriAPI = {
  async getAppState() {
    return invoke<{ version: string; initialized: boolean }>('get_app_state')
  },

  async createWorkspace(workspace: Omit<Workspace, 'created_at' | 'updated_at'>) {
    return invoke<Workspace>('create_workspace', { workspace })
  },

  async listWorkspaces(userId: string) {
    return invoke<Workspace[]>('list_workspaces', { userId })
  },

  async saveCanvasState(canvasState: CanvasState) {
    return invoke<void>('save_canvas_state', { canvasState })
  },

  async analyzeProblem(problem: string) {
    return invoke<string>('analyze_problem', { problem })
  },

  // LangGraph bridge functions - connect frontend to Rust backend tools
  async callLlm(request: {
    prompt: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }) {
    return invoke<{
      content: string;
      model: string;
      tokens_used?: number;
    }>('call_llm', { request })
  },

  async queryLocalSqlite(query: string, params: string[] = []) {
    const result = await invoke<string>('query_local_sqlite', { query, params })
    return JSON.parse(result)
  },

  async getProblemContext(problemId?: string) {
    const result = await invoke<string>('get_problem_context', { problemId })
    return JSON.parse(result)
  },

  async saveGenerationResult(
    problemId: string,
    resultType: string,
    content: string,
    metadata?: string
  ) {
    return invoke<void>('save_generation_result', {
      problemId,
      resultType,
      content,
      metadata
    })
  },

  async getAvailableTools() {
    return invoke<any[]>('get_available_tools')
  },

  // LangGraph orchestrator functions
  async executeLangGraphWorkflow(
    workflowName: string,
    projectId: string,
    initialData: Record<string, any>
  ) {
    return invoke<any>('execute_langgraph_workflow', {
      workflowName,
      projectId,
      initialData
    })
  },

  async listLangGraphWorkflows() {
    return invoke<string[]>('list_langgraph_workflows')
  },

  async getLangGraphWorkflowDefinition(workflowName: string) {
    return invoke<any>('get_langgraph_workflow_definition', { workflowName })
  },

  // Utility functions for testing and health checks
  async testLangGraphConnection() {
    try {
      const tools = await this.getAvailableTools()
      return tools.length > 0
    } catch (error) {
      console.error('LangGraph connection test failed:', error)
      return false
    }
  },

  async langGraphHealthCheck() {
    try {
      const [llmTest, dbTest, workflowsTest] = await Promise.allSettled([
        this.callLlm({ prompt: 'test' }),
        this.queryLocalSqlite('SELECT 1'),
        this.listLangGraphWorkflows()
      ])

      return {
        llm_available: llmTest.status === 'fulfilled',
        database_available: dbTest.status === 'fulfilled',
        workflows_available: workflowsTest.status === 'fulfilled'
      }
    } catch (error) {
      console.error('Health check failed:', error)
      return {
        llm_available: false,
        database_available: false,
        workflows_available: false
      }
    }
  }
}