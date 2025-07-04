import { WorkflowStateType } from "../../state/annotations";
import { llmClient } from "../../utils/llm-client";
import { UserStoriesResponseSchema } from "../../schemas/api.schema";
import { Feature, MustHaveFeature, UserStory } from "../../schemas/entities.schema";

export async function focusGroupSubgraph(
  state: WorkflowStateType
): Promise<Partial<WorkflowStateType>> {
  console.log("--- FOCUS GROUP SUBGRAPH ---");
  
  const { coreProblem, personas, solutions } = state;
  
  // Simplified focus group: Generate key features and user stories
  const keyFeatures: Feature[] = solutions.slice(0, 3).map((solution, index) => ({
    id: `feature_${Date.now()}_${index}`,
    text: `Key feature from ${solution.title}`,
    sourceSolutionId: solution.id,
    sourcePersonaId: personas[0]?.id || '',
    votes: 5 - index // Simulate voting
  }));
  
  const mustHaveFeatures: MustHaveFeature[] = keyFeatures.map(feature => ({
    ...feature,
    comments: personas.slice(0, 2).map(persona => ({
      personaId: persona.id,
      personaName: persona.name,
      comment: `This feature would help with ${persona.pain_points[0] || 'main issues'}`
    }))
  }));
  
  // Generate user stories
  const prompt = `
    Based on this problem and the personas, create 6 user stories.
    
    Problem: ${coreProblem.validatedStatement}
    Personas: ${personas.map(p => `${p.name} (${p.role})`).join(', ')}
    
    Return JSON: {
      "userStories": [{
        "title": "string",
        "asA": "string", 
        "iWant": "string",
        "soThat": "string",
        "acceptanceCriteria": ["string"]
      }]
    }
  `;
  
  const result = await llmClient.callWithSchema(prompt, UserStoriesResponseSchema);
  
  const userStories: UserStory[] = result.userStories.map((story, index) => ({
    id: `story_${Date.now()}_${index}`,
    title: story.title,
    asA: story.asA,
    iWant: story.iWant,
    soThat: story.soThat,
    acceptanceCriteria: story.acceptanceCriteria
  }));
  
  return {
    keyFeatures,
    mustHaveFeatures,
    userStories,
    currentStep: 'focus_group_complete'
  };
} 