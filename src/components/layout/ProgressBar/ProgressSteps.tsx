import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  className = '',
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Connecting lines background */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700" />
      
      {/* Progress overlay on connecting lines */}
      <div 
        className="absolute top-4 left-0 h-0.5 bg-primary-600 transition-all duration-slow"
        style={{ 
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
        }}
      />
      
      {/* Steps grid */}
      <div 
        className="grid w-full"
        style={{ 
          gridTemplateColumns: `repeat(${totalSteps}, 1fr)`,
        }}
      >
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const label = stepLabels[step - 1] || `Step ${step}`;

          return (
            <div key={step} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-base',
                  'ring-2 ring-offset-2 ring-offset-gray-900',
                  isCompleted && 'bg-primary-600 ring-primary-600',
                  isCurrent && 'bg-gray-700 ring-primary-500 animate-pulse-glow',
                  !isCompleted && !isCurrent && 'bg-gray-700 ring-gray-600'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn(
                    'text-sm font-medium',
                    isCurrent ? 'text-white' : 'text-gray-400'
                  )}>
                    {step}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium text-center',
                (isCompleted || isCurrent) ? 'text-gray-300' : 'text-gray-500'
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};