use crate::db::{models::*, queries::Queries, DbPool};
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;
use anyhow::Result;
use chrono::Utc;

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub workspace_id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct DuplicateProjectRequest {
    pub project_id: String,
    pub new_name: String,
}

#[derive(Debug, Deserialize)]  
pub struct ImportProjectRequest {
    pub workspace_id: String,
    pub project_data: String,
    pub format: String, // "json" or "markdown"
}

#[derive(Debug, Serialize)]
pub struct ExportProjectResponse {
    pub format: String,
    pub data: String,
    pub filename: String,
}

#[derive(Debug, Serialize)]
pub struct ProjectExportData {
    pub project: Project,
    pub core_problem: Option<CoreProblem>,
    pub personas: Vec<Persona>,
    pub pain_points: Vec<PainPoint>,
    pub solutions: Vec<Solution>,
    pub solution_mappings: Vec<SolutionPainPointMapping>,
    pub user_stories: Vec<UserStory>,
    pub canvas_state: Option<CanvasState>,
}

#[derive(Debug, Deserialize)]
pub struct ProjectImportData {
    pub project: Project,
    pub core_problem: Option<CoreProblem>,
    pub personas: Vec<Persona>,
    pub pain_points: Vec<PainPoint>,
    pub solutions: Vec<Solution>,
    pub solution_mappings: Vec<SolutionPainPointMapping>,
    pub user_stories: Vec<UserStory>,
    pub canvas_state: Option<CanvasState>,
}

/// Create new project with default state
#[tauri::command]
pub async fn create_new_project(
    db: State<'_, DbPool>,
    request: CreateProjectRequest,
) -> Result<Project, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    let project = Project {
        id: Uuid::new_v4().to_string(),
        workspace_id: request.workspace_id,
        name: request.name,
        status: "problem_input".to_string(),
        current_step: "problem_input".to_string(),
        langgraph_state: None,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    queries.create_project(&project)
        .map_err(|e| e.to_string())?;
    
    Ok(project)
}

/// Delete project and all related data
#[tauri::command]
pub async fn delete_project_with_data(
    db: State<'_, DbPool>,
    project_id: String,
) -> Result<bool, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    queries.delete_project_cascade(&project_id)
        .map_err(|e| e.to_string())?;
    
    Ok(true)
}

