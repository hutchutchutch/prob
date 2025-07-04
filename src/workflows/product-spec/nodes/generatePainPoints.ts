import { WorkflowStateType } from "../state/annotations";
import { withErrorHandling } from "../utils/error-handling";
import { llmClient } from "../utils/llm-client";
import { PainPointGenerationResponseSchema } from "../schemas/api.schema";
import { PainPoint } from "../schemas/entities.schema";

async function generatePainPointsNode(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  const { coreProblem, personas, lockedItems } = state;
  
  const prompt = `
    Based on this validated problem and the personas, generate specific pain points 
    that these users experience.
    
    Problem: "${coreProblem.validatedStatement}"
    
    Personas: ${personas.map(p => `${p.name} (${p.role}): ${p.description}`).join('\n')}
    
    ${lockedItems.painPoints.length > 0 ? `
    Avoid duplicating these existing pain points: 
    ${lockedItems.painPoints.join(', ')}
    ` : ''}
    
    Generate 8-10 specific pain points with:
    - Clear, actionable descriptions
    - Severity levels (low, medium, high, critical)
    - Impact areas (workflow, communication, efficiency, etc.)
    - Optional persona association
    
    Return JSON with structure:
    {
      "painPoints": [{
        "description": "specific pain point description",
        "severity": "low|medium|high|critical",
        "impactArea": "impact area name",
        "persona_id": "optional persona id"
      }]
    }
  `;
  
  const result = await llmClient.callWithSchema(
    prompt,
    PainPointGenerationResponseSchema
  );
  
  const painPoints: PainPoint[] = result.painPoints.map((pp, index) => ({
    id: `painpoint_${Date.now()}_${index}`,
    description: pp.description,
    severity: pp.severity,
    impactArea: pp.impactArea,
    persona_id: pp.persona_id
  }));
  
  return { painPoints };
}

export const generatePainPoints = withErrorHandling(
  "generatePainPoints",
  generatePainPointsNode
); 