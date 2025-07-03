#![cfg_attr(
    all(not(debug_assertions), target_os = "macos"),
    macos_subsystem = "macos"
)]

mod commands;
mod db;

use commands::*;
use commands::data_sync::{check_migration_status, run_database_migrations, get_detailed_migration_status};
use db::init_db;
use log::info;

#[tokio::main]
async fn main() {
    env_logger::init();
    info!("Starting Prob...");
    
    let db_pool = init_db().await.expect("Failed to initialize database");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .manage(db_pool)
        .invoke_handler(tauri::generate_handler![
            // App state
            get_app_state,
            // Workspace commands
            create_workspace,
            list_workspaces,
            // Project management commands
            create_new_project,
            delete_project_with_data,
            rename_project,
            duplicate_project,
            import_project,
            export_project,
            // Problem commands
            validate_problem,
            save_problem_validation,
            get_problem_history,
            create_test_problem_data,
            // Persona commands
            generate_personas,
            regenerate_personas,
            lock_persona,
            select_persona,
            get_personas,
            create_test_persona_data,
            // Canvas commands
            save_canvas_state,
            load_canvas_state,
            export_canvas_image,
            calculate_layout,
            // Data sync commands
            populate_sqlite_test_data,
            verify_test_data_consistency,
            clear_sqlite_test_data,
            // Migration management commands
            check_migration_status,
            run_database_migrations,
            get_detailed_migration_status,
            // Legacy analyze command
            analyze_problem,
            // Filesystem commands
            get_platform,
            open_terminal,
        ])
        .setup(|_app| {
            info!("GoldiDocs setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}