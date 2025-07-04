import { WorkflowStateType } from "../state/annotations";
import { withErrorHandling } from "../utils/error-handling";
import { llmClient } from "../utils/llm-client";
import { SolutionGenerationResponseSchema } from "../schemas/api.schema";
import { Solution } from "../schemas/entities.schema";

async function generateSolutionsNode(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  const { coreProblem, personas, painPoints, lockedItems } = state;
  
  const prompt = `
    Based on the validated problem, personas, and pain points, generate innovative 
    solutions that address the core issues.
    
    Problem: "${coreProblem.validatedStatement}"
    
    Key Pain Points: ${painPoints.map(pp => `${pp.description} (${pp.severity})`).join('\n')}
    
    Target Personas: ${personas.map(p => `${p.name} (${p.role})`).join(', ')}
    
    ${lockedItems.solutions.length > 0 ? `
    Avoid duplicating these existing solutions: 
    ${lockedItems.solutions.join(', ')}
    ` : ''}
    
    Generate 6-8 diverse solutions with:
    - Creative and practical approaches
    - Different complexity levels (low, medium, high)
    - Varied impact potential (low, medium, high)
    - Clear technical approaches
    - Business impact explanations
    - Target persona mappings
    
    Return JSON with structure:
    {
      "solutions": [{
        "title": "solution title",
        "description": "detailed solution description",
        "complexity": "low|medium|high",
        "impact": "low|medium|high",
        "technical_approach": "how to implement technically",
        "business_impact": "business value explanation",
        "target_personas": ["persona names this solution addresses"]
      }]
    }
  `;
  
  const result = await llmClient.callWithSchema(
    prompt,
    SolutionGenerationResponseSchema
  );
  
  const solutions: Solution[] = result.solutions.map((s, index) => ({
    id: `solution_${Date.now()}_${index}`,
    title: s.title,
    name: s.title, // backwards compatibility
    description: s.description,
    complexity: s.complexity,
    impact: s.impact,
    technical_approach: s.technical_approach,
    business_impact: s.business_impact,
    target_personas: s.target_personas
  }));
  
  return { solutions };
}

export const generateSolutions = withErrorHandling(
  "generateSolutions",
  generateSolutionsNode
); 