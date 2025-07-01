import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

interface RefreshButtonProps {
  label: string;
  onClick: () => void;
  count?: number;
  lockedCount?: number;
  loading?: boolean;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  label,
  onClick,
  count = 0,
  lockedCount = 0,
  loading = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        icon={RefreshCw}
        onClick={onClick}
        loading={loading}
        disabled={loading || (count > 0 && count === lockedCount)}
      >
        Regenerate {label}
      </Button>
      {count > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{count - lockedCount} unlocked</span>
          {lockedCount > 0 && (
            <>
              <span>•</span>
              <span>{lockedCount} locked</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RefreshButton; 