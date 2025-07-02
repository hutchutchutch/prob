import { Handle, Position } from '@xyflow/react';
import React from 'react';

interface DemoPainPointNodeProps {
  data: {
    title: string;
    severity: number;
    isAppearing: boolean;
    isConnecting: boolean;
  };
}

export const DemoPainPointNode: React.FC<DemoPainPointNodeProps> = ({ data }) => {
  const { title, severity, isAppearing, isConnecting } = data;
  
  const getSeverityColor = () => {
    if (severity >= 9) return 'from-red-500 to-orange-500';
    if (severity >= 7) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-amber-500';
  };
  
  return (
    <div
      className={`
        relative min-w-[280px] p-4 rounded-lg
        bg-gradient-to-br from-orange-600/90 to-orange-700/90
        border-2 border-orange-500 transition-all duration-300
        ${isAppearing ? 'animate-slide-in-right' : ''}
        ${isConnecting ? 'shadow-lg shadow-orange-500/30' : 'shadow-md'}
        ${!isAppearing ? 'animate-breathing' : ''}
      `}
      style={{
        animationDelay: isAppearing ? '0ms' : `${Math.random() * 2000}ms`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-600 border-2 border-gray-900"
      />
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-orange-300 uppercase tracking-wider">
              Pain Point
            </span>
          </div>
          
          <h4 className="text-white font-medium leading-tight">
            {title}
          </h4>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-orange-300">Severity</span>
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            bg-gradient-to-br ${getSeverityColor()}
            shadow-inner
          `}>
            <span className="text-white font-bold text-lg">{severity}</span>
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-600 border-2 border-gray-900"
      />
    </div>
  );
};