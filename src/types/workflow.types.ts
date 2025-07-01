export type WorkflowStep = 
  | 'problem_input'
  | 'persona_discovery'
  | 'pain_points'
  | 'solution_generation'
  | 'user_stories'
  | 'architecture'
  | 'export';

export interface ValidationResult {
  isValid: boolean;
  validatedProblem?: string;
  feedback?: string;
  coreProblemId?: string;
}

export interface CoreProblem {
  id: string;
  projectId: string;
  originalInput: string;
  validatedProblem?: string;
  isValid: boolean;
  validationFeedback?: string;
  version: number;
  createdAt: string;
}

export interface Persona {
  id: string;
  coreProblemId: string;
  name: string;
  industry: string;
  role: string;
  painDegree: number;
  position: number;
  isLocked: boolean;
  isActive: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface PainPoint {
  id: string;
  personaId: string;
  description: string;
  severity?: string;
  impactArea?: string;
  position: number;
  isLocked: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface Solution {
  id: string;
  projectId: string;
  personaId: string;
  title: string;
  description: string;
  solutionType?: string;
  complexity?: string;
  position: number;
  isLocked: boolean;
  isSelected: boolean;
  generationBatch?: string;
  createdAt: string;
}

export interface SolutionPainPointMapping {
  id: string;
  solutionId: string;
  painPointId: string;
  relevanceScore: number;
}

export interface UserStory {
  id: string;
  projectId: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority?: string;
  complexityPoints?: number;
  position: number;
  isEdited: boolean;
  originalContent?: string;
  editedContent?: string;
  createdAt: string;
}