/// Rename an existing project
#[tauri::command]
pub async fn rename_project(
    db: State<'_, DbPool>,
    project_id: String,
    new_name: String,
) -> Result<Project, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    // Update the project name
    if let Err(e) = queries.rename_project(&project_id, &new_name) {
        return Err(e.to_string());
    }
    
    // Return the updated project
    match queries.get_project(&project_id) {
        Ok(Some(project)) => Ok(project),
        Ok(None) => Err("Project not found after rename".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

/// Duplicate project with all related data
#[tauri::command]
pub async fn duplicate_project(
    db: State<'_, DbPool>,
    request: DuplicateProjectRequest,
) -> Result<Project, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    // Gather original project data
    let original_project = match queries.get_project(&request.project_id) {
        Ok(Some(project)) => project,
        Ok(None) => return Err("Original project not found".to_string()),
        Err(e) => return Err(e.to_string()),
    };
    
    let export_data = gather_project_data(&request.project_id, &queries)
        .await
        .map_err(|e| e.to_string())?;
    
    // Create new project with new name and new IDs
    let new_project = Project {
        id: Uuid::new_v4().to_string(),
        workspace_id: original_project.workspace_id,
        name: request.new_name,
        status: original_project.status,
        current_step: original_project.current_step,
        langgraph_state: original_project.langgraph_state,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    // Use transaction to duplicate all data
    let result = queries.with_transaction(|tx| {
        // Create new project
        tx.execute(
            "INSERT INTO projects (id, workspace_id, name, status, current_step, langgraph_state) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![
                new_project.id,
                new_project.workspace_id,
                new_project.name,
                new_project.status,
                new_project.current_step,
                new_project.langgraph_state.as_ref().map(|v| v.to_string()),
            ],
        )?;
        
        // Copy core problem if exists
        if let Some(core_problem) = &export_data.core_problem {
            let new_core_problem = CoreProblem {
                id: Uuid::new_v4().to_string(),
                project_id: new_project.id.clone(),
                original_input: core_problem.original_input.clone(),
                validated_problem: core_problem.validated_problem.clone(),
                is_valid: core_problem.is_valid,
                validation_feedback: core_problem.validation_feedback.clone(),
                version: core_problem.version,
                created_at: Utc::now(),
            };
            
            tx.execute(
                "INSERT INTO core_problems (id, project_id, original_input, validated_problem, is_valid, validation_feedback, version) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                rusqlite::params![
                    new_core_problem.id,
                    new_core_problem.project_id,
                    new_core_problem.original_input,
                    new_core_problem.validated_problem,
                    new_core_problem.is_valid as i32,
                    new_core_problem.validation_feedback,
                    new_core_problem.version,
                ],
            )?;
            
            // Copy personas with new IDs
            let mut persona_id_map = std::collections::HashMap::new();
            for persona in &export_data.personas {
                let new_persona_id = Uuid::new_v4().to_string();
                persona_id_map.insert(persona.id.clone(), new_persona_id.clone());
                
                tx.execute(
                    "INSERT INTO personas (id, core_problem_id, name, industry, role, pain_degree, position, is_locked, is_active, generation_batch) 
                     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
                    rusqlite::params![
                        new_persona_id,
                        new_core_problem.id,
                        persona.name,
                        persona.industry,
                        persona.role,
                        persona.pain_degree,
                        persona.position,
                        persona.is_locked as i32,
                        persona.is_active as i32,
                        persona.generation_batch,
                    ],
                )?;
            }
            
            // Copy pain points with new persona IDs
            let mut pain_point_id_map = std::collections::HashMap::new();
            for pain_point in &export_data.pain_points {
                if let Some(new_persona_id) = persona_id_map.get(&pain_point.persona_id) {
                    let new_pain_point_id = Uuid::new_v4().to_string();
                    pain_point_id_map.insert(pain_point.id.clone(), new_pain_point_id.clone());
                    
                    tx.execute(
                        "INSERT INTO pain_points (id, persona_id, description, severity, impact_area, position, is_locked, generation_batch) 
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                        rusqlite::params![
                            new_pain_point_id,
                            new_persona_id,
                            pain_point.description,
                            pain_point.severity,
                            pain_point.impact_area,
                            pain_point.position,
                            pain_point.is_locked as i32,
                            pain_point.generation_batch,
                        ],
                    )?;
                }
            }
            
            // Copy solutions with new IDs
            let mut solution_id_map = std::collections::HashMap::new();
            for solution in &export_data.solutions {
                if let Some(new_persona_id) = persona_id_map.get(&solution.persona_id) {
                    let new_solution_id = Uuid::new_v4().to_string();
                    solution_id_map.insert(solution.id.clone(), new_solution_id.clone());
                    
                    tx.execute(
                        "INSERT INTO key_solutions (id, project_id, persona_id, title, description, solution_type, complexity, position, is_locked, is_selected, generation_batch) 
                         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
                        rusqlite::params![
                            new_solution_id,
                            new_project.id,
                            new_persona_id,
                            solution.title,
                            solution.description,
                            solution.solution_type,
                            solution.complexity,
                            solution.position,
                            solution.is_locked as i32,
                            solution.is_selected as i32,
                            solution.generation_batch,
                        ],
                    )?;
                }
            }
            
            // Copy solution-pain point mappings
            for mapping in &export_data.solution_mappings {
                if let (Some(new_solution_id), Some(new_pain_point_id)) = (
                    solution_id_map.get(&mapping.solution_id),
                    pain_point_id_map.get(&mapping.pain_point_id)
                ) {
                    tx.execute(
                        "INSERT INTO solution_pain_point_mappings (id, solution_id, pain_point_id, relevance_score) 
                         VALUES (?1, ?2, ?3, ?4)",
                        rusqlite::params![
                            Uuid::new_v4().to_string(),
                            new_solution_id,
                            new_pain_point_id,
                            mapping.relevance_score,
                        ],
                    )?;
                }
            }
        }
        
        // Copy user stories
        for story in &export_data.user_stories {
            let criteria_json = serde_json::to_string(&story.acceptance_criteria)
                .map_err(|e| anyhow::anyhow!("Failed to serialize acceptance criteria: {}", e))?;
            
            tx.execute(
                "INSERT INTO user_stories (id, project_id, title, as_a, i_want, so_that, acceptance_criteria, priority, complexity_points, position, is_edited, original_content, edited_content) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
                rusqlite::params![
                    Uuid::new_v4().to_string(),
                    new_project.id,
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
                ],
            )?;
        }
        
        // Copy canvas state
        if let Some(canvas_state) = &export_data.canvas_state {
            tx.execute(
                "INSERT INTO canvas_states (id, project_id, nodes, edges, viewport) 
                 VALUES (?1, ?2, ?3, ?4, ?5)",
                rusqlite::params![
                    Uuid::new_v4().to_string(),
                    new_project.id,
                    canvas_state.nodes.to_string(),
                    canvas_state.edges.to_string(),
                    canvas_state.viewport.as_ref().map(|v| v.to_string()),
                ],
            )?;
        }
        
        Ok(())
    });
    
    match result {
        Ok(_) => Ok(new_project),
        Err(e) => Err(e.to_string()),
    }
}

