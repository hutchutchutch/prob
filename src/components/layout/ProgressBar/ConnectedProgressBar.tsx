import React from 'react';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { useWorkflowProgress } from '../../../hooks/useWorkflowProgress';

export const ConnectedProgressBar: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    completedSteps,
    lockedSteps,
    personas,
    connections,
    documentProgress,
    canNavigate,
    navigateToStep
  } = useWorkflowProgress();

  return (
    <ProgressBar
      currentStep={currentStep}
      totalSteps={totalSteps}
      completedSteps={completedSteps}
      lockedSteps={lockedSteps}
      personas={personas}
      connections={connections}
      documentProgress={documentProgress}
      canNavigate={canNavigate}
      onStepClick={navigateToStep}
    />
  );
};