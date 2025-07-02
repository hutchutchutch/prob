import React from 'react';
import type { ProgressStep } from './ProgressBar';

interface ProgressTooltipProps {
  step: ProgressStep;
}

export const ProgressTooltip: React.FC<ProgressTooltipProps> = ({ step }) => {
  return (
    <div className="segment-tooltip">
      <h4 className="tooltip-title">{step.label}</h4>
      <p className="tooltip-description">{step.description}</p>
      
      {step.stats && step.stats.length > 0 && (
        <div className="tooltip-stats">
          {step.stats.map((stat, index) => (
            <div key={index} className="tooltip-stat">
              <span className="tooltip-stat-label">{stat.label}:</span>
              <span className="tooltip-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};