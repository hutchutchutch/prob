import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ANIMATION_TIMINGS } from '../AnimationSequence';

interface DemoProblemNodeProps {
  data: {
    statement: string;
    isTyping: boolean;
    isValidating: boolean;
    isValidated: boolean;
    goldFlashCount: number;
  };
}

export const DemoProblemNode: React.FC<DemoProblemNodeProps> = ({ data }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Typing animation
  useEffect(() => {
    if (!data.isTyping || !data.statement) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= data.statement.length) {
        setDisplayText(data.statement.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, ANIMATION_TIMINGS.TYPING_SPEED);
    
    return () => clearInterval(typingInterval);
  }, [data.isTyping, data.statement]);
  
  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  const getBorderClass = () => {
    if (data.goldFlashCount > 0) {
      return 'animate-gold-flash-demo';
    }
    if (data.isValidated) {
      return 'border-accent-500';
    }
    if (data.isValidating) {
      return 'border-white animate-pulse-border';
    }
    return 'border-gray-600';
  };
  
  return (
    <div
      className={`
        relative min-w-[400px] min-h-[140px] p-6 rounded-lg
        bg-gradient-to-br from-red-900/90 to-red-800/90
        border-2 transition-all duration-300
        ${getBorderClass()}
        ${data.isTyping || data.isValidating ? 'shadow-lg' : 'shadow-xl'}
      `}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-red-200 uppercase tracking-wider">
            Core Problem
          </h3>
        </div>
        
        <div className="text-white text-lg leading-relaxed">
          {displayText}
          {data.isTyping && cursorVisible && (
            <span className="inline-block w-0.5 h-5 bg-white ml-1 animate-pulse" />
          )}
        </div>
        
        {data.isValidating && (
          <div className="flex items-center gap-2 text-sm text-red-300">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Validating problem statement...
          </div>
        )}
        
        {data.isValidated && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Problem validated successfully
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-red-600 border-2 border-gray-900"
      />
    </div>
  );
};