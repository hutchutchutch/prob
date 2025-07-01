import React from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Button, IconButton } from '@/components/common/Button';

interface BulkActionsBarProps {
  selectedCount: number;
  onLockAll: () => void;
  onUnlockAll: () => void;
  onClearSelection: () => void;
  className?: string;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onLockAll,
  onUnlockAll,
  onClearSelection,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700',
        'shadow-lg',
        className
      )}
    >
      <span className="text-sm font-medium text-gray-300">
        {selectedCount} items selected
      </span>
      
      <div className="w-px h-6 bg-gray-700" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={Lock}
          onClick={onLockAll}
        >
          Lock All
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          icon={Unlock}
          onClick={onUnlockAll}
        >
          Unlock All
        </Button>
      </div>
      
      <div className="flex-1" />
      
      <IconButton
        icon={X}
        size="sm"
        onClick={onClearSelection}
        aria-label="Clear selection"
      />
    </motion.div>
  );
};

export default BulkActionsBar; 