// Types that match both SQLite and Supabase schemas
export interface User {
    id: string
    email: string
    created_at: string
    updated_at: string
  }
  
  export interface Workspace {
    id: string
    user_id: string
    name: string
    folder_path: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }
  
  export interface Project {
    id: string
    workspace_id: string
    name: string
    status: string
    current_step: string
    langgraph_state: Record<string, any> | null
    created_at: string
    updated_at: string
  }
  
  export interface CanvasState {
    id: string
    project_id: string
    nodes: any[]
    edges: any[]
    viewport: any | null
    created_at: string
    updated_at: string
  }

  export interface Persona {
    id: string
    project_id: string
    name: string
    description: string
    demographics: Record<string, any> | null
    behaviors: Record<string, any> | null
    goals: string[]
    frustrations: string[]
    is_selected: boolean
    created_at: string
    updated_at: string
  }

  export interface PainPoint {
    id: string
    project_id: string
    persona_id: string | null
    title: string
    description: string
    severity: 'low' | 'medium' | 'high'
    frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
    category: string | null
    is_selected: boolean
    created_at: string
    updated_at: string
  }

  export interface Solution {
    id: string
    project_id: string
    title: string
    description: string
    category: string | null
    feasibility_score: number | null
    business_value: number | null
    implementation_complexity: 'low' | 'medium' | 'high' | null
    estimated_effort: string | null
    is_locked: boolean
    generation_batch: string | null
    created_at: string
    updated_at: string
  }

  export interface SolutionPainPointMapping {
    id: string
    solution_id: string
    pain_point_id: string
    relevance_score: number
    created_at: string
    updated_at: string
  }