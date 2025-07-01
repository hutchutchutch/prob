import React from 'react';
import { cn } from '@/utils/cn';
import { PersonaCircles } from './PersonaCircles';
import { ProgressSteps } from './ProgressSteps';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  personas?: Array<{ id: string; name: string; avatar?: string }>;
  showPersonas?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  personas = [],
  showPersonas = true,
  className = '',
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-2xl font-semibold text-white">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {showPersonas && personas.length > 0 && (
          <PersonaCircles personas={personas} />
        )}
      </div>
      
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
        </div>
      </div>
      
      <ProgressSteps 
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    </div>
  );
}; 