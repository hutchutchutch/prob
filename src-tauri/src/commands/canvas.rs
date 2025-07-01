use crate::db::{models::*, queries::Queries, DbPool};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use tauri::State;
use uuid::Uuid;
use chrono::Utc;

#[derive(Debug, Deserialize)]
pub struct SaveCanvasRequest {
    pub project_id: String,
    pub nodes: JsonValue,
    pub edges: JsonValue,
    pub viewport: Option<JsonValue>,
}

#[derive(Debug, Serialize)]
pub struct LayoutCalculation {
    pub nodes: Vec<NodePosition>,
}

#[derive(Debug, Serialize)]
pub struct NodePosition {
    pub id: String,
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Deserialize)]
pub struct ExportCanvasRequest {
    pub project_id: String,
    pub format: String, // "png" or "svg"
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize)]
pub struct CanvasResponse {
    pub nodes: JsonValue,
    pub edges: JsonValue,
    pub viewport: Option<JsonValue>,
}

impl Default for CanvasResponse {
    fn default() -> Self {
        Self {
            nodes: serde_json::json!([]),
            edges: serde_json::json!([]),
            viewport: None,
        }
    }
}

/// Save canvas state with validation
#[tauri::command]
pub async fn save_canvas_state(
    db: State<'_, DbPool>,
    request: SaveCanvasRequest,
) -> Result<(), String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    // Validate nodes and edges are valid JSON
    if !request.nodes.is_array() {
        return Err("Nodes must be a valid JSON array".to_string());
    }
    
    if !request.edges.is_array() {
        return Err("Edges must be a valid JSON array".to_string());
    }
    
    // Create new CanvasState with UUID
    let canvas_state = CanvasState {
        id: Uuid::new_v4().to_string(),
        project_id: request.project_id,
        nodes: request.nodes,
        edges: request.edges,
        viewport: request.viewport,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    queries.save_canvas_state(&canvas_state)
        .map_err(|e| e.to_string())
}

/// Load latest canvas state for a project
#[tauri::command]
pub async fn load_canvas_state(
    db: State<'_, DbPool>,
    project_id: String,
) -> Result<CanvasResponse, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    match queries.get_latest_canvas_state(&project_id) {
        Ok(Some(canvas_state)) => {
            Ok(CanvasResponse {
                nodes: canvas_state.nodes,
                edges: canvas_state.edges,
                viewport: canvas_state.viewport,
            })
        }
        Ok(None) => {
            // Return default empty state if no canvas state exists
            Ok(CanvasResponse::default())
        }
        Err(e) => Err(e.to_string()),
    }
}

/// Export canvas as image (placeholder implementation)
#[tauri::command]
pub async fn export_canvas_image(
    _db: State<'_, DbPool>,
    _request: ExportCanvasRequest,
) -> Result<String, String> {
    // For now, return error "Not implemented"
    // Will require canvas rendering library later
    Err("Canvas image export not implemented - requires canvas rendering library".to_string())
}

/// Calculate hierarchical layout for canvas nodes
#[tauri::command]
pub async fn calculate_layout(
    _db: State<'_, DbPool>,
    nodes: JsonValue,
) -> Result<LayoutCalculation, String> {
    if !nodes.is_array() {
        return Err("Nodes must be a valid JSON array".to_string());
    }
    
    let node_array = nodes.as_array().unwrap();
    let positions = calculate_hierarchical_layout(node_array);
    
    Ok(LayoutCalculation { nodes: positions })
}

/// Calculate positions based on node types in a hierarchical layout
fn calculate_hierarchical_layout(nodes: &[JsonValue]) -> Vec<NodePosition> {
    let mut positions = Vec::new();
    let mut problem_nodes = Vec::new();
    let mut persona_nodes = Vec::new();
    let mut pain_point_nodes = Vec::new();
    let mut solution_nodes = Vec::new();
    
    // Group nodes by type
    for node in nodes {
        if let Some(node_type) = node.get("type").and_then(|t| t.as_str()) {
            let node_id = node.get("id").and_then(|id| id.as_str()).unwrap_or("unknown");
            
            match node_type {
                "problem" => problem_nodes.push(node_id),
                "persona" => persona_nodes.push(node_id),
                "painPoint" => pain_point_nodes.push(node_id),
                "solution" => solution_nodes.push(node_id),
                _ => {} // Handle unknown node types
            }
        }
    }
    
    // Calculate positions for each node type
    
    // Problem nodes: x=100, y=center
    let problem_center_y = 300.0;
    for (i, node_id) in problem_nodes.iter().enumerate() {
        positions.push(NodePosition {
            id: node_id.to_string(),
            x: 100.0,
            y: problem_center_y + (i as f64 * 120.0),
        });
    }
    
    // Personas: x=400, y=distributed
    let persona_start_y = 50.0;
    let persona_spacing = 150.0;
    for (i, node_id) in persona_nodes.iter().enumerate() {
        positions.push(NodePosition {
            id: node_id.to_string(),
            x: 400.0,
            y: persona_start_y + (i as f64 * persona_spacing),
        });
    }
    
    // Pain points: x=700, y=distributed
    let pain_start_y = 50.0;
    let pain_spacing = 100.0;
    for (i, node_id) in pain_point_nodes.iter().enumerate() {
        positions.push(NodePosition {
            id: node_id.to_string(),
            x: 700.0,
            y: pain_start_y + (i as f64 * pain_spacing),
        });
    }
    
    // Solutions: x=1000, y=distributed
    let solution_start_y = 50.0;
    let solution_spacing = 120.0;
    for (i, node_id) in solution_nodes.iter().enumerate() {
        positions.push(NodePosition {
            id: node_id.to_string(),
            x: 1000.0,
            y: solution_start_y + (i as f64 * solution_spacing),
        });
    }
    
    positions
}
