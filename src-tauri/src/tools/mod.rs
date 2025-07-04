use tauri::{command, State};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use crate::db::queries::Queries;
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;

pub mod langgraph;

#[derive(Debug, Serialize, Deserialize)]
pub struct LLMRequest {
    pub prompt: String,
    pub model: Option<String>,
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LLMResponse {
    pub content: String,
    pub model: String,
    pub tokens_used: Option<u32>,
}

#[command]
pub async fn call_llm(request: LLMRequest) -> Result<LLMResponse, String> {
    let api_key = env::var("GOOGLE_API_KEY")
        .map_err(|_| "GOOGLE_API_KEY not found in environment".to_string())?;

    let client = Client::new();
    let model = request.model.unwrap_or_else(|| "gemini-pro".to_string());
    
    // Google Gemini API request
    let request_body = serde_json::json!({
        "contents": [{
            "parts": [{
                "text": request.prompt
            }]
        }],
        "generationConfig": {
            "temperature": request.temperature.unwrap_or(0.7),
            "maxOutputTokens": request.max_tokens.unwrap_or(1024),
        }
    });

    let response = client
        .post(&format!("https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent", model))
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let response_json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    // Extract content from Gemini response
    let content = response_json
        .get("candidates")
        .and_then(|candidates| candidates.get(0))
        .and_then(|candidate| candidate.get("content"))
        .and_then(|content| content.get("parts"))
        .and_then(|parts| parts.get(0))
        .and_then(|part| part.get("text"))
        .and_then(|text| text.as_str())
        .ok_or("Failed to extract content from response")?;

    Ok(LLMResponse {
        content: content.to_string(),
        model,
        tokens_used: None, // Gemini doesn't provide token count in response
    })
}

#[command]
pub async fn query_local_sqlite(
    query: String, 
    params: Vec<String>,
    db_pool: State<'_, Pool<SqliteConnectionManager>>
) -> Result<String, String> {
    let queries = Queries::new(db_pool.inner().clone());
    match queries.execute_query(&query, &params) {
        Ok(results) => {
            // Convert results to JSON string
            serde_json::to_string(&results)
                .map_err(|e| format!("Failed to serialize results: {}", e))
        }
        Err(e) => Err(format!("Database query failed: {}", e))
    }
}

#[command]
pub async fn get_problem_context(
    problem_id: Option<String>,
    db_pool: State<'_, Pool<SqliteConnectionManager>>
) -> Result<String, String> {
    let queries = Queries::new(db_pool.inner().clone());
    match queries.get_problem_with_context(problem_id) {
        Ok(context) => {
            serde_json::to_string(&context)
                .map_err(|e| format!("Failed to serialize context: {}", e))
        }
        Err(e) => Err(format!("Failed to get problem context: {}", e))
    }
}

#[command]
pub async fn save_generation_result(
    problem_id: String,
    result_type: String,
    content: String,
    metadata: Option<String>,
    db_pool: State<'_, Pool<SqliteConnectionManager>>
) -> Result<(), String> {
    let queries = Queries::new(db_pool.inner().clone());
    queries.save_ai_generation_result(problem_id, result_type, content, metadata)
        .map_err(|e| format!("Failed to save result: {}", e))
}

// Tool for LangGraph to get available tools metadata
#[command]
pub async fn get_available_tools() -> Result<Vec<serde_json::Value>, String> {
    let tools = vec![
        serde_json::json!({
            "name": "call_llm",
            "description": "Make a call to Google's Gemini LLM with specified parameters",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The text prompt to send to the LLM"},
                    "model": {"type": "string", "description": "Model to use (default: gemini-pro)"},
                    "temperature": {"type": "number", "description": "Temperature for generation (0.0-1.0)"},
                    "max_tokens": {"type": "number", "description": "Maximum tokens to generate"}
                },
                "required": ["prompt"]
            }
        }),
        serde_json::json!({
            "name": "query_local_sqlite",
            "description": "Execute a SQL query against the local SQLite database",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL query to execute"},
                    "params": {"type": "array", "items": {"type": "string"}, "description": "Parameters for the query"}
                },
                "required": ["query"]
            }
        }),
        serde_json::json!({
            "name": "get_problem_context",
            "description": "Get problem context including related data for AI generation",
            "parameters": {
                "type": "object",
                "properties": {
                    "problem_id": {"type": "string", "description": "Problem ID to get context for"}
                }
            }
        }),
        serde_json::json!({
            "name": "save_generation_result",
            "description": "Save AI generation results to the database",
            "parameters": {
                "type": "object",
                "properties": {
                    "problem_id": {"type": "string", "description": "Problem ID this result belongs to"},
                    "result_type": {"type": "string", "description": "Type of result (personas, solutions, etc.)"},
                    "content": {"type": "string", "description": "Generated content as JSON string"},
                    "metadata": {"type": "string", "description": "Optional metadata about the generation"}
                },
                "required": ["problem_id", "result_type", "content"]
            }
        })
    ];

    Ok(tools)
}

// LangGraph orchestrator commands
#[command]
pub async fn execute_langgraph_workflow(
    workflow_name: String,
    project_id: String,
    initial_data: std::collections::HashMap<String, serde_json::Value>,
) -> Result<serde_json::Value, String> {
    let orchestrator = langgraph::LangGraphOrchestrator::new();
    
    match orchestrator.execute_workflow(&workflow_name, &project_id, initial_data).await {
        Ok(state) => {
            serde_json::to_value(state)
                .map_err(|e| format!("Failed to serialize workflow state: {}", e))
        }
        Err(e) => Err(format!("Workflow execution failed: {}", e))
    }
}

#[command]
pub async fn list_langgraph_workflows() -> Result<Vec<String>, String> {
    let orchestrator = langgraph::LangGraphOrchestrator::new();
    Ok(orchestrator.list_workflows())
}

#[command]
pub async fn get_langgraph_workflow_definition(workflow_name: String) -> Result<serde_json::Value, String> {
    let orchestrator = langgraph::LangGraphOrchestrator::new();
    
    match orchestrator.get_workflow_status(&workflow_name) {
        Some(definition) => {
            serde_json::to_value(definition)
                .map_err(|e| format!("Failed to serialize workflow definition: {}", e))
        }
        None => Err(format!("Workflow {} not found", workflow_name))
    }
} 