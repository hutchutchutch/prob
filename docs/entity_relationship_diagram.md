# Prob - Entity Relationship Diagram

## Core Tables

### 1. **users**
Stores user authentication and profile information.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **workspaces**
Represents the folders/directories in the left sidebar.
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    folder_path VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```

### 3. **projects**
Each problem-to-product workflow within a workspace.
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'problem_input',
    current_step VARCHAR(50) DEFAULT 'problem_input',
    langgraph_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Problem Analysis Tables

### 4. **core_problems**
Stores the validated core problem statement.
```sql
CREATE TABLE core_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid BOOLEAN DEFAULT false,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, version)
);
```

### 5. **personas**
The 5 generated personas for each core problem.
```sql
CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    core_problem_id UUID REFERENCES core_problems(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    pain_degree INTEGER CHECK (pain_degree >= 1 AND pain_degree <= 5),
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT false,
    generation_batch UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_personas_active ON personas(core_problem_id, is_active);
CREATE INDEX idx_personas_batch ON personas(generation_batch);
```

### 6. **pain_points**
The 3 pain points for the selected persona.
```sql
CREATE TABLE pain_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity VARCHAR(50),
    impact_area VARCHAR(255),
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    generation_batch UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. **key_solutions**
The 5 generated solutions.
```sql
CREATE TABLE key_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    solution_type VARCHAR(50),
    complexity VARCHAR(50),
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    is_selected BOOLEAN DEFAULT false,
    generation_batch UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. **solution_pain_point_mappings**
Many-to-many relationship between solutions and pain points.
```sql
CREATE TABLE solution_pain_point_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID REFERENCES key_solutions(id) ON DELETE CASCADE,
    pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(solution_id, pain_point_id)
);
```

## User Story & Architecture Tables

### 9. **user_stories**
The 6 generated user stories.
```sql
CREATE TABLE user_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    as_a TEXT NOT NULL,
    i_want TEXT NOT NULL,
    so_that TEXT NOT NULL,
    acceptance_criteria TEXT[],
    priority VARCHAR(50),
    complexity_points INTEGER,
    position INTEGER NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    original_content TEXT,
    edited_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. **system_architecture**
Tech stack recommendations.
```sql
CREATE TABLE system_architecture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    layer VARCHAR(50) NOT NULL,
    technology VARCHAR(255) NOT NULL,
    justification TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 11. **data_flows**
Data flow diagrams for each user story.
```sql
CREATE TABLE data_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_flow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_flow_id UUID REFERENCES data_flows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    data_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 12. **database_schema**
Entity relationship diagram data.
```sql
CREATE TABLE database_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE database_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES database_tables(id) ON DELETE CASCADE,
    column_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(100) NOT NULL,
    is_primary_key BOOLEAN DEFAULT false,
    is_foreign_key BOOLEAN DEFAULT false,
    references_table VARCHAR(255),
    constraints TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE database_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    from_table VARCHAR(255) NOT NULL,
    to_table VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 13. **ui_screens**
Screen definitions and components.
```sql
CREATE TABLE ui_screens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    screen_name VARCHAR(255) NOT NULL,
    description TEXT,
    route_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ui_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id UUID REFERENCES ui_screens(id) ON DELETE CASCADE,
    component_name VARCHAR(255) NOT NULL,
    component_type VARCHAR(50),
    data_displayed TEXT,
    props JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 14. **design_system**
Design tokens and component library.
```sql
CREATE TABLE design_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token_category VARCHAR(50) NOT NULL,
    token_name VARCHAR(100) NOT NULL,
    token_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE atomic_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    component_level VARCHAR(50) NOT NULL, -- atom, molecule, organism
    component_name VARCHAR(255) NOT NULL,
    description TEXT,
    props JSONB,
    composed_of TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## State Management Tables

### 15. **langgraph_execution_logs**
Track LangGraph node executions.
```sql
CREATE TABLE langgraph_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    node_name VARCHAR(100) NOT NULL,
    input_state JSONB,
    output_state JSONB,
    execution_time_ms INTEGER,
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 16. **react_flow_states**
Store React Flow node positions and UI state.
```sql
CREATE TABLE react_flow_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    viewport JSONB,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_solutions_selected ON key_solutions(project_id, is_selected);

-- Mapping queries
CREATE INDEX idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

-- User story queries
CREATE INDEX idx_user_stories_project ON user_stories(project_id);

-- Flow state queries
CREATE INDEX idx_flow_states_project ON react_flow_states(project_id, created_at DESC);
```

## Key Relationships Summary

1. **One-to-Many Relationships:**
   - users → workspaces
   - workspaces → projects
   - projects → core_problems (versioned)
   - core_problems → personas
   - personas → pain_points
   - personas → key_solutions
   - projects → user_stories
   - user_stories → data_flows
   - data_flows → data_flow_steps

2. **Many-to-Many Relationships:**
   - key_solutions ↔ pain_points (via solution_pain_point_mappings)

3. **Important Business Rules:**
   - Only one persona can be active at a time per project
   - Solutions must be selected before proceeding to user stories
   - Lock status prevents regeneration of specific items
   - Generation batches track which items were created together
   - Edited user stories maintain both original and edited content

## Data Flow for Key Operations

### 1. Problem Submission Flow
```sql
-- Insert new project
INSERT INTO projects (workspace_id, name) VALUES (?, ?);

-- Insert core problem validation attempt
INSERT INTO core_problems (project_id, original_input, validated_problem, is_valid, validation_feedback) 
VALUES (?, ?, ?, ?, ?);

-- If valid, generate personas
INSERT INTO personas (core_problem_id, name, industry, role, pain_degree, position, generation_batch)
VALUES (?, ?, ?, ?, ?, ?, ?);
```

### 2. Persona Selection Flow
```sql
-- Mark persona as active
UPDATE personas SET is_active = true WHERE id = ?;
UPDATE personas SET is_active = false WHERE core_problem_id = ? AND id != ?;

-- Generate pain points
INSERT INTO pain_points (persona_id, description, position, generation_batch)
VALUES (?, ?, ?, ?);

-- Generate solutions with mappings
INSERT INTO key_solutions (...) VALUES (...);
INSERT INTO solution_pain_point_mappings (solution_id, pain_point_id) VALUES (?, ?);
```

### 3. Regeneration Flow (with locks)
```sql
-- Delete non-locked items and regenerate
DELETE FROM personas WHERE core_problem_id = ? AND is_locked = false;
-- Then insert new personas...

-- Similar pattern for pain_points and key_solutions
```

This schema provides a robust foundation for tracking all state transitions, maintaining data integrity, and supporting the complex workflows in your problem-to-product application.