import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader } from 'lucide-react';

interface RefreshProgressProps {
  progress: {
    total: number;
    completed: number;
    currentStep: string;
    errors: string[];
  };
}

const RefreshProgress: React.FC<RefreshProgressProps> = ({ progress }) => {
  const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  
  return (
    <div className="refresh-progress">
      <div className="refresh-progress-header">
        <h3>Refreshing Items</h3>
        <span className="refresh-progress-count">
          {progress.completed} / {progress.total}
        </span>
      </div>
      
      <div className="refresh-progress-bar">
        <motion.div
          className="refresh-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      
      <div className="refresh-progress-status">
        <motion.div
          key={progress.currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="refresh-progress-step"
        >
          {progress.completed < progress.total ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <CheckCircle size={16} className="text-green-500" />
          )}
          <span>{progress.currentStep}</span>
        </motion.div>
      </div>
      
      <div className="refresh-progress-steps">
        {Array.from({ length: progress.total }, (_, i) => (
          <motion.div
            key={i}
            className="refresh-progress-step-indicator"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {i < progress.completed ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : i === progress.completed ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader size={20} className="text-blue-500" />
              </motion.div>
            ) : (
              <Circle size={20} className="text-gray-600" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RefreshProgress;