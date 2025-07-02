# Prob - Entity Relationship Diagram

## Core Tables

### 1. **users**
Stores user authentication and profile information.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. **workspaces**
Represents the folders/directories in the left sidebar.
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    folder_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);
```

### 3. **projects**
Each problem-to-product workflow within a workspace.
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'problem_input',
    current_step TEXT DEFAULT 'problem_input',
    langgraph_state JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Problem Analysis Tables

### 4. **core_problems**
Stores the validated core problem statement.
```sql
CREATE TABLE core_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid BOOLEAN DEFAULT FALSE,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. **personas**
The 5 generated personas for each core problem.
```sql
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    core_problem_id UUID REFERENCES core_problems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    role TEXT NOT NULL,
    pain_degree INTEGER CHECK (pain_degree >= 1 AND pain_degree <= 5),
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_personas_active ON personas(core_problem_id, is_active);
CREATE INDEX idx_personas_batch ON personas(generation_batch);
```

### 6. **pain_points**
The 3 pain points for the selected persona.
```sql
CREATE TABLE pain_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT,
    impact_area TEXT,
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. **key_solutions**
The 5 generated solutions.
```sql
CREATE TABLE key_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    solution_type TEXT,
    complexity TEXT,
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_selected BOOLEAN DEFAULT FALSE,
    generation_batch TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8. **solution_pain_point_mappings**
Many-to-many relationship between solutions and pain points.
```sql
CREATE TABLE solution_pain_point_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solution_id UUID REFERENCES key_solutions(id) ON DELETE CASCADE,
    pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
    relevance_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(solution_id, pain_point_id)
);
```

## User Story & Architecture Tables

### 9. **user_stories**
The 6 generated user stories.
```sql
CREATE TABLE user_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    as_a TEXT NOT NULL,
    i_want TEXT NOT NULL,
    so_that TEXT NOT NULL,
    acceptance_criteria JSONB,
    priority TEXT,
    complexity_points INTEGER,
    position INTEGER NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    original_content TEXT,
    edited_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. **system_architecture**
Tech stack recommendations.
```sql
CREATE TABLE system_architecture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    technology TEXT NOT NULL,
    justification TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. **data_flows**
Data flow diagrams for each user story.
```sql
CREATE TABLE data_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE data_flow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_flow_id UUID REFERENCES data_flows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    data_payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. **database_schema**
Entity relationship diagram data.
```sql
CREATE TABLE database_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE database_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES database_tables(id) ON DELETE CASCADE,
    column_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    is_primary_key BOOLEAN DEFAULT FALSE,
    is_foreign_key BOOLEAN DEFAULT FALSE,
    references_table TEXT,
    constraints JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE database_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    from_table TEXT NOT NULL,
    to_table TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13. **ui_screens**
Screen definitions and components.
```sql
CREATE TABLE ui_screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL,
    description TEXT,
    route_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ui_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screen_id UUID REFERENCES ui_screens(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    component_type TEXT,
    data_displayed TEXT,
    props JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 14. **design_system**
Design tokens and component library.
```sql
CREATE TABLE design_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token_category TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atomic_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    component_level TEXT NOT NULL, -- atom, molecule, organism
    component_name TEXT NOT NULL,
    description TEXT,
    props JSONB,
    composed_of JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## State Management Tables

### 15. **langgraph_execution_logs**
Track LangGraph node executions.
```sql
CREATE TABLE langgraph_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    node_name TEXT NOT NULL,
    input_state JSONB,
    output_state JSONB,
    execution_time_ms INTEGER,
    status TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 16. **react_flow_states**
Store React Flow node positions and UI state.
```sql
CREATE TABLE react_flow_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    viewport JSONB,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 17. **langgraph_state_events**
Event sourcing for LangGraph state management and version control.
```sql
CREATE TABLE langgraph_state_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    event_metadata JSONB,
    sequence_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
```

