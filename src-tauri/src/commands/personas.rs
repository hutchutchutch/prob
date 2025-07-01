use crate::db::{models::*, queries::Queries, DbPool};
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

// Command Structures

#[derive(Debug, Deserialize)]
pub struct GeneratePersonasRequest {
    pub core_problem_id: String,
    pub project_id: String,
}

#[derive(Debug, Serialize)]
pub struct GeneratePersonasResponse {
    pub personas: Vec<Persona>,
    pub generation_batch: String,
}

#[derive(Debug, Deserialize)]
pub struct PersonaFilterOptions {
    pub core_problem_id: String,
    pub include_locked: Option<bool>,
    pub only_active: Option<bool>,
}

// Realistic mock data arrays
const MOCK_NAMES: [&str; 20] = [
    "Sarah Chen", "Marcus Rodriguez", "Jennifer Taylor", "David Kim", "Emily Johnson",
    "Michael Brown", "Lisa Zhang", "Robert Wilson", "Amanda Davis", "Christopher Lee",
    "Rachel Green", "Thomas Anderson", "Nicole Martinez", "James Thompson", "Maria Garcia",
    "Kevin Wang", "Laura Miller", "Daniel Cooper", "Stephanie Liu", "Brandon Clark"
];

const MOCK_INDUSTRIES: [&str; 15] = [
    "Technology", "Healthcare", "Finance", "Retail", "Manufacturing",
    "Education", "Real Estate", "Consulting", "E-commerce", "Media",
    "Hospitality", "Transportation", "Non-profit", "Government", "Energy"
];

const MOCK_ROLES: [&str; 20] = [
    "CEO", "VP of Engineering", "Product Manager", "Sales Director", "Marketing Manager",
    "Operations Manager", "Customer Success Manager", "Business Analyst", "Team Lead",
    "Project Manager", "Designer", "Developer", "Consultant", "Founder", "Director",
    "Senior Manager", "Account Manager", "Strategy Lead", "Department Head", "Specialist"
];

// Commands

#[tauri::command]
pub async fn generate_personas(
    request: GeneratePersonasRequest,
    pool: State<'_, DbPool>,
) -> Result<GeneratePersonasResponse, String> {
    let queries = Queries::new(pool.inner().clone());
    let generation_batch = Uuid::new_v4().to_string();
    
    // Generate 5 realistic personas
    let personas = generate_realistic_personas(&request.core_problem_id, &generation_batch);
    
    // Save to database
    queries
        .create_personas(&personas)
        .map_err(|e| e.to_string())?;
    
    Ok(GeneratePersonasResponse {
        personas,
        generation_batch,
    })
}

#[tauri::command]
pub async fn regenerate_personas(
    request: GeneratePersonasRequest,
    pool: State<'_, DbPool>,
) -> Result<GeneratePersonasResponse, String> {
    let queries = Queries::new(pool.inner().clone());
    
    // Get locked persona IDs to avoid conflicts
    let locked_ids = queries
        .get_locked_persona_ids(&request.core_problem_id)
        .map_err(|e| e.to_string())?;
    
    let generation_batch = Uuid::new_v4().to_string();
    
    // Generate new personas that don't conflict with locked ones
    let new_personas = generate_realistic_personas_avoiding_conflicts(&request.core_problem_id, &generation_batch, &locked_ids);
    
    // Use regenerate_personas which handles deletion and position management
    queries
        .regenerate_personas(&request.core_problem_id, &new_personas)
        .map_err(|e| e.to_string())?;
    
    Ok(GeneratePersonasResponse {
        personas: new_personas,
        generation_batch,
    })
}

#[tauri::command]
pub async fn lock_persona(
    persona_id: String,
    pool: State<'_, DbPool>,
) -> Result<bool, String> {
    let queries = Queries::new(pool.inner().clone());
    
    queries
        .toggle_persona_lock(&persona_id)
        .map_err(|e| e.to_string())?;
    
    Ok(true)
}

#[tauri::command]
pub async fn select_persona(
    core_problem_id: String,
    persona_id: String,
    project_id: String,
    pool: State<'_, DbPool>,
) -> Result<Persona, String> {
    let queries = Queries::new(pool.inner().clone());
    
    // Set the active persona
    queries
        .set_active_persona(&core_problem_id, &persona_id)
        .map_err(|e| e.to_string())?;
    
    // Update project step to next workflow step
    queries
        .update_project_step(&project_id, "SolutionDiscovery")
        .map_err(|e| e.to_string())?;
    
    // Get the updated personas and return the active one
    let personas = queries
        .get_personas(&core_problem_id)
        .map_err(|e| e.to_string())?;
    
    personas
        .into_iter()
        .find(|p| p.id == persona_id)
        .ok_or_else(|| "Persona not found".to_string())
}

