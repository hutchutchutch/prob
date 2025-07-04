import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { ProductVisionNodeData } from '@/types/documentNodes.types';
import { Lightbulb, Target, Users, Milestone } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ProductVisionNode: React.FC<NodeProps<ProductVisionNodeData>> = ({ data, selected }) => {
  const completedSections = Object.values(data.sections).filter(s => s.complete).length;
  const totalSections = Object.keys(data.sections).length;
  const sectionProgress = (completedSections / totalSections) * 100;

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="product"
      icon={<Lightbulb className="w-5 h-5 text-gold-500" />}
    >
      <div className="space-y-3">
        {/* Product Summary */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-gold-400">
            {data.summary.productName || 'Untitled Product'}
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.summary.elevatorPitch || 'No elevator pitch defined'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Completion</span>
            <span>{Math.round(data.summary.completionPercentage)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
              style={{ width: `${data.summary.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Section Status */}
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(data.sections).map(([key, section]) => (
            <div
              key={key}
              className={cn(
                "h-1 rounded-full transition-colors",
                section.complete ? "bg-gold-500" : "bg-gray-700"
              )}
              title={`${key}: ${section.complete ? 'Complete' : 'Incomplete'}`}
            />
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
            <Users className="w-3 h-3 text-gold-500" />
            <span className="text-gray-300">
              {data.metrics.targetAudienceCount} Audiences
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
            <Target className="w-3 h-3 text-gold-500" />
            <span className="text-gray-300">
              {data.metrics.valuePropositionCount} Value Props
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
            <Milestone className="w-3 h-3 text-gold-500" />
            <span className="text-gray-300">
              {data.metrics.milestoneCount} Milestones
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
            <span className="text-red-400">⚠</span>
            <span className="text-gray-300">
              {data.metrics.riskCount} Risks
            </span>
          </div>
        </div>

        {/* Relationships */}
        {data.relationships.feeds.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Feeds into: {data.relationships.feeds.map(d => d.replace(/_/g, ' ')).join(', ')}
            </p>
          </div>
        )}
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default ProductVisionNode;