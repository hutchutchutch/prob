use crate::db::{models::*, queries::Queries, DbPool};
use serde::Serialize;
use tauri::State;
use chrono::Utc;

#[derive(Debug, Serialize)]
pub struct DataSyncResponse {
    pub message: String,
    pub items_synced: u32,
    pub tables_populated: Vec<String>,
}

/// Populate SQLite database with comprehensive test data matching Supabase seed data
#[tauri::command]
pub async fn populate_sqlite_test_data(
    db: State<'_, DbPool>,
) -> Result<DataSyncResponse, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    let mut tables_populated = Vec::new();
    let mut total_items = 0u32;

    // 1. Create test user
    let test_user = User {
        id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
        email: "test@example.com".to_string(),
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    if let Err(_) = queries.create_user(&test_user) {
        // User might already exist, ignore error
    }
    tables_populated.push("users".to_string());
    total_items += 1;

    // 2. Create test workspace
    let test_workspace = Workspace {
        id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
        user_id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
        name: "Test Workspace".to_string(),
        folder_path: Some("/Users/test/projects".to_string()),
        is_active: true,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    if let Err(_) = queries.create_workspace(&test_workspace) {
        // Workspace might already exist, ignore error
    }
    tables_populated.push("workspaces".to_string());
    total_items += 1;

    // 3. Create test projects (multiple scenarios for comprehensive testing)
    let test_projects = vec![
        Project {
            id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            workspace_id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
            name: "Inventory Management System".to_string(),
            status: "problem_validation".to_string(),
            current_step: "persona_generation".to_string(),
            langgraph_state: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        Project {
            id: "550e8400-e29b-41d4-a716-446655440030".to_string(),
            workspace_id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
            name: "Remote Collaboration Platform".to_string(),
            status: "solution_discovery".to_string(),
            current_step: "solution_selection".to_string(),
            langgraph_state: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        Project {
            id: "550e8400-e29b-41d4-a716-446655440031".to_string(),
            workspace_id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
            name: "Educational Progress Tracker".to_string(),
            status: "feature_definition".to_string(),
            current_step: "user_stories".to_string(),
            langgraph_state: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];
    
    for project in &test_projects {
        if let Err(_) = queries.create_project(project) {
            // Project might already exist, ignore error
        }
        total_items += 1;
    }
    tables_populated.push("projects".to_string());

    // 4. Create test core problems
    let test_problems = vec![
        CoreProblem {
            id: "550e8400-e29b-41d4-a716-446655440003".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            original_input: "Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations".to_string(),
            validated_problem: Some("Business Process Optimization: Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations. This challenge affects operational efficiency and requires systematic analysis to identify key personas and solution pathways.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 1,
            created_at: Utc::now(),
        },
        CoreProblem {
            id: "550e8400-e29b-41d4-a716-446655440004".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            original_input: "Remote workers find it difficult to stay connected and collaborate effectively with their team members".to_string(),
            validated_problem: Some("User Experience Problem: Remote workers find it difficult to stay connected and collaborate effectively with their team members. This issue directly impacts user satisfaction and retention, requiring persona-driven solution development.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 2,
            created_at: Utc::now(),
        },
        CoreProblem {
            id: "550e8400-e29b-41d4-a716-446655440005".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            original_input: "Students need a better way to track their learning progress and study habits across multiple subjects".to_string(),
            validated_problem: Some("Mobile Application Challenge: Students need a better way to track their learning progress and study habits across multiple subjects. This problem impacts user experience and requires a strategic solution that balances technical feasibility with user needs.".to_string()),
            is_valid: true,
            validation_feedback: Some("Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.".to_string()),
            version: 3,
            created_at: Utc::now(),
        },
    ];

    for problem in &test_problems {
        if let Err(_) = queries.create_core_problem(problem) {
            // Problem might already exist, ignore error
        }
        total_items += 1;
    }
    tables_populated.push("core_problems".to_string());

    // 5. Create test personas
    let test_personas = vec![
        PersonaBuilder::new(
            "550e8400-e29b-41d4-a716-446655440003".to_string(),
            "Sarah Chen".to_string()
        )
        .industry("Retail".to_string())
        .role("Small Business Owner".to_string())
        .pain_degree(4)
        .position(0)
        .generation_batch("batch_001".to_string())
        .build(),
        PersonaBuilder::new(
            "550e8400-e29b-41d4-a716-446655440003".to_string(),
            "Marcus Rodriguez".to_string()
        )
        .industry("Retail".to_string())
        .role("Inventory Manager".to_string())
        .pain_degree(5)
        .position(1)
        .generation_batch("batch_001".to_string())
        .build(),
        PersonaBuilder::new(
            "550e8400-e29b-41d4-a716-446655440003".to_string(),
            "Jennifer Taylor".to_string()
        )
        .industry("Technology".to_string())
        .role("Remote Software Developer".to_string())
        .pain_degree(3)
        .position(2)
        .generation_batch("batch_002".to_string())
        .build(),
        PersonaBuilder::new(
            "550e8400-e29b-41d4-a716-446655440003".to_string(),
            "David Kim".to_string()
        )
        .industry("Education".to_string())
        .role("College Student".to_string())
        .pain_degree(4)
        .position(3)
        .generation_batch("batch_003".to_string())
        .build(),
        PersonaBuilder::new(
            "550e8400-e29b-41d4-a716-446655440003".to_string(),
            "Emily Johnson".to_string()
        )
        .industry("Healthcare".to_string())
        .role("Practice Manager".to_string())
        .pain_degree(5)
        .position(4)
        .generation_batch("batch_004".to_string())
        .build(),
    ];

    // Set specific IDs for test personas
    let mut personas_with_ids = Vec::new();
    let persona_ids = vec![
        "550e8400-e29b-41d4-a716-446655440006",
        "550e8400-e29b-41d4-a716-446655440007", 
        "550e8400-e29b-41d4-a716-446655440008",
        "550e8400-e29b-41d4-a716-446655440018",
        "550e8400-e29b-41d4-a716-446655440019",
    ];

    for (i, persona) in test_personas.into_iter().enumerate() {
        let mut persona_with_id = persona;
        persona_with_id.id = persona_ids[i].to_string();
        // Set first persona as active
        if i == 0 {
            persona_with_id.is_active = true;
        }
        personas_with_ids.push(persona_with_id);
    }

    if let Err(_) = queries.create_personas(&personas_with_ids) {
        // Personas might already exist, ignore error
    }
    total_items += personas_with_ids.len() as u32;
    tables_populated.push("personas".to_string());

    // 6. Create pain points
    let test_pain_points = vec![
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440009".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440006".to_string(),
            description: "Constantly running out of popular items during peak seasons".to_string(),
            severity: Some("High".to_string()),
            impact_area: Some("Revenue Loss".to_string()),
            position: 0,
            is_locked: false,
            generation_batch: Some("batch_001".to_string()),
            created_at: Utc::now(),
        },
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440010".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440006".to_string(),
            description: "Tying up capital in slow-moving inventory".to_string(),
            severity: Some("Medium".to_string()),
            impact_area: Some("Cash Flow".to_string()),
            position: 1,
            is_locked: false,
            generation_batch: Some("batch_001".to_string()),
            created_at: Utc::now(),
        },
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440011".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440007".to_string(),
            description: "Difficulty tracking inventory across multiple locations".to_string(),
            severity: Some("High".to_string()),
            impact_area: Some("Operations".to_string()),
            position: 0,
            is_locked: false,
            generation_batch: Some("batch_001".to_string()),
            created_at: Utc::now(),
        },
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440020".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440008".to_string(),
            description: "Feeling isolated from team members throughout the workday".to_string(),
            severity: Some("High".to_string()),
            impact_area: Some("Team Collaboration".to_string()),
            position: 0,
            is_locked: false,
            generation_batch: Some("batch_002".to_string()),
            created_at: Utc::now(),
        },
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440021".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440018".to_string(),
            description: "Struggling to maintain focus across multiple subjects".to_string(),
            severity: Some("Medium".to_string()),
            impact_area: Some("Academic Performance".to_string()),
            position: 0,
            is_locked: false,
            generation_batch: Some("batch_003".to_string()),
            created_at: Utc::now(),
        },
        PainPoint {
            id: "550e8400-e29b-41d4-a716-446655440022".to_string(),
            persona_id: "550e8400-e29b-41d4-a716-446655440019".to_string(),
            description: "Managing patient scheduling conflicts and double bookings".to_string(),
            severity: Some("High".to_string()),
            impact_area: Some("Patient Care".to_string()),
            position: 0,
            is_locked: false,
            generation_batch: Some("batch_004".to_string()),
            created_at: Utc::now(),
        },
    ];

    if let Err(_) = queries.create_pain_points(&test_pain_points) {
        // Pain points might already exist, ignore error
    }
    total_items += test_pain_points.len() as u32;
    tables_populated.push("pain_points".to_string());

    // 7. Create solutions
    let test_solutions = vec![
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440006".to_string(),
            "Smart Inventory Prediction System".to_string()
        )
        .description("AI-powered system that analyzes sales patterns, seasonal trends, and external factors to predict optimal inventory levels".to_string())
        .solution_type("Software Solution".to_string())
        .complexity("High".to_string())
        .position(0)
        .build(),
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440006".to_string(),
            "Real-time Stock Alerts".to_string()
        )
        .description("Mobile and web notifications for low stock levels and reorder recommendations".to_string())
        .solution_type("Notification System".to_string())
        .complexity("Medium".to_string())
        .position(1)
        .build(),
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440007".to_string(),
            "Multi-Location Inventory Tracker".to_string()
        )
        .description("Centralized system for tracking inventory across multiple store locations with real-time sync".to_string())
        .solution_type("Management System".to_string())
        .complexity("High".to_string())
        .position(0)
        .build(),
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440008".to_string(),
            "Virtual Team Presence Dashboard".to_string()
        )
        .description("Real-time dashboard showing team member availability, current projects, and quick communication tools".to_string())
        .solution_type("Dashboard Solution".to_string())
        .complexity("Medium".to_string())
        .position(0)
        .build(),
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440018".to_string(),
            "Study Progress Tracker".to_string()
        )
        .description("Comprehensive platform for tracking learning progress, study habits, and academic performance across subjects".to_string())
        .solution_type("Educational Platform".to_string())
        .complexity("Medium".to_string())
        .position(0)
        .build(),
        SolutionBuilder::new(
            "550e8400-e29b-41d4-a716-446655440002".to_string(),
            "550e8400-e29b-41d4-a716-446655440019".to_string(),
            "Smart Scheduling System".to_string()
        )
        .description("Intelligent patient scheduling system that prevents conflicts and optimizes appointment slots".to_string())
        .solution_type("Healthcare Solution".to_string())
        .complexity("High".to_string())
        .position(0)
        .build(),
    ];

    // Set specific IDs and selection status for test solutions
    let mut solutions_with_ids = Vec::new();
    let solution_ids = vec![
        "550e8400-e29b-41d4-a716-446655440012",
        "550e8400-e29b-41d4-a716-446655440013",
        "550e8400-e29b-41d4-a716-446655440014",
        "550e8400-e29b-41d4-a716-446655440023",
        "550e8400-e29b-41d4-a716-446655440024",
        "550e8400-e29b-41d4-a716-446655440025",
    ];

    for (i, solution) in test_solutions.into_iter().enumerate() {
        let mut solution_with_id = solution;
        solution_with_id.id = solution_ids[i].to_string();
        // Set first solution as selected
        if i == 0 {
            solution_with_id.is_selected = true;
        }
        solutions_with_ids.push(solution_with_id);
    }

    // 8. Create solution-pain point mappings
    let test_mappings = vec![
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440015".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440012".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440009".to_string(),
            relevance_score: Some(0.95),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440016".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440012".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440010".to_string(),
            relevance_score: Some(0.85),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440017".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440013".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440009".to_string(),
            relevance_score: Some(0.88),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440026".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440014".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440011".to_string(),
            relevance_score: Some(0.92),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440027".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440023".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440020".to_string(),
            relevance_score: Some(0.90),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440028".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440024".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440021".to_string(),
            relevance_score: Some(0.87),
            created_at: Utc::now(),
        },
        SolutionPainPointMapping {
            id: "550e8400-e29b-41d4-a716-446655440029".to_string(),
            solution_id: "550e8400-e29b-41d4-a716-446655440025".to_string(),
            pain_point_id: "550e8400-e29b-41d4-a716-446655440022".to_string(),
            relevance_score: Some(0.93),
            created_at: Utc::now(),
        },
    ];

    if let Err(_) = queries.create_solutions_with_mappings(&solutions_with_ids, &test_mappings) {
        // Solutions might already exist, ignore error
    }
    total_items += solutions_with_ids.len() as u32;
    total_items += test_mappings.len() as u32;
    tables_populated.push("key_solutions".to_string());
    tables_populated.push("solution_pain_point_mappings".to_string());

    // 9. Create test user stories for comprehensive workflow testing
    let test_user_stories = vec![
        UserStory {
            id: "550e8400-e29b-41d4-a716-446655440032".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            title: "Inventory Level Monitoring".to_string(),
            as_a: "small business owner".to_string(),
            i_want: "to receive real-time alerts when inventory levels drop below threshold".to_string(),
            so_that: "I can reorder stock before running out".to_string(),
            acceptance_criteria: vec!["Alert triggers when stock < 10 units".to_string(), "Email and SMS notifications sent".to_string(), "Reorder suggestions provided".to_string(), "Historical data shows alert effectiveness".to_string()],
            priority: Some("High".to_string()),
            complexity_points: Some(8),
            position: 0,
            is_edited: false,
            original_content: None,
            edited_content: None,
            created_at: Utc::now(),
        },
        UserStory {
            id: "550e8400-e29b-41d4-a716-446655440033".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            title: "Sales Trend Analysis".to_string(),
            as_a: "inventory manager".to_string(),
            i_want: "to view sales trends and seasonal patterns".to_string(),
            so_that: "I can make informed purchasing decisions".to_string(),
            acceptance_criteria: vec!["Charts display monthly/quarterly trends".to_string(), "Seasonal pattern detection".to_string(), "Export data to spreadsheet".to_string(), "Filter by product category".to_string()],
            priority: Some("Medium".to_string()),
            complexity_points: Some(5),
            position: 1,
            is_edited: false,
            original_content: None,
            edited_content: None,
            created_at: Utc::now(),
        },
        UserStory {
            id: "550e8400-e29b-41d4-a716-446655440034".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440030".to_string(),
            title: "Team Presence Dashboard".to_string(),
            as_a: "remote developer".to_string(),
            i_want: "to see which team members are currently online and available".to_string(),
            so_that: "I can collaborate more effectively".to_string(),
            acceptance_criteria: vec!["Real-time online status display".to_string(), "Current project indicators".to_string(), "Availability status (busy/free)".to_string(), "Quick message capability".to_string()],
            priority: Some("High".to_string()),
            complexity_points: Some(3),
            position: 0,
            is_edited: false,
            original_content: None,
            edited_content: None,
            created_at: Utc::now(),
        },
        UserStory {
            id: "550e8400-e29b-41d4-a716-446655440035".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440031".to_string(),
            title: "Study Progress Tracking".to_string(),
            as_a: "college student".to_string(),
            i_want: "to track my study time and progress across multiple subjects".to_string(),
            so_that: "I can better manage my time and improve performance".to_string(),
            acceptance_criteria: vec!["Timer for study sessions".to_string(), "Progress visualization".to_string(), "Subject categorization".to_string(), "Weekly/monthly reports".to_string(), "Goal setting and tracking".to_string()],
            priority: Some("High".to_string()),
            complexity_points: Some(8),
            position: 0,
            is_edited: false,
            original_content: None,
            edited_content: None,
            created_at: Utc::now(),
        },
    ];

    if let Err(_) = queries.create_user_stories(&test_user_stories) {
        // Stories might already exist, ignore error
    }
    total_items += test_user_stories.len() as u32;
    tables_populated.push("user_stories".to_string());

    // 10. Create test canvas states for visual workflow testing
    let test_canvas_states = vec![
        CanvasState {
            id: "550e8400-e29b-41d4-a716-446655440036".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
            nodes: serde_json::json!([
                {"id": "problem-1", "type": "problem", "position": {"x": 100, "y": 300}, "data": {"label": "Inventory Management"}},
                {"id": "persona-1", "type": "persona", "position": {"x": 400, "y": 200}, "data": {"label": "Sarah Chen", "role": "Business Owner"}},
                {"id": "persona-2", "type": "persona", "position": {"x": 400, "y": 400}, "data": {"label": "Marcus Rodriguez", "role": "Inventory Manager"}},
                {"id": "pain-1", "type": "painPoint", "position": {"x": 700, "y": 150}, "data": {"label": "Stockouts during peak seasons"}},
                {"id": "pain-2", "type": "painPoint", "position": {"x": 700, "y": 350}, "data": {"label": "Tracking across locations"}},
                {"id": "solution-1", "type": "solution", "position": {"x": 1000, "y": 200}, "data": {"label": "Smart Prediction System", "selected": true}}
            ]),
            edges: serde_json::json!([
                {"id": "e-problem-persona1", "source": "problem-1", "target": "persona-1", "type": "smoothstep"},
                {"id": "e-problem-persona2", "source": "problem-1", "target": "persona-2", "type": "smoothstep"},
                {"id": "e-persona1-pain1", "source": "persona-1", "target": "pain-1", "type": "smoothstep"},
                {"id": "e-persona2-pain2", "source": "persona-2", "target": "pain-2", "type": "smoothstep"},
                {"id": "e-pain1-solution1", "source": "pain-1", "target": "solution-1", "type": "smoothstep"},
                {"id": "e-pain2-solution1", "source": "pain-2", "target": "solution-1", "type": "smoothstep"}
            ]),
            viewport: Some(serde_json::json!({"x": 0, "y": 0, "zoom": 0.8})),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        CanvasState {
            id: "550e8400-e29b-41d4-a716-446655440037".to_string(),
            project_id: "550e8400-e29b-41d4-a716-446655440030".to_string(),
            nodes: serde_json::json!([
                {"id": "problem-2", "type": "problem", "position": {"x": 100, "y": 300}, "data": {"label": "Remote Collaboration"}},
                {"id": "persona-3", "type": "persona", "position": {"x": 400, "y": 300}, "data": {"label": "Jennifer Taylor", "role": "Remote Developer"}},
                {"id": "pain-3", "type": "painPoint", "position": {"x": 700, "y": 300}, "data": {"label": "Team isolation"}},
                {"id": "solution-2", "type": "solution", "position": {"x": 1000, "y": 300}, "data": {"label": "Presence Dashboard"}}
            ]),
            edges: serde_json::json!([
                {"id": "e-problem2-persona3", "source": "problem-2", "target": "persona-3", "type": "smoothstep"},
                {"id": "e-persona3-pain3", "source": "persona-3", "target": "pain-3", "type": "smoothstep"},
                {"id": "e-pain3-solution2", "source": "pain-3", "target": "solution-2", "type": "smoothstep"}
            ]),
            viewport: Some(serde_json::json!({"x": 0, "y": 0, "zoom": 1.0})),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];

    for canvas_state in &test_canvas_states {
        if let Err(_) = queries.save_canvas_state(canvas_state) {
            // Canvas state might already exist, ignore error
        }
        total_items += 1;
    }
    tables_populated.push("canvas_states".to_string());

    Ok(DataSyncResponse {
        message: "SQLite database populated with comprehensive test data".to_string(),
        items_synced: total_items,
        tables_populated,
    })
}

/// Verify data consistency between expected test data structure
#[tauri::command]
pub async fn verify_test_data_consistency(
    db: State<'_, DbPool>,
) -> Result<DataSyncResponse, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    let mut verification_results = Vec::new();
    let mut items_verified = 0u32;

    // Check if test project exists
    if let Ok(Some(_project)) = queries.get_project("550e8400-e29b-41d4-a716-446655440002") {
        verification_results.push("Test project found".to_string());
        items_verified += 1;
    } else {
        return Err("Test project not found - run populate_sqlite_test_data first".to_string());
    }

    // Check if test personas exist
    if let Ok(personas) = queries.get_personas("550e8400-e29b-41d4-a716-446655440003") {
        if personas.len() >= 5 {
            verification_results.push(format!("Found {} test personas", personas.len()));
            items_verified += personas.len() as u32;
        } else {
            return Err("Expected at least 5 test personas - database may be incomplete".to_string());
        }
    } else {
        return Err("Could not retrieve test personas".to_string());
    }

    // Check if solutions exist with mappings
    if let Ok(solutions_with_mappings) = queries.get_solutions_with_mappings("550e8400-e29b-41d4-a716-446655440002") {
        if !solutions_with_mappings.is_empty() {
            verification_results.push(format!("Found {} solutions with mappings", solutions_with_mappings.len()));
            items_verified += solutions_with_mappings.len() as u32;
        } else {
            return Err("No solutions found - database may be incomplete".to_string());
        }
    } else {
        return Err("Could not retrieve test solutions".to_string());
    }

    Ok(DataSyncResponse {
        message: format!("Data consistency verified: {}", verification_results.join(", ")),
        items_synced: items_verified,
        tables_populated: vec!["projects".to_string(), "personas".to_string(), "solutions".to_string()],
    })
}

/// Clear all test data from SQLite database
#[tauri::command]
pub async fn clear_sqlite_test_data(
    db: State<'_, DbPool>,
) -> Result<DataSyncResponse, String> {
    let pool = db.inner();
    let queries = Queries::new(pool.clone());
    
    // Delete all test projects (cascades to all related data)
    let test_project_ids = vec![
        "550e8400-e29b-41d4-a716-446655440002",
        "550e8400-e29b-41d4-a716-446655440030", 
        "550e8400-e29b-41d4-a716-446655440031",
    ];
    
    for project_id in test_project_ids {
        if let Err(e) = queries.delete_project_cascade(project_id) {
            return Err(format!("Failed to clear test data for project {}: {}", project_id, e));
        }
    }

    Ok(DataSyncResponse {
        message: "All test data cleared from SQLite database".to_string(),
        items_synced: 0,
        tables_populated: vec!["cleared_all_test_data".to_string()],
    })
} 