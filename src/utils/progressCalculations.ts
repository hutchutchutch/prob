import type { Node } from '@xyflow/react';
import type { WorkflowStep } from '../types/workflow.types';

interface ProgressMetrics {
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  currentStepProgress: number;
  estimatedTimeRemaining: number; // in minutes
}

interface StepRequirements {
  minNodes?: number;
  requiredNodeTypes?: string[];
  validationRequired?: boolean;
}

const stepRequirements: Record<WorkflowStep, StepRequirements> = {
  'problem_input': {
    minNodes: 1,
    requiredNodeTypes: ['coreProblem'],
    validationRequired: true
  },
  'persona_discovery': {
    minNodes: 3,
    requiredNodeTypes: ['persona']
  },
  'pain_points': {
    minNodes: 5,
    requiredNodeTypes: ['painPoint']
  },
  'solution_mapping': {
    minNodes: 3,
    requiredNodeTypes: ['solution']
  },
  'documentation': {
    minNodes: 5,
    requiredNodeTypes: ['document']
  }
};

const stepTimeEstimates: Record<WorkflowStep, number> = {
  'problem_input': 2,    // minutes
  'persona_discovery': 3,
  'pain_points': 5,
  'solution_mapping': 7,
  'documentation': 15
};

export const calculateWorkflowProgress = (
  currentStep: WorkflowStep,
  nodes: Node[]
): ProgressMetrics => {
  const steps: WorkflowStep[] = [
    'problem_input',
    'persona_discovery',
    'pain_points',
    'solution_mapping',
    'documentation'
  ];

  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length;

  // Calculate completed steps
  let completedSteps = 0;
  for (let i = 0; i < currentStepIndex; i++) {
    if (isStepComplete(steps[i], nodes)) {
      completedSteps++;
    }
  }

  // Calculate current step progress
  const currentStepProgress = calculateStepProgress(currentStep, nodes);

  // Overall percentage
  const percentage = Math.round(
    ((completedSteps + currentStepProgress) / totalSteps) * 100
  );

  // Estimated time remaining
  const estimatedTimeRemaining = calculateTimeRemaining(currentStep, steps, nodes);

  return {
    percentage,
    completedSteps,
    totalSteps,
    currentStepProgress,
    estimatedTimeRemaining
  };
};

export const isStepComplete = (step: WorkflowStep, nodes: Node[]): boolean => {
  const requirements = stepRequirements[step];
  if (!requirements) return false;

  const relevantNodes = nodes.filter(node => 
    requirements.requiredNodeTypes?.includes(node.type || '')
  );

  // Check minimum nodes
  if (requirements.minNodes && relevantNodes.length < requirements.minNodes) {
    return false;
  }

  // Check validation for problem input
  if (step === 'problem_input' && requirements.validationRequired) {
    const problemNode = nodes.find(n => n.type === 'coreProblem');
    return problemNode?.data?.validated === true;
  }

  // Check if all documents are complete
  if (step === 'documentation') {
    const documentNodes = nodes.filter(n => n.type === 'document');
    const completedDocs = documentNodes.filter(n => n.data?.status === 'completed');
    return completedDocs.length >= (requirements.minNodes || 0);
  }

  return relevantNodes.length >= (requirements.minNodes || 0);
};

export const calculateStepProgress = (step: WorkflowStep, nodes: Node[]): number => {
  const requirements = stepRequirements[step];
  if (!requirements || !requirements.requiredNodeTypes) return 0;

  const relevantNodes = nodes.filter(node => 
    requirements.requiredNodeTypes?.includes(node.type || '')
  );

  const minRequired = requirements.minNodes || 1;
  const progress = Math.min(relevantNodes.length / minRequired, 1);

  // Special handling for documentation step
  if (step === 'documentation') {
    const documentNodes = nodes.filter(n => n.type === 'document');
    const completedDocs = documentNodes.filter(n => n.data?.status === 'completed');
    const inProgressDocs = documentNodes.filter(n => n.data?.status === 'processing');
    
    if (documentNodes.length === 0) return 0;
    
    // Give partial credit for in-progress docs
    const completedWeight = completedDocs.length;
    const inProgressWeight = inProgressDocs.length * 0.5;
    
    return Math.min((completedWeight + inProgressWeight) / minRequired, 1);
  }

  return progress;
};

export const calculateTimeRemaining = (
  currentStep: WorkflowStep,
  allSteps: WorkflowStep[],
  nodes: Node[]
): number => {
  const currentIndex = allSteps.indexOf(currentStep);
  let totalTime = 0;

  // Add remaining time for current step
  const currentStepProgress = calculateStepProgress(currentStep, nodes);
  const currentStepTime = stepTimeEstimates[currentStep] || 0;
  totalTime += currentStepTime * (1 - currentStepProgress);

  // Add time for all remaining steps
  for (let i = currentIndex + 1; i < allSteps.length; i++) {
    totalTime += stepTimeEstimates[allSteps[i]] || 0;
  }

  return Math.round(totalTime);
};

export const getStepStats = (
  step: WorkflowStep,
  nodes: Node[],
  edges: any[]
): { label: string; value: string | number }[] => {
  const stats: { label: string; value: string | number }[] = [];

  switch (step) {
    case 'persona_discovery':
      const personas = nodes.filter(n => n.type === 'persona');
      if (personas.length > 0) {
        const avgPain = personas.reduce((sum, p) => sum + (p.data.pain_degree || 0), 0) / personas.length;
        stats.push(
          { label: 'Personas', value: personas.length },
          { label: 'Avg Pain', value: avgPain.toFixed(1) }
        );
      }
      break;

    case 'pain_points':
      const painPoints = nodes.filter(n => n.type === 'painPoint');
      const painConnections = edges.filter(e => 
        nodes.find(n => n.id === e.target && n.type === 'painPoint')
      );
      stats.push(
        { label: 'Pain Points', value: painPoints.length },
        { label: 'Connections', value: painConnections.length }
      );
      break;

    case 'solution_mapping':
      const solutions = nodes.filter(n => n.type === 'solution');
      const votedSolutions = solutions.filter(s => s.data.voting_results?.total_votes > 0);
      stats.push(
        { label: 'Solutions', value: solutions.length },
        { label: 'Voted', value: votedSolutions.length }
      );
      break;

    case 'documentation':
      const documents = nodes.filter(n => n.type === 'document');
      const completedDocs = documents.filter(d => d.data.status === 'completed');
      stats.push(
        { label: 'Documents', value: `${completedDocs.length}/${documents.length}` },
        { label: 'Progress', value: `${Math.round((completedDocs.length / Math.max(documents.length, 1)) * 100)}%` }
      );
      break;
  }

  return stats;
};