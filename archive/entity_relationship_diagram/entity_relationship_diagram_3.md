# Prob - Entity Relationship Diagram (Updated)

## Overview
This updated ERD reflects the separated canvas state architecture and addresses all integration issues identified in the data flow analysis. The schema now fully supports animations, UI state management, comprehensive event sourcing, and all features described in the product vision.

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

## Canvas State Management (Separated Architecture)

### 15. **canvas_states** (Business/Logic State - Version Controlled)
Stores the logical state of the canvas with full version control.
```sql
CREATE TABLE canvas_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Core business data
    nodes JSONB NOT NULL, -- All nodes (personas, problems, solutions, etc.)
    edges JSONB NOT NULL, -- All relationships/connections
    
    -- Business metadata
    workflow_step TEXT NOT NULL,
    step_completed BOOLEAN DEFAULT FALSE,
    locked_items JSONB, -- {personas: [], painPoints: [], solutions: []}
    
    -- Version control
    version INTEGER NOT NULL,
    parent_version_id UUID REFERENCES canvas_states(id),
    change_description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    -- Constraints
    CONSTRAINT unique_version_per_project UNIQUE (project_id, version),
    CONSTRAINT unique_current_state UNIQUE (project_id, is_current) WHERE is_current = TRUE
);

CREATE INDEX idx_canvas_latest_version ON canvas_states(project_id, version DESC);
CREATE INDEX idx_canvas_current_state ON canvas_states(project_id, is_current) WHERE is_current = TRUE;
```

### 16. **react_flow_states** (UI/View State - Not Version Controlled)
Stores the visual/UI state of React Flow, updated frequently without versioning.
```sql
CREATE TABLE react_flow_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- React Flow specific UI state
    viewport JSONB NOT NULL, -- {x, y, zoom}
    minimap_config JSONB, -- {x, y, width, height, displayed}
    controls_config JSONB, -- {showZoom, showFitView, showInteractive}
    
    -- Selection and interaction
    selection_ids TEXT[], -- Currently selected node/edge IDs
    interaction_mode TEXT DEFAULT 'default', -- 'default', 'selection', 'panning', 'locked'
    canvas_locked BOOLEAN DEFAULT FALSE,
    
    -- Animation states
    animation_queue JSONB, -- Pending animations
    active_animations JSONB, -- Currently running animations
    
    -- This changes frequently, no versioning needed
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One active UI state per project
    CONSTRAINT one_ui_state_per_project UNIQUE (project_id)
);

CREATE INDEX idx_react_flow_project ON react_flow_states(project_id);
```

## Animation and UI State Tables

### 17. **ui_animation_states**
Tracks animation states for smooth transitions.
```sql
CREATE TABLE ui_animation_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    element_id TEXT NOT NULL, -- Node or edge ID
    element_type TEXT NOT NULL, -- 'node', 'edge', 'canvas'
    animation_type TEXT NOT NULL, -- 'breathing', 'gold_flash', 'stagger', 'slide'
    animation_config JSONB NOT NULL, -- Timing, easing, properties
    start_state JSONB,
    end_state JSONB,
    duration_ms INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_animation_active ON ui_animation_states(project_id, is_active);
```

### 18. **progress_tracking**
Tracks workflow progress with UI state for progress bar.
```sql
CREATE TABLE progress_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    -- UI state for progress bar
    ui_state JSONB, -- {showPersonaCircles: true, segmentAnimation: 'pulse'}
    persona_circles JSONB, -- Array of persona data for circles display
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_project_step UNIQUE (project_id, step_name)
);

CREATE INDEX idx_progress_current ON progress_tracking(project_id, is_current) WHERE is_current = TRUE;
```

## Enhanced State Management Tables

