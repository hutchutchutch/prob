import { Annotation } from "@langchain/langgraph";
import { 
  WorkflowState, 
  CoreProblem, 
  FinalDocuments,
  LockedItems
} from "../schemas/state.schema";
import {
  Persona, 
  PainPoint, 
  Solution,
  Feature,
  MustHaveFeature,
  UserStory
} from "../schemas/entities.schema";

// Custom reducers
import { 
  arrayReplaceReducer, 
  arrayAppendReducer, 
  objectMergeReducer,
  errorAccumulatorReducer 
} from "./reducers";

export const WorkflowStateAnnotation = Annotation.Root({
  projectId: Annotation<string>,
  
  coreProblem: Annotation<CoreProblem>({
    reducer: (current, next) => next || current,
    default: () => ({
      id: '',
      originalInput: '',
      validatedStatement: '',
      isValid: false
    })
  }),
  
  personas: Annotation<Persona[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  painPoints: Annotation<PainPoint[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  solutions: Annotation<Solution[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  keyFeatures: Annotation<Feature[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  mustHaveFeatures: Annotation<MustHaveFeature[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  userStories: Annotation<UserStory[]>({
    reducer: arrayReplaceReducer,
    default: () => []
  }),
  
  finalDocuments: Annotation<FinalDocuments>({
    reducer: objectMergeReducer,
    default: () => ({})
  }),
  
  prompts: Annotation<Record<string, string>>({
    reducer: objectMergeReducer,
    default: () => ({})
  }),
  
  lockedItems: Annotation<LockedItems>({
    reducer: objectMergeReducer,
    default: () => ({
      personas: [],
      painPoints: [],
      solutions: []
    })
  }),
  
  currentStep: Annotation<string>({
    reducer: (current, next) => next || current,
    default: () => 'initialize'
  }),
  
  errors: Annotation<string[]>({
    reducer: errorAccumulatorReducer,
    default: () => []
  }),
  
  metadata: Annotation<Record<string, any>>({
    reducer: objectMergeReducer,
    default: () => ({
      created_at: new Date().toISOString()
    })
  })
});

export type WorkflowStateType = typeof WorkflowStateAnnotation.State; 