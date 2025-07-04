import { LangGraphService } from '../tauri/langgraph';
import { tauriAPI } from '../tauri/api';

// =======================================================================================
// 1. STATE DEFINITION
// Defines the complete, shared state that flows through the entire graph.
// =======================================================================================

interface Feature {
  id: string;
  text: string;
  sourceSolutionId: string;
  sourcePersonaId: string;
  votes: number;
}

interface MustHaveFeature extends Feature {
  comments: { personaId: string; personaName: string; comment: string }[];
}

interface WorkflowState {
  projectId: string;
  coreProblem: { 
    id: string; 
    originalInput: string; 
    validatedStatement: string; 
    isValid: boolean; 
    feedback?: string; 
  };
  personas: Array<{
    id: string;
    name: string;
    demographics: string;
    role: string;
    industry: string;
    description: string;
    goals: string[];
    pain_points: string[];
    tech_level: string;
    painDegree: number;
  }>;
  painPoints: Array<{
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impactArea: string;
    persona_id?: string;
  }>;
  solutions: Array<{
    id: string;
    title: string;
    name: string;
    description: string;
    target_personas: string[];
    technical_approach: string;
    business_impact: string;
    complexity: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }>;
  keyFeatures: Feature[];
  mustHaveFeatures: MustHaveFeature[];
  userStories: Array<{
    id: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
    acceptanceCriteria: string[];
  }>;
  finalDocuments: {
    productVision?: string;
    functionalRequirements?: string;
    systemArchitecture?: string;
    dataFlowDiagram?: string;
    entityRelationshipDiagram?: string;
    designSystem?: string;
  };
  // NEW: Add a place for user-customized prompts
  prompts: Record<string, string>;
  lockedItems: { 
    personas: string[]; 
    painPoints: string[]; 
    solutions: string[]; 
  };
  currentStep?: string;
  errors?: string[];
  metadata?: Record<string, any>;
}

// NEW: Default prompts that the user can edit.
const DEFAULT_PROMPTS = {
  productVision: "Use the product-vision-guide.md as a template. Create an executive summary, a core value proposition based on the personas and problem, and define the MVP feature set based on the must-have features.",
  functionalRequirements: "Use functional_requirements_doc.md. Detail features derived from the user stories, including acceptance criteria and data handling rules.",
  systemArchitecture: "Use system_architecture.md. Define an architectural pattern, component breakdown, and technology stack suitable for the functional requirements.",
  dataFlowDiagram: "Use data_flow_diagram.md. Create Mermaid syntax diagrams for key user flows, showing how data moves between the defined system components.",
  entityRelationshipDiagram: "Use entity_relationship_diagram.md. Create a Mermaid ERD based on the data stores and flows. Define entities, attributes, and relationships to support the application's features.",
  designSystem: "Use atomic-design-system.md. Define foundational design tokens (colors, typography) and key atomic components required to build the UI for the specified features."
};

// Legacy interface for backwards compatibility
interface AppState extends WorkflowState {
  problemStatement: string;
  validatedProblem?: {
    validated_problem: string;
    is_valid: boolean;
    feedback: string;
  };
}

// =======================================================================================
// 2. MAIN GRAPH NODES
// These are the primary steps in the main workflow.
// =======================================================================================

/**
 * Validates the initial problem statement by calling the LLM via the Rust backend.
 */
async function validateProblemNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- Local Node: validateProblem ---");
  const { originalInput } = state.coreProblem;
  const prompt = `Analyze this problem statement: "${originalInput}"\n\nRespond with JSON: {"isValid": boolean, "feedback": "string", "validatedProblem": "A concise, improved version of the problem"}`;
  
  try {
    const response = await tauriAPI.callLlm({ prompt });
    const analysis = JSON.parse(response.content);
    return { 
      coreProblem: { 
        ...state.coreProblem, 
        isValid: analysis.isValid,
        feedback: analysis.feedback,
        validatedStatement: analysis.validatedProblem 
      } 
    };
  } catch (error) {
    return { 
      errors: [...(state.errors || []), `Problem validation failed: ${error}`],
      coreProblem: { ...state.coreProblem, isValid: false, feedback: `Validation error: ${error}` }
    };
  }
}

/**
 * Generates 5 user personas based on the validated problem.
 */
