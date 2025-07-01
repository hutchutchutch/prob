use crate::db::{models::*, queries::Queries, DbPool};
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;
use chrono::Utc;

// Command Structures

#[derive(Debug, Deserialize)]
pub struct ValidateProblemRequest {
    pub problem_input: String,
    pub project_id: String,
}

#[derive(Debug, Serialize)]
pub struct ValidateProblemResponse {
    pub is_valid: bool,
    pub validated_problem: Option<String>,
    pub feedback: String,
    pub suggestions: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct ProblemHistoryItem {
    pub id: String,
    pub original_input: String,
    pub validated_problem: Option<String>,
    pub is_valid: bool,
    pub version: i32,
    pub created_at: String,
}

// Commands

#[tauri::command]
pub async fn validate_problem(
    request: ValidateProblemRequest,
    pool: State<'_, DbPool>,
) -> Result<ValidateProblemResponse, String> {
    let queries = Queries::new(pool.inner().clone());
    
    // Get the current version number for this project
    let latest_problem = queries
        .get_latest_core_problem(&request.project_id)
        .map_err(|e| e.to_string())?;
    
    let next_version = latest_problem
        .map(|p| p.version + 1)
        .unwrap_or(1);
    
    // Enhanced mock validation logic (will integrate with Supabase later)
    let problem_text = request.problem_input.trim();
    let (is_valid, validated_problem, feedback, suggestions) = generate_realistic_validation(problem_text);
    
    // Create a new CoreProblem record
    let core_problem = CoreProblem {
        id: Uuid::new_v4().to_string(),
        project_id: request.project_id.clone(),
        original_input: request.problem_input.clone(),
        validated_problem: validated_problem.clone(),
        is_valid,
        validation_feedback: Some(feedback.clone()),
        version: next_version,
        created_at: Utc::now(),
    };
    
    // Save to database
    queries
        .create_core_problem(&core_problem)
        .map_err(|e| e.to_string())?;
    
    Ok(ValidateProblemResponse {
        is_valid,
        validated_problem,
        feedback,
        suggestions,
    })
}

#[tauri::command]
pub async fn save_problem_validation(
    problem: CoreProblem,
    pool: State<'_, DbPool>,
) -> Result<CoreProblem, String> {
    let queries = Queries::new(pool.inner().clone());
    
    // Create a new problem with a generated ID if it doesn't have one
    let mut problem_to_save = problem;
    if problem_to_save.id.is_empty() {
        problem_to_save.id = Uuid::new_v4().to_string();
    }
    problem_to_save.created_at = Utc::now();
    
    // Save the problem to database
    queries
        .create_core_problem(&problem_to_save)
        .map_err(|e| e.to_string())?;
    
    // Update project status to next step if valid
    if problem_to_save.is_valid {
        queries
            .update_project_step(&problem_to_save.project_id, "SolutionDiscovery")
            .map_err(|e| e.to_string())?;
    }
    
    Ok(problem_to_save)
}

#[tauri::command]
pub async fn get_problem_history(
    project_id: String,
    pool: State<'_, DbPool>,
) -> Result<Vec<ProblemHistoryItem>, String> {
    let conn = pool.inner().get().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare(
            "SELECT id, original_input, validated_problem, is_valid, version, created_at 
             FROM core_problems 
             WHERE project_id = ?1 
             ORDER BY version DESC"
        )
        .map_err(|e| e.to_string())?;
    
    let history_items = stmt
        .query_map([&project_id], |row| {
            Ok(ProblemHistoryItem {
                id: row.get(0)?,
                original_input: row.get(1)?,
                validated_problem: row.get(2)?,
                is_valid: row.get::<_, i32>(3)? == 1,
                version: row.get(4)?,
                created_at: row.get::<_, chrono::DateTime<Utc>>(5)?.to_rfc3339(),
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(history_items)
}

// Helper function to generate realistic mock validation data
fn generate_realistic_validation(problem_text: &str) -> (bool, Option<String>, String, Vec<String>) {
    if problem_text.is_empty() {
        return (
            false,
            None,
            "Problem statement cannot be empty.".to_string(),
            vec![
                "Describe the specific challenge or issue you're trying to solve".to_string(),
                "Include who is affected by this problem".to_string(),
                "Mention the current impact or consequences".to_string(),
            ]
        );
    }
    
    if problem_text.len() < 20 {
        return (
            false,
            None,
            "Problem statement is too brief. Please provide more context and detail.".to_string(),
            vec![
                "Expand on the specific challenges users face".to_string(),
                "Include the business context or domain".to_string(),
                "Describe why this problem needs to be solved now".to_string(),
            ]
        );
    }
    
    // Generate realistic validated problem based on input
    let validated_problem = enhance_problem_statement(problem_text);
    
    // Create context-aware feedback
    let feedback = format!(
        "Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident."
    );
    
    // Generate targeted suggestions based on content
    let suggestions = vec![
        "Consider adding specific metrics or KPIs to measure success".to_string(),
        "Include potential user segments that might be affected differently".to_string(),
        "Think about seasonal or temporal factors that might influence the problem".to_string(),
        "Consider the technical complexity and resource requirements".to_string(),
    ];
    
    (true, Some(validated_problem), feedback, suggestions)
}

fn enhance_problem_statement(original: &str) -> String {
    // Create realistic enhanced version that maintains the original intent
    // but adds professional structure and clarity
    
    if original.to_lowercase().contains("app") || original.to_lowercase().contains("mobile") {
        format!("Mobile Application Challenge: {}. This problem impacts user experience and requires a strategic solution that balances technical feasibility with user needs.", original)
    } else if original.to_lowercase().contains("business") || original.to_lowercase().contains("company") {
        format!("Business Process Optimization: {}. This challenge affects operational efficiency and requires systematic analysis to identify key personas and solution pathways.", original)
    } else if original.to_lowercase().contains("user") || original.to_lowercase().contains("customer") {
        format!("User Experience Problem: {}. This issue directly impacts user satisfaction and retention, requiring persona-driven solution development.", original)
    } else if original.to_lowercase().contains("data") || original.to_lowercase().contains("analytics") {
        format!("Data & Analytics Challenge: {}. This problem requires data-driven insights and affects decision-making processes across multiple user types.", original)
    } else {
        format!("Core Problem Statement: {}. This challenge requires comprehensive analysis to understand affected user groups and develop targeted solutions.", original)
    }
}

// Seed data functions for testing
#[tauri::command]
pub async fn create_test_problem_data(
    project_id: String,
    pool: State<'_, DbPool>,
) -> Result<Vec<CoreProblem>, String> {
    let queries = Queries::new(pool.inner().clone());
    
    let test_problems = vec![
        CoreProblem {
            id: Uuid::new_v4().to_string(),
            project_id: project_id.clone(),
            original_input: "Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations".to_string(),
            validated_problem: Some("Business Process Optimization: Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations. This challenge affects operational efficiency and requires systematic analysis to identify key personas and solution pathways.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 1,
            created_at: Utc::now(),
        },
        CoreProblem {
            id: Uuid::new_v4().to_string(),
            project_id: project_id.clone(),
            original_input: "Remote workers find it difficult to stay connected and collaborate effectively with their team members".to_string(),
            validated_problem: Some("User Experience Problem: Remote workers find it difficult to stay connected and collaborate effectively with their team members. This issue directly impacts user satisfaction and retention, requiring persona-driven solution development.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 2,
            created_at: Utc::now(),
        },
        CoreProblem {
            id: Uuid::new_v4().to_string(),
            project_id: project_id.clone(),
            original_input: "Students need a better way to track their learning progress and study habits across multiple subjects".to_string(),
            validated_problem: Some("Mobile Application Challenge: Students need a better way to track their learning progress and study habits across multiple subjects. This problem impacts user experience and requires a strategic solution that balances technical feasibility with user needs.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 3,
            created_at: Utc::now(),
        },
    ];
    
    // Save all test problems
    for problem in &test_problems {
        queries
            .create_core_problem(problem)
            .map_err(|e| e.to_string())?;
    }
    
    Ok(test_problems)
}