/// Import project from external data
#[tauri::command]
pub async fn import_project(
    db: State<'_, DbPool>,
    request: ImportProjectRequest,
) -> Result<Project, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    let import_data = validate_import_data(&request.project_data)
        .map_err(|e| e.to_string())?;
    
    let mut project = import_data.project;
    project.id = Uuid::new_v4().to_string();
    project.workspace_id = request.workspace_id;
    project.created_at = Utc::now();
    project.updated_at = Utc::now();
    
    // Import all data in transaction
    let result = queries.with_transaction(|tx| {
        // Insert project
        tx.execute(
            "INSERT INTO projects (id, workspace_id, name, status, current_step, langgraph_state) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            rusqlite::params![
                project.id,
                project.workspace_id,
                project.name,
                project.status,
                project.current_step,
                project.langgraph_state.as_ref().map(|v| v.to_string()),
            ],
        )?;
        
        // Import core problem if exists
        if let Some(mut core_problem) = import_data.core_problem {
            core_problem.id = Uuid::new_v4().to_string();
            core_problem.project_id = project.id.clone();
            core_problem.created_at = Utc::now();
            
            tx.execute(
                "INSERT INTO core_problems (id, project_id, original_input, validated_problem, is_valid, validation_feedback, version) 
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
                rusqlite::params![
                    core_problem.id,
                    core_problem.project_id,
                    core_problem.original_input,
                    core_problem.validated_problem,
                    core_problem.is_valid as i32,
                    core_problem.validation_feedback,
                    core_problem.version,
                ],
            )?;
        }
        
        Ok(())
    });
    
    match result {
        Ok(_) => Ok(project),
        Err(e) => Err(e.to_string()),
    }
}

/// Export project to structured data
#[tauri::command]
pub async fn export_project(
    db: State<'_, DbPool>,
    project_id: String,
    format: String,
) -> Result<ExportProjectResponse, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    let export_data = gather_project_data(&project_id, &queries)
        .await
        .map_err(|e| e.to_string())?;
    
    let data = serde_json::to_string_pretty(&export_data)
        .map_err(|e| format!("Failed to serialize export data: {}", e))?;
    
    let filename = format!("{}_export_{}.json", 
        export_data.project.name.replace(' ', "_").to_lowercase(),
        chrono::Utc::now().format("%Y%m%d_%H%M%S")
    );
    
    Ok(ExportProjectResponse {
        format,
        data,
        filename,
    })
}

/// Helper function to gather all project data
async fn gather_project_data(project_id: &str, queries: &Queries) -> Result<ProjectExportData> {
    let project = queries.get_project(project_id)?
        .ok_or_else(|| anyhow::anyhow!("Project not found"))?;
    
    let core_problem = queries.get_latest_core_problem(project_id)?;
    
    let personas = if let Some(ref problem) = core_problem {
        queries.get_personas(&problem.id)?
    } else {
        Vec::new()
    };
    
    let mut pain_points = Vec::new();
    for persona in &personas {
        let mut points = queries.get_pain_points(&persona.id)?;
        pain_points.append(&mut points);
    }
    
    let solutions_with_mappings = queries.get_solutions_with_mappings(project_id)?;
    let solutions: Vec<Solution> = solutions_with_mappings.iter()
        .map(|(solution, _)| solution.clone())
        .collect();
    let solution_mappings: Vec<SolutionPainPointMapping> = solutions_with_mappings.iter()
        .flat_map(|(_, mappings)| mappings.clone())
        .collect();
    
    let user_stories = queries.get_user_stories(project_id)?;
    let canvas_state = queries.get_latest_canvas_state(project_id)?;
    
    Ok(ProjectExportData {
        project,
        core_problem,
        personas,
        pain_points,
        solutions,
        solution_mappings,
        user_stories,
        canvas_state,
    })
}

/// Helper function to validate import data
fn validate_import_data(data: &str) -> Result<ProjectImportData> {
    let import_data: ProjectImportData = serde_json::from_str(data)
        .map_err(|e| anyhow::anyhow!("Failed to parse import data: {}", e))?;
    
    // Basic validation
    if import_data.project.name.is_empty() {
        return Err(anyhow::anyhow!("Project name cannot be empty"));
    }
    
    // Validate persona relationships
    for persona in &import_data.personas {
        if let Some(ref core_problem) = import_data.core_problem {
            if persona.core_problem_id != core_problem.id {
                return Err(anyhow::anyhow!("Persona core_problem_id mismatch"));
            }
        }
    }
    
    Ok(import_data)
}
