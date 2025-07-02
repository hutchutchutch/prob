-- Migration 002: Sync SQLite with Supabase Schema
-- Adds all missing tables and columns to achieve perfect consistency

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- =====================================
-- STEP 1: Add Missing Columns to Existing Tables
-- =====================================

-- Add missing columns to key_solutions
ALTER TABLE key_solutions ADD COLUMN voting_results TEXT; -- JSON structure: {total_votes: number, persona_votes: [{persona_id, votes}]}
ALTER TABLE key_solutions ADD COLUMN must_have_features TEXT; -- Array of {persona_id: TEXT, features: [string]}

-- Add missing columns to langgraph_state_events  
ALTER TABLE langgraph_state_events ADD COLUMN before_state TEXT; -- JSON
ALTER TABLE langgraph_state_events ADD COLUMN after_state TEXT; -- JSON
ALTER TABLE langgraph_state_events ADD COLUMN state_diff TEXT; -- JSON
ALTER TABLE langgraph_state_events ADD COLUMN event_priority INTEGER DEFAULT 0;

-- Add missing columns to react_flow_states
ALTER TABLE react_flow_states ADD COLUMN minimap_config TEXT; -- JSON
ALTER TABLE react_flow_states ADD COLUMN controls_config TEXT; -- JSON
ALTER TABLE react_flow_states ADD COLUMN selection_ids TEXT; -- JSON array
ALTER TABLE react_flow_states ADD COLUMN interaction_mode TEXT DEFAULT 'default';
ALTER TABLE react_flow_states ADD COLUMN canvas_locked INTEGER DEFAULT 0;
ALTER TABLE react_flow_states ADD COLUMN animation_queue TEXT DEFAULT '[]'; -- JSON array
ALTER TABLE react_flow_states ADD COLUMN active_animations TEXT DEFAULT '{}'; -- JSON object
ALTER TABLE react_flow_states ADD COLUMN animation_settings TEXT DEFAULT '{"enableBreathing": true, "staggerDelay": 150}'; -- JSON
ALTER TABLE react_flow_states ADD COLUMN updated_at TEXT DEFAULT (datetime('now'));

-- Add missing columns to canvas_states
ALTER TABLE canvas_states ADD COLUMN workflow_step TEXT NOT NULL DEFAULT 'problem_input';
ALTER TABLE canvas_states ADD COLUMN step_completed INTEGER DEFAULT 0;
ALTER TABLE canvas_states ADD COLUMN locked_items TEXT DEFAULT '{"personas": [], "painPoints": [], "solutions": []}'; -- JSON
ALTER TABLE canvas_states ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE canvas_states ADD COLUMN parent_version_id TEXT REFERENCES canvas_states(id);
ALTER TABLE canvas_states ADD COLUMN change_description TEXT;
ALTER TABLE canvas_states ADD COLUMN is_current INTEGER DEFAULT 0;
ALTER TABLE canvas_states ADD COLUMN created_by TEXT;

-- Add missing column to langgraph_execution_logs
ALTER TABLE langgraph_execution_logs ADD COLUMN retry_count INTEGER DEFAULT 0;

-- =====================================
-- STEP 2: Create AI Focus Group Tables
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
-- STEP 3: Create Animation & UI State Tables
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
-- STEP 4: Create Document Management System
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
-- STEP 5: Create Enhanced Sync Management System
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
-- STEP 6: Create Edge Function Registry
-- =====================================

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
-- STEP 7: Create Export and Sharing System
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
-- STEP 8: Create Demo and Cache Tables
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

-- =====================================
-- STEP 9: Create Indexes for Performance
-- =====================================

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

-- =====================================
-- STEP 10: Create Update Triggers for New Tables
-- =====================================

-- Update triggers for tables with updated_at columns
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

-- =====================================
-- Migration Complete
-- ===================================== 