import { z } from 'zod';
import { 
  PersonaSchema, 
  PainPointSchema, 
  SolutionSchema, 
  FeatureSchema, 
  MustHaveFeatureSchema,
  UserStorySchema 
} from './entities.schema';

export const CoreProblemSchema = z.object({
  id: z.string(),
  originalInput: z.string(),
  validatedStatement: z.string(),
  isValid: z.boolean(),
  feedback: z.string().optional()
});

export const FinalDocumentsSchema = z.object({
  productVision: z.string().optional(),
  functionalRequirements: z.string().optional(),
  systemArchitecture: z.string().optional(),
  dataFlowDiagram: z.string().optional(),
  entityRelationshipDiagram: z.string().optional(),
  designSystem: z.string().optional()
});

export const LockedItemsSchema = z.object({
  personas: z.array(z.string()),
  painPoints: z.array(z.string()),
  solutions: z.array(z.string())
});

export const WorkflowStateSchema = z.object({
  projectId: z.string(),
  coreProblem: CoreProblemSchema,
  personas: z.array(PersonaSchema),
  painPoints: z.array(PainPointSchema),
  solutions: z.array(SolutionSchema),
  keyFeatures: z.array(FeatureSchema),
  mustHaveFeatures: z.array(MustHaveFeatureSchema),
  userStories: z.array(UserStorySchema),
  finalDocuments: FinalDocumentsSchema,
  prompts: z.record(z.string()),
  lockedItems: LockedItemsSchema,
  currentStep: z.string().optional(),
  errors: z.array(z.string()),
  metadata: z.record(z.any())
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
export type CoreProblem = z.infer<typeof CoreProblemSchema>;
export type FinalDocuments = z.infer<typeof FinalDocumentsSchema>;
export type LockedItems = z.infer<typeof LockedItemsSchema>; 