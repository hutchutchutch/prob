use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use anyhow::Result;

use super::{LLMRequest, LLMResponse, call_llm, query_local_sqlite, get_problem_context, save_generation_result};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowState {
    pub id: String,
    pub project_id: String,
    pub current_step: String,
    pub data: HashMap<String, serde_json::Value>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowStep {
    pub name: String,
    pub description: String,
    pub tool_name: String,
    pub inputs: HashMap<String, serde_json::Value>,
    pub outputs: HashMap<String, serde_json::Value>,
    pub next_steps: Vec<String>,
    pub completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowDefinition {
    pub name: String,
    pub description: String,
    pub steps: Vec<WorkflowStep>,
    pub initial_step: String,
}

pub struct LangGraphOrchestrator {
    pub workflow_definitions: HashMap<String, WorkflowDefinition>,
}

impl LangGraphOrchestrator {
    pub fn new() -> Self {
        let mut orchestrator = Self {
            workflow_definitions: HashMap::new(),
        };
        
        orchestrator.register_default_workflows();
        orchestrator
    }
    
    fn register_default_workflows(&mut self) {
        // Register the problem-to-solution workflow
        let problem_workflow = WorkflowDefinition {
            name: "problem_to_solution".to_string(),
            description: "Complete workflow from problem validation to solution generation".to_string(),
            steps: vec![
                WorkflowStep {
                    name: "validate_problem".to_string(),
                    description: "Validate and refine the problem statement".to_string(),
                    tool_name: "call_llm".to_string(),
                    inputs: HashMap::from([
                        ("prompt_template".to_string(), serde_json::json!(
                            "Please analyze this problem statement and provide a refined, validated version:\n\n{problem_input}\n\nProvide:\n1. A clear, refined problem statement\n2. Whether the problem is valid and solvable\n3. Any recommendations for improvement\n\nFormat your response as JSON with keys: validated_problem, is_valid, feedback"
                        ))
                    ]),
                    outputs: HashMap::new(),
                    next_steps: vec!["generate_personas".to_string()],
                    completed: false,
                },
                WorkflowStep {
                    name: "generate_personas".to_string(),
                    description: "Generate user personas based on the validated problem".to_string(),
                    tool_name: "call_llm".to_string(),
                    inputs: HashMap::from([
                        ("prompt_template".to_string(), serde_json::json!(
                            "Based on this problem: {validated_problem}\n\nGenerate 3-5 detailed user personas who would be affected by this problem. For each persona, provide:\n1. Name and basic demographics\n2. Role/occupation\n3. Goals and motivations\n4. Pain points related to this problem\n5. Technical proficiency level\n\nFormat as JSON array with objects containing: name, demographics, role, goals, pain_points, tech_level"
                        ))
                    ]),
                    outputs: HashMap::new(),
                    next_steps: vec!["generate_solutions".to_string()],
                    completed: false,
                },
                WorkflowStep {
                    name: "generate_solutions".to_string(),
                    description: "Generate solutions based on personas and problem".to_string(),
                    tool_name: "call_llm".to_string(),
                    inputs: HashMap::from([
                        ("prompt_template".to_string(), serde_json::json!(
                            "Problem: {validated_problem}\n\nPersonas: {personas}\n\nGenerate 3-5 key solutions that address this problem for these personas. For each solution:\n1. Solution name\n2. Description\n3. Which personas it serves\n4. Technical approach\n5. Business impact\n6. Implementation complexity (1-10)\n\nFormat as JSON array with objects containing: name, description, target_personas, technical_approach, business_impact, complexity"
                        ))
                    ]),
                    outputs: HashMap::new(),
                    next_steps: vec!["complete".to_string()],
                    completed: false,
                },
            ],
            initial_step: "validate_problem".to_string(),
        };
        
        self.workflow_definitions.insert("problem_to_solution".to_string(), problem_workflow);
    }
    
    pub async fn execute_workflow(&self, workflow_name: &str, project_id: &str, initial_data: HashMap<String, serde_json::Value>) -> Result<WorkflowState> {
        let workflow = self.workflow_definitions.get(workflow_name)
            .ok_or_else(|| anyhow::anyhow!("Workflow {} not found", workflow_name))?;
        
        let mut state = WorkflowState {
            id: Uuid::new_v4().to_string(),
            project_id: project_id.to_string(),
            current_step: workflow.initial_step.clone(),
            data: initial_data,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        // Execute steps in sequence
        let mut current_step_name = workflow.initial_step.clone();
        while current_step_name != "complete" {
            let step = workflow.steps.iter()
                .find(|s| s.name == current_step_name)
                .ok_or_else(|| anyhow::anyhow!("Step {} not found", current_step_name))?;
            
            state = self.execute_step(step, state).await?;
            
            // Move to next step (simplified - just take first next step)
            current_step_name = step.next_steps.first()
                .unwrap_or(&"complete".to_string())
                .clone();
        }
        
        Ok(state)
    }
    
    async fn execute_step(&self, step: &WorkflowStep, mut state: WorkflowState) -> Result<WorkflowState> {
        state.current_step = step.name.clone();
        state.updated_at = Utc::now();
        
        match step.tool_name.as_str() {
            "call_llm" => {
                // Build prompt from template and state data
                let prompt_template = step.inputs.get("prompt_template")
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                
                let prompt = self.build_prompt(prompt_template, &state.data)?;
                
                let llm_request = LLMRequest {
                    prompt,
                    model: Some("gemini-pro".to_string()),
                    temperature: Some(0.7),
                    max_tokens: Some(2048),
                };
                
                // This is a simplified call - in real implementation you'd need proper async handling
                // For now, this shows the structure
                let response = self.call_llm_tool(llm_request).await?;
                
                // Parse and store response
                let result: serde_json::Value = serde_json::from_str(&response.content)
                    .unwrap_or_else(|_| serde_json::json!({"content": response.content}));
                
                state.data.insert(step.name.clone(), result.clone());
                
                // Save to database
                self.save_step_result(&state.project_id, &step.name, &result).await?;
            }
            "query_local_sqlite" => {
                // Execute database query
                let query = step.inputs.get("query")
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                
                let params = step.inputs.get("params")
                    .and_then(|v| v.as_array())
                    .unwrap_or(&vec![])
                    .iter()
                    .map(|v| v.to_string())
                    .collect();
                
                let result = self.query_database(query.to_string(), params).await?;
                state.data.insert(step.name.clone(), result);
            }
            _ => {
                return Err(anyhow::anyhow!("Unknown tool: {}", step.tool_name));
            }
        }
        
        Ok(state)
    }
    
    fn build_prompt(&self, template: &str, data: &HashMap<String, serde_json::Value>) -> Result<String> {
        let mut prompt = template.to_string();
        
        for (key, value) in data {
            let placeholder = format!("{{{}}}", key);
            let replacement = match value {
                serde_json::Value::String(s) => s.clone(),
                _ => value.to_string(),
            };
            prompt = prompt.replace(&placeholder, &replacement);
        }
        
        Ok(prompt)
    }
    
    async fn call_llm_tool(&self, request: LLMRequest) -> Result<LLMResponse> {
        // In a real implementation, this would call the actual tool
        // For now, simulate the response
        Ok(LLMResponse {
            content: "{}".to_string(),
            model: request.model.unwrap_or_else(|| "gemini-pro".to_string()),
            tokens_used: Some(100),
        })
    }
    
    async fn query_database(&self, query: String, params: Vec<String>) -> Result<serde_json::Value> {
        // In a real implementation, this would call the actual database tool
        // For now, return empty result
        Ok(serde_json::json!([]))
    }
    
    async fn save_step_result(&self, project_id: &str, step_name: &str, result: &serde_json::Value) -> Result<()> {
        // In a real implementation, this would call the actual save tool
        // For now, just log
        log::info!("Saving step {} result for project {}", step_name, project_id);
        Ok(())
    }
    
    pub fn get_workflow_status(&self, workflow_name: &str) -> Option<&WorkflowDefinition> {
        self.workflow_definitions.get(workflow_name)
    }
    
    pub fn list_workflows(&self) -> Vec<String> {
        self.workflow_definitions.keys().cloned().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_orchestrator_creation() {
        let orchestrator = LangGraphOrchestrator::new();
        assert!(orchestrator.workflow_definitions.contains_key("problem_to_solution"));
    }
    
    #[test]
    fn test_prompt_building() {
        let orchestrator = LangGraphOrchestrator::new();
        let template = "Hello {name}, your problem is: {problem}";
        let mut data = HashMap::new();
        data.insert("name".to_string(), serde_json::json!("John"));
        data.insert("problem".to_string(), serde_json::json!("test problem"));
        
        let result = orchestrator.build_prompt(template, &data).unwrap();
        assert_eq!(result, "Hello John, your problem is: test problem");
    }
} 