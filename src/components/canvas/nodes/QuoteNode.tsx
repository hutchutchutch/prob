import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/utils/cn';

// QuoteNode Component - Acts as an Edge Label for Focus Group Mode
export interface QuoteNodeData {
  quote: string;
  personaName: string;
  personaId: string;
  solutionId: string;
}

export const QuoteNode: React.FC<{ data: QuoteNodeData }> = ({ data }) => {
  const { quote, personaName } = data;

  if (!quote) return null;

  return (
    <div className={cn(
      "relative max-w-xs p-4 rounded-lg",
      "bg-obsidian-800/95 backdrop-blur-sm",
      "border border-gold-600/50",
      "shadow-lg shadow-gold-500/10",
      "transition-all duration-300",
      "hover:shadow-xl hover:shadow-gold-500/20",
      "hover:border-gold-500"
    )}>
      {/* Quote Icon */}
      <Quote className="absolute top-2 left-2 w-4 h-4 text-gold-500/50" />
      
      {/* Quote Content */}
      <div className="pl-6">
        <p className="text-sm text-obsidian-50 leading-relaxed italic">
          "{quote}"
        </p>
        
        {/* Attribution */}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-gold-600/30" />
          <p className="text-xs text-gold-500 font-medium">
            {personaName}
          </p>
        </div>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <div className="absolute bottom-0 right-0 w-0 h-0 
          border-l-[16px] border-l-transparent
          border-b-[16px] border-b-gold-600/20
          rounded-bl-sm" />
      </div>
    </div>
  );
};

export default QuoteNode;