async function generatePersonasNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- Local Node: generatePersonas ---");
  const { coreProblem, lockedItems } = state;
  const prompt = `Problem: "${coreProblem.validatedStatement}"\n\nGenerate 5 diverse user personas. Avoid duplicating personas similar to these locked ones: ${lockedItems.personas.join(', ')}\n\nReturn JSON: {"personas": [{"name", "industry", "role", "description", "painDegree": 1-5, "demographics": "", "goals": [], "pain_points": [], "tech_level": ""}]}`;
  
  try {
    const response = await tauriAPI.callLlm({ prompt });
    const result = JSON.parse(response.content);
    const personas = result.personas.map((p: any, index: number) => ({
      id: `persona_${index + 1}`,
      name: p.name,
      industry: p.industry || 'General',
      role: p.role,
      description: p.description,
      painDegree: p.painDegree || 3,
      demographics: p.demographics || '',
      goals: Array.isArray(p.goals) ? p.goals : [],
      pain_points: Array.isArray(p.pain_points) ? p.pain_points : [],
      tech_level: p.tech_level || 'medium'
    }));
    return { personas };
  } catch (error) {
    return { errors: [...(state.errors || []), `Persona generation failed: ${error}`] };
  }
}

/**
 * Generates 7 pain points for the created personas.
 */
async function generatePainPointsNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- Local Node: generatePainPoints ---");
  const { coreProblem, personas, lockedItems } = state;
  const prompt = `Core Problem: "${coreProblem.validatedStatement}"\n\nPersonas:\n${JSON.stringify(personas, null, 2)}\n\nGenerate 7 specific pain points derived from the personas' experience with the core problem. Avoid duplicating pain points similar to these: ${lockedItems.painPoints.join(', ')}\n\nReturn JSON: {"painPoints": [{"description", "severity": "low|medium|high|critical", "impactArea": "time|money|etc.", "persona_id": ""}]}`;
  
  try {
    const response = await tauriAPI.callLlm({ prompt });
    const result = JSON.parse(response.content);
    const painPoints = result.painPoints.map((p: any, index: number) => ({
      id: `pain_${index + 1}`,
      description: p.description,
      severity: p.severity as 'low' | 'medium' | 'high' | 'critical',
      impactArea: p.impactArea || 'general',
      persona_id: p.persona_id || personas[index % personas.length]?.id
    }));
    return { painPoints };
  } catch (error) {
    return { errors: [...(state.errors || []), `Pain point generation failed: ${error}`] };
  }
}

/**
 * Generates 5 potential solutions to address the pain points.
 */
async function generateSolutionsNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- Local Node: generateSolutions ---");
  const { coreProblem, painPoints, lockedItems } = state;
  const prompt = `Core Problem: "${coreProblem.validatedStatement}"\n\nPain Points:\n${JSON.stringify(painPoints, null, 2)}\n\nGenerate 5 diverse solutions. Avoid duplicating solutions similar to these: ${lockedItems.solutions.join(', ')}\n\nReturn JSON: {"solutions": [{"title", "description", "complexity": "low|medium|high", "impact": "low|medium|high", "technical_approach": "", "business_impact": "", "target_personas": []}]}`;
  
  try {
    const response = await tauriAPI.callLlm({ prompt });
    const result = JSON.parse(response.content);
    const solutions = result.solutions.map((s: any, index: number) => ({
      id: `solution_${index + 1}`,
      title: s.title,
      name: s.title, // For backwards compatibility
      description: s.description,
      complexity: s.complexity as 'low' | 'medium' | 'high',
      impact: s.impact as 'low' | 'medium' | 'high',
      technical_approach: s.technical_approach || '',
      business_impact: s.business_impact || '',
      target_personas: Array.isArray(s.target_personas) ? s.target_personas : []
    }));
    return { solutions };
  } catch (error) {
    return { errors: [...(state.errors || []), `Solution generation failed: ${error}`] };
  }
}

// Define your graph nodes
const nodes = {
  validateProblem: "validateProblem",
  generatePersonas: "generatePersonas", 
  generatePainPoints: "generatePainPoints",
  generateSolutions: "generateSolutions",
  focusGroup: "focusGroup",
  generateDocuments: "generateDocuments",
  saveFinalState: "saveFinalState",
};

// Custom state graph implementation
class CustomStateGraph {
  private steps: { [key: string]: (state: WorkflowState) => Promise<Partial<WorkflowState>> } = {};
  private stepOrder: string[] = [];
  
  addNode(name: string, fn: (state: WorkflowState) => Promise<Partial<WorkflowState>>) {
    this.steps[name] = fn;
  }
  
