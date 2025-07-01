-- Initial Schema Migration for Prob
-- PostgreSQL/Supabase Schema matching the SQLite structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (integrated with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    folder_path TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'problem_input',
    current_step TEXT DEFAULT 'problem_input',
    langgraph_state JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core problems table
CREATE TABLE IF NOT EXISTS core_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid BOOLEAN DEFAULT FALSE,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, version)
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
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

-- Pain points table
CREATE TABLE IF NOT EXISTS pain_points (
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

-- Key solutions table
CREATE TABLE IF NOT EXISTS key_solutions (
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

-- Solution to pain point mappings
CREATE TABLE IF NOT EXISTS solution_pain_point_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solution_id UUID REFERENCES key_solutions(id) ON DELETE CASCADE,
    pain_point_id UUID REFERENCES pain_points(id) ON DELETE CASCADE,
    relevance_score DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(solution_id, pain_point_id)
);

-- User stories table
CREATE TABLE IF NOT EXISTS user_stories (
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

-- System architecture table
CREATE TABLE IF NOT EXISTS system_architecture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    technology TEXT NOT NULL,
    justification TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data flows table
CREATE TABLE IF NOT EXISTS data_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_story_id UUID REFERENCES user_stories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data flow steps table
CREATE TABLE IF NOT EXISTS data_flow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_flow_id UUID REFERENCES data_flows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    data_payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database schema tables
CREATE TABLE IF NOT EXISTS database_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS database_columns (
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

CREATE TABLE IF NOT EXISTS database_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    from_table TEXT NOT NULL,
    to_table TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI screens table
CREATE TABLE IF NOT EXISTS ui_screens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL,
    description TEXT,
    route_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI components table
CREATE TABLE IF NOT EXISTS ui_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screen_id UUID REFERENCES ui_screens(id) ON DELETE CASCADE,
    component_name TEXT NOT NULL,
    component_type TEXT,
    data_displayed TEXT,
    props JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design tokens table
CREATE TABLE IF NOT EXISTS design_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token_category TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atomic components table
CREATE TABLE IF NOT EXISTS atomic_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    component_level TEXT NOT NULL,
    component_name TEXT NOT NULL,
    description TEXT,
    props JSONB,
    composed_of JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LangGraph execution logs
CREATE TABLE IF NOT EXISTS langgraph_execution_logs (
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

-- React Flow states
CREATE TABLE IF NOT EXISTS react_flow_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    viewport JSONB,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LangGraph state events
CREATE TABLE IF NOT EXISTS langgraph_state_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    event_metadata JSONB,
    sequence_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

-- Canvas states
CREATE TABLE IF NOT EXISTS canvas_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    viewport JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_project ON core_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_version ON core_problems(project_id, version);
CREATE INDEX IF NOT EXISTS idx_canvas_states_project ON canvas_states(project_id);

CREATE INDEX IF NOT EXISTS idx_personas_core_problem ON personas(core_problem_id); 
CREATE INDEX IF NOT EXISTS idx_personas_locked ON personas(core_problem_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_personas_active ON personas(core_problem_id, is_active);
CREATE INDEX IF NOT EXISTS idx_personas_batch ON personas(generation_batch);

CREATE INDEX IF NOT EXISTS idx_pain_points_persona ON pain_points(persona_id);
CREATE INDEX IF NOT EXISTS idx_pain_points_locked ON pain_points(persona_id, is_locked);
CREATE INDEX IF NOT EXISTS idx_pain_points_batch ON pain_points(generation_batch);

CREATE INDEX IF NOT EXISTS idx_solutions_project ON key_solutions(project_id);
CREATE INDEX IF NOT EXISTS idx_solutions_persona ON key_solutions(persona_id);
CREATE INDEX IF NOT EXISTS idx_solutions_selected ON key_solutions(project_id, is_selected);
CREATE INDEX IF NOT EXISTS idx_solutions_batch ON key_solutions(generation_batch);

CREATE INDEX IF NOT EXISTS idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

CREATE INDEX IF NOT EXISTS idx_user_stories_project ON user_stories(project_id);

CREATE INDEX IF NOT EXISTS idx_flow_states_project ON react_flow_states(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_state_events_type ON langgraph_state_events(project_id, event_type);

-- Row Level Security (RLS) Policies
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

-- Basic RLS policies (can be expanded based on requirements)
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "Users can manage own workspaces" ON workspaces FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage projects in own workspaces" ON projects FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
);

-- Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canvas_states_updated_at BEFORE UPDATE ON canvas_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
