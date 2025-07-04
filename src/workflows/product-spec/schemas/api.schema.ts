import { z } from 'zod';

// LLM API response schemas
export const ProblemValidationResponseSchema = z.object({
  isValid: z.boolean(),
  feedback: z.string(),
  validatedProblem: z.string()
});

export const PersonaGenerationResponseSchema = z.object({
  personas: z.array(z.object({
    name: z.string(),
    industry: z.string(),
    role: z.string(),
    description: z.string(),
    painDegree: z.number().optional(),
    demographics: z.string().optional(),
    goals: z.array(z.string()).optional(),
    pain_points: z.array(z.string()).optional(),
    tech_level: z.string().optional()
  }))
});

export const PainPointGenerationResponseSchema = z.object({
  painPoints: z.array(z.object({
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    impactArea: z.string(),
    persona_id: z.string().optional()
  }))
});

export const SolutionGenerationResponseSchema = z.object({
  solutions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    complexity: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    technical_approach: z.string(),
    business_impact: z.string(),
    target_personas: z.array(z.string())
  }))
});

export const FeatureGenerationResponseSchema = z.object({
  keyFeature: z.string()
});

export const VotingResponseSchema = z.object({
  votes: z.array(z.string())
});

export const CommentResponseSchema = z.object({
  comment: z.string()
});

export const UserStoriesResponseSchema = z.object({
  userStories: z.array(z.object({
    title: z.string(),
    asA: z.string(),
    iWant: z.string(),
    soThat: z.string(),
    acceptanceCriteria: z.array(z.string())
  }))
});

export const DocumentGenerationResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  sections: z.array(z.string()).optional()
});

// Type exports
export type ProblemValidationResponse = z.infer<typeof ProblemValidationResponseSchema>;
export type PersonaGenerationResponse = z.infer<typeof PersonaGenerationResponseSchema>;
export type PainPointGenerationResponse = z.infer<typeof PainPointGenerationResponseSchema>;
export type SolutionGenerationResponse = z.infer<typeof SolutionGenerationResponseSchema>;
export type FeatureGenerationResponse = z.infer<typeof FeatureGenerationResponseSchema>;
export type VotingResponse = z.infer<typeof VotingResponseSchema>;
export type CommentResponse = z.infer<typeof CommentResponseSchema>;
export type UserStoriesResponse = z.infer<typeof UserStoriesResponseSchema>;
export type DocumentGenerationResponse = z.infer<typeof DocumentGenerationResponseSchema>; 