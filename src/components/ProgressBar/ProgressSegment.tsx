import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressSegmentProps {
  isCompleted: boolean;
  isActive: boolean;
  isFuture: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ProgressSegment: React.FC<ProgressSegmentProps> = ({
  isCompleted,
  isActive,
  isFuture,
  onClick,
  children,
  className
}) => {
  return (
    <div
      className={cn(
        'progress-segment',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : -1}
      aria-label={`Progress step ${isCompleted ? 'completed' : isActive ? 'current' : 'future'}`}
    >
      {children}
    </div>
  );
};