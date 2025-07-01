import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SelectionCounterProps {
  selected: number;
  total: number;
  label?: string;
  className?: string;
}

export const SelectionCounter: React.FC<SelectionCounterProps> = ({
  selected,
  total,
  label = 'items',
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-primary-600/10 border border-primary-600 text-primary-400',
        'px-4 py-2 rounded-full text-sm font-medium',
        'backdrop-blur-sm',
        className
      )}
    >
      <span className="text-white">{selected}</span>
      <span className="mx-1">/</span>
      <span>{total}</span>
      <span className="ml-1">{label} selected</span>
    </motion.div>
  );
};

export default SelectionCounter; 