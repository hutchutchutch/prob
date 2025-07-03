pub mod problem;
pub mod personas;
pub mod canvas;
pub mod data_sync;
pub mod workspace;
pub mod filesystem;
pub mod terminal;

use crate::db::{Queries, DbPool, Workspace};
use serde::{Deserialize, Serialize};
use tauri::State;

// Re-export problem commands
pub use problem::{validate_problem, save_problem_validation, get_problem_history, create_test_problem_data};

// Re-export persona commands
pub use personas::{generate_personas, regenerate_personas, lock_persona, select_persona, get_personas, create_test_persona_data};

// Re-export canvas commands
pub use canvas::{save_canvas_state, load_canvas_state, export_canvas_image, calculate_layout};

// Re-export data sync commands
pub use data_sync::{populate_sqlite_test_data, verify_test_data_consistency, clear_sqlite_test_data};

// Re-export workspace commands
pub use workspace::{create_new_project, delete_project_with_data, rename_project, duplicate_project, import_project, export_project};

// Re-export filesystem commands
pub use filesystem::{get_platform, open_terminal};

// Re-export terminal commands
pub use terminal::{start_terminal_session, write_to_terminal, close_terminal_session, resize_terminal};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppState {
    pub version: String,
    pub initialized: bool,
}

#[tauri::command]
pub async fn get_app_state() -> Result<AppState, String> {
    Ok(AppState {
        version: env!("CARGO_PKG_VERSION").to_string(),
        initialized: true,
    })
}

#[tauri::command]
pub async fn create_workspace(
    db: State<'_, DbPool>,
    workspace: Workspace,
) -> Result<Workspace, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    queries.create_workspace(&workspace)
        .map_err(|e| e.to_string())?;
    
    Ok(workspace)
}

#[tauri::command]
pub async fn list_workspaces(
    db: State<'_, DbPool>,
    user_id: String,
) -> Result<Vec<Workspace>, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    queries.list_workspaces(&user_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn analyze_problem(problem: String) -> Result<String, String> {
    // This will be connected to Supabase Edge Function
    // For now, return a mock response
    Ok(format!("Analyzing: {}", problem))
}