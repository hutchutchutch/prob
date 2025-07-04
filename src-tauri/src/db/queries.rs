use super::models::*;
use anyhow::Result;
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::{params, OptionalExtension, Transaction};
use serde_json;


pub struct Queries {
    pool: Pool<SqliteConnectionManager>,
}

impl Queries {
    pub fn new(pool: Pool<SqliteConnectionManager>) -> Self {
        Self { pool }
    }

    // Transaction helper
    pub fn with_transaction<F, R>(&self, f: F) -> Result<R>
    where
        F: FnOnce(&Transaction) -> Result<R>,
    {
        let mut conn = self.pool.get()?;
        let tx = conn.transaction()?;
        let result = f(&tx)?;
        tx.commit()?;
        Ok(result)
    }

    // User queries
    pub fn create_user(&self, user: &User) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO users (id, email) VALUES (?1, ?2)",
            params![user.id, user.email],
        )?;
        Ok(())
    }

    pub fn get_user(&self, id: &str) -> Result<Option<User>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, email, created_at, updated_at FROM users WHERE id = ?1"
        )?;
        
        let user = stmt.query_row(params![id], |row| {
            Ok(User {
                id: row.get(0)?,
                email: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        }).optional()?;
        
        Ok(user)
    }

    // Workspace queries
    pub fn create_workspace(&self, workspace: &Workspace) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO workspaces (id, user_id, name, folder_path, is_active) 
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                workspace.id,
                workspace.user_id,
                workspace.name,
                workspace.folder_path,
                workspace.is_active as i32,
            ],
        )?;
        Ok(())
    }
    
    pub fn get_workspace(&self, id: &str) -> Result<Option<Workspace>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, user_id, name, folder_path, is_active, created_at, updated_at 
             FROM workspaces WHERE id = ?1"
        )?;
        
        let workspace = stmt.query_row(params![id], |row| {
            Ok(Workspace {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                folder_path: row.get(3)?,
                is_active: row.get::<_, i32>(4)? == 1,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(workspace)
    }
    
    pub fn list_workspaces(&self, user_id: &str) -> Result<Vec<Workspace>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, user_id, name, folder_path, is_active, created_at, updated_at 
             FROM workspaces WHERE user_id = ?1 ORDER BY name"
        )?;
        
        let workspaces = stmt.query_map(params![user_id], |row| {
            Ok(Workspace {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                folder_path: row.get(3)?,
                is_active: row.get::<_, i32>(4)? == 1,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        
        Ok(workspaces)
    }

    // Project queries
    pub fn create_project(&self, project: &Project) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO projects (id, workspace_id, name, status, current_step, langgraph_state) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                project.id,
                project.workspace_id,
                project.name,
                project.status,
                project.current_step,
                project.langgraph_state.as_ref().map(|v| v.to_string()),
            ],
        )?;
        Ok(())
    }

    pub fn get_project(&self, id: &str) -> Result<Option<Project>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, workspace_id, name, status, current_step, langgraph_state, created_at, updated_at 
             FROM projects WHERE id = ?1"
        )?;
        
        let project = stmt.query_row(params![id], |row| {
            let langgraph_state_str: Option<String> = row.get(5)?;
            Ok(Project {
                id: row.get(0)?,
                workspace_id: row.get(1)?,
                name: row.get(2)?,
                status: row.get(3)?,
                current_step: row.get(4)?,
                langgraph_state: langgraph_state_str
                    .and_then(|s| serde_json::from_str(&s).ok()),
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        }).optional()?;
        
        Ok(project)
    }

    pub fn update_project_step(&self, project_id: &str, step: &str) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "UPDATE projects SET current_step = ?1 WHERE id = ?2",
            params![step, project_id],
        )?;
        Ok(())
    }

    pub fn rename_project(&self, project_id: &str, new_name: &str) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "UPDATE projects SET name = ?1, updated_at = datetime('now') WHERE id = ?2",
            params![new_name, project_id],
        )?;
        Ok(())
    }

    // Core Problem queries
    pub fn create_core_problem(&self, problem: &CoreProblem) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO core_problems (id, project_id, original_input, validated_problem, is_valid, validation_feedback, version) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                problem.id,
                problem.project_id,
                problem.original_input,
                problem.validated_problem,
                problem.is_valid as i32,
                problem.validation_feedback,
                problem.version,
            ],
        )?;
        Ok(())
    }

    pub fn get_latest_core_problem(&self, project_id: &str) -> Result<Option<CoreProblem>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, project_id, original_input, validated_problem, is_valid, validation_feedback, version, created_at 
             FROM core_problems 
             WHERE project_id = ?1 
             ORDER BY version DESC 
             LIMIT 1"
        )?;
        
        let problem = stmt.query_row(params![project_id], |row| {
            Ok(CoreProblem {
                id: row.get(0)?,
                project_id: row.get(1)?,
                original_input: row.get(2)?,
                validated_problem: row.get(3)?,
                is_valid: row.get::<_, i32>(4)? == 1,
                validation_feedback: row.get(5)?,
                version: row.get(6)?,
                created_at: row.get(7)?,
            })
        }).optional()?;
        
        Ok(problem)
    }

    // Persona queries
    pub fn create_personas(&self, personas: &[Persona]) -> Result<()> {
        self.with_transaction(|tx| {
            let mut stmt = tx.prepare(
                "INSERT INTO personas (id, core_problem_id, name, industry, role, pain_degree, position, is_locked, is_active, generation_batch) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)"
            )?;
            
            for persona in personas {
                stmt.execute(params![
                    persona.id,
                    persona.core_problem_id,
                    persona.name,
                    persona.industry,
                    persona.role,
                    persona.pain_degree,
                    persona.position,
                    persona.is_locked as i32,
                    persona.is_active as i32,
                    persona.generation_batch,
                ])?;
            }
            Ok(())
        })
    }

    pub fn get_personas(&self, core_problem_id: &str) -> Result<Vec<Persona>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, core_problem_id, name, industry, role, pain_degree, position, is_locked, is_active, generation_batch, created_at 
             FROM personas 
             WHERE core_problem_id = ?1 
             ORDER BY position"
        )?;
        
        let personas = stmt.query_map(params![core_problem_id], |row| {
            Ok(Persona {
                id: row.get(0)?,
                core_problem_id: row.get(1)?,
                name: row.get(2)?,
                industry: row.get(3)?,
                role: row.get(4)?,
                pain_degree: row.get(5)?,
                position: row.get(6)?,
                is_locked: row.get::<_, i32>(7)? == 1,
                is_active: row.get::<_, i32>(8)? == 1,
                generation_batch: row.get(9)?,
                created_at: row.get(10)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        
        Ok(personas)
    }

    pub fn toggle_persona_lock(&self, persona_id: &str) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "UPDATE personas SET is_locked = NOT is_locked WHERE id = ?1",
            params![persona_id],
        )?;
        Ok(())
    }

    pub fn set_active_persona(&self, core_problem_id: &str, persona_id: &str) -> Result<()> {
        self.with_transaction(|tx| {
            // Deactivate all personas for this problem
            tx.execute(
                "UPDATE personas SET is_active = 0 WHERE core_problem_id = ?1",
                params![core_problem_id],
            )?;
            
            // Activate the selected persona
            tx.execute(
                "UPDATE personas SET is_active = 1 WHERE id = ?1",
                params![persona_id],
            )?;
            Ok(())
        })
    }

    pub fn regenerate_personas(&self, core_problem_id: &str, new_personas: &[Persona]) -> Result<()> {
        self.with_transaction(|tx| {
            // Delete non-locked personas
            tx.execute(
                "DELETE FROM personas WHERE core_problem_id = ?1 AND is_locked = 0",
                params![core_problem_id],
            )?;
            
            // Insert new personas
            let mut stmt = tx.prepare(
                "INSERT INTO personas (id, core_problem_id, name, industry, role, pain_degree, position, is_locked, is_active, generation_batch) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)"
            )?;
            
            for persona in new_personas {
                stmt.execute(params![
                    persona.id,
                    persona.core_problem_id,
                    persona.name,
                    persona.industry,
                    persona.role,
                    persona.pain_degree,
                    persona.position,
                    persona.is_locked as i32,
                    persona.is_active as i32,
                    persona.generation_batch,
                ])?;
            }
            Ok(())
        })
    }

    // Pain Point queries
    pub fn create_pain_points(&self, pain_points: &[PainPoint]) -> Result<()> {
        self.with_transaction(|tx| {
            let mut stmt = tx.prepare(
                "INSERT INTO pain_points (id, persona_id, description, severity, impact_area, position, is_locked, generation_batch) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)"
            )?;
            
            for pain_point in pain_points {
                stmt.execute(params![
                    pain_point.id,
                    pain_point.persona_id,
                    pain_point.description,
                    pain_point.severity,
                    pain_point.impact_area,
                    pain_point.position,
                    pain_point.is_locked as i32,
                    pain_point.generation_batch,
                ])?;
            }
            Ok(())
        })
    }

    pub fn get_pain_points(&self, persona_id: &str) -> Result<Vec<PainPoint>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, persona_id, description, severity, impact_area, position, is_locked, generation_batch, created_at 
             FROM pain_points 
             WHERE persona_id = ?1 
             ORDER BY position"
        )?;
        
        let pain_points = stmt.query_map(params![persona_id], |row| {
            Ok(PainPoint {
                id: row.get(0)?,
                persona_id: row.get(1)?,
                description: row.get(2)?,
                severity: row.get(3)?,
                impact_area: row.get(4)?,
                position: row.get(5)?,
                is_locked: row.get::<_, i32>(6)? == 1,
                generation_batch: row.get(7)?,
                created_at: row.get(8)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        
        Ok(pain_points)
    }

    // Solution queries
    pub fn create_solutions_with_mappings(
        &self, 
        solutions: &[Solution], 
        mappings: &[SolutionPainPointMapping]
    ) -> Result<()> {
        self.with_transaction(|tx| {
            // Insert solutions
            let mut solution_stmt = tx.prepare(
                "INSERT INTO key_solutions (id, project_id, persona_id, title, description, solution_type, complexity, position, is_locked, is_selected, generation_batch) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)"
            )?;
            
            for solution in solutions {
                solution_stmt.execute(params![
                    solution.id,
                    solution.project_id,
                    solution.persona_id,
                    solution.title,
                    solution.description,
                    solution.solution_type,
                    solution.complexity,
                    solution.position,
                    solution.is_locked as i32,
                    solution.is_selected as i32,
                    solution.generation_batch,
                ])?;
            }
            
            // Insert mappings
            let mut mapping_stmt = tx.prepare(
                "INSERT INTO solution_pain_point_mappings (id, solution_id, pain_point_id, relevance_score) 
                 VALUES (?1, ?2, ?3, ?4)"
            )?;
            
            for mapping in mappings {
                mapping_stmt.execute(params![
                    mapping.id,
                    mapping.solution_id,
                    mapping.pain_point_id,
                    mapping.relevance_score,
                ])?;
            }
            
            Ok(())
        })
    }

    pub fn get_solutions_with_mappings(&self, project_id: &str) -> Result<Vec<(Solution, Vec<SolutionPainPointMapping>)>> {
        let conn = self.pool.get()?;
        
        // Get solutions
        let mut solution_stmt = conn.prepare(
            "SELECT id, project_id, persona_id, title, description, solution_type, complexity, position, is_locked, is_selected, generation_batch, created_at 
             FROM key_solutions 
             WHERE project_id = ?1 
             ORDER BY position"
        )?;
        
        let solutions: Vec<Solution> = solution_stmt.query_map(params![project_id], |row| {
            Ok(Solution {
                id: row.get(0)?,
                project_id: row.get(1)?,
                persona_id: row.get(2)?,
                title: row.get(3)?,
                description: row.get(4)?,
                solution_type: row.get(5)?,
                complexity: row.get(6)?,
                position: row.get(7)?,
                is_locked: row.get::<_, i32>(8)? == 1,
                is_selected: row.get::<_, i32>(9)? == 1,
                generation_batch: row.get(10)?,
                created_at: row.get(11)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        
        // Get mappings for each solution
        let mut mapping_stmt = conn.prepare(
            "SELECT id, solution_id, pain_point_id, relevance_score, created_at 
             FROM solution_pain_point_mappings 
             WHERE solution_id = ?1"
        )?;
        
        let mut result = Vec::new();
        for solution in solutions {
            let mappings: Vec<SolutionPainPointMapping> = mapping_stmt.query_map(
                params![&solution.id], 
                |row| {
                    Ok(SolutionPainPointMapping {
                        id: row.get(0)?,
                        solution_id: row.get(1)?,
                        pain_point_id: row.get(2)?,
                        relevance_score: row.get(3)?,
                        created_at: row.get(4)?,
                    })
                }
            )?.collect::<Result<Vec<_>, _>>()?;
            
            result.push((solution, mappings));
        }
        
        Ok(result)
    }

    pub fn toggle_solution_selection(&self, solution_id: &str) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "UPDATE key_solutions SET is_selected = NOT is_selected WHERE id = ?1",
            params![solution_id],
        )?;
        Ok(())
    }

    // Canvas state queries
    pub fn save_canvas_state(&self, canvas_state: &CanvasState) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT OR REPLACE INTO canvas_states 
             (id, project_id, nodes, edges, viewport) 
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                canvas_state.id,
                canvas_state.project_id,
                canvas_state.nodes.to_string(),
                canvas_state.edges.to_string(),
                canvas_state.viewport.as_ref().map(|v| v.to_string()),
            ],
        )?;
        Ok(())
    }

    pub fn get_latest_canvas_state(&self, project_id: &str) -> Result<Option<CanvasState>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, project_id, nodes, edges, viewport, created_at, updated_at 
             FROM canvas_states 
             WHERE project_id = ?1 
             ORDER BY updated_at DESC 
             LIMIT 1"
        )?;
        
        let canvas_state = stmt.query_row(params![project_id], |row| {
            let nodes_str: String = row.get(2)?;
            let edges_str: String = row.get(3)?;
            let viewport_str: Option<String> = row.get(4)?;
            
            Ok(CanvasState {
                id: row.get(0)?,
                project_id: row.get(1)?,
                nodes: serde_json::from_str(&nodes_str).unwrap_or(serde_json::Value::Null),
                edges: serde_json::from_str(&edges_str).unwrap_or(serde_json::Value::Null),
                viewport: viewport_str.and_then(|s| serde_json::from_str(&s).ok()),
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        }).optional()?;
        
        Ok(canvas_state)
    }

    // Event sourcing queries
    pub fn append_state_event(&self, event: &LangGraphStateEvent) -> Result<()> {
        let conn = self.pool.get()?;
        
        // Get next sequence number
        let sequence_number: i32 = conn.query_row(
            "SELECT COALESCE(MAX(sequence_number), 0) + 1 FROM langgraph_state_events WHERE project_id = ?1",
            params![event.project_id],
            |row| row.get(0),
        )?;
        
        conn.execute(
            "INSERT INTO langgraph_state_events (id, project_id, event_type, event_data, event_metadata, sequence_number, created_by) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![
                event.id,
                event.project_id,
                event.event_type,
                event.event_data.to_string(),
                event.event_metadata.as_ref().map(|v| v.to_string()),
                sequence_number,
                event.created_by,
            ],
        )?;
        Ok(())
    }

    pub fn get_project_events(&self, project_id: &str, after_sequence: Option<i32>) -> Result<Vec<LangGraphStateEvent>> {
        let conn = self.pool.get()?;
        
        if let Some(seq) = after_sequence {
            let mut stmt = conn.prepare(
                "SELECT id, project_id, event_type, event_data, event_metadata, sequence_number, created_at, created_by 
                 FROM langgraph_state_events 
                 WHERE project_id = ?1 AND sequence_number > ?2 
                 ORDER BY sequence_number"
            )?;
            
            let events: Result<Vec<_>, _> = stmt.query_map(params![project_id, seq], |row| {
                let event_data_str: String = row.get(3)?;
                let event_metadata_str: Option<String> = row.get(4)?;
                
                Ok(LangGraphStateEvent {
                    id: row.get(0)?,
                    project_id: row.get(1)?,
                    event_type: row.get(2)?,
                    event_data: serde_json::from_str(&event_data_str).unwrap_or(serde_json::Value::Null),
                    event_metadata: event_metadata_str.and_then(|s| serde_json::from_str(&s).ok()),
                    sequence_number: row.get(5)?,
                    created_at: row.get(6)?,
                    created_by: row.get(7)?,
                })
            })?.collect();
            
            Ok(events?)
        } else {
            let mut stmt = conn.prepare(
                "SELECT id, project_id, event_type, event_data, event_metadata, sequence_number, created_at, created_by 
                 FROM langgraph_state_events 
                 WHERE project_id = ?1 
                 ORDER BY sequence_number"
            )?;
            
            let events: Result<Vec<_>, _> = stmt.query_map(params![project_id], |row| {
                let event_data_str: String = row.get(3)?;
                let event_metadata_str: Option<String> = row.get(4)?;
                
                Ok(LangGraphStateEvent {
                    id: row.get(0)?,
                    project_id: row.get(1)?,
                    event_type: row.get(2)?,
                    event_data: serde_json::from_str(&event_data_str).unwrap_or(serde_json::Value::Null),
                    event_metadata: event_metadata_str.and_then(|s| serde_json::from_str(&s).ok()),
                    sequence_number: row.get(5)?,
                    created_at: row.get(6)?,
                    created_by: row.get(7)?,
                })
            })?.collect();
            
            Ok(events?)
        }
    }

    // Project state reconstruction
    pub fn get_project_state(&self, project_id: &str) -> Result<Option<serde_json::Value>> {
        let events = self.get_project_events(project_id, None)?;
        if events.is_empty() {
            return Ok(None);
        }
        
        // Reconstruct state from events
        let mut state = serde_json::json!({});
        for event in events {
            // Apply event to state based on event type
            match event.event_type.as_str() {
                "problem_validated" => {
                    state["problem"] = event.event_data;
                }
                "personas_generated" => {
                    state["personas"] = event.event_data;
                }
                "persona_selected" => {
                    state["active_persona_id"] = event.event_data;
                }
                "pain_points_generated" => {
                    state["pain_points"] = event.event_data;
                }
                "solutions_generated" => {
                    state["solutions"] = event.event_data;
                }
                "solution_selected" => {
                    if let Some(selected) = state["selected_solutions"].as_array_mut() {
                        selected.push(event.event_data);
                    } else {
                        state["selected_solutions"] = serde_json::json!([event.event_data]);
                    }
                }
                _ => {
                    // Generic state update
                    if let Some(obj) = state.as_object_mut() {
                        if let Some(event_obj) = event.event_data.as_object() {
                            for (key, value) in event_obj {
                                obj.insert(key.clone(), value.clone());
                            }
                        }
                    }
                }
            }
        }
        
        Ok(Some(state))
    }

    // Batch operations
    pub fn delete_project_cascade(&self, project_id: &str) -> Result<()> {
        self.with_transaction(|tx| {
            // Due to CASCADE, most related data will be deleted automatically
            // Just delete the project
            tx.execute(
                "DELETE FROM projects WHERE id = ?1",
                params![project_id],
            )?;
            Ok(())
        })
    }

    // User Story queries
    pub fn create_user_stories(&self, stories: &[UserStory]) -> Result<()> {
        self.with_transaction(|tx| {
            let mut stmt = tx.prepare(
                "INSERT INTO user_stories (id, project_id, title, as_a, i_want, so_that, acceptance_criteria, priority, complexity_points, position, is_edited, original_content, edited_content) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)"
            )?;
            
            for story in stories {
                let criteria_json = serde_json::to_string(&story.acceptance_criteria)?;
                stmt.execute(params![
                    story.id,
                    story.project_id,
                    story.title,
                    story.as_a,
                    story.i_want,
                    story.so_that,
                    criteria_json,
                    story.priority,
                    story.complexity_points,
                    story.position,
                    story.is_edited as i32,
                    story.original_content,
                    story.edited_content,
                ])?;
            }
            Ok(())
        })
    }

    pub fn get_user_stories(&self, project_id: &str) -> Result<Vec<UserStory>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id, project_id, title, as_a, i_want, so_that, acceptance_criteria, priority, complexity_points, position, is_edited, original_content, edited_content, created_at 
             FROM user_stories 
             WHERE project_id = ?1 
             ORDER BY position"
        )?;
        
        let stories = stmt.query_map(params![project_id], |row| {
            let criteria_json: String = row.get(6)?;
            let criteria: Vec<String> = serde_json::from_str(&criteria_json).unwrap_or_default();
            
            Ok(UserStory {
                id: row.get(0)?,
                project_id: row.get(1)?,
                title: row.get(2)?,
                as_a: row.get(3)?,
                i_want: row.get(4)?,
                so_that: row.get(5)?,
                acceptance_criteria: criteria,
                priority: row.get(7)?,
                complexity_points: row.get(8)?,
                position: row.get(9)?,
                is_edited: row.get::<_, i32>(10)? == 1,
                original_content: row.get(11)?,
                edited_content: row.get(12)?,
                created_at: row.get(13)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        
        Ok(stories)
    }

    // Helper function to get locked item IDs
    pub fn get_locked_persona_ids(&self, core_problem_id: &str) -> Result<Vec<String>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id FROM personas WHERE core_problem_id = ?1 AND is_locked = 1"
        )?;
        
        let ids = stmt.query_map(params![core_problem_id], |row| {
            row.get(0)
        })?.collect::<Result<Vec<String>, _>>()?;
        
        Ok(ids)
    }

    pub fn get_locked_solution_ids(&self, project_id: &str) -> Result<Vec<String>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(
            "SELECT id FROM key_solutions WHERE project_id = ?1 AND is_locked = 1"
        )?;
        
        let ids = stmt.query_map(params![project_id], |row| {
            row.get(0)
        })?.collect::<Result<Vec<String>, _>>()?;
        
        Ok(ids)
    }

    // LangGraph tool support functions
    pub fn execute_query(&self, query: &str, params: &[String]) -> Result<Vec<serde_json::Value>> {
        let conn = self.pool.get()?;
        let mut stmt = conn.prepare(query)?;
        
        let column_count = stmt.column_count();
        let column_names: Vec<String> = (0..column_count)
            .map(|i| stmt.column_name(i).unwrap().to_string())
            .collect();
        
        let rows = stmt.query_map(rusqlite::params_from_iter(params), |row| {
            let mut obj = serde_json::Map::new();
            for (i, col_name) in column_names.iter().enumerate() {
                let value: serde_json::Value = match row.get_raw(i).data_type() {
                    rusqlite::types::Type::Null => serde_json::Value::Null,
                    rusqlite::types::Type::Integer => {
                        serde_json::Value::Number(serde_json::Number::from(row.get::<_, i64>(i)?))
                    }
                    rusqlite::types::Type::Real => {
                        serde_json::Value::Number(serde_json::Number::from_f64(row.get::<_, f64>(i)?).unwrap())
                    }
                    rusqlite::types::Type::Text => {
                        serde_json::Value::String(row.get::<_, String>(i)?)
                    }
                    rusqlite::types::Type::Blob => {
                        let bytes: Vec<u8> = row.get(i)?;
                        serde_json::Value::String(base64::encode(bytes))
                    }
                };
                obj.insert(col_name.clone(), value);
            }
            Ok(serde_json::Value::Object(obj))
        })?.collect::<Result<Vec<_>, _>>()?;
        
        Ok(rows)
    }

    pub fn get_problem_with_context(&self, problem_id: Option<String>) -> Result<serde_json::Value> {
        let conn = self.pool.get()?;
        
        if let Some(id) = problem_id {
            // Get specific problem with full context
            let mut stmt = conn.prepare(
                "SELECT p.id, p.name, p.status, p.current_step, 
                        cp.original_input, cp.validated_problem, cp.is_valid,
                        COUNT(DISTINCT pe.id) as persona_count,
                        COUNT(DISTINCT s.id) as solution_count
                 FROM projects p
                 LEFT JOIN core_problems cp ON p.id = cp.project_id 
                 LEFT JOIN personas pe ON cp.id = pe.core_problem_id
                 LEFT JOIN key_solutions s ON p.id = s.project_id
                 WHERE p.id = ?1 
                 GROUP BY p.id"
            )?;
            
            let context = stmt.query_row(params![id], |row| {
                Ok(serde_json::json!({
                    "project_id": row.get::<_, String>(0)?,
                    "project_name": row.get::<_, String>(1)?,
                    "status": row.get::<_, String>(2)?,
                    "current_step": row.get::<_, String>(3)?,
                    "original_input": row.get::<_, Option<String>>(4)?,
                    "validated_problem": row.get::<_, Option<String>>(5)?,
                    "is_valid": row.get::<_, Option<i32>>(6)?,
                    "persona_count": row.get::<_, i32>(7)?,
                    "solution_count": row.get::<_, i32>(8)?,
                }))
            })?;
            
            Ok(context)
        } else {
            // Get all projects summary
            let mut stmt = conn.prepare(
                "SELECT p.id, p.name, p.status, p.current_step,
                        COUNT(DISTINCT pe.id) as persona_count,
                        COUNT(DISTINCT s.id) as solution_count
                 FROM projects p
                 LEFT JOIN core_problems cp ON p.id = cp.project_id
                 LEFT JOIN personas pe ON cp.id = pe.core_problem_id
                 LEFT JOIN key_solutions s ON p.id = s.project_id
                 GROUP BY p.id
                 ORDER BY p.updated_at DESC"
            )?;
            
            let projects = stmt.query_map([], |row| {
                Ok(serde_json::json!({
                    "project_id": row.get::<_, String>(0)?,
                    "project_name": row.get::<_, String>(1)?,
                    "status": row.get::<_, String>(2)?,
                    "current_step": row.get::<_, String>(3)?,
                    "persona_count": row.get::<_, i32>(4)?,
                    "solution_count": row.get::<_, i32>(5)?,
                }))
            })?.collect::<Result<Vec<_>, _>>()?;
            
            Ok(serde_json::json!({
                "projects": projects
            }))
        }
    }

    pub fn save_ai_generation_result(
        &self, 
        project_id: String, 
        result_type: String, 
        content: String, 
        metadata: Option<String>
    ) -> Result<()> {
        let conn = self.pool.get()?;
        conn.execute(
            "INSERT INTO langgraph_state_events (id, project_id, event_type, event_data, event_metadata, sequence_number, created_by) 
             VALUES (?1, ?2, ?3, ?4, ?5, 
                     (SELECT COALESCE(MAX(sequence_number), 0) + 1 FROM langgraph_state_events WHERE project_id = ?2), 
                     'ai_agent')",
            params![
                format!("{}_{}", uuid::Uuid::new_v4(), chrono::Utc::now().timestamp()),
                project_id,
                result_type,
                content,
                metadata,
            ],
        )?;
        Ok(())
    }
}