-- SQLite Schema for Prob - Complete Schema with All Features
-- Synchronized with Supabase PostgreSQL schema
-- Includes AI Focus Groups, Document Management, Animation States, and Enhanced Sync

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- =====================================
-- CORE TABLES
-- =====================================

-- Users table (local cache of authenticated user)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
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

-- =====================================
-- PROBLEM ANALYSIS TABLES
-- =====================================

-- Core problems table
CREATE TABLE IF NOT EXISTS core_problems (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    original_input TEXT NOT NULL,
    validated_problem TEXT,
    is_valid INTEGER DEFAULT 0,
    validation_feedback TEXT,
    version INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
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

-- Key solutions table (Enhanced with AI Focus Group results)
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
    
    -- AI Focus Group Results
    voting_results TEXT, -- JSON: {total_votes: number, persona_votes: [{persona_id, votes}]}
    must_have_features TEXT, -- JSON: Array of {persona_id: TEXT, features: [string]}
    
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

-- =====================================
-- AI FOCUS GROUP TABLES
-- =====================================

-- Focus group sessions for AI-driven solution validation
CREATE TABLE IF NOT EXISTS focus_group_sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    session_type TEXT DEFAULT 'dot_voting', -- 'dot_voting', 'discussion', 'prioritization'
    facilitator_config TEXT, -- JSON: LangGraph facilitator settings
    
    -- Voting data
    total_votes_available INTEGER DEFAULT 15, -- 3 per persona × 5 personas
    persona_votes TEXT NOT NULL, -- JSON: [{persona_id, solution_id, votes}]
    
    -- Discussion results
    discussion_topics TEXT, -- JSON: Array of discussion prompts
    discussion_results TEXT, -- JSON: Must-have features by persona/solution
    
    -- Session metadata
    duration_ms INTEGER,
    status TEXT DEFAULT 'completed',
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================
-- USER STORY & ARCHITECTURE TABLES
-- =====================================

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

-- =====================================
-- CANVAS STATE MANAGEMENT (SEPARATED ARCHITECTURE)
-- =====================================

-- Canvas states (Business/Logic State - Version Controlled)
CREATE TABLE IF NOT EXISTS canvas_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Core business data
    nodes TEXT NOT NULL, -- JSON: All nodes (personas, problems, solutions, etc.)
    edges TEXT NOT NULL, -- JSON: All relationships/connections
    
    -- Business metadata
    workflow_step TEXT NOT NULL DEFAULT 'problem_input',
    step_completed INTEGER DEFAULT 0,
    locked_items TEXT DEFAULT '{"personas": [], "painPoints": [], "solutions": []}', -- JSON
    
    -- Version control
    version INTEGER NOT NULL DEFAULT 1,
    parent_version_id TEXT REFERENCES canvas_states(id),
    change_description TEXT,
    is_current INTEGER DEFAULT 0,
    
    -- Original fields (preserved)
    viewport TEXT, -- JSON
    
    -- Audit
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    created_by TEXT
);

-- React Flow states (UI/View State - Not Version Controlled)
CREATE TABLE IF NOT EXISTS react_flow_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    
    -- React Flow specific UI state
    viewport TEXT NOT NULL, -- JSON: {x, y, zoom}
    nodes TEXT NOT NULL, -- JSON: Visual representation of nodes
    edges TEXT NOT NULL, -- JSON: Visual representation of edges
    
    -- Enhanced UI configurations
    minimap_config TEXT, -- JSON: {x, y, width, height, displayed}
    controls_config TEXT, -- JSON: {showZoom, showFitView, showInteractive}
    
    -- Selection and interaction
    selection_ids TEXT, -- JSON array: Currently selected node/edge IDs
    interaction_mode TEXT DEFAULT 'default', -- 'default', 'selection', 'panning', 'locked'
    canvas_locked INTEGER DEFAULT 0,
    
    -- Enhanced animation states
    animation_queue TEXT DEFAULT '[]', -- JSON: Pending animations
    active_animations TEXT DEFAULT '{}', -- JSON: Currently running animations
    animation_settings TEXT DEFAULT '{"enableBreathing": true, "staggerDelay": 150}', -- JSON
    
    -- This changes frequently, no versioning needed
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================
-- ANIMATION AND UI STATE TABLES
-- =====================================

-- UI animation states for smooth transitions
CREATE TABLE IF NOT EXISTS ui_animation_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    element_id TEXT NOT NULL, -- Node or edge ID
    element_type TEXT NOT NULL, -- 'node', 'edge', 'canvas'
    animation_type TEXT NOT NULL, -- 'breathing', 'gold_flash', 'stagger', 'slide'
    animation_config TEXT NOT NULL, -- JSON: Timing, easing, properties
    start_state TEXT, -- JSON
    end_state TEXT, -- JSON
    duration_ms INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Canvas transitions between workflow steps
CREATE TABLE IF NOT EXISTS canvas_transitions (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    from_step TEXT NOT NULL,
    to_step TEXT NOT NULL,
    transition_type TEXT NOT NULL, -- 'slide_left', 'fade', 'zoom_out'
    transition_config TEXT, -- JSON: {duration: 500, easing: 'ease-out', opacity: 0.3}
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- UI selection states for multi-select and visual feedback
CREATE TABLE IF NOT EXISTS ui_selection_states (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    selection_type TEXT NOT NULL, -- 'single', 'multi', 'connected'
    selected_items TEXT NOT NULL, -- JSON: Array of {id, type, glowColor}
    selection_metadata TEXT, -- JSON: {shiftPressed: boolean, connectedHighlights: array}
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Progress tracking with UI state for progress bar
CREATE TABLE IF NOT EXISTS progress_tracking (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    is_complete INTEGER DEFAULT 0,
    is_current INTEGER DEFAULT 0,
    completed_at TEXT,
    
    -- UI state for progress bar
    ui_state TEXT, -- JSON: {showPersonaCircles: boolean, segmentAnimation: string, completedSegments: number[]}
    persona_circles TEXT, -- JSON: Array of {persona_id: TEXT, name: string, color: string, position: number}
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================
-- DOCUMENT MANAGEMENT SYSTEM
-- =====================================

-- Project documents for file system integration
CREATE TABLE IF NOT EXISTS project_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'product_vision', 'requirements', 'architecture', etc.
    file_path TEXT NOT NULL,
    file_hash TEXT, -- For change detection
    last_modified TEXT,
    content TEXT, -- Cached content
    is_synced INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Document generation queue with dependency tracking
CREATE TABLE IF NOT EXISTS document_generation_queue (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    dependencies TEXT, -- JSON: Array of document types that must complete first
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    priority INTEGER DEFAULT 5,
    started_at TEXT,
    completed_at TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Document drift reports for inconsistency tracking
CREATE TABLE IF NOT EXISTS document_drift_reports (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    detected_at TEXT DEFAULT (datetime('now')),
    affected_documents TEXT NOT NULL, -- JSON: Array of document names
    drift_details TEXT NOT NULL, -- JSON: Specific discrepancies found
    drift_severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    resolution_status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'ignored'
    resolution_method TEXT, -- 'update_all', 'update_selected', 'keep_changes', 'revert'
    resolution_metadata TEXT, -- JSON: Details about what was changed
    resolved_at TEXT,
    resolved_by TEXT
);

-- =====================================
-- ENHANCED STATE MANAGEMENT TABLES
-- =====================================

-- LangGraph execution logs (Enhanced with retry count)
CREATE TABLE IF NOT EXISTS langgraph_execution_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    node_name TEXT NOT NULL,
    input_state TEXT, -- JSON
    output_state TEXT, -- JSON
    execution_time_ms INTEGER,
    status TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Event sourcing for version control (Enhanced with before/after states)
CREATE TABLE IF NOT EXISTS langgraph_state_events (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data TEXT NOT NULL, -- JSON
    
    -- Enhanced state tracking
    before_state TEXT, -- JSON
    after_state TEXT, -- JSON
    state_diff TEXT, -- JSON
    
    -- Event metadata
    event_metadata TEXT, -- JSON
    event_priority INTEGER DEFAULT 0,
    sequence_number INTEGER NOT NULL,
    
    -- Audit
    created_at TEXT DEFAULT (datetime('now')),
    created_by TEXT
);

-- Registry of available Supabase Edge Functions
CREATE TABLE IF NOT EXISTS edge_function_registry (
    id TEXT PRIMARY KEY,
    function_name TEXT UNIQUE NOT NULL, -- 'problem-validation', 'generate-personas', etc.
    function_version TEXT NOT NULL,
    function_url TEXT NOT NULL,
    input_schema TEXT, -- JSON: Expected input format
    output_schema TEXT, -- JSON: Expected output format
    dependencies TEXT, -- JSON: Other functions it depends on
    timeout_ms INTEGER DEFAULT 30000,
    max_retries INTEGER DEFAULT 3,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================
-- SYNC AND QUEUE MANAGEMENT
-- =====================================

-- Sync batches for grouping related operations
CREATE TABLE IF NOT EXISTS sync_batches (
    id TEXT PRIMARY KEY,
    batch_type TEXT NOT NULL, -- 'persona_generation', 'document_update', etc.
    total_operations INTEGER NOT NULL,
    completed_operations INTEGER DEFAULT 0,
    status TEXT DEFAULT 'processing', -- 'pending', 'processing', 'completed', 'failed'
    metadata TEXT, -- JSON: Additional batch information
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
);

-- Enhanced sync queue with priority and batch support
CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- 'insert', 'update', 'delete'
    record_id TEXT NOT NULL,
    data TEXT NOT NULL, -- JSON: Record data
    
    -- Enhanced queue management
    priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
    batch_id TEXT REFERENCES sync_batches(id),
    batch_sequence INTEGER, -- Order within batch
    
    -- Retry logic
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TEXT,
    next_retry_at TEXT,
    error_message TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
);

-- Enhanced conflict tracking with resolution strategies
CREATE TABLE IF NOT EXISTS sync_conflicts (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    local_data TEXT NOT NULL, -- JSON
    remote_data TEXT NOT NULL, -- JSON
    
    -- Enhanced conflict information
    conflict_type TEXT NOT NULL, -- 'update-update', 'delete-update', etc.
    resolution_strategy TEXT, -- 'timestamp', 'manual', 'merge', 'custom'
    auto_resolvable INTEGER DEFAULT 0,
    
    -- Resolution details
    resolution TEXT, -- 'local', 'remote', 'merged'
    resolution_metadata TEXT, -- JSON: Details about how it was resolved
    merged_data TEXT, -- JSON: If resolution = 'merged'
    
    -- Timestamps
    detected_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    resolved_by TEXT
);

-- Comprehensive lock tracking for all lockable items
CREATE TABLE IF NOT EXISTS lock_management (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    lock_type TEXT DEFAULT 'exclusive', -- 'exclusive', 'shared'
    locked_by TEXT,
    locked_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT, -- Optional lock expiration
    unlock_reason TEXT,
    unlocked_at TEXT
);

-- =====================================
-- EXPORT AND SHARING SYSTEM
-- =====================================

-- Export history with configuration tracking
CREATE TABLE IF NOT EXISTS export_history (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL, -- 'markdown', 'json', 'pdf', 'share'
    export_config TEXT, -- JSON: Format-specific settings
    file_path TEXT, -- Local file path if applicable
    file_size_bytes INTEGER,
    
    -- Export metadata
    included_sections TEXT, -- JSON: Which parts were exported
    export_version TEXT, -- Version of export format
    
    created_at TEXT DEFAULT (datetime('now')),
    created_by TEXT
);

-- Shareable read-only project links
CREATE TABLE IF NOT EXISTS share_links (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE NOT NULL,
    
    -- Access control
    expires_at TEXT,
    max_access_count INTEGER,
    current_access_count INTEGER DEFAULT 0,
    
    -- Permissions
    allow_download INTEGER DEFAULT 0,
    visible_sections TEXT, -- JSON: Which sections can be viewed
    
    -- Status
    is_active INTEGER DEFAULT 1,
    last_accessed_at TEXT,
    
    created_at TEXT DEFAULT (datetime('now')),
    created_by TEXT
);

-- =====================================
-- DEMO AND CACHE TABLES
-- =====================================

-- Demo canvas configurations for welcome screen
CREATE TABLE IF NOT EXISTS demo_templates (
    id TEXT PRIMARY KEY,
    template_name TEXT NOT NULL,
    template_type TEXT DEFAULT 'welcome', -- 'welcome', 'example', 'tutorial'
    
    -- Canvas configuration
    nodes TEXT NOT NULL, -- JSON: Demo nodes configuration
    edges TEXT NOT NULL, -- JSON: Demo edges configuration
    viewport TEXT, -- JSON: Initial viewport
    
    -- Animation sequence
    animation_sequence TEXT NOT NULL, -- JSON: Step-by-step animations
    loop_duration_ms INTEGER DEFAULT 30000, -- 30 seconds default
    
    -- Status
    is_active INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 0, -- For ordering multiple templates
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Cache for sidebar recent problem flows display
CREATE TABLE IF NOT EXISTS recent_flows_cache (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Display data
    problem_statement TEXT NOT NULL,
    last_activity TEXT NOT NULL,
    
    -- Progress segments (5 total)
    progress_segments TEXT NOT NULL, -- JSON: [{name: 'Problem', complete: true}, ...]
    completion_percentage INTEGER,
    
    -- Cache management
    cache_key TEXT UNIQUE NOT NULL,
    expires_at TEXT,
    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Table: project_settings (Preserved from original)
CREATE TABLE IF NOT EXISTS project_settings (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_core_problems_project ON core_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_states_project ON canvas_states(project_id);
CREATE INDEX IF NOT EXISTS idx_canvas_latest_version ON canvas_states(project_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_canvas_current_state ON canvas_states(project_id, is_current);

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
CREATE INDEX IF NOT EXISTS idx_solutions_voting ON key_solutions(project_id, voting_results);

-- Mapping indexes
CREATE INDEX IF NOT EXISTS idx_solution_pain_mappings ON solution_pain_point_mappings(solution_id, pain_point_id);

-- User story indexes
CREATE INDEX IF NOT EXISTS idx_user_stories_project ON user_stories(project_id);

-- Flow state indexes
CREATE INDEX IF NOT EXISTS idx_flow_states_project ON react_flow_states(project_id, created_at DESC);

-- Event sourcing indexes
CREATE INDEX IF NOT EXISTS idx_state_events_project_seq ON langgraph_state_events(project_id, sequence_number);
CREATE INDEX IF NOT EXISTS idx_state_events_type ON langgraph_state_events(project_id, event_type);
CREATE INDEX IF NOT EXISTS idx_state_events_priority ON langgraph_state_events(project_id, event_priority DESC);

-- Focus group indexes
CREATE INDEX IF NOT EXISTS idx_focus_sessions_project ON focus_group_sessions(project_id, created_at DESC);

-- Animation indexes
CREATE INDEX IF NOT EXISTS idx_animation_active ON ui_animation_states(project_id, is_active);
CREATE INDEX IF NOT EXISTS idx_transitions_steps ON canvas_transitions(project_id, from_step, to_step);
CREATE INDEX IF NOT EXISTS idx_selection_project ON ui_selection_states(project_id);
CREATE INDEX IF NOT EXISTS idx_progress_current ON progress_tracking(project_id, is_current);

-- Document management indexes
CREATE INDEX IF NOT EXISTS idx_documents_project ON project_documents(project_id, document_type);
CREATE INDEX IF NOT EXISTS idx_documents_sync ON project_documents(project_id, is_synced);
CREATE INDEX IF NOT EXISTS idx_doc_queue_status ON document_generation_queue(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_drift_pending ON document_drift_reports(project_id, resolution_status);
CREATE INDEX IF NOT EXISTS idx_drift_severity ON document_drift_reports(project_id, drift_severity, detected_at DESC);

-- Sync management indexes
CREATE INDEX IF NOT EXISTS idx_batches_status ON sync_batches(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status, priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_sync_queue_batch ON sync_queue(batch_id, batch_sequence);
CREATE INDEX IF NOT EXISTS idx_sync_queue_retry ON sync_queue(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_conflicts_unresolved ON sync_conflicts(table_name, resolved_at);
CREATE INDEX IF NOT EXISTS idx_locks_active ON lock_management(project_id, table_name, unlocked_at);
CREATE INDEX IF NOT EXISTS idx_locks_expired ON lock_management(expires_at, unlocked_at);

-- Edge function indexes
CREATE INDEX IF NOT EXISTS idx_edge_functions_active ON edge_function_registry(function_name, is_active);

-- Export and sharing indexes
CREATE INDEX IF NOT EXISTS idx_exports_project ON export_history(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON share_links(share_token, is_active);
CREATE INDEX IF NOT EXISTS idx_share_links_expiry ON share_links(expires_at, is_active);

-- Demo and cache indexes
CREATE INDEX IF NOT EXISTS idx_demo_templates_active ON demo_templates(template_type, priority DESC, is_active);
CREATE INDEX IF NOT EXISTS idx_recent_flows_user ON recent_flows_cache(user_id, last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_recent_flows_expiry ON recent_flows_cache(expires_at);

-- Project settings indexes
CREATE INDEX IF NOT EXISTS idx_project_settings_project_key ON project_settings(project_id, setting_key);

-- =====================================
-- UPDATE TRIGGERS
-- =====================================

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

CREATE TRIGGER IF NOT EXISTS update_react_flow_states_timestamp 
AFTER UPDATE ON react_flow_states
BEGIN
    UPDATE react_flow_states SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_ui_selection_states_timestamp 
AFTER UPDATE ON ui_selection_states
BEGIN
    UPDATE ui_selection_states SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_progress_tracking_timestamp 
AFTER UPDATE ON progress_tracking
BEGIN
    UPDATE progress_tracking SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_project_documents_timestamp 
AFTER UPDATE ON project_documents
BEGIN
    UPDATE project_documents SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_edge_function_registry_timestamp 
AFTER UPDATE ON edge_function_registry
BEGIN
    UPDATE edge_function_registry SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_demo_templates_timestamp 
AFTER UPDATE ON demo_templates
BEGIN
    UPDATE demo_templates SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_recent_flows_cache_timestamp 
AFTER UPDATE ON recent_flows_cache
BEGIN
    UPDATE recent_flows_cache SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_project_settings_timestamp 
AFTER UPDATE ON project_settings
BEGIN
    UPDATE project_settings SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Auto-increment sequence number trigger for event sourcing
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