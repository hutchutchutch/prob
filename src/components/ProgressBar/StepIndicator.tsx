import React from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ProgressStep } from './ProgressBar';

interface StepIndicatorProps {
  step: ProgressStep;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  isFuture: boolean;
  isLocked: boolean;
  isValidated: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  isCompleted,
  isActive,
  isFuture,
  isLocked,
  isValidated
}) => {
  const renderIcon = () => {
    if (isLocked) {
      return <Lock className="segment-icon" />;
    }
    if (isCompleted) {
      return <Check className="segment-icon" />;
    }
    return step.icon;
  };

  return (
    <>
      <div
        className={cn(
          'segment-circle',
          isCompleted && 'segment-circle--completed',
          isActive && 'segment-circle--active',
          isFuture && 'segment-circle--future'
        )}
      >
        {renderIcon()}
      </div>

      {/* Validation indicator for problem input */}
      {index === 0 && (
        <div
          className={cn(
            'validation-indicator',
            isValidated && 'validation-indicator--show'
          )}
        />
      )}
    </>
  );
};