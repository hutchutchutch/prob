import { z } from 'zod';
import { CoreProblemSchema } from '../../../schemas/state.schema';
import { 
  PersonaSchema, 
  SolutionSchema, 
  FeatureSchema, 
  MustHaveFeatureSchema,
  UserStorySchema 
} from '../../../schemas/entities.schema';

// Focus group shares some parent state but has its own internal state
export const FocusGroupStateSchema = z.object({
  // Inherited from parent
  coreProblem: CoreProblemSchema,
  personas: z.array(PersonaSchema),
  solutions: z.array(SolutionSchema),
  
  // Focus group specific
  keyFeatures: z.array(FeatureSchema),
  mustHaveFeatures: z.array(MustHaveFeatureSchema),
  userStories: z.array(UserStorySchema),
  
  // Internal tracking
  votingRounds: z.number().default(0),
  currentPhase: z.enum(['ideation', 'voting', 'discussion', 'synthesis']).optional()
});

export type FocusGroupState = z.infer<typeof FocusGroupStateSchema>; 