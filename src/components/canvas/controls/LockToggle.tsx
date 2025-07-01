import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from '@/components/common/Button';
import { SimpleTooltip } from '@/components/common/Tooltip';

interface LockToggleProps {
  isLocked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LockToggle: React.FC<LockToggleProps> = ({
  isLocked,
  onToggle,
  size = 'sm',
  className,
}) => {
  return (
    <SimpleTooltip content={isLocked ? 'Unlock' : 'Lock'}>
      <IconButton
        icon={isLocked ? Lock : Unlock}
        size={size}
        onClick={onToggle}
        className={cn(
          isLocked && 'text-warning-500 hover:text-warning-400',
          className
        )}
        aria-label={isLocked ? 'Unlock item' : 'Lock item'}
      />
    </SimpleTooltip>
  );
};

export default LockToggle; 