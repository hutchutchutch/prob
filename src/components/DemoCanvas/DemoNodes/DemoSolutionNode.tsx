import { Handle, Position } from '@xyflow/react';
import React from 'react';

interface DemoSolutionNodeProps {
  data: {
    title: string;
    description: string;
    votes: {
      total: number;
      byPersona: Record<string, number>;
    };
    isAppearing: boolean;
    showVotes: boolean;
  };
}

export const DemoSolutionNode: React.FC<DemoSolutionNodeProps> = ({ data }) => {
  const { title, description, votes, isAppearing, showVotes } = data;
  
  const renderVoteDots = () => {
    let dots = [];
    let totalRendered = 0;
    
    Object.entries(votes.byPersona).forEach(([personaId, count]) => {
      for (let i = 0; i < count; i++) {
        dots.push(
          <span
            key={`${personaId}-${i}`}
            className="inline-block w-2 h-2 rounded-full bg-accent-500 animate-vote-appear"
            style={{
              animationDelay: `${totalRendered * 100}ms`,
            }}
          />
        );
        totalRendered++;
      }
    });
    
    return dots;
  };
  
  return (
    <div
      className={`
        relative min-w-[320px] p-4 rounded-lg
        bg-gradient-to-br from-blue-600/90 to-blue-700/90
        border-2 border-blue-500 transition-all duration-300
        ${isAppearing ? 'animate-solution-emerge' : ''}
        ${!isAppearing ? 'animate-breathing' : ''}
      `}
      style={{
        animationDelay: isAppearing ? '0ms' : `${Math.random() * 2000}ms`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-600 border-2 border-gray-900"
      />
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">
              Solution
            </span>
          </div>
          
          <h4 className="text-white font-semibold text-base leading-tight mb-1">
            {title}
          </h4>
          
          <p className="text-blue-100 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        {showVotes && (
          <div className="space-y-2 pt-2 border-t border-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-300">Focus Group Votes</span>
              <span className="text-sm font-semibold text-white">{votes.total} total</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {renderVoteDots()}
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-600 border-2 border-gray-900"
      />
    </div>
  );
};