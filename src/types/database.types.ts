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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      atomic_components: {
        Row: {
          component_level: string
          component_name: string
          composed_of: Json | null
          created_at: string | null
          description: string | null
          id: string
          project_id: string | null
          props: Json | null
        }
        Insert: {
          component_level: string
          component_name: string
          composed_of?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          props?: Json | null
        }
        Update: {
          component_level?: string
          component_name?: string
          composed_of?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          props?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "atomic_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "atomic_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_states: {
        Row: {
          change_description: string | null
          created_at: string | null
          created_by: string | null
          edges: Json
          id: string
          is_current: boolean | null
          locked_items: Json | null
          nodes: Json
          parent_version_id: string | null
          project_id: string | null
          step_completed: boolean | null
          updated_at: string | null
          version: number
          viewport: Json | null
          workflow_step: string
        }
        Insert: {
          change_description?: string | null
          created_at?: string | null
          created_by?: string | null
          edges: Json
          id?: string
          is_current?: boolean | null
          locked_items?: Json | null
          nodes: Json
          parent_version_id?: string | null
          project_id?: string | null
          step_completed?: boolean | null
          updated_at?: string | null
          version?: number
          viewport?: Json | null
          workflow_step?: string
        }
        Update: {
          change_description?: string | null
          created_at?: string | null
          created_by?: string | null
          edges?: Json
          id?: string
          is_current?: boolean | null
          locked_items?: Json | null
          nodes?: Json
          parent_version_id?: string | null
          project_id?: string | null
          step_completed?: boolean | null
          updated_at?: string | null
          version?: number
          viewport?: Json | null
          workflow_step?: string
        }
        Relationships: [
          {
            foreignKeyName: "canvas_states_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_states_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "canvas_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "canvas_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_transitions: {
        Row: {
          created_at: string | null
          from_step: string
          id: string
          is_active: boolean | null
          project_id: string | null
          to_step: string
          transition_config: Json | null
          transition_type: string
        }
        Insert: {
          created_at?: string | null
          from_step: string
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          to_step: string
          transition_config?: Json | null
          transition_type: string
        }
        Update: {
          created_at?: string | null
          from_step?: string
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          to_step?: string
          transition_config?: Json | null
          transition_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "canvas_transitions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "canvas_transitions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      core_problems: {
        Row: {
          created_at: string | null
          id: string
          is_valid: boolean | null
          original_input: string
          project_id: string | null
          validated_problem: string | null
          validation_feedback: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          original_input: string
          project_id?: string | null
          validated_problem?: string | null
          validation_feedback?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          original_input?: string
          project_id?: string | null
          validated_problem?: string | null
          validation_feedback?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "core_problems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "core_problems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flow_diagrams: {
        Row: {
          context_description: string | null
          context_system_name: string
          created_at: string | null
          data_flows: Json
          data_stores: Json
          diagram_levels: Json | null
          external_entities: Json
          id: string
          processes: Json
          project_id: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          context_description?: string | null
          context_system_name: string
          created_at?: string | null
          data_flows: Json
          data_stores: Json
          diagram_levels?: Json | null
          external_entities: Json
          id?: string
          processes: Json
          project_id: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          context_description?: string | null
          context_system_name?: string
          created_at?: string | null
          data_flows?: Json
          data_stores?: Json
          diagram_levels?: Json | null
          external_entities?: Json
          id?: string
          processes?: Json
          project_id?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_flow_diagrams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "data_flow_diagrams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flow_steps: {
        Row: {
          action: string
          created_at: string | null
          data_flow_id: string | null
          data_payload: string | null
          id: string
          source: string
          step_number: number
          target: string
        }
        Insert: {
          action: string
          created_at?: string | null
          data_flow_id?: string | null
          data_payload?: string | null
          id?: string
          source: string
          step_number: number
          target: string
        }
        Update: {
          action?: string
          created_at?: string | null
          data_flow_id?: string | null
          data_payload?: string | null
          id?: string
          source?: string
          step_number?: number
          target?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_flow_steps_data_flow_id_fkey"
            columns: ["data_flow_id"]
            isOneToOne: false
            referencedRelation: "data_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      data_flows: {
        Row: {
          created_at: string | null
          description: string
          id: string
          user_story_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          user_story_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          user_story_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_flows_user_story_id_fkey"
            columns: ["user_story_id"]
            isOneToOne: false
            referencedRelation: "user_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      database_columns: {
        Row: {
          column_name: string
          constraints: Json | null
          created_at: string | null
          data_type: string
          id: string
          is_foreign_key: boolean | null
          is_primary_key: boolean | null
          references_table: string | null
          table_id: string | null
        }
        Insert: {
          column_name: string
          constraints?: Json | null
          created_at?: string | null
          data_type: string
          id?: string
          is_foreign_key?: boolean | null
          is_primary_key?: boolean | null
          references_table?: string | null
          table_id?: string | null
        }
        Update: {
          column_name?: string
          constraints?: Json | null
          created_at?: string | null
          data_type?: string
          id?: string
          is_foreign_key?: boolean | null
          is_primary_key?: boolean | null
          references_table?: string | null
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_columns_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "database_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      database_relationships: {
        Row: {
          created_at: string | null
          from_table: string
          id: string
          project_id: string | null
          relationship_type: string
          to_table: string
        }
        Insert: {
          created_at?: string | null
          from_table: string
          id?: string
          project_id?: string | null
          relationship_type: string
          to_table: string
        }
        Update: {
          created_at?: string | null
          from_table?: string
          id?: string
          project_id?: string | null
          relationship_type?: string
          to_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "database_relationships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "database_relationships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      database_tables: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "database_tables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "database_tables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_templates: {
        Row: {
          animation_sequence: Json
          created_at: string | null
          edges: Json
          id: string
          is_active: boolean | null
          loop_duration_ms: number | null
          nodes: Json
          priority: number | null
          template_name: string
          template_type: string | null
          updated_at: string | null
          viewport: Json | null
        }
        Insert: {
          animation_sequence: Json
          created_at?: string | null
          edges: Json
          id?: string
          is_active?: boolean | null
          loop_duration_ms?: number | null
          nodes: Json
          priority?: number | null
          template_name: string
          template_type?: string | null
          updated_at?: string | null
          viewport?: Json | null
        }
        Update: {
          animation_sequence?: Json
          created_at?: string | null
          edges?: Json
          id?: string
          is_active?: boolean | null
          loop_duration_ms?: number | null
          nodes?: Json
          priority?: number | null
          template_name?: string
          template_type?: string | null
          updated_at?: string | null
          viewport?: Json | null
        }
        Relationships: []
      }
      design_systems: {
        Row: {
          accessibility_guidelines: Json | null
          assets: Json | null
          brand_guidelines: string | null
          brand_name: string
          color_palette: Json
          components: Json
          created_at: string | null
          design_principles: Json
          icon_library: string | null
          icon_style: string | null
          id: string
          motion_principles: Json | null
          project_id: string
          spacing_system: Json
          typography: Json
          ui_patterns: Json | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          accessibility_guidelines?: Json | null
          assets?: Json | null
          brand_guidelines?: string | null
          brand_name: string
          color_palette: Json
          components: Json
          created_at?: string | null
          design_principles: Json
          icon_library?: string | null
          icon_style?: string | null
          id?: string
          motion_principles?: Json | null
          project_id: string
          spacing_system: Json
          typography: Json
          ui_patterns?: Json | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          accessibility_guidelines?: Json | null
          assets?: Json | null
          brand_guidelines?: string | null
          brand_name?: string
          color_palette?: Json
          components?: Json
          created_at?: string | null
          design_principles?: Json
          icon_library?: string | null
          icon_style?: string | null
          id?: string
          motion_principles?: Json | null
          project_id?: string
          spacing_system?: Json
          typography?: Json
          ui_patterns?: Json | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_systems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "design_systems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      design_tokens: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          token_category: string
          token_name: string
          token_value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          token_category: string
          token_name: string
          token_value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          token_category?: string
          token_name?: string
          token_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "design_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_drift_reports: {
        Row: {
          affected_documents: Json
          detected_at: string | null
          drift_details: Json
          drift_severity: string | null
          id: string
          project_id: string | null
          resolution_metadata: Json | null
          resolution_method: string | null
          resolution_status: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          affected_documents: Json
          detected_at?: string | null
          drift_details: Json
          drift_severity?: string | null
          id?: string
          project_id?: string | null
          resolution_metadata?: Json | null
          resolution_method?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          affected_documents?: Json
          detected_at?: string | null
          drift_details?: Json
          drift_severity?: string | null
          id?: string
          project_id?: string | null
          resolution_metadata?: Json | null
          resolution_method?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_drift_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_drift_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_drift_reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_generation_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          dependencies: Json | null
          document_type: string
          error_message: string | null
          id: string
          priority: number | null
          project_id: string | null
          retry_count: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          dependencies?: Json | null
          document_type: string
          error_message?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          dependencies?: Json | null
          document_type?: string
          error_message?: string | null
          id?: string
          priority?: number | null
          project_id?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_generation_queue_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_generation_queue_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          document_type: string
          id: string
          is_public: boolean | null
          name: string
          template_config: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_type: string
          id?: string
          is_public?: boolean | null
          name: string
          template_config: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_type?: string
          id?: string
          is_public?: boolean | null
          name?: string
          template_config?: Json
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_function_registry: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          function_name: string
          function_url: string
          function_version: string
          id: string
          input_schema: Json | null
          is_active: boolean | null
          max_retries: number | null
          output_schema: Json | null
          timeout_ms: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          function_name: string
          function_url: string
          function_version: string
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          max_retries?: number | null
          output_schema?: Json | null
          timeout_ms?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          function_name?: string
          function_url?: string
          function_version?: string
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          max_retries?: number | null
          output_schema?: Json | null
          timeout_ms?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      entity_relationship_diagrams: {
        Row: {
          business_rules: Json | null
          created_at: string | null
          data_classifications: Json | null
          entities: Json
          id: string
          indexes: Json | null
          junction_tables: Json | null
          project_id: string
          relationships: Json
          updated_at: string | null
          version: string | null
        }
        Insert: {
          business_rules?: Json | null
          created_at?: string | null
          data_classifications?: Json | null
          entities: Json
          id?: string
          indexes?: Json | null
          junction_tables?: Json | null
          project_id: string
          relationships: Json
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          business_rules?: Json | null
          created_at?: string | null
          data_classifications?: Json | null
          entities?: Json
          id?: string
          indexes?: Json | null
          junction_tables?: Json | null
          project_id?: string
          relationships?: Json
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_relationship_diagrams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "entity_relationship_diagrams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      export_history: {
        Row: {
          created_at: string | null
          created_by: string | null
          export_config: Json | null
          export_format: string
          export_version: string | null
          file_path: string | null
          file_size_bytes: number | null
          id: string
          included_sections: Json | null
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          export_config?: Json | null
          export_format: string
          export_version?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          included_sections?: Json | null
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          export_config?: Json | null
          export_format?: string
          export_version?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          included_sections?: Json | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "export_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "export_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_group_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          discussion_results: Json | null
          discussion_topics: Json | null
          duration_ms: number | null
          facilitator_config: Json | null
          id: string
          persona_votes: Json
          project_id: string | null
          session_type: string | null
          status: string | null
          total_votes_available: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          discussion_results?: Json | null
          discussion_topics?: Json | null
          duration_ms?: number | null
          facilitator_config?: Json | null
          id?: string
          persona_votes: Json
          project_id?: string | null
          session_type?: string | null
          status?: string | null
          total_votes_available?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          discussion_results?: Json | null
          discussion_topics?: Json | null
          duration_ms?: number | null
          facilitator_config?: Json | null
          id?: string
          persona_votes?: Json
          project_id?: string | null
          session_type?: string | null
          status?: string | null
          total_votes_available?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_group_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "focus_group_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      functional_requirements: {
        Row: {
          created_at: string | null
          data_validations: Json | null
          error_scenarios: Json | null
          features: Json
          id: string
          integrations: Json | null
          project_id: string
          updated_at: string | null
          user_roles: Json | null
          version: string | null
          workflows: Json | null
        }
        Insert: {
          created_at?: string | null
          data_validations?: Json | null
          error_scenarios?: Json | null
          features: Json
          id?: string
          integrations?: Json | null
          project_id: string
          updated_at?: string | null
          user_roles?: Json | null
          version?: string | null
          workflows?: Json | null
        }
        Update: {
          created_at?: string | null
          data_validations?: Json | null
          error_scenarios?: Json | null
          features?: Json
          id?: string
          integrations?: Json | null
          project_id?: string
          updated_at?: string | null
          user_roles?: Json | null
          version?: string | null
          workflows?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "functional_requirements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "functional_requirements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      key_solutions: {
        Row: {
          complexity: string | null
          created_at: string | null
          description: string
          generation_batch: string | null
          id: string
          is_locked: boolean | null
          is_selected: boolean | null
          must_have_features: Json | null
          persona_id: string | null
          position: number
          project_id: string | null
          solution_type: string | null
          title: string
          voting_results: Json | null
        }
        Insert: {
          complexity?: string | null
          created_at?: string | null
          description: string
          generation_batch?: string | null
          id?: string
          is_locked?: boolean | null
          is_selected?: boolean | null
          must_have_features?: Json | null
          persona_id?: string | null
          position: number
          project_id?: string | null
          solution_type?: string | null
          title: string
          voting_results?: Json | null
        }
        Update: {
          complexity?: string | null
          created_at?: string | null
          description?: string
          generation_batch?: string | null
          id?: string
          is_locked?: boolean | null
          is_selected?: boolean | null
          must_have_features?: Json | null
          persona_id?: string | null
          position?: number
          project_id?: string | null
          solution_type?: string | null
          title?: string
          voting_results?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "key_solutions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "key_solutions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "key_solutions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      langgraph_execution_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          input_state: Json | null
          node_name: string
          output_state: Json | null
          project_id: string | null
          retry_count: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_state?: Json | null
          node_name: string
          output_state?: Json | null
          project_id?: string | null
          retry_count?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_state?: Json | null
          node_name?: string
          output_state?: Json | null
          project_id?: string | null
          retry_count?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "langgraph_execution_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "langgraph_execution_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      langgraph_state_events: {
        Row: {
          after_state: Json | null
          before_state: Json | null
          created_at: string | null
          created_by: string | null
          event_data: Json
          event_metadata: Json | null
          event_priority: number | null
          event_type: string
          id: string
          project_id: string | null
          sequence_number: number
          state_diff: Json | null
        }
        Insert: {
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          created_by?: string | null
          event_data: Json
          event_metadata?: Json | null
          event_priority?: number | null
          event_type: string
          id?: string
          project_id?: string | null
          sequence_number: number
          state_diff?: Json | null
        }
        Update: {
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          created_by?: string | null
          event_data?: Json
          event_metadata?: Json | null
          event_priority?: number | null
          event_type?: string
          id?: string
          project_id?: string | null
          sequence_number?: number
          state_diff?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "langgraph_state_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "langgraph_state_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "langgraph_state_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      lock_management: {
        Row: {
          expires_at: string | null
          id: string
          lock_type: string | null
          locked_at: string | null
          locked_by: string | null
          project_id: string | null
          record_id: string
          table_name: string
          unlock_reason: string | null
          unlocked_at: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          lock_type?: string | null
          locked_at?: string | null
          locked_by?: string | null
          project_id?: string | null
          record_id: string
          table_name: string
          unlock_reason?: string | null
          unlocked_at?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          lock_type?: string | null
          locked_at?: string | null
          locked_by?: string | null
          project_id?: string | null
          record_id?: string
          table_name?: string
          unlock_reason?: string | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lock_management_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lock_management_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "lock_management_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pain_points: {
        Row: {
          created_at: string | null
          description: string
          generation_batch: string | null
          id: string
          impact_area: string | null
          is_locked: boolean | null
          persona_id: string | null
          position: number
          severity: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          generation_batch?: string | null
          id?: string
          impact_area?: string | null
          is_locked?: boolean | null
          persona_id?: string | null
          position: number
          severity?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          generation_batch?: string | null
          id?: string
          impact_area?: string | null
          is_locked?: boolean | null
          persona_id?: string | null
          position?: number
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pain_points_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          core_problem_id: string | null
          created_at: string | null
          generation_batch: string | null
          id: string
          industry: string
          is_active: boolean | null
          is_locked: boolean | null
          name: string
          pain_degree: number | null
          position: number
          role: string
        }
        Insert: {
          core_problem_id?: string | null
          created_at?: string | null
          generation_batch?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          is_locked?: boolean | null
          name: string
          pain_degree?: number | null
          position: number
          role: string
        }
        Update: {
          core_problem_id?: string | null
          created_at?: string | null
          generation_batch?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          name?: string
          pain_degree?: number | null
          position?: number
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "personas_core_problem_id_fkey"
            columns: ["core_problem_id"]
            isOneToOne: false
            referencedRelation: "core_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      product_vision: {
        Row: {
          assumptions: Json | null
          constraints: Json | null
          created_at: string | null
          elevator_pitch: string
          id: string
          key_differentiators: Json | null
          market_opportunity: string | null
          milestones: Json | null
          problem_statement: string
          product_name: string
          project_id: string
          risks: Json | null
          stakeholders: Json | null
          success_metrics: Json
          target_audience: Json
          updated_at: string | null
          value_propositions: Json
          version: string | null
          vision_statement: string
        }
        Insert: {
          assumptions?: Json | null
          constraints?: Json | null
          created_at?: string | null
          elevator_pitch: string
          id?: string
          key_differentiators?: Json | null
          market_opportunity?: string | null
          milestones?: Json | null
          problem_statement: string
          product_name: string
          project_id: string
          risks?: Json | null
          stakeholders?: Json | null
          success_metrics: Json
          target_audience: Json
          updated_at?: string | null
          value_propositions: Json
          version?: string | null
          vision_statement: string
        }
        Update: {
          assumptions?: Json | null
          constraints?: Json | null
          created_at?: string | null
          elevator_pitch?: string
          id?: string
          key_differentiators?: Json | null
          market_opportunity?: string | null
          milestones?: Json | null
          problem_statement?: string
          product_name?: string
          project_id?: string
          risks?: Json | null
          stakeholders?: Json | null
          success_metrics?: Json
          target_audience?: Json
          updated_at?: string | null
          value_propositions?: Json
          version?: string | null
          vision_statement?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_vision_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "product_vision_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_tracking: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_complete: boolean | null
          is_current: boolean | null
          persona_circles: Json | null
          project_id: string | null
          step_index: number
          step_name: string
          ui_state: Json | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          is_current?: boolean | null
          persona_circles?: Json | null
          project_id?: string | null
          step_index: number
          step_name: string
          ui_state?: Json | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          is_current?: boolean | null
          persona_circles?: Json | null
          project_id?: string | null
          step_index?: number
          step_name?: string
          ui_state?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "progress_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          content: string | null
          created_at: string | null
          document_type: string
          file_hash: string | null
          file_path: string
          id: string
          is_synced: boolean | null
          last_modified: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          document_type: string
          file_hash?: string | null
          file_path: string
          id?: string
          is_synced?: boolean | null
          last_modified?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          document_type?: string
          file_hash?: string | null
          file_path?: string
          id?: string
          is_synced?: boolean | null
          last_modified?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          current_step: string | null
          id: string
          langgraph_state: Json | null
          name: string
          status: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          langgraph_state?: Json | null
          name: string
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          langgraph_state?: Json | null
          name?: string
          status?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      react_flow_states: {
        Row: {
          active_animations: Json | null
          animation_queue: Json | null
          animation_settings: Json | null
          canvas_locked: boolean | null
          controls_config: Json | null
          created_at: string | null
          edges: Json
          id: string
          interaction_mode: string | null
          minimap_config: Json | null
          nodes: Json
          project_id: string | null
          selection_ids: string[] | null
          updated_at: string | null
          viewport: Json | null
        }
        Insert: {
          active_animations?: Json | null
          animation_queue?: Json | null
          animation_settings?: Json | null
          canvas_locked?: boolean | null
          controls_config?: Json | null
          created_at?: string | null
          edges: Json
          id?: string
          interaction_mode?: string | null
          minimap_config?: Json | null
          nodes: Json
          project_id?: string | null
          selection_ids?: string[] | null
          updated_at?: string | null
          viewport?: Json | null
        }
        Update: {
          active_animations?: Json | null
          animation_queue?: Json | null
          animation_settings?: Json | null
          canvas_locked?: boolean | null
          controls_config?: Json | null
          created_at?: string | null
          edges?: Json
          id?: string
          interaction_mode?: string | null
          minimap_config?: Json | null
          nodes?: Json
          project_id?: string | null
          selection_ids?: string[] | null
          updated_at?: string | null
          viewport?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "react_flow_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "react_flow_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_flows_cache: {
        Row: {
          cache_key: string
          completion_percentage: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          last_activity: string
          problem_statement: string
          progress_segments: Json
          project_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cache_key: string
          completion_percentage?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity: string
          problem_statement: string
          progress_segments: Json
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cache_key?: string
          completion_percentage?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_activity?: string
          problem_statement?: string
          progress_segments?: Json
          project_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_flows_cache_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "recent_flows_cache_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recent_flows_cache_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      share_links: {
        Row: {
          allow_download: boolean | null
          created_at: string | null
          created_by: string | null
          current_access_count: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_accessed_at: string | null
          max_access_count: number | null
          project_id: string | null
          share_token: string
          visible_sections: Json | null
        }
        Insert: {
          allow_download?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_access_count?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed_at?: string | null
          max_access_count?: number | null
          project_id?: string | null
          share_token: string
          visible_sections?: Json | null
        }
        Update: {
          allow_download?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_access_count?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed_at?: string | null
          max_access_count?: number | null
          project_id?: string | null
          share_token?: string
          visible_sections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "share_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "share_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_pain_point_mappings: {
        Row: {
          created_at: string | null
          id: string
          pain_point_id: string | null
          relevance_score: number | null
          solution_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pain_point_id?: string | null
          relevance_score?: number | null
          solution_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pain_point_id?: string | null
          relevance_score?: number | null
          solution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_pain_point_mappings_pain_point_id_fkey"
            columns: ["pain_point_id"]
            isOneToOne: false
            referencedRelation: "pain_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_pain_point_mappings_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "key_solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_batches: {
        Row: {
          batch_type: string
          completed_at: string | null
          completed_operations: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          status: string | null
          total_operations: number
        }
        Insert: {
          batch_type: string
          completed_at?: string | null
          completed_operations?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          total_operations: number
        }
        Update: {
          batch_type?: string
          completed_at?: string | null
          completed_operations?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          total_operations?: number
        }
        Relationships: []
      }
      sync_conflicts: {
        Row: {
          auto_resolvable: boolean | null
          conflict_type: string
          detected_at: string | null
          id: string
          local_data: Json
          merged_data: Json | null
          record_id: string
          remote_data: Json
          resolution: string | null
          resolution_metadata: Json | null
          resolution_strategy: string | null
          resolved_at: string | null
          resolved_by: string | null
          table_name: string
        }
        Insert: {
          auto_resolvable?: boolean | null
          conflict_type: string
          detected_at?: string | null
          id?: string
          local_data: Json
          merged_data?: Json | null
          record_id: string
          remote_data: Json
          resolution?: string | null
          resolution_metadata?: Json | null
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          table_name: string
        }
        Update: {
          auto_resolvable?: boolean | null
          conflict_type?: string
          detected_at?: string | null
          id?: string
          local_data?: Json
          merged_data?: Json | null
          record_id?: string
          remote_data?: Json
          resolution?: string | null
          resolution_metadata?: Json | null
          resolution_strategy?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_conflicts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_queue: {
        Row: {
          attempts: number | null
          batch_id: string | null
          batch_sequence: number | null
          completed_at: string | null
          created_at: string | null
          data: Json
          error_message: string | null
          id: string
          last_attempt_at: string | null
          max_attempts: number | null
          next_retry_at: string | null
          operation: string
          priority: number | null
          record_id: string
          status: string | null
          table_name: string
        }
        Insert: {
          attempts?: number | null
          batch_id?: string | null
          batch_sequence?: number | null
          completed_at?: string | null
          created_at?: string | null
          data: Json
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          operation: string
          priority?: number | null
          record_id: string
          status?: string | null
          table_name: string
        }
        Update: {
          attempts?: number | null
          batch_id?: string | null
          batch_sequence?: number | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number | null
          next_retry_at?: string | null
          operation?: string
          priority?: number | null
          record_id?: string
          status?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_queue_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "sync_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      system_architecture: {
        Row: {
          architecture_pattern: string
          components: Json
          created_at: string | null
          deployment_environments: Json
          external_systems: Json
          id: string
          key_decisions: Json | null
          pattern_justification: string | null
          performance_targets: Json | null
          project_id: string
          scalability_approach: string | null
          security_measures: Json | null
          tech_stack: Json
          updated_at: string | null
          version: string | null
        }
        Insert: {
          architecture_pattern: string
          components: Json
          created_at?: string | null
          deployment_environments: Json
          external_systems: Json
          id?: string
          key_decisions?: Json | null
          pattern_justification?: string | null
          performance_targets?: Json | null
          project_id: string
          scalability_approach?: string | null
          security_measures?: Json | null
          tech_stack: Json
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          architecture_pattern?: string
          components?: Json
          created_at?: string | null
          deployment_environments?: Json
          external_systems?: Json
          id?: string
          key_decisions?: Json | null
          pattern_justification?: string | null
          performance_targets?: Json | null
          project_id?: string
          scalability_approach?: string | null
          security_measures?: Json | null
          tech_stack?: Json
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_architecture_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "system_architecture_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_animation_states: {
        Row: {
          animation_config: Json
          animation_type: string
          created_at: string | null
          duration_ms: number | null
          element_id: string
          element_type: string
          end_state: Json | null
          id: string
          is_active: boolean | null
          project_id: string | null
          start_state: Json | null
        }
        Insert: {
          animation_config: Json
          animation_type: string
          created_at?: string | null
          duration_ms?: number | null
          element_id: string
          element_type: string
          end_state?: Json | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          start_state?: Json | null
        }
        Update: {
          animation_config?: Json
          animation_type?: string
          created_at?: string | null
          duration_ms?: number | null
          element_id?: string
          element_type?: string
          end_state?: Json | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          start_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_animation_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ui_animation_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_components: {
        Row: {
          component_name: string
          component_type: string | null
          created_at: string | null
          data_displayed: string | null
          id: string
          props: Json | null
          screen_id: string | null
        }
        Insert: {
          component_name: string
          component_type?: string | null
          created_at?: string | null
          data_displayed?: string | null
          id?: string
          props?: Json | null
          screen_id?: string | null
        }
        Update: {
          component_name?: string
          component_type?: string | null
          created_at?: string | null
          data_displayed?: string | null
          id?: string
          props?: Json | null
          screen_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_components_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "ui_screens"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_screens: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          project_id: string | null
          route_path: string | null
          screen_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          route_path?: string | null
          screen_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          route_path?: string | null
          screen_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ui_screens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ui_screens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_selection_states: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          selected_items: Json
          selection_metadata: Json | null
          selection_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          selected_items: Json
          selection_metadata?: Json | null
          selection_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          selected_items?: Json
          selection_metadata?: Json | null
          selection_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_selection_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ui_selection_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stories: {
        Row: {
          acceptance_criteria: Json | null
          as_a: string
          complexity_points: number | null
          created_at: string | null
          edited_content: string | null
          i_want: string
          id: string
          is_edited: boolean | null
          original_content: string | null
          position: number
          priority: string | null
          project_id: string | null
          so_that: string
          title: string
        }
        Insert: {
          acceptance_criteria?: Json | null
          as_a: string
          complexity_points?: number | null
          created_at?: string | null
          edited_content?: string | null
          i_want: string
          id?: string
          is_edited?: boolean | null
          original_content?: string | null
          position: number
          priority?: string | null
          project_id?: string | null
          so_that: string
          title: string
        }
        Update: {
          acceptance_criteria?: Json | null
          as_a?: string
          complexity_points?: number | null
          created_at?: string | null
          edited_content?: string | null
          i_want?: string
          id?: string
          is_edited?: boolean | null
          original_content?: string | null
          position?: number
          priority?: string | null
          project_id?: string | null
          so_that?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "goldidocs_status"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "user_stories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workspaces: {
        Row: {
          created_at: string | null
          folder_path: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          folder_path?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          folder_path?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      goldidocs_status: {
        Row: {
          completed_count: number | null
          df_generated_at: string | null
          df_status: string | null
          ds_generated_at: string | null
          ds_status: string | null
          er_generated_at: string | null
          er_status: string | null
          fr_generated_at: string | null
          fr_status: string | null
          project_id: string | null
          project_name: string | null
          pv_generated_at: string | null
          pv_status: string | null
          sa_generated_at: string | null
          sa_status: string | null
          total_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_goldidocs_status: {
        Args: { p_project_id: string }
        Returns: {
          document_type: string
          doc_status: string
          doc_generated_at: string
          doc_version: string
        }[]
      }
      is_project_owner: {
        Args: { project_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const