import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { Check, Lock, User, Brain, Lightbulb, FileText, Book } from 'lucide-react';
import { PersonaCircles } from './PersonaCircles';
import { ProgressTooltip } from './ProgressTooltip';
import { StepIndicator } from './StepIndicator';
import { cn } from '../../utils/cn';
import './ProgressBar.css';

export interface ProgressStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  timeEstimate?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (stepIndex: number) => void;
  personas?: Array<{
    id: string;
    name: string;
    role: string;
    pain_degree: number;
  }>;
  connections?: {
    painPoints?: number;
    solutions?: number;
  };
  documentProgress?: {
    current: number;
    total: number;
  };
  lockedSteps?: number[];
  completedSteps?: number[];
  canNavigate?: boolean;
}

const defaultSteps: ProgressStep[] = [
  {
    id: 'problem_input',
    label: 'Problem Input',
    description: 'Define your problem statement',
    icon: <FileText className="segment-icon" />,
    timeEstimate: '1-2 min'
  },
  {
    id: 'persona_discovery',
    label: 'Persona Discovery',
    description: 'AI identifies key personas',
    icon: <User className="segment-icon" />,
    timeEstimate: '2-3 min'
  },
  {
    id: 'pain_point_mapping',
    label: 'Pain Point Mapping',
    description: 'Map pain points to personas',
    icon: <Brain className="segment-icon" />,
    timeEstimate: '3-5 min'
  },
  {
    id: 'solution_architecture',
    label: 'Solution Architecture',
    description: 'Generate solution ideas',
    icon: <Lightbulb className="segment-icon" />,
    timeEstimate: '5-7 min'
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Generate specs and docs',
    icon: <Book className="segment-icon" />,
    timeEstimate: '10-15 min'
  }
];

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 5,
  onStepClick,
  personas = [],
  connections = {},
  documentProgress,
  lockedSteps = [],
  completedSteps = [],
  canNavigate = true
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
  const celebrationRef = useRef<HTMLDivElement>(null);

  const steps = defaultSteps.slice(0, totalSteps);
  const progressPercentage = useMemo(() => {
    if (totalSteps === 0) return 0;
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Check for completion celebration
  useEffect(() => {
    if (currentStep === totalSteps && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStep, totalSteps, showCelebration]);

  // Simulate validation animation
  useEffect(() => {
    if (completedSteps.includes(0) && !validatedSteps.includes(0)) {
      setTimeout(() => {
        setValidatedSteps(prev => [...prev, 0]);
      }, 500);
    }
  }, [completedSteps, validatedSteps]);

  const handleStepClick = useCallback((index: number) => {
    if (!canNavigate || lockedSteps.includes(index)) return;
    if (index <= currentStep || completedSteps.includes(index)) {
      onStepClick?.(index);
    }
  }, [canNavigate, lockedSteps, currentStep, completedSteps, onStepClick]);

  const getPersonaPainColor = (painDegree: number): string => {
    if (painDegree >= 8) return 'persona-circle--high';
    if (painDegree >= 5) return 'persona-circle--medium';
    return 'persona-circle--low';
  };

  const renderCelebration = () => {
    if (!showCelebration) return null;

    const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 0.5 + 's',
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    return (
      <div ref={celebrationRef} className="completion-celebration">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="celebration-particle"
            style={{
              left: particle.left,
              backgroundColor: particle.color,
              animationDelay: particle.delay
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-segments">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index) || index < currentStep;
          const isActive = index === currentStep;
          const isFuture = index > currentStep;
          const isLocked = lockedSteps.includes(index);
          const isValidated = validatedSteps.includes(index);

          // Add stats based on step
          const stepWithStats = { ...step };
          if (index === 1 && personas.length > 0) {
            stepWithStats.stats = [
              { label: 'Personas', value: personas.length },
              { label: 'Avg Pain', value: Math.round(personas.reduce((sum, p) => sum + p.pain_degree, 0) / personas.length) }
            ];
          }
          if (index === 2 && connections.painPoints) {
            stepWithStats.stats = [
              { label: 'Pain Points', value: connections.painPoints },
              { label: 'Connections', value: personas.length * connections.painPoints }
            ];
          }
          if (index === 3 && connections.solutions) {
            stepWithStats.stats = [
              { label: 'Solutions', value: connections.solutions },
              { label: 'Selected', value: Math.floor(connections.solutions * 0.4) }
            ];
          }
          if (index === 4 && documentProgress) {
            stepWithStats.stats = [
              { label: 'Documents', value: `${documentProgress.current}/${documentProgress.total}` },
              { label: 'Progress', value: `${Math.round((documentProgress.current / documentProgress.total) * 100)}%` }
            ];
          }

          return (
            <div
              key={step.id}
              className={cn(
                'progress-segment',
                isLocked && 'cursor-not-allowed'
              )}
              onClick={() => handleStepClick(index)}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'segment-connector',
                    isCompleted && 'segment-connector--completed',
                    isActive && 'segment-connector--active'
                  )}
                />
              )}

              {/* Step indicator */}
              <StepIndicator
                step={stepWithStats}
                index={index}
                isCompleted={isCompleted}
                isActive={isActive}
                isFuture={isFuture}
                isLocked={isLocked}
                isValidated={isValidated}
              />

              {/* Step label */}
              <span
                className={cn(
                  'segment-label',
                  isActive && 'segment-label--active'
                )}
              >
                {step.label}
              </span>

              {/* Persona circles for persona discovery step */}
              {index === 1 && personas.length > 0 && (
                <div className="persona-circles-container persona-circles-container--show">
                  {personas.slice(0, 3).map((persona, pIndex) => (
                    <div
                      key={persona.id}
                      className={cn(
                        'persona-circle',
                        getPersonaPainColor(persona.pain_degree),
                        isActive && 'persona-circle--active'
                      )}
                      title={`${persona.name} - ${persona.role}`}
                      style={{ zIndex: 3 - pIndex }}
                    >
                      {persona.name.charAt(0)}
                    </div>
                  ))}
                  {personas.length > 3 && (
                    <div className="persona-circle" style={{ background: 'var(--color-gray-600)' }}>
                      +{personas.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Connection count for pain points */}
              {index === 2 && connections.painPoints && (
                <div className="connection-count connection-count--show">
                  {connections.painPoints} connections
                </div>
              )}

              {/* Sub-progress for documents */}
              {index === 4 && documentProgress && (
                <div className="sub-progress sub-progress--show">
                  <div
                    className="sub-progress-fill"
                    style={{
                      width: `${(documentProgress.current / documentProgress.total) * 100}%`
                    }}
                  />
                </div>
              )}

              {/* Time estimate (shows on hover) */}
              {step.timeEstimate && (
                <div className="time-estimate">
                  ~{step.timeEstimate}
                </div>
              )}

              {/* Tooltip */}
              <ProgressTooltip step={stepWithStats} />
            </div>
          );
        })}
      </div>

      {/* Celebration animation */}
      {renderCelebration()}
    </div>
  );
};