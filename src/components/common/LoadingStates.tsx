import React from 'react';
import { cn } from '@/utils/cn';

// Spinner Component
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <div
      className={cn(
        'spinner',
        spinnerSizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

// Skeleton Component
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = true,
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-gray-800',
        animation && 'skeleton',
        variantClasses[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
    />
  );
};

// Loading Overlay Component
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  fullScreen = false,
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-900/75 backdrop-blur-sm z-50',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0'
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
};

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressVariants = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  error: 'bg-error-600',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-700 rounded-full overflow-hidden', progressSizes[size])}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            progressVariants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// Progress Steps Component (Following Design System M4)
// Usage Example:
// <ProgressSteps 
//   currentStep={2} 
//   variant="horizontal" 
//   size="md"
// />
//
// Or with custom steps:
// <ProgressSteps
//   currentStep={1}
//   steps={[
//     { id: 'step1', label: 'Step 1', description: 'First step' },
//     { id: 'step2', label: 'Step 2', description: 'Second step' }
//   ]}
//   variant="vertical"
// />

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface ProgressStepsProps {
  steps?: ProgressStep[];
  currentStep: number;
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  onStepClick?: (stepIndex: number) => void;
}

const defaultWorkflowSteps: ProgressStep[] = [
  {
    id: 'problem',
    label: 'Problem'
  },
  {
    id: 'persona',
    label: 'Persona'
  },
  {
    id: 'pain-points',
    label: 'Pain Points'
  },
  {
    id: 'solutions',
    label: 'Solutions'
  },
  {
    id: 'focus-group',
    label: 'Focus Group'
  },
  {
    id: 'user-stories',
    label: 'User Stories'
  },
  {
    id: 'documentation',
    label: 'Documentation'
  }
];

const stepSizes = {
  sm: {
    circle: 'w-6 h-6',
    text: 'text-xs',
    spacing: 'gap-1'
  },
  md: {
    circle: 'w-8 h-8',
    text: 'text-sm',
    spacing: 'gap-2'
  },
  lg: {
    circle: 'w-10 h-10',
    text: 'text-base',
    spacing: 'gap-3'
  }
};

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps = defaultWorkflowSteps,
  currentStep,
  className,
  variant = 'horizontal',
  size = 'md',
  onStepClick,
}) => {
  const sizeClasses = stepSizes[size];

  const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepStyles = (status: 'completed' | 'active' | 'pending') => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-transparent text-white',
          text: 'text-white'
        };
      case 'active':
        return {
          circle: 'bg-accent-600 text-white shadow-glow-metallic',
          text: 'text-accent-500'
        };
      case 'pending':
        return {
          circle: 'bg-transparent text-slate-400',
          text: 'text-slate-400'
        };
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = getStepStyles(status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center">
                {/* Progress Circle */}
                <button
                  onClick={() => onStepClick?.(index)}
                  data-step-index={index}
                  className={cn(
                    'progress-circle',
                    'flex items-center justify-center rounded-full',
                    'transition-all duration-300 ease-default',
                    'font-medium',
                    sizeClasses.circle,
                    styles.circle,
                    onStepClick && 'cursor-pointer hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-obsidian-800'
                  )}
                  disabled={!onStepClick}
                >
                                  <span className={sizeClasses.text}>{index + 1}</span>
                </button>

                {/* Progress Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'progress-line',
                      'w-0.5 min-h-[40px] my-2',
                      'transition-all duration-slow ease-default',
                      'bg-obsidian-600'
                    )}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className={cn('ml-4 pb-8 min-h-[60px]', sizeClasses.spacing)}>
                <div className={cn('font-medium', sizeClasses.text, styles.text)}>
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={cn('flex items-center gap-8', className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const styles = getStepStyles(status);

        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(index)}
            data-step-index={index}
            className={cn(
              'progress-step flex items-center',
              'transition-all duration-300 ease-default',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-obsidian-800',
              sizeClasses.spacing,
              onStepClick && 'cursor-pointer hover:scale-105 hover:shadow-lg'
            )}
            disabled={!onStepClick}
          >
            {/* Progress Circle */}
            <div
              className={cn(
                'progress-circle',
                'flex items-center justify-center rounded-full',
                'font-medium flex-shrink-0',
                sizeClasses.circle,
                styles.circle
              )}
            >
              <span className={sizeClasses.text}>{index + 1}</span>
            </div>

            {/* Step Label */}
            <div className="ml-3">
              <div className={cn('font-medium whitespace-nowrap', sizeClasses.text, styles.text)}>
                {step.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// Dots Loading Component
export const DotsLoading: React.FC = () => {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
};

// Loading Card Component (for content placeholders)
export interface LoadingCardProps {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  lines = 3,
  showAvatar = false,
  className,
}) => {
  return (
    <div className={cn('card', className)}>
      <div className="flex gap-4">
        {showAvatar && (
          <Skeleton variant="circular" width={48} height={48} />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" height={20} />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={i === lines - 1 ? '40%' : '100%'}
              height={16}
            />
          ))}
        </div>
      </div>
    </div>
  );
};