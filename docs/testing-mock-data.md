# Mock Data Testing System

This document explains how to use the mock data generation system to ensure consistent, realistic test data across both SQLite and Supabase databases.

## Overview

Our problem validation system generates realistic mock data that represents exactly what we want to see in production. The same data structure and content is available in both:

- **SQLite (Local)**: Generated via Rust commands
- **Supabase (Cloud)**: Populated via migration and seed files

## Mock Data Features

### Enhanced Problem Validation

The `validate_problem` command now generates realistic validation responses based on problem content:

- **Context-aware categorization**: Detects app, business, user, or data problems
- **Professional validation feedback**: Detailed, constructive feedback
- **Targeted suggestions**: Specific improvement recommendations
- **Enhanced problem statements**: Structured, professional reformulations

### Realistic Persona Generation

The persona generation system creates contextually appropriate personas:

- **Industry-specific roles**: Matches personas to relevant industries and positions
- **Pain degree calculation**: Realistic pain levels based on role seniority and industry
- **Deterministic generation**: Consistent personas for reliable testing
- **Lock/unlock functionality**: Test persona selection and regeneration workflows
- **Active persona management**: Test workflow progression through persona selection

### Test Data Generation

#### Problem Validation Data
Use the `create_test_problem_data` command to populate realistic test data:

```rust
// Available test scenarios:
1. Inventory Management (Business Process)
2. Remote Collaboration (User Experience) 
3. Student Learning Tracker (Mobile App)
```

#### Persona Generation Data
Use the `create_test_persona_data` command to populate realistic persona test data:

```rust
// Available test personas:
1. Sarah Chen - Retail Small Business Owner (Pain: 4/5)
2. Marcus Rodriguez - Retail Inventory Manager (Pain: 5/5)
3. Jennifer Taylor - Technology Remote Developer (Pain: 3/5)
4. David Kim - Education College Student (Pain: 4/5)
5. Emily Johnson - Healthcare Practice Manager (Pain: 5/5)
```

## Database Consistency

### SQLite (Local Testing)
```rust
// Populate comprehensive test data matching Supabase seed data
let sync_result = populate_sqlite_test_data().await?;

// Verify data consistency 
let verification = verify_test_data_consistency().await?;

// Clear test data when needed
let clear_result = clear_sqlite_test_data().await?;

// Individual command usage:
validate_problem(request) // Creates realistic validation
create_test_problem_data(project_id) // Populates full test suite
```

### Supabase (Cloud Testing)
```sql
-- Run the migration
supabase migration up

-- Load seed data (contains identical test data structure)
supabase db seed
```

### Database Synchronization Process

Our system maintains identical test data across both SQLite and Supabase databases:

#### Synchronized Test Data Includes:
- **1 Test User**: `test@example.com` with consistent UUID
- **1 Test Workspace**: "Test Workspace" with folder path
- **3 Test Projects**: 
  - "Inventory Management System" (persona_generation stage)
  - "Remote Collaboration Platform" (solution_selection stage)
  - "Educational Progress Tracker" (user_stories stage)
- **3 Core Problems**: Inventory, collaboration, and learning tracking scenarios
- **5 Test Personas**: Sarah Chen, Marcus Rodriguez, Jennifer Taylor, David Kim, Emily Johnson
- **6 Pain Points**: Distributed across personas with severity and impact areas
- **6 Key Solutions**: Smart systems with complexity ratings and selection status
- **7 Solution-Pain Point Mappings**: With relevance scores (0.85-0.95)
- **4 User Stories**: Complete acceptance criteria for inventory and collaboration scenarios
- **2 Canvas States**: Visual workflow diagrams with nodes and edges for comprehensive testing

#### Data Structure Consistency:
- **UUID Format**: Consistent IDs across both databases (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Type Mapping**: PostgreSQL BOOLEAN → SQLite INTEGER, JSONB → TEXT, UUID → TEXT
- **Relationships**: Proper foreign key constraints and cascading deletes
- **Timestamps**: Automatic creation timestamps in both systems

## Example Mock Data

### Problem Validation Response
```json
{
  "is_valid": true,
  "validated_problem": "Business Process Optimization: Small businesses struggle to manage their inventory efficiently, leading to stockouts and overstock situations. This challenge affects operational efficiency and requires systematic analysis to identify key personas and solution pathways.",
  "feedback": "Excellent problem statement! The core issue is clearly defined and provides a solid foundation for persona generation. Key strengths: problem scope is well-defined, target context is clear, and the impact is evident.",
  "suggestions": [
    "Consider adding specific metrics or KPIs to measure success",
    "Include potential user segments that might be affected differently",
    "Think about seasonal or temporal factors that might influence the problem",
    "Consider the technical complexity and resource requirements"
  ]
}
```

### Persona Generation Response
```json
{
  "personas": [
    {
      "id": "uuid-here",
      "name": "Sarah Chen",
      "industry": "Retail",
      "role": "Small Business Owner",
      "pain_degree": 4,
      "position": 0,
      "is_active": true,
      "is_locked": false,
      "generation_batch": "batch_001"
    },
    {
      "id": "uuid-here",
      "name": "Marcus Rodriguez", 
      "industry": "Technology",
      "role": "VP of Engineering",
      "pain_degree": 4,
      "position": 1,
      "is_active": false,
      "is_locked": false,
      "generation_batch": "batch_001"
    }
  ],
  "generation_batch": "batch_001"
}
```

### Test Data Includes
- **3 realistic problem statements** with professional validation
- **5 diverse personas** with distinct industries, roles, and pain degrees
- **Multiple pain points** per persona with severity levels and impact areas
- **Key solutions** with complexity ratings and selection status
- **Solution-pain point mappings** with relevance scores
- **Generation batches** for tracking persona and solution versions
- **Lock/active status** for testing workflow controls

## Usage in Development

### 1. Setting Up Test Environment
```rust
// Option A: Quick setup with comprehensive test data
let sync_result = populate_sqlite_test_data().await?;
println!("Created {} items across {} tables", sync_result.items_synced, sync_result.tables_populated.len());

// Option B: Verify existing data integrity
let verification = verify_test_data_consistency().await?;
println!("Verified: {}", verification.message);

// Option C: Clean slate for fresh testing
let clear_result = clear_sqlite_test_data().await?;
```

### 2. Local Development Workflow
```rust
// Workspace project management
let new_project = create_new_project(CreateProjectRequest {
    workspace_id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
    name: "Test Project".to_string(),
}).await?;

let renamed_project = rename_project(project_id, "Updated Name".to_string()).await?;

let duplicated_project = duplicate_project(DuplicateProjectRequest {
    project_id,
    new_name: "Copy of Project".to_string(),
}).await?;

let export_data = export_project(project_id, "json".to_string()).await?;

// Generate test problem data for a project
let test_problems = create_test_problem_data(project_id, pool).await?;

// Generate test persona data for a core problem
let test_personas = create_test_persona_data(core_problem_id, pool).await?;

// Validate new problems with realistic responses
let validation = validate_problem(request, pool).await?;

// Generate personas with realistic industry/role combinations
let personas_response = generate_personas(request, pool).await?;

// Test persona workflow operations
let locked = lock_persona(persona_id, pool).await?;
let selected_persona = select_persona(core_problem_id, persona_id, project_id, pool).await?;
let filtered_personas = get_personas(filter_options, pool).await?;

// Canvas operations
let canvas_state = save_canvas_state(SaveCanvasRequest { ... }).await?;
let loaded_state = load_canvas_state(project_id).await?;
let layout = calculate_layout(nodes_json).await?;
```

### 3. Testing Workflows
- **Consistent Data**: Same test data structure across SQLite and Supabase
- **Pipeline Testing**: Test problem → persona → solution → canvas workflows
- **UI Component Testing**: Verify components with realistic, professional content
- **Data Integrity**: Validate relationships, constraints, and cascading operations
- **Workflow States**: Test lock/unlock, active/inactive, and selection states

### 4. Demo Scenarios
The system provides 3 complete demo scenarios with full data pipelines:

#### Scenario 1: Inventory Management System
- **Problem**: Small business inventory efficiency challenges
- **Personas**: Sarah Chen (Business Owner), Marcus Rodriguez (Inventory Manager)
- **Solutions**: Smart Prediction System, Real-time Alerts, Multi-location Tracker
- **Pain Points**: Stockouts, capital tied up, location tracking difficulties

#### Scenario 2: Remote Collaboration Platform  
- **Problem**: Remote worker connection and collaboration challenges
- **Personas**: Jennifer Taylor (Remote Developer)
- **Solutions**: Virtual Team Presence Dashboard
- **Pain Points**: Team isolation, communication barriers

#### Scenario 3: Educational Progress Tracker
- **Problem**: Student learning progress and study habit tracking
- **Personas**: David Kim (College Student), Emily Johnson (Practice Manager)
- **Solutions**: Study Progress Tracker, Smart Scheduling System
- **Pain Points**: Focus management, scheduling conflicts

Each scenario includes:
- Complete persona → pain point → solution workflows
- Realistic industry/role combinations with appropriate pain degrees
- Solution-pain point mappings with relevance scores
- Professional validation feedback and suggestions

## Data Relationships

The mock data maintains proper relationships:
```
Project
├── Core Problems (versioned)
│   ├── Personas (with industry/role/pain_degree)
│   │   ├── Pain Points (with severity/impact_area)
│   │   └── Solutions (with complexity/selection_status)
│   │       └── Solution-Pain Point Mappings (with relevance_scores)
│   └── Generation Batches (for tracking versions)
│       ├── Lock Status (for workflow control)
│       └── Active Status (for selection tracking)
```

## Available Commands

### Workspace Management Commands
- `create_new_project` - Create new project with default state
- `delete_project_with_data` - Delete project and all related data (cascading)
- `rename_project` - Rename an existing project
- `duplicate_project` - Create complete copy of project with all related data
- `import_project` - Import project from external JSON data
- `export_project` - Export project with all data to structured JSON format

### Problem Commands
- `validate_problem` - Enhanced validation with context-aware responses
- `save_problem_validation` - Direct database storage with workflow progression
- `get_problem_history` - Versioned problem retrieval
- `create_test_problem_data` - Consistent test data generation

### Persona Commands  
- `generate_personas` - Creates 5 realistic personas with industry/role matching
- `regenerate_personas` - Respects locked personas, generates new alternatives
- `lock_persona` - Toggle lock status for workflow testing
- `select_persona` - Set active persona and progress workflow
- `get_personas` - Filtered retrieval with lock/active status options
- `create_test_persona_data` - Comprehensive persona test data with pain points

### Canvas Commands
- `save_canvas_state` - Enhanced canvas state persistence with validation
- `load_canvas_state` - Retrieve latest canvas state with fallback to empty state
- `export_canvas_image` - Canvas image export (placeholder - requires rendering library)
- `calculate_layout` - Hierarchical layout calculation for canvas nodes

### Data Synchronization Commands
- `populate_sqlite_test_data` - Populate SQLite with comprehensive test data matching Supabase
- `verify_test_data_consistency` - Verify data integrity and completeness
- `clear_sqlite_test_data` - Clean up all test data from SQLite database

## Benefits

1. **Realistic Testing**: Professional-quality data that represents real use cases
2. **Database Consistency**: Identical data structure and content across SQLite/Supabase  
3. **Development Speed**: Pre-populated scenarios for immediate testing
4. **Demo Ready**: Polished data for presentations and user testing
5. **Regression Testing**: Consistent baseline for validating changes

## Testing the Complete System

### End-to-End Testing Process

1. **Initialize Environment**
```rust
// Start with clean database
let clear_result = clear_sqlite_test_data().await?;

// Populate comprehensive test data  
let sync_result = populate_sqlite_test_data().await?;
assert!(sync_result.items_synced > 20); // Should create 25+ items

// Verify data consistency
let verification = verify_test_data_consistency().await?;
assert!(verification.message.contains("consistency verified"));
```

2. **Test Workspace Management Workflows**
```rust
// Test project creation and management
let workspace_id = "550e8400-e29b-41d4-a716-446655440001";
let new_project = create_new_project(CreateProjectRequest {
    workspace_id: workspace_id.to_string(),
    name: "Test Project Creation".to_string(),
}).await?;
assert_eq!(new_project.status, "problem_input");
assert_eq!(new_project.current_step, "problem_input");

// Test project duplication
let duplicated = duplicate_project(DuplicateProjectRequest {
    project_id: new_project.id.clone(),
    new_name: "Duplicated Project".to_string(),
}).await?;
assert_ne!(duplicated.id, new_project.id);
assert_eq!(duplicated.name, "Duplicated Project");

// Test project export/import cycle
let export_data = export_project(new_project.id.clone(), "json".to_string()).await?;
assert!(!export_data.data.is_empty());

let imported = import_project(ImportProjectRequest {
    workspace_id: workspace_id.to_string(),
    project_data: export_data.data,
    format: "json".to_string(),
}).await?;
assert_eq!(imported.workspace_id, workspace_id);
```

3. **Test Core Workflows**
```rust
// Test problem validation workflow
let project_id = "550e8400-e29b-41d4-a716-446655440002";
let problem_history = get_problem_history(project_id).await?;
assert!(!problem_history.is_empty());

// Test persona selection workflow  
let core_problem_id = "550e8400-e29b-41d4-a716-446655440003";
let personas = get_personas(core_problem_id).await?;
assert_eq!(personas.len(), 5);

// Test active persona selection
let sarah_persona_id = "550e8400-e29b-41d4-a716-446655440006";
let selection_result = select_persona(core_problem_id, sarah_persona_id, project_id).await?;
assert!(selection_result.is_active);
```

4. **Test Canvas Integration**
```rust
// Test canvas state persistence with comprehensive data
let canvas_request = SaveCanvasRequest {
    project_id: project_id.to_string(),
    nodes: serde_json::json!([
        {"id": "problem-1", "type": "problem", "position": {"x": 100, "y": 300}},
        {"id": "persona-1", "type": "persona", "position": {"x": 400, "y": 200}},
        {"id": "pain-1", "type": "painPoint", "position": {"x": 700, "y": 150}},
        {"id": "solution-1", "type": "solution", "position": {"x": 1000, "y": 200}}
    ]),
    edges: serde_json::json!([
        {"id": "e1", "source": "problem-1", "target": "persona-1", "type": "smoothstep"},
        {"id": "e2", "source": "persona-1", "target": "pain-1", "type": "smoothstep"},
        {"id": "e3", "source": "pain-1", "target": "solution-1", "type": "smoothstep"}
    ]),
    viewport: Some(serde_json::json!({"x": 0, "y": 0, "zoom": 0.8}))
};

let save_result = save_canvas_state(canvas_request).await?;
let loaded_state = load_canvas_state(project_id).await?;
assert!(loaded_state.nodes.is_array());
assert!(loaded_state.edges.is_array());

// Test layout calculation with hierarchical positioning
let layout = calculate_layout(loaded_state.nodes).await?;
assert!(!layout.nodes.is_empty());
assert!(layout.nodes.iter().any(|node| 
    node["position"]["x"].as_f64().unwrap() == 1000.0 // Solutions at x=1000
));

// Test pre-populated canvas states from test data
let inventory_canvas = load_canvas_state("550e8400-e29b-41d4-a716-446655440002").await?;
assert!(!inventory_canvas.nodes.is_null());
let collaboration_canvas = load_canvas_state("550e8400-e29b-41d4-a716-446655440030").await?;
assert!(!collaboration_canvas.nodes.is_null());
```

5. **Verify Database Relationships and Data Integrity**
```rust
// Test that relationships are properly maintained across all projects
let all_projects = ["550e8400-e29b-41d4-a716-446655440002", 
                   "550e8400-e29b-41d4-a716-446655440030", 
                   "550e8400-e29b-41d4-a716-446655440031"];

for project_id in all_projects {
    let solutions_with_mappings = get_solutions_with_mappings(project_id).await?;
    assert!(solutions_with_mappings.iter().any(|(solution, mappings)| {
        solution.is_selected && !mappings.is_empty()
    }));
    
    // Verify user stories exist for projects
    let user_stories = get_user_stories(project_id).await?;
    if project_id != "550e8400-e29b-41d4-a716-446655440031" {
        assert!(!user_stories.is_empty(), "Project should have user stories");
    }
    
    // Verify canvas states exist
    let canvas_state = get_latest_canvas_state(project_id).await?;
    if project_id != "550e8400-e29b-41d4-a716-446655440031" {
        assert!(canvas_state.is_some(), "Project should have canvas state");
    }
}

// Test cascading operations work properly
let sarah_persona_id = "550e8400-e29b-41d4-a716-446655440006";
let pain_points = get_pain_points(sarah_persona_id).await?;
assert!(!pain_points.is_empty());

// Test project duplication maintains relationships
let original_project_data = gather_project_data(project_id).await?;
let duplicated_project_data = gather_project_data(&duplicated.id).await?;
assert_eq!(original_project_data.personas.len(), duplicated_project_data.personas.len());
assert_eq!(original_project_data.solutions.len(), duplicated_project_data.solutions.len());
```

### Continuous Integration Testing

For CI/CD pipelines, run these commands in sequence:

```bash
# 1. Ensure databases are synchronized
cargo test populate_sqlite_test_data
cargo test verify_test_data_consistency

# 2. Test workspace management operations
cargo test create_new_project
cargo test duplicate_project
cargo test export_project
cargo test import_project
cargo test delete_project_with_data

# 3. Test all command workflows
cargo test validate_problem
cargo test generate_personas  
cargo test create_solutions

# 4. Test canvas operations
cargo test save_canvas_state
cargo test calculate_layout
cargo test load_canvas_state

# 5. Test data integrity and relationships
cargo test verify_test_data_consistency
cargo test gather_project_data

# 6. Clean up after tests
cargo test clear_sqlite_test_data
```

## Next Steps

### Phase 1: Integration with Supabase Edge Functions
1. Replace mock validation logic with API calls to Supabase Edge Functions
2. Keep the same data structure and response format for consistency
3. Use synchronized test data for API development and validation
4. Maintain identical data structure between mock and live data

### Phase 2: Real-time Synchronization
1. Implement real-time sync between SQLite and Supabase
2. Add conflict resolution for concurrent edits
3. Implement offline-first capabilities with sync on reconnection
4. Add data versioning and change tracking

### Phase 3: Enhanced Canvas Features  
1. Implement canvas image export with rendering library
2. Add advanced layout algorithms (force-directed, hierarchical)
3. Support custom node types and styling
4. Add collaborative editing capabilities

## Enhanced Features Summary

### Workspace Management System
The comprehensive workspace management system provides:
- **Project Lifecycle Management**: Create, rename, duplicate, delete projects with complete data integrity
- **Data Import/Export**: JSON-based project export with all related data (problems, personas, solutions, user stories, canvas states)
- **Advanced Duplication**: Full project copying with new UUIDs maintaining all relationships
- **Transaction Safety**: All operations use database transactions to ensure data consistency

### Enhanced Test Data Infrastructure  
- **Multi-Project Testing**: 3 distinct projects covering different workflow stages
- **Complete Workflow Coverage**: From problem validation through user story creation
- **Visual Canvas Testing**: Pre-populated canvas states with nodes, edges, and viewport settings
- **Comprehensive User Stories**: Real acceptance criteria for thorough feature testing
- **Cross-Database Consistency**: Identical data structure in both SQLite and Supabase

### Advanced Canvas System
- **Hierarchical Layout**: Automatic node positioning by type (problem→persona→pain→solution)
- **State Persistence**: Enhanced JSON validation and UUID generation for canvas states
- **Visual Workflow Testing**: Pre-built canvas diagrams for immediate testing
- **Layout Calculation**: Smart positioning algorithms for node arrangement

### Database Architecture Benefits
- **Referential Integrity**: Proper cascading deletes and relationship maintenance
- **Type Safety**: Strong typing across Rust structures and database schemas
- **Version Control**: Data versioning for problems and solution generations
- **Workflow Tracking**: Status and step progression through the development process

This infrastructure provides a robust foundation for testing complex workflow scenarios, ensuring data consistency, and validating the complete problem validation pipeline from initial input through final feature definition. 