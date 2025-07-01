use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

// Core Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub folder_path: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub workspace_id: String,
    pub name: String,
    pub status: String,
    pub current_step: String,
    pub langgraph_state: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// Problem Analysis Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoreProblem {
    pub id: String,
    pub project_id: String,
    pub original_input: String,
    pub validated_problem: Option<String>,
    pub is_valid: bool,
    pub validation_feedback: Option<String>,
    pub version: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Persona {
    pub id: String,
    pub core_problem_id: String,
    pub name: String,
    pub industry: String,
    pub role: String,
    pub pain_degree: i32,
    pub position: i32,
    pub is_locked: bool,
    pub is_active: bool,
    pub generation_batch: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PainPoint {
    pub id: String,
    pub persona_id: String,
    pub description: String,
    pub severity: Option<String>,
    pub impact_area: Option<String>,
    pub position: i32,
    pub is_locked: bool,
    pub generation_batch: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Solution {
    pub id: String,
    pub project_id: String,
    pub persona_id: String,
    pub title: String,
    pub description: String,
    pub solution_type: Option<String>,
    pub complexity: Option<String>,
    pub position: i32,
    pub is_locked: bool,
    pub is_selected: bool,
    pub generation_batch: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SolutionPainPointMapping {
    pub id: String,
    pub solution_id: String,
    pub pain_point_id: String,
    pub relevance_score: Option<f64>,
    pub created_at: DateTime<Utc>,
}

// User Story & Architecture Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStory {
    pub id: String,
    pub project_id: String,
    pub title: String,
    pub as_a: String,
    pub i_want: String,
    pub so_that: String,
    pub acceptance_criteria: Vec<String>, // Will be stored as JSON
    pub priority: Option<String>,
    pub complexity_points: Option<i32>,
    pub position: i32,
    pub is_edited: bool,
    pub original_content: Option<String>,
    pub edited_content: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemArchitecture {
    pub id: String,
    pub project_id: String,
    pub layer: String,
    pub technology: String,
    pub justification: String,
    pub version: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataFlow {
    pub id: String,
    pub user_story_id: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataFlowStep {
    pub id: String,
    pub data_flow_id: String,
    pub step_number: i32,
    pub action: String,
    pub source: String,
    pub target: String,
    pub data_payload: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Database Schema Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseTable {
    pub id: String,
    pub project_id: String,
    pub table_name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseColumn {
    pub id: String,
    pub table_id: String,
    pub column_name: String,
    pub data_type: String,
    pub is_primary_key: bool,
    pub is_foreign_key: bool,
    pub references_table: Option<String>,
    pub constraints: Vec<String>, // Will be stored as JSON
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseRelationship {
    pub id: String,
    pub project_id: String,
    pub from_table: String,
    pub to_table: String,
    pub relationship_type: String,
    pub created_at: DateTime<Utc>,
}

// UI & Design Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UIScreen {
    pub id: String,
    pub project_id: String,
    pub screen_name: String,
    pub description: Option<String>,
    pub route_path: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UIComponent {
    pub id: String,
    pub screen_id: String,
    pub component_name: String,
    pub component_type: Option<String>,
    pub data_displayed: Option<String>,
    pub props: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DesignToken {
    pub id: String,
    pub project_id: String,
    pub token_category: String,
    pub token_name: String,
    pub token_value: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AtomicComponent {
    pub id: String,
    pub project_id: String,
    pub component_level: String,
    pub component_name: String,
    pub description: Option<String>,
    pub props: Option<serde_json::Value>,
    pub composed_of: Vec<String>, // Will be stored as JSON
    pub created_at: DateTime<Utc>,
}

// State Management Models

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LangGraphExecutionLog {
    pub id: String,
    pub project_id: String,
    pub node_name: String,
    pub input_state: Option<serde_json::Value>,
    pub output_state: Option<serde_json::Value>,
    pub execution_time_ms: Option<i32>,
    pub status: Option<String>,
    pub error_message: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReactFlowState {
    pub id: String,
    pub project_id: String,
    pub viewport: Option<serde_json::Value>,
    pub nodes: serde_json::Value,
    pub edges: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LangGraphStateEvent {
    pub id: String,
    pub project_id: String,
    pub event_type: String,
    pub event_data: serde_json::Value,
    pub event_metadata: Option<serde_json::Value>,
    pub sequence_number: i32,
    pub created_at: DateTime<Utc>,
    pub created_by: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CanvasState {
    pub id: String,
    pub project_id: String,
    pub nodes: serde_json::Value,
    pub edges: serde_json::Value,
    pub viewport: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// Default Implementations

impl Default for Workspace {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            user_id: String::new(),
            name: String::new(),
            folder_path: None,
            is_active: true,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl Default for Project {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            workspace_id: String::new(),
            name: String::new(),
            status: "problem_input".to_string(),
            current_step: "problem_input".to_string(),
            langgraph_state: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl Default for CoreProblem {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            project_id: String::new(),
            original_input: String::new(),
            validated_problem: None,
            is_valid: false,
            validation_feedback: None,
            version: 1,
            created_at: Utc::now(),
        }
    }
}

impl Default for Persona {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            core_problem_id: String::new(),
            name: String::new(),
            industry: String::new(),
            role: String::new(),
            pain_degree: 3,
            position: 0,
            is_locked: false,
            is_active: false,
            generation_batch: None,
            created_at: Utc::now(),
        }
    }
}

// Builder Pattern for Complex Models

pub struct PersonaBuilder {
    persona: Persona,
}

impl PersonaBuilder {
    pub fn new(core_problem_id: String, name: String) -> Self {
        let mut persona = Persona::default();
        persona.core_problem_id = core_problem_id;
        persona.name = name;
        Self { persona }
    }

    pub fn industry(mut self, industry: String) -> Self {
        self.persona.industry = industry;
        self
    }

    pub fn role(mut self, role: String) -> Self {
        self.persona.role = role;
        self
    }

    pub fn pain_degree(mut self, pain_degree: i32) -> Self {
        self.persona.pain_degree = pain_degree.clamp(1, 5);
        self
    }

    pub fn position(mut self, position: i32) -> Self {
        self.persona.position = position;
        self
    }

    pub fn generation_batch(mut self, batch: String) -> Self {
        self.persona.generation_batch = Some(batch);
        self
    }

    pub fn build(self) -> Persona {
        self.persona
    }
}

pub struct SolutionBuilder {
    solution: Solution,
}

impl SolutionBuilder {
    pub fn new(project_id: String, persona_id: String, title: String) -> Self {
        let solution = Solution {
            id: Uuid::new_v4().to_string(),
            project_id,
            persona_id,
            title,
            description: String::new(),
            solution_type: None,
            complexity: None,
            position: 0,
            is_locked: false,
            is_selected: false,
            generation_batch: None,
            created_at: Utc::now(),
        };
        Self { solution }
    }

    pub fn description(mut self, description: String) -> Self {
        self.solution.description = description;
        self
    }

    pub fn solution_type(mut self, solution_type: String) -> Self {
        self.solution.solution_type = Some(solution_type);
        self
    }

    pub fn complexity(mut self, complexity: String) -> Self {
        self.solution.complexity = Some(complexity);
        self
    }

    pub fn position(mut self, position: i32) -> Self {
        self.solution.position = position;
        self
    }

    pub fn build(self) -> Solution {
        self.solution
    }
}

// Validation Methods

impl CoreProblem {
    pub fn validate(&self) -> Result<(), String> {
        if self.original_input.trim().is_empty() {
            return Err("Problem input cannot be empty".to_string());
        }
        if self.original_input.len() < 10 {
            return Err("Problem description is too short".to_string());
        }
        if self.original_input.len() > 1000 {
            return Err("Problem description is too long".to_string());
        }
        Ok(())
    }
}

impl Persona {
    pub fn validate(&self) -> Result<(), String> {
        if self.name.trim().is_empty() {
            return Err("Persona name cannot be empty".to_string());
        }
        if self.industry.trim().is_empty() {
            return Err("Industry cannot be empty".to_string());
        }
        if self.role.trim().is_empty() {
            return Err("Role cannot be empty".to_string());
        }
        if self.pain_degree < 1 || self.pain_degree > 5 {
            return Err("Pain degree must be between 1 and 5".to_string());
        }
        Ok(())
    }
}

impl UserStory {
    pub fn validate(&self) -> Result<(), String> {
        if self.title.trim().is_empty() {
            return Err("User story title cannot be empty".to_string());
        }
        if self.as_a.trim().is_empty() {
            return Err("'As a' field cannot be empty".to_string());
        }
        if self.i_want.trim().is_empty() {
            return Err("'I want' field cannot be empty".to_string());
        }
        if self.so_that.trim().is_empty() {
            return Err("'So that' field cannot be empty".to_string());
        }
        Ok(())
    }
}

// Workflow State Enums

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum WorkflowStep {
    ProblemInput,
    SolutionDiscovery,
    FeatureSelection,
    UserStories,
    Architecture,
    DesignSystem,
    RepositorySetup,
}

impl ToString for WorkflowStep {
    fn to_string(&self) -> String {
        match self {
            WorkflowStep::ProblemInput => "problem_input".to_string(),
            WorkflowStep::SolutionDiscovery => "solution_discovery".to_string(),
            WorkflowStep::FeatureSelection => "feature_selection".to_string(),
            WorkflowStep::UserStories => "user_stories".to_string(),
            WorkflowStep::Architecture => "architecture".to_string(),
            WorkflowStep::DesignSystem => "design_system".to_string(),
            WorkflowStep::RepositorySetup => "repository_setup".to_string(),
        }
    }
}

impl From<String> for WorkflowStep {
    fn from(s: String) -> Self {
        match s.as_str() {
            "problem_input" => WorkflowStep::ProblemInput,
            "solution_discovery" => WorkflowStep::SolutionDiscovery,
            "feature_selection" => WorkflowStep::FeatureSelection,
            "user_stories" => WorkflowStep::UserStories,
            "architecture" => WorkflowStep::Architecture,
            "design_system" => WorkflowStep::DesignSystem,
            "repository_setup" => WorkflowStep::RepositorySetup,
            _ => WorkflowStep::ProblemInput,
        }
    }
}