  setStepOrder(order: string[]) {
    this.stepOrder = order;
  }
  
  async invoke(initialState: WorkflowState): Promise<WorkflowState> {
    let currentState = { ...initialState };
    
    for (const stepName of this.stepOrder) {
      const stepFn = this.steps[stepName];
      if (stepFn) {
        try {
          const update = await stepFn(currentState);
          currentState = { ...currentState, ...update };
        } catch (error) {
          console.error(`Error in step ${stepName}:`, error);
          currentState.errors = [...(currentState.errors || []), `Step ${stepName} failed: ${error}`];
          break;
        }
      }
    }
    
    return currentState;
  }
  
  async invokeStep(stepName: string, state: WorkflowState): Promise<WorkflowState> {
    const stepFn = this.steps[stepName];
    if (!stepFn) {
      throw new Error(`Step ${stepName} not found`);
    }
    
    const update = await stepFn(state);
    return { ...state, ...update };
  }
}

// =======================================================================================
// 3. SUBGRAPHS (MODULAR WORKFLOWS)
// =======================================================================================

/**
 * Creates and executes the focus group subgraph. This encapsulates the complex
 * logic for feature ideation, voting, commenting, and user story generation.
 */
async function createFocusGroupSubgraph(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- SUBGRAPH: Focus Group Workflow ---");
  
  try {
    // Step 1: Generate Key Features
    const keyFeatures = await generateKeyFeatures(state);
    const stateWithFeatures = { ...state, keyFeatures };
    
    // Step 2: Dot Voting
    const updatedFeatures = await dotVoting(stateWithFeatures);
    const stateWithVotes = { ...stateWithFeatures, keyFeatures: updatedFeatures };
    
    // Step 3: Tally Votes and Select Must-Have Features
    const mustHaveFeatures = tallyVotes(stateWithVotes);
    const stateWithMustHave = { ...stateWithVotes, mustHaveFeatures };
    
    // Step 4: Sequential Commenting
    const featuresWithComments = await sequentialCommenting(stateWithMustHave);
    const stateWithComments = { ...stateWithMustHave, mustHaveFeatures: featuresWithComments };
    
    // Step 5: Generate User Stories
    const userStories = await generateFocusGroupUserStories(stateWithComments);
    
    return { 
      keyFeatures: updatedFeatures,
      mustHaveFeatures: featuresWithComments,
      userStories,
      currentStep: 'focus_group_complete'
    };
  } catch (error) {
    return { errors: [...(state.errors || []), `Focus group failed: ${error}`] };
  }
}

async function generateKeyFeatures(state: WorkflowState): Promise<Feature[]> {
  console.log("--- SUBGRAPH: generateKeyFeaturesNode ---");
  const { solutions, personas, painPoints, coreProblem } = state;
  
  const promises = solutions.flatMap(solution =>
    personas.map(async (persona, personaIndex) => {
      const personaPainPoints = painPoints.filter(p => p.persona_id === persona.id);
      const prompt = `As persona "${persona.name}", evaluate solution: "${solution.title}". Your pain points are: ${JSON.stringify(personaPainPoints.map(p => p.description))}. The core problem is: "${coreProblem.validatedStatement}". How could this solution become a single, must-have feature for you? Respond with JSON: {"keyFeature": "A concise feature description."}`;
      
      const response = await tauriAPI.callLlm({ prompt });
      const result = JSON.parse(response.content);
      return {
        id: `kf_${solution.id}_${persona.id}`,
        text: result.keyFeature,
        sourceSolutionId: solution.id,
        sourcePersonaId: persona.id,
        votes: 0
      };
    })
  );
  
  return await Promise.all(promises);
}

async function dotVoting(state: WorkflowState): Promise<Feature[]> {
  console.log("--- SUBGRAPH: dotVotingNode ---");
  const { keyFeatures, personas } = state;
  const featureList = keyFeatures.map(f => `"${f.text}"`).join(',\n');
  
  const promises = personas.map(async (persona) => {
    const prompt = `You are persona "${persona.name}". From this list of features, select your top 5 most important: [${featureList}]. Return JSON: {"votes": ["feature text 1", "feature text 2", ...]}`;
    const response = await tauriAPI.callLlm({ prompt });
    return JSON.parse(response.content).votes;
  });
  
  const allVotes = (await Promise.all(promises)).flat();
  return keyFeatures.map(feature => ({
    ...feature,
    votes: allVotes.filter(vote => vote === feature.text).length
  }));
}

