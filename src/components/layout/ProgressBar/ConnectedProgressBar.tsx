import React from 'react';
import { ProgressBar } from './ProgressBar';
import { useWorkflowStore } from '@/stores/workflowStore';

const WORKFLOW_STEPS = [
  'problem_input',
  'persona_discovery', 
  'pain_point_analysis',
  'solution_ideation',
  'user_story_creation'
];

export const ConnectedProgressBar: React.FC = () => {
  const { currentStep, personas } = useWorkflowStore();
  
  const currentStepIndex = WORKFLOW_STEPS.indexOf(currentStep) + 1;
  const totalSteps = WORKFLOW_STEPS.length;
  
  const formattedPersonas = personas.slice(0, 5).map(persona => ({
    id: persona.id,
    name: persona.name,
    avatar: undefined // We don't have avatars yet
  }));

  return (
    <ProgressBar
      currentStep={currentStepIndex}
      totalSteps={totalSteps}
      personas={formattedPersonas}
      showPersonas={personas.length > 0}
    />
  );
}; 