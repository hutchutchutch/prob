import { WorkflowStateType } from "../../state/annotations";
import { llmClient } from "../../utils/llm-client";
import { DocumentGenerationResponseSchema } from "../../schemas/api.schema";

async function generateDocument(
  state: WorkflowStateType, 
  docType: string, 
  promptTemplate: string
): Promise<string> {
  const { coreProblem, personas, solutions, userStories, mustHaveFeatures } = state;
  
  const context = {
    problem: coreProblem.validatedStatement,
    personas: personas.map(p => `${p.name} (${p.role}): ${p.description}`),
    solutions: solutions.map(s => `${s.title}: ${s.description}`),
    userStories: userStories.map(us => `${us.title}: As a ${us.asA}, I want ${us.iWant} so that ${us.soThat}`),
    mustHaveFeatures: mustHaveFeatures.map(f => f.text)
  };
  
  const prompt = `
    Generate a ${docType} document based on this context and template.
    
    Context:
    ${JSON.stringify(context, null, 2)}
    
    Template Instructions: ${promptTemplate}
    
    Return a well-structured document in JSON format:
    {
      "title": "document title",
      "content": "complete document content in markdown format"
    }
  `;
  
  const result = await llmClient.callWithSchema(prompt, DocumentGenerationResponseSchema);
  return result.content;
}

export async function documentGenerationSubgraph(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  console.log("--- DOCUMENT GENERATION SUBGRAPH ---");
  
  const finalDocuments: Record<string, string> = {};
  
  // Generate documents using prompts from state
  const documentTypes = [
    { key: 'productVision', name: 'Product Vision' },
    { key: 'functionalRequirements', name: 'Functional Requirements' },
    { key: 'systemArchitecture', name: 'System Architecture' },
    { key: 'dataFlowDiagram', name: 'Data Flow Diagram' },
    { key: 'entityRelationshipDiagram', name: 'Entity Relationship Diagram' },
    { key: 'designSystem', name: 'Design System' }
  ];
  
  for (const docType of documentTypes) {
    console.log(`Generating ${docType.name}...`);
    
    const promptTemplate = state.prompts[docType.key] || 
      `Create a comprehensive ${docType.name} document based on the provided context.`;
    
    try {
      finalDocuments[docType.key] = await generateDocument(state, docType.name, promptTemplate);
    } catch (error) {
      console.error(`Failed to generate ${docType.name}:`, error);
      finalDocuments[docType.key] = `# ${docType.name}\n\nError generating document: ${error}`;
    }
  }
  
  console.log("✓ Document generation completed");
  
  return {
    finalDocuments,
    currentStep: 'documents_complete'
  };
} 