function tallyVotes(state: WorkflowState): MustHaveFeature[] {
  console.log("--- SUBGRAPH: tallyVotesNode ---");
  const sortedFeatures = [...state.keyFeatures].sort((a, b) => b.votes - a.votes);
  return sortedFeatures.slice(0, 3).map(f => ({ ...f, comments: [] }));
}

async function sequentialCommenting(state: WorkflowState): Promise<MustHaveFeature[]> {
  console.log("--- SUBGRAPH: sequentialCommentingNode ---");
  const { mustHaveFeatures, personas } = state;
  
  for (const feature of mustHaveFeatures) {
    let commentThread = "";
    for (const persona of personas) {
      const prompt = `You are persona "${persona.name}". Consider this feature: "${feature.text}". Previous comments: ${commentThread || "None."} What is the most important aspect of this feature to you? Provide a brief comment. Return JSON: {"comment": "Your concise comment."}`;
      const response = await tauriAPI.callLlm({ prompt });
      const result = JSON.parse(response.content);
      const newComment = { personaId: persona.id, personaName: persona.name, comment: result.comment };
      feature.comments.push(newComment);
      commentThread += `\n- ${persona.name}: "${result.comment}"`;
    }
  }
  
  return mustHaveFeatures;
}

async function generateFocusGroupUserStories(state: WorkflowState): Promise<WorkflowState['userStories']> {
  console.log("--- SUBGRAPH: generateUserStoriesNode ---");
  const { mustHaveFeatures, coreProblem } = state;
  const prompt = `Core Problem: "${coreProblem.validatedStatement}"\n\nMust-Have Features & Persona Comments:\n${JSON.stringify(mustHaveFeatures, null, 2)}\n\nGenerate 6 core user stories with acceptance criteria based on this context.\n\nReturn JSON: {"userStories": [{"title", "asA", "iWant", "soThat", "acceptanceCriteria": []}]}`;
  
  const response = await tauriAPI.callLlm({ prompt });
  const result = JSON.parse(response.content);
  return result.userStories.map((story: any, index: number) => ({
    id: `story_${index + 1}`,
    ...story
  }));
}

/**
 * Creates and executes the document generation subgraph. This runs sequentially
 * after the focus group to produce all final specification documents.
 */
async function createDocumentGenerationSubgraph(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- SUBGRAPH: Document Generation Workflow ---");
  
  try {
    const finalDocuments: WorkflowState['finalDocuments'] = {};
    
    // Generate documents sequentially
    finalDocuments.productVision = await generateDocument(state, 'productVision', 'Product Vision');
    
    finalDocuments.functionalRequirements = await generateDocument(state, 'functionalRequirements', 'Functional Requirements');
    
    finalDocuments.systemArchitecture = await generateDocument(state, 'systemArchitecture', 'System Architecture');
    
    finalDocuments.dataFlowDiagram = await generateDocument(state, 'dataFlowDiagram', 'Data Flow Diagram');
    
    finalDocuments.entityRelationshipDiagram = await generateDocument(state, 'entityRelationshipDiagram', 'Entity Relationship Diagram');
    
    finalDocuments.designSystem = await generateDocument(state, 'designSystem', 'Design System');
    
    return { 
      finalDocuments,
      currentStep: 'document_generation_complete'
    };
  } catch (error) {
    return { errors: [...(state.errors || []), `Document generation failed: ${error}`] };
  }
}

async function generateDocument(state: WorkflowState, docType: keyof WorkflowState['finalDocuments'], docName: string): Promise<string> {
  console.log(`--- DOCGEN SUBGRAPH: Generating ${docName} ---`);
  const { coreProblem, personas, solutions, userStories, mustHaveFeatures, prompts } = state;
  
  // Use the user's custom prompt if available, otherwise use the default.
  const instructions = prompts[docType] || DEFAULT_PROMPTS[docType];
  
  const context = { coreProblem, personas, solutions, userStories, mustHaveFeatures };
  const prompt = `Generate the ${docName} document in Markdown format based on the following context and instructions.\n\nContext:\n${JSON.stringify(context, null, 2)}\n\nInstructions:\n${instructions}`;
  
  const response = await tauriAPI.callLlm({ prompt });
  return response.content;
}

/**
 * Saves the final, complete state to the local SQLite database and triggers a cloud sync.
 */
async function saveFinalStateNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
  console.log("--- Local Node: saveFinalStateNode ---");
  try {
    const { errors, ...stateToSave } = state;
    
    if (state.projectId) {
      await tauriAPI.saveGenerationResult(
        state.projectId,
        'workflow_completed',
        JSON.stringify(stateToSave),
        JSON.stringify({ step: 'save_final_state', timestamp: new Date().toISOString() })
      );
    }
    
    return { 
      currentStep: 'workflow_complete',
      metadata: { ...state.metadata, completion_timestamp: new Date().toISOString() }
    };
  } catch (error) {
    return { errors: [...(state.errors || []), `Final state save failed: ${error}`] };
  }
}

// =======================================================================================
// 4. MAIN GRAPH ASSEMBLY & EXPORT
// =======================================================================================

// Create the main workflow graph
const createMainWorkflow = () => {
  const mainWorkflow = new CustomStateGraph();
  
  // Add all nodes to the main graph
  mainWorkflow.addNode("validateProblem", validateProblemNode);
  mainWorkflow.addNode("generatePersonas", generatePersonasNode);
  mainWorkflow.addNode("generatePainPoints", generatePainPointsNode);
  mainWorkflow.addNode("generateSolutions", generateSolutionsNode);
  mainWorkflow.addNode("focusGroup", createFocusGroupSubgraph);
  mainWorkflow.addNode("generateDocuments", createDocumentGenerationSubgraph);
  mainWorkflow.addNode("saveFinalState", saveFinalStateNode);
  
  // Define the complete workflow order
  const workflowSteps = [
    "validateProblem",
    "generatePersonas", 
    "generatePainPoints",
    "generateSolutions",
    "focusGroup",
    "generateDocuments",
    "saveFinalState"
  ];
  
  mainWorkflow.setStepOrder(workflowSteps);
  
  return mainWorkflow;
};

// Backwards compatibility adapter
class LangGraphOrchestrator {
  private mainWorkflow: CustomStateGraph;
  
  constructor() {
    this.mainWorkflow = createMainWorkflow();
  }
  
  async runCompleteWorkflow(
    problemStatement: string, 
    projectId?: string,
    customPrompts?: Partial<typeof DEFAULT_PROMPTS>
  ): Promise<WorkflowState> {
    const initialState: WorkflowState = {
      projectId: projectId || `project_${Date.now()}`,
      coreProblem: {
        id: `problem_${Date.now()}`,
        originalInput: problemStatement,
        validatedStatement: '',
        isValid: false
      },
      personas: [],
      painPoints: [],
      solutions: [],
      keyFeatures: [],
      mustHaveFeatures: [],
      userStories: [],
      finalDocuments: {},
      prompts: { ...DEFAULT_PROMPTS, ...customPrompts },
      lockedItems: {
        personas: [],
        painPoints: [],
        solutions: []
      },
      currentStep: 'initialize',
      errors: [],
      metadata: { created_at: new Date().toISOString() }
    };
    
    return await this.mainWorkflow.invoke(initialState);
  }
  
  async runStep(stepName: string, state: WorkflowState): Promise<WorkflowState> {
    return await this.mainWorkflow.invokeStep(stepName, state);
  }
  
  // Legacy methods for backwards compatibility
  async runCompleteWorkflowLegacy(problemStatement: string, projectId?: string): Promise<AppState> {
    const result = await this.runCompleteWorkflow(problemStatement, projectId);
    
    // Convert WorkflowState to AppState for backwards compatibility
    return {
      ...result,
      problemStatement: result.coreProblem.originalInput,
      validatedProblem: result.coreProblem.isValid ? {
        validated_problem: result.coreProblem.validatedStatement,
        is_valid: result.coreProblem.isValid,
        feedback: result.coreProblem.feedback || ''
      } : undefined
    };
  }
  
  getAvailableSteps(): string[] {
    return [
      "validateProblem",
      "generatePersonas", 
      "generatePainPoints",
      "generateSolutions",
      "focusGroup",
      "generateDocuments",
      "saveFinalState"
    ];
  }
  
  getStepDescription(stepName: string): string {
    const descriptions: Record<string, string> = {
      validateProblem: "Validates and refines the initial problem statement",
      generatePersonas: "Creates diverse user personas based on the validated problem",
      generatePainPoints: "Generates specific pain points for each persona",
      generateSolutions: "Creates potential solutions to address the pain points",
      focusGroup: "Runs a simulated focus group to identify key features and generate user stories",
      generateDocuments: "Generates comprehensive project documentation (Product Vision, Functional Requirements, etc.)",
      saveFinalState: "Saves the complete workflow state to the database"
    };
    
    return descriptions[stepName] || "Unknown step";
  }
}

// Export the main orchestrator
export const orchestrator = new LangGraphOrchestrator();

// Export types for external use
export type { WorkflowState, AppState, Feature, MustHaveFeature };

// Legacy export for backwards compatibility
export { LangGraphOrchestrator };

// Utility functions for working with the state
export const StateUtils = {
  createInitialState: (problemStatement: string, projectId?: string): WorkflowState => ({
    projectId: projectId || `project_${Date.now()}`,
    coreProblem: {
      id: `problem_${Date.now()}`,
      originalInput: problemStatement,
      validatedStatement: '',
      isValid: false
    },
    personas: [],
    painPoints: [],
    solutions: [],
    keyFeatures: [],
    mustHaveFeatures: [],
    userStories: [],
    finalDocuments: {},
    prompts: { ...DEFAULT_PROMPTS },
    lockedItems: {
      personas: [],
      painPoints: [],
      solutions: []
    },
    currentStep: 'initialize',
    errors: [],
    metadata: { created_at: new Date().toISOString() }
  }),
  
  isWorkflowComplete: (state: WorkflowState): boolean => {
    return state.currentStep === 'workflow_complete' && 
           state.coreProblem.isValid &&
           state.personas.length > 0 &&
           state.solutions.length > 0 &&
           state.userStories.length > 0 &&
           Object.keys(state.finalDocuments).length > 0;
  },
  
  getProgress: (state: WorkflowState): { completed: number; total: number; percentage: number } => {
    const steps = [
      state.coreProblem.isValid,
      state.personas.length > 0,
      state.painPoints.length > 0,
      state.solutions.length > 0,
      state.keyFeatures.length > 0,
      state.userStories.length > 0,
      Object.keys(state.finalDocuments).length > 0
    ];
    
    const completed = steps.filter(Boolean).length;
    const total = steps.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  }
};

// =======================================================================================
// 5. STREAMING WORKFLOW ENTRY POINT
// =======================================================================================

/**
 * Main entry point for invoking the entire workflow with streaming capabilities.
 * The UI can call this function with the initial problem and any user-defined prompts.
 * 
 * @param projectId - Unique identifier for the project
 * @param problemInput - The initial problem statement
 * @param customPrompts - Optional custom prompts to override defaults
 * @param lockedItems - Optional locked items to avoid regenerating
 * @param onStepComplete - Callback function called after each step completion
 */
export async function runFullWorkflow(
  projectId: string,
  problemInput: string,
  customPrompts?: Partial<typeof DEFAULT_PROMPTS>,
  lockedItems?: Partial<WorkflowState['lockedItems']>,
  onStepComplete?: (stepName: string, state: WorkflowState) => void
): Promise<WorkflowState> {
  const initialState: WorkflowState = {
    projectId,
    coreProblem: { 
      id: `problem_${Date.now()}`,
      originalInput: problemInput,
      validatedStatement: '',
      isValid: false
    },
    personas: [],
    painPoints: [],
    solutions: [],
    keyFeatures: [],
    mustHaveFeatures: [],
    userStories: [],
    finalDocuments: {},
    prompts: { ...DEFAULT_PROMPTS, ...customPrompts },
    lockedItems: { 
      personas: [],
      painPoints: [],
      solutions: [],
      ...lockedItems
    },
    currentStep: 'initialize',
    errors: [],
    metadata: { created_at: new Date().toISOString() }
  };

  // Create the main workflow orchestrator
  const orchestrator = new LangGraphOrchestrator();
  
  try {
    // Use the existing runCompleteWorkflow but enhance with step tracking
    const finalState = await orchestrator.runCompleteWorkflow(problemInput, projectId);
    
    // Call the step completion callback if provided
    if (onStepComplete) {
      onStepComplete(finalState.currentStep || 'complete', finalState);
    }
    
    console.log("✅ Full workflow completed successfully!");
    return finalState;
  } catch (error) {
    console.error("❌ Full workflow execution failed:", error);
    throw error;
  }
}

/**
 * Utility function to update prompts in an existing workflow state
 */
export function updateWorkflowPrompts(
  state: WorkflowState,
  newPrompts: Partial<typeof DEFAULT_PROMPTS>
): WorkflowState {
  return {
    ...state,
    prompts: { ...state.prompts, ...newPrompts }
  };
}

/**
 * Export the default prompts for external use
 */
export { DEFAULT_PROMPTS };