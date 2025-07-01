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
}