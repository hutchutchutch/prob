// Workflow configuration and constants
export const WORKFLOW_CONFIG = {
  name: 'product-spec',
  version: '2.0',
  description: 'Complete product specification workflow with focus groups and document generation',
  
  // Default timeouts (in milliseconds)
  timeouts: {
    node: 120000, // 2 minutes per node
    workflow: 600000, // 10 minutes total
  },
  
  // Retry configuration
  retries: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
  
  // Generation limits
  limits: {
    maxPersonas: 5,
    maxSolutions: 8,
    maxPainPoints: 10,
    maxUserStories: 6,
    maxKeyFeatures: 15,
    maxMustHaveFeatures: 3,
  }
};

export const NODE_NAMES = {
  VALIDATE_PROBLEM: 'validateProblem',
  GENERATE_PERSONAS: 'generatePersonas',
  GENERATE_PAIN_POINTS: 'generatePainPoints',
  GENERATE_SOLUTIONS: 'generateSolutions',
  FOCUS_GROUP: 'focusGroup',
  GENERATE_DOCUMENTS: 'generateDocuments',
  SAVE_FINAL_STATE: 'saveFinalState',
} as const;

export type NodeName = typeof NODE_NAMES[keyof typeof NODE_NAMES]; 