### 18. **canvas_states**
Canvas state storage for React Flow interface.
```sql
CREATE TABLE canvas_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    viewport JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Core problem lookups
CREATE INDEX idx_core_problems_project ON core_problems(project_id);

-- Persona queries
CREATE INDEX idx_personas_core_problem ON personas(core_problem_id);
CREATE INDEX idx_personas_locked ON personas(core_problem_id, is_locked);

-- Pain point queries
CREATE INDEX idx_pain_points_persona ON pain_points(persona_id);

-- Solution queries
CREATE INDEX idx_solutions_project ON key_solutions(project_id);
CREATE INDEX idx_solutions_persona ON key_solutions(persona_id);
CREATE INDEX idx_solutions_selected ON key_solutions(project_id, is_selected);

-- Mapping queries
CREATE INDEX idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

-- User story queries
CREATE INDEX idx_user_stories_project ON user_stories(project_id);

-- Flow state queries
CREATE INDEX idx_flow_states_project ON react_flow_states(project_id, created_at DESC);

-- State event queries
CREATE INDEX idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX idx_state_events_type ON langgraph_state_events(project_id, event_type);

-- Canvas state queries
CREATE INDEX idx_canvas_states_project ON canvas_states(project_id);

-- Project and workspace queries
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
```

## Row Level Security (RLS) Policies

All tables require RLS policies for multi-tenant security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solution_pain_point_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE langgraph_state_events ENABLE ROW LEVEL SECURITY;

-- Example policy (users can manage own record)
CREATE POLICY "Users can manage own record" ON users FOR ALL 
USING (auth.uid() = id);

-- Example policy (users can manage own workspaces)
CREATE POLICY "Users can manage own workspaces" ON workspaces FOR ALL 
USING (auth.uid() = user_id);
```

## Triggers for Timestamp Updates

```sql
-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at columns
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canvas_states_updated_at BEFORE UPDATE ON canvas_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Key Relationships Summary

1. **One-to-Many Relationships:**
   - users → workspaces
   - workspaces → projects
   - projects → core_problems
   - core_problems → personas
   - personas → pain_points
   - personas → key_solutions
   - projects → user_stories
   - user_stories → data_flows
   - data_flows → data_flow_steps
   - projects → canvas_states
   - projects → langgraph_state_events

2. **Many-to-Many Relationships:**
   - key_solutions ↔ pain_points (via solution_pain_point_mappings)

3. **Important Business Rules:**
   - Only one persona can be active at a time per project
   - Solutions must be selected before proceeding to user stories
   - Lock status prevents regeneration of specific items
   - Generation batches track which items were created together
   - Edited user stories maintain both original and edited content
   - Event sourcing maintains complete audit trail via langgraph_state_events
   - Canvas states track React Flow UI positioning and configuration

## Data Flow for Key Operations

### 1. Problem Submission Flow
```sql
-- Insert new project
INSERT INTO projects (workspace_id, name) VALUES (?, ?);

-- Insert core problem validation attempt
INSERT INTO core_problems (project_id, original_input, validated_problem, is_valid, validation_feedback) 
VALUES (?, ?, ?, ?, ?);

-- Log state event
INSERT INTO langgraph_state_events (project_id, event_type, event_data, sequence_number)
VALUES (?, 'problem_validated', ?, ?);

-- If valid, generate personas
INSERT INTO personas (core_problem_id, name, industry, role, pain_degree, position, generation_batch)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### 2. Persona Selection Flow
```sql
-- Mark persona as active
UPDATE personas SET is_active = TRUE WHERE id = ?;
UPDATE personas SET is_active = FALSE WHERE core_problem_id = ? AND id != ?;

-- Log state change
INSERT INTO langgraph_state_events (project_id, event_type, event_data, sequence_number)
VALUES (?, 'persona_selected', ?, ?);

-- Generate pain points
INSERT INTO pain_points (persona_id, description, position, generation_batch)
VALUES (?, ?, ?, ?);

-- Generate solutions with mappings
INSERT INTO key_solutions (...) VALUES (...);
INSERT INTO solution_pain_point_mappings (solution_id, pain_point_id) VALUES (?, ?);
```

### 3. Canvas State Management
```sql
-- Save canvas state
INSERT INTO canvas_states (project_id, nodes, edges, viewport)
VALUES (?, ?, ?, ?)
ON CONFLICT (project_id) DO UPDATE SET
    nodes = EXCLUDED.nodes,
    edges = EXCLUDED.edges,
    viewport = EXCLUDED.viewport,
    updated_at = NOW();
```

This schema provides a robust foundation for tracking all state transitions, maintaining data integrity, supporting complex workflows, and ensuring proper multi-tenant security through RLS policies.