import { WorkflowStateType } from "../state/annotations";
import { withErrorHandling } from "../utils/error-handling";
import { llmClient } from "../utils/llm-client";
import { PersonaGenerationResponseSchema } from "../schemas/api.schema";
import { Persona } from "../schemas/entities.schema";

async function generatePersonasNode(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  const { coreProblem, lockedItems } = state;
  
  const prompt = `
    Based on this validated problem, generate 5 diverse user personas who would 
    be most affected by this issue.
    
    Problem: "${coreProblem.validatedStatement}"
    
    ${lockedItems.personas.length > 0 ? `
    Avoid creating personas similar to these existing ones: 
    ${lockedItems.personas.join(', ')}
    ` : ''}
    
    Each persona should have:
    - Unique background and role
    - Specific pain points related to the problem
    - Clear goals and motivations
    - Varied technical expertise levels
    - Pain degree rating (1-5, where 5 is most affected)
    
    Return JSON with structure:
    {
      "personas": [{
        "name": "string",
        "industry": "string",
        "role": "string",
        "description": "string",
        "painDegree": number (1-5),
        "demographics": "string",
        "goals": ["string"],
        "pain_points": ["string"],
        "tech_level": "low|medium|high"
      }]
    }
  `;
  
  const result = await llmClient.callWithSchema(
    prompt,
    PersonaGenerationResponseSchema
  );
  
  const personas: Persona[] = result.personas.map((p, index) => ({
    id: `persona_${Date.now()}_${index}`,
    name: p.name,
    industry: p.industry || 'General',
    role: p.role,
    description: p.description,
    painDegree: p.painDegree || 3,
    demographics: p.demographics || '',
    goals: p.goals || [],
    pain_points: p.pain_points || [],
    tech_level: (p.tech_level as any) || 'medium'
  }));
  
  return { personas };
}

export const generatePersonas = withErrorHandling(
  "generatePersonas",
  generatePersonasNode
); 