#[tauri::command]
pub async fn get_personas(
    filter_options: PersonaFilterOptions,
    pool: State<'_, DbPool>,
) -> Result<Vec<Persona>, String> {
    let queries = Queries::new(pool.inner().clone());
    
    let mut personas = queries
        .get_personas(&filter_options.core_problem_id)
        .map_err(|e| e.to_string())?;
    
    // Apply filters
    if let Some(include_locked) = filter_options.include_locked {
        if !include_locked {
            personas.retain(|p| !p.is_locked);
        }
    }
    
    if let Some(only_active) = filter_options.only_active {
        if only_active {
            personas.retain(|p| p.is_active);
        }
    }
    
    Ok(personas)
}

// Helper functions for realistic mock data generation

fn generate_realistic_personas(core_problem_id: &str, generation_batch: &str) -> Vec<Persona> {
    let mut personas = Vec::new();
    
    // Generate 5 unique personas using deterministic selection for consistent testing
    let persona_templates = [
        ("Sarah Chen", "Retail", "Small Business Owner"),
        ("Marcus Rodriguez", "Technology", "VP of Engineering"),
        ("Jennifer Taylor", "Finance", "Operations Manager"),
        ("David Kim", "Healthcare", "Product Manager"),
        ("Emily Johnson", "Education", "Department Head"),
    ];
    
    for (position, (name, industry, role)) in persona_templates.iter().enumerate() {
        let persona = PersonaBuilder::new(core_problem_id.to_string(), name.to_string())
            .industry(industry.to_string())
            .role(role.to_string())
            .pain_degree(generate_realistic_pain_degree(industry, role))
            .position(position as i32)
            .generation_batch(generation_batch.to_string())
            .build();
        
        personas.push(persona);
    }
    
    // Set first persona as active by default
    if let Some(first_persona) = personas.first_mut() {
        first_persona.is_active = true;
    }
    
    personas
}

fn generate_realistic_personas_avoiding_conflicts(
    core_problem_id: &str, 
    generation_batch: &str, 
    _locked_ids: &[String]
) -> Vec<Persona> {
    // For now, generate new personas without considering locked ones
    // In the real implementation, you would check against locked personas
    generate_realistic_personas(core_problem_id, generation_batch)
}

fn generate_realistic_pain_degree(industry: &str, role: &str) -> i32 {
    // Generate realistic pain degrees based on industry and role context
    match (industry, role) {
        ("Technology", role) => {
            if role.contains("CEO") || role.contains("Founder") { 5 }
            else if role.contains("VP") || role.contains("Director") { 4 }
            else if role.contains("Manager") { 3 }
            else { 2 }
        },
        ("Healthcare", role) => {
            if role.contains("CEO") || role.contains("Director") { 5 }
            else if role.contains("Manager") { 4 }
            else { 3 }
        },
        ("Finance", _) => 4, // High stakes industry
        ("Retail", role) => {
            if role.contains("CEO") || role.contains("VP") { 5 }
            else if role.contains("Manager") { 3 }
            else { 2 }
        },
        _ => 3, // Default moderate pain
    }
}

fn create_fallback_persona(core_problem_id: &str, generation_batch: &str, position: i32) -> Persona {
    PersonaBuilder::new(core_problem_id.to_string(), format!("Persona {}", position + 1))
        .industry("Business".to_string())
        .role("Manager".to_string())
        .pain_degree(3)
        .position(position)
        .generation_batch(generation_batch.to_string())
        .build()
}

// Test data generation functions

#[tauri::command]
pub async fn create_test_persona_data(
    core_problem_id: String,
    pool: State<'_, DbPool>,
) -> Result<Vec<Persona>, String> {
    let queries = Queries::new(pool.inner().clone());
    
    let test_personas = vec![
        PersonaBuilder::new(core_problem_id.clone(), "Sarah Chen".to_string())
            .industry("Retail".to_string())
            .role("Small Business Owner".to_string())
            .pain_degree(4)
            .position(0)
            .generation_batch("batch_001".to_string())
            .build(),
        PersonaBuilder::new(core_problem_id.clone(), "Marcus Rodriguez".to_string())
            .industry("Retail".to_string())
            .role("Inventory Manager".to_string())
            .pain_degree(5)
            .position(1)
            .generation_batch("batch_001".to_string())
            .build(),
        PersonaBuilder::new(core_problem_id.clone(), "Jennifer Taylor".to_string())
            .industry("Technology".to_string())
            .role("Remote Software Developer".to_string())
            .pain_degree(3)
            .position(2)
            .generation_batch("batch_002".to_string())
            .build(),
        PersonaBuilder::new(core_problem_id.clone(), "David Kim".to_string())
            .industry("Education".to_string())
            .role("College Student".to_string())
            .pain_degree(4)
            .position(3)
            .generation_batch("batch_003".to_string())
            .build(),
        PersonaBuilder::new(core_problem_id.clone(), "Emily Johnson".to_string())
            .industry("Healthcare".to_string())
            .role("Practice Manager".to_string())
            .pain_degree(5)
            .position(4)
            .generation_batch("batch_004".to_string())
            .build(),
    ];
    
    // Set first persona as active
    let mut test_personas = test_personas;
    test_personas[0].is_active = true;
    
    // Save all test personas
    queries
        .create_personas(&test_personas)
        .map_err(|e| e.to_string())?;
    
    Ok(test_personas)
}
