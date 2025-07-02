import { Handle, Position } from '@xyflow/react';
import React from 'react';

interface DemoPersonaNodeProps {
  data: {
    name: string;
    role: string;
    painDegree: number;
    description: string;
    isAppearing: boolean;
    isHighlighted: boolean;
  };
}

export const DemoPersonaNode: React.FC<DemoPersonaNodeProps> = ({ data }) => {
  const { name, role, painDegree, description, isAppearing, isHighlighted } = data;
  
  return (
    <div
      className={`
        relative min-w-[300px] p-4 rounded-lg
        bg-gradient-to-br from-teal-600/90 to-teal-700/90
        border-2 transition-all duration-300
        ${isHighlighted ? 'border-accent-500 shadow-accent-glow' : 'border-teal-500'}
        ${isAppearing ? 'animate-node-appear' : ''}
        ${!isAppearing ? 'animate-breathing' : ''}
      `}
      style={{
        animationDelay: isAppearing ? '0ms' : `${Math.random() * 2000}ms`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-teal-600 border-2 border-gray-900"
      />
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center">
            <span className="text-teal-200 font-semibold text-sm">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="text-white font-semibold">{name}</h4>
            <p className="text-teal-200 text-sm">{role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-teal-300">Pain</span>
          <div className="flex gap-0.5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-sm transition-all duration-300 ${
                  i < painDegree
                    ? 'bg-gradient-to-t from-orange-500 to-yellow-400'
                    : 'bg-teal-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-teal-100 text-sm leading-relaxed line-clamp-2">
        {description}
      </p>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-teal-600 border-2 border-gray-900"
      />
    </div>
  );
};