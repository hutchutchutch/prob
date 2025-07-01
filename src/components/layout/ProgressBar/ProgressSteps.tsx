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
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const label = stepLabels[step - 1] || `Step ${step}`;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
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
                'text-xs font-medium',
                (isCompleted || isCurrent) ? 'text-gray-300' : 'text-gray-500'
              )}>
                {label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className="h-0.5 bg-gray-700 relative overflow-hidden">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 bg-primary-600 transition-all duration-slow',
                      isCompleted && 'w-full'
                    )}
                    style={{
                      width: isCurrent ? '50%' : isCompleted ? '100%' : '0%'
                    }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};