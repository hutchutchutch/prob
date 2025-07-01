import React from 'react';
import { cn } from '@/utils/cn';

export interface PainLevelIndicatorProps {
  level: number;
  maxLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

export const PainLevelIndicator: React.FC<PainLevelIndicatorProps> = ({
  level,
  maxLevel = 5,
  size = 'md',
  showLabel = true,
}) => {
  return (
    <div className={cn('flex items-center', gapClasses[size])}>
      {Array.from({ length: maxLevel }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all',
            sizeClasses[size],
            i <= level ? 'bg-white' : 'bg-white/20'
          )}
        />
      ))}
      {showLabel && (
        <span className="ml-1 text-sm font-medium">
          {level}/{maxLevel}
        </span>
      )}
    </div>
  );
};