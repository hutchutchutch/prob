-- SQLite Schema for Prob
-- Optimized for local storage with proper SQLite types

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Users table (local cache of authenticated user)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    folder_path TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, name)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    workspace_id TEXT REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'problem_input',
    current_step TEXT DEFAULT 'problem_input',
    langgraph_state TEXT, -- JSON
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Core problems table
CREATE TABLE IF NOT EXISTS core_problems (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid INTEGER DEFAULT 0,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(project_id, version)
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
    id TEXT PRIMARY KEY,
    core_problem_id TEXT REFERENCES core_problems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    role TEXT NOT NULL,
    pain_degree INTEGER CHECK (pain_degree >= 1 AND pain_degree <= 5),
    position INTEGER NOT NULL,
    is_locked INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 0,
    generation_batch TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Pain points table
CREATE TABLE IF NOT EXISTS pain_points (
    id TEXT PRIMARY KEY,
    persona_id TEXT REFERENCES personas(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT,
    impact_area TEXT,
    position INTEGER NOT NULL,
    is_locked INTEGER DEFAULT 0,
    generation_batch TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Key solutions table
CREATE TABLE IF NOT EXISTS key_solutions (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    persona_id TEXT REFERENCES personas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    solution_type TEXT,
    complexity TEXT,
    position INTEGER NOT NULL,
    is_locked INTEGER DEFAULT 0,
    is_selected INTEGER DEFAULT 0,
    generation_batch TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Solution to pain point mappings
CREATE TABLE IF NOT EXISTS solution_pain_point_mappings (
    id TEXT PRIMARY KEY,
    solution_id TEXT REFERENCES key_solutions(id) ON DELETE CASCADE,
    pain_point_id TEXT REFERENCES pain_points(id) ON DELETE CASCADE,
    relevance_score REAL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(solution_id, pain_point_id)
);

-- User stories table
CREATE TABLE IF NOT EXISTS user_stories (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    as_a TEXT NOT NULL,
    i_want TEXT NOT NULL,
    so_that TEXT NOT NULL,
    acceptance_criteria TEXT, -- JSON array
    priority TEXT,
    complexity_points INTEGER,
    position INTEGER NOT NULL,
    is_edited INTEGER DEFAULT 0,
    original_content TEXT,
    edited_content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- System architecture table
CREATE TABLE IF NOT EXISTS system_architecture (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    technology TEXT NOT NULL,
    justification TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Data flows table
CREATE TABLE IF NOT EXISTS data_flows (
    id TEXT PRIMARY KEY,
    user_story_id TEXT REFERENCES user_stories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Data flow steps table
CREATE TABLE IF NOT EXISTS data_flow_steps (
    id TEXT PRIMARY KEY,
    data_flow_id TEXT REFERENCES data_flows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    data_payload TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Database schema tables
CREATE TABLE IF NOT EXISTS database_tables (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS database_columns (
    id TEXT PRIMARY KEY,
    table_id TEXT REFERENCES database_tables(id) ON DELETE CASCADE,
    column_name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    is_primary_key INTEGER DEFAULT 0,
    is_foreign_key INTEGER DEFAULT 0,
    references_table TEXT,
    constraints TEXT, -- JSON array
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS database_relationships (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    from_table TEXT NOT NULL,
    to_table TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- UI screens table
CREATE TABLE IF NOT EXISTS ui_screens (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL,
    description TEXT,
    route_path TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- UI components table
CREATE TABLE IF NOT EXISTS ui_components (
    id TEXT PRIMARY KEY,
    screen_id TEXT REFERENCES ui_screens(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    component_type TEXT,
    data_displayed TEXT,
    props TEXT, -- JSON
    created_at TEXT DEFAULT (datetime('now'))
);

-- Design system tables
CREATE TABLE IF NOT EXISTS design_tokens (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    token_category TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_value TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS atomic_components (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    component_level TEXT NOT NULL, -- atom, molecule, organism
    component_name TEXT NOT NULL,
    description TEXT,
    props TEXT, -- JSON
    composed_of TEXT, -- JSON array
    created_at TEXT DEFAULT (datetime('now'))
);

-- State Management Tables

-- LangGraph execution logs
CREATE TABLE IF NOT EXISTS langgraph_execution_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    node_name TEXT NOT NULL,
    input_state TEXT, -- JSON
    output_state TEXT, -- JSON
    execution_time_ms INTEGER,
    status TEXT,
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- React Flow states (separate from canvas_states for versioning)
CREATE TABLE IF NOT EXISTS react_flow_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    viewport TEXT, -- JSON
    nodes TEXT NOT NULL, -- JSON
    edges TEXT NOT NULL, -- JSON
    created_at TEXT DEFAULT (datetime('now'))
);

-- Event sourcing for version control
CREATE TABLE IF NOT EXISTS langgraph_state_events (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data TEXT NOT NULL, -- JSON
    event_metadata TEXT, -- JSON
    sequence_number INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    created_by TEXT REFERENCES users(id)
);

-- Canvas states for React Flow (keeping your original)
CREATE TABLE IF NOT EXISTS canvas_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    nodes TEXT NOT NULL, -- JSON
    edges TEXT NOT NULL, -- JSON
    viewport TEXT, -- JSON
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create indexes for performance

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_project ON core_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_states_project ON canvas_states(project_id);

-- Persona indexes
CREATE INDEX IF NOT EXISTS idx_personas_core_problem ON personas(core_problem_id);
CREATE INDEX IF NOT EXISTS idx_personas_locked ON personas(core_problem_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_personas_active ON personas(core_problem_id, is_active);
CREATE INDEX IF NOT EXISTS idx_personas_batch ON personas(generation_batch);

-- Pain point indexes
CREATE INDEX IF NOT EXISTS idx_pain_points_persona ON pain_points(persona_id);
CREATE INDEX IF NOT EXISTS idx_pain_points_locked ON pain_points(persona_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_pain_points_batch ON pain_points(generation_batch);

-- Solution indexes
CREATE INDEX IF NOT EXISTS idx_solutions_project ON key_solutions(project_id);
CREATE INDEX IF NOT EXISTS idx_solutions_persona ON key_solutions(persona_id);
CREATE INDEX IF NOT EXISTS idx_solutions_selected ON key_solutions(project_id, is_selected);
CREATE INDEX IF NOT EXISTS idx_solutions_batch ON key_solutions(generation_batch);

-- Mapping indexes
CREATE INDEX IF NOT EXISTS idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

-- User story indexes
CREATE INDEX IF NOT EXISTS idx_user_stories_project ON user_stories(project_id);

-- Flow state indexes
CREATE INDEX IF NOT EXISTS idx_flow_states_project ON react_flow_states(project_id, created_at DESC);

-- Event sourcing indexes
CREATE INDEX IF NOT EXISTS idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_state_events_type ON langgraph_state_events(project_id, event_type);

-- Create update triggers
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_workspaces_timestamp 
AFTER UPDATE ON workspaces
BEGIN
    UPDATE workspaces SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_canvas_states_timestamp 
AFTER UPDATE ON canvas_states
BEGIN
    UPDATE canvas_states SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Add auto-increment sequence number trigger for event sourcing
CREATE TRIGGER IF NOT EXISTS auto_increment_sequence_number
BEFORE INSERT ON langgraph_state_events
FOR EACH ROW
WHEN NEW.sequence_number IS NULL
BEGIN
    UPDATE langgraph_state_events 
    SET sequence_number = (
        SELECT COALESCE(MAX(sequence_number), 0) + 1 
        FROM langgraph_state_events 
        WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.id;
END;