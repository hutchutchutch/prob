import { z } from 'zod';

// Base schemas for business entities
export const PersonaSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  demographics: z.string(),
  role: z.string(),
  industry: z.string(),
  description: z.string(),
  goals: z.array(z.string()),
  pain_points: z.array(z.string()),
  tech_level: z.enum(['low', 'medium', 'high']),
  painDegree: z.number().min(1).max(5)
});

export const PainPointSchema = z.object({
  id: z.string(),
  description: z.string().min(10),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  impactArea: z.string(),
  persona_id: z.string().optional()
});

export const SolutionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  name: z.string(), // backwards compatibility
  description: z.string().min(20),
  target_personas: z.array(z.string()),
  technical_approach: z.string(),
  business_impact: z.string(),
  complexity: z.enum(['low', 'medium', 'high']),
  impact: z.enum(['low', 'medium', 'high'])
});

export const FeatureSchema = z.object({
  id: z.string(),
  text: z.string().min(5),
  sourceSolutionId: z.string(),
  sourcePersonaId: z.string(),
  votes: z.number().default(0)
});

export const MustHaveFeatureSchema = FeatureSchema.extend({
  comments: z.array(z.object({
    personaId: z.string(),
    personaName: z.string(),
    comment: z.string()
  }))
});

export const UserStorySchema = z.object({
  id: z.string(),
  title: z.string(),
  asA: z.string(),
  iWant: z.string(),
  soThat: z.string(),
  acceptanceCriteria: z.array(z.string())
});

// Type exports
export type Persona = z.infer<typeof PersonaSchema>;
export type PainPoint = z.infer<typeof PainPointSchema>;
export type Solution = z.infer<typeof SolutionSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type MustHaveFeature = z.infer<typeof MustHaveFeatureSchema>;
export type UserStory = z.infer<typeof UserStorySchema>; 