### 19. **langgraph_execution_logs**
Track LangGraph node executions with enhanced error handling.
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
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 20. **langgraph_state_events** (Enhanced Event Sourcing)
Complete event sourcing with before/after states and diffs.
```sql
CREATE TABLE langgraph_state_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    
    -- Enhanced state tracking
    before_state JSONB,
    after_state JSONB,
    state_diff JSONB,
    
    -- Event metadata
    event_metadata JSONB,
    event_priority INTEGER DEFAULT 0,
    sequence_number INTEGER NOT NULL,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    CONSTRAINT unique_sequence_per_project UNIQUE (project_id, sequence_number)
);

CREATE INDEX idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX idx_state_events_type ON langgraph_state_events(project_id, event_type);
CREATE INDEX idx_state_events_priority ON langgraph_state_events(project_id, event_priority DESC);
```

## Sync and Queue Management

### 21. **sync_queue** (Enhanced with Batch Processing)
Enhanced sync queue with priority and batch support.
```sql
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- 'insert', 'update', 'delete'
    record_id TEXT NOT NULL,
    data JSONB NOT NULL, -- Record data
    
    -- Enhanced queue management
    priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
    batch_id UUID, -- For grouping related operations
    batch_sequence INTEGER, -- Order within batch
    
    -- Retry logic
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    error_message TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_status ON sync_queue(status, priority DESC, created_at);
CREATE INDEX idx_sync_queue_batch ON sync_queue(batch_id, batch_sequence);
CREATE INDEX idx_sync_queue_retry ON sync_queue(status, next_retry_at) WHERE status = 'pending';
```

### 22. **sync_conflicts** (Enhanced Resolution)
Enhanced conflict tracking with resolution strategies.
```sql
CREATE TABLE sync_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    local_data JSONB NOT NULL,
    remote_data JSONB NOT NULL,
    
    -- Enhanced conflict information
    conflict_type TEXT NOT NULL, -- 'update-update', 'delete-update', etc.
    resolution_strategy TEXT, -- 'timestamp', 'manual', 'merge', 'custom'
    auto_resolvable BOOLEAN DEFAULT FALSE,
    
    -- Resolution details
    resolution TEXT, -- 'local', 'remote', 'merged'
    resolution_metadata JSONB, -- Details about how it was resolved
    merged_data JSONB, -- If resolution = 'merged'
    
    -- Timestamps
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_conflicts_unresolved ON sync_conflicts(table_name, resolved_at) WHERE resolved_at IS NULL;
```

## Lock Management

### 23. **lock_management**
Comprehensive lock tracking for all lockable items.
```sql
CREATE TABLE lock_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    lock_type TEXT DEFAULT 'exclusive', -- 'exclusive', 'shared'
    locked_by UUID REFERENCES users(id),
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- Optional lock expiration
    unlock_reason TEXT,
    unlocked_at TIMESTAMPTZ,
    
    -- Ensure only one active lock per record
    CONSTRAINT unique_active_lock UNIQUE (table_name, record_id, unlocked_at)
);

CREATE INDEX idx_locks_active ON lock_management(project_id, table_name) WHERE unlocked_at IS NULL;
CREATE INDEX idx_locks_expired ON lock_management(expires_at) WHERE unlocked_at IS NULL AND expires_at IS NOT NULL;
```

## Export and Sharing

### 24. **export_history**
Track all exports with configuration.
```sql
CREATE TABLE export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL, -- 'markdown', 'json', 'pdf', 'share'
    export_config JSONB, -- Format-specific settings
    file_path TEXT, -- Local file path if applicable
    file_size_bytes BIGINT,
    
    -- Export metadata
    included_sections JSONB, -- Which parts were exported
    export_version TEXT, -- Version of export format
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_exports_project ON export_history(project_id, created_at DESC);
```

### 25. **share_links**
Manage shareable read-only links.
```sql
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE NOT NULL,
    
    -- Access control
    expires_at TIMESTAMPTZ,
    max_access_count INTEGER,
    current_access_count INTEGER DEFAULT 0,
    
    -- Permissions
    allow_download BOOLEAN DEFAULT FALSE,
    visible_sections JSONB, -- Which sections can be viewed
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_accessed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_share_links_token ON share_links(share_token) WHERE is_active = TRUE;
CREATE INDEX idx_share_links_expiry ON share_links(expires_at) WHERE is_active = TRUE;
```

## Demo and Templates

### 26. **demo_templates**
Store demo canvas configurations for welcome screen.
```sql
CREATE TABLE demo_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT NOT NULL,
    template_type TEXT DEFAULT 'welcome', -- 'welcome', 'example', 'tutorial'
    
    -- Canvas configuration
    nodes JSONB NOT NULL, -- Demo nodes configuration
    edges JSONB NOT NULL, -- Demo edges configuration
    viewport JSONB, -- Initial viewport
    
    -- Animation sequence
    animation_sequence JSONB NOT NULL, -- Step-by-step animations
    loop_duration_ms INTEGER DEFAULT 30000, -- 30 seconds default
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0, -- For ordering multiple templates
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_demo_templates_active ON demo_templates(template_type, priority DESC) WHERE is_active = TRUE;
```

## Sidebar and Recent Flows

### 27. **recent_flows_cache**
Cache for sidebar recent problem flows display.
```sql
CREATE TABLE recent_flows_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Display data
    problem_statement TEXT NOT NULL,
    last_activity TIMESTAMPTZ NOT NULL,
    
    -- Progress segments (5 total)
    progress_segments JSONB NOT NULL, -- [{name: 'Problem', complete: true}, ...]
    completion_percentage INTEGER,
    
    -- Cache management
    cache_key TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recent_flows_user ON recent_flows_cache(user_id, last_activity DESC);
CREATE INDEX idx_recent_flows_expiry ON recent_flows_cache(expires_at);
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
ALTER TABLE react_flow_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE langgraph_state_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE lock_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Function to check project ownership
CREATE OR REPLACE FUNCTION is_project_owner(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM projects p
        JOIN workspaces w ON p.workspace_id = w.id
        WHERE p.id = project_id 
        AND w.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example policies for canvas_states (business logic)
CREATE POLICY "Users can view their canvas states" ON canvas_states
    FOR SELECT USING (is_project_owner(project_id));

CREATE POLICY "Users can create canvas states" ON canvas_states
    FOR INSERT WITH CHECK (is_project_owner(project_id));

-- Example policies for react_flow_states (UI state)
CREATE POLICY "Users can manage their UI state" ON react_flow_states
    FOR ALL USING (is_project_owner(project_id));

-- Share link access (public read for valid tokens)
CREATE POLICY "Public can read shared projects" ON canvas_states
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM share_links 
            WHERE share_links.project_id = canvas_states.project_id
            AND share_links.is_active = TRUE
            AND (share_links.expires_at IS NULL OR share_links.expires_at > NOW())
        )
    );
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
CREATE TRIGGER update_react_flow_states_updated_at BEFORE UPDATE ON react_flow_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_tracking_updated_at BEFORE UPDATE ON progress_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demo_templates_updated_at BEFORE UPDATE ON demo_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recent_flows_cache_updated_at BEFORE UPDATE ON recent_flows_cache FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Key Relationships Summary

### One-to-Many Relationships:
- users → workspaces
- workspaces → projects
- projects → core_problems
- projects → canvas_states (versioned)
- projects → react_flow_states (one active)
- core_problems → personas
- personas → pain_points
- personas → key_solutions
- projects → user_stories
- projects → progress_tracking
- projects → export_history
- projects → share_links

### Many-to-Many Relationships:
- key_solutions ↔ pain_points (via solution_pain_point_mappings)

### Important Business Rules:
1. **Canvas State Separation**: 
   - `canvas_states` stores business logic (versioned)
   - `react_flow_states` stores UI state (not versioned)

2. **Animation Management**:
   - UI animations tracked separately from business state
   - Animation queue prevents conflicts

3. **Progress Tracking**:
   - Maintains UI state for progress bar
   - Tracks persona circles display

4. **Event Sourcing**:
   - Complete before/after states
   - State diffs for efficient storage
   - Priority-based event replay

5. **Sync Queue**:
   - Priority-based processing
   - Batch support for related operations
   - Retry logic with exponential backoff

6. **Lock Management**:
   - Comprehensive lock tracking
   - Optional expiration
   - Audit trail of locks

7. **Export & Sharing**:
   - Full export history
   - Granular share permissions
   - Access tracking

This updated schema fully supports all features described in the data flow diagram and product vision, with clear separation of concerns and comprehensive state management.