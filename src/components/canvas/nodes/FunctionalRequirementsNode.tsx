import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { FunctionalRequirementsNodeData } from '@/types/documentNodes.types';
import { FileCode, Flag, CheckSquare, GitBranch } from 'lucide-react';
import { cn } from '@/utils/cn';

export const FunctionalRequirementsNode: React.FC<NodeProps<FunctionalRequirementsNodeData>> = ({ data, selected }) => {
  const totalRequirements = data.summary.requirementCount;
  const totalPriority = data.summary.priorityBreakdown.mustHave + 
                       data.summary.priorityBreakdown.shouldHave + 
                       data.summary.priorityBreakdown.niceToHave;

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="technical"
      icon={<FileCode className="w-5 h-5 text-teal-500" />}
    >
      <div className="space-y-3">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-teal-400">{data.summary.featureCount}</p>
            <p className="text-xs text-gray-400">Features</p>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-teal-400">{totalRequirements}</p>
            <p className="text-xs text-gray-400">Requirements</p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Priority Distribution</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flag className="w-3 h-3 text-red-500" />
              <span className="text-xs text-gray-300 w-20">Must Have</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500"
                  style={{ width: `${(data.summary.priorityBreakdown.mustHave / totalPriority) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {data.summary.priorityBreakdown.mustHave}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-gray-300 w-20">Should Have</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500"
                  style={{ width: `${(data.summary.priorityBreakdown.shouldHave / totalPriority) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {data.summary.priorityBreakdown.shouldHave}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-300 w-20">Nice to Have</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${(data.summary.priorityBreakdown.niceToHave / totalPriority) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">
                {data.summary.priorityBreakdown.niceToHave}
              </span>
            </div>
          </div>
        </div>

        {/* Section Status */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Section Progress</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(data.sections).map(([key, section]) => (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-2 p-2 rounded",
                  section.complete ? "bg-teal-900/20" : "bg-gray-800/50"
                )}
              >
                <CheckSquare className={cn(
                  "w-3 h-3",
                  section.complete ? "text-teal-500" : "text-gray-600"
                )} />
                <span className={cn(
                  "capitalize",
                  section.complete ? "text-teal-300" : "text-gray-400"
                )}>
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Metrics */}
        <div className="space-y-1 pt-2 border-t border-gray-700">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Requirements Coverage</span>
            <span className="text-teal-400">{data.coverage.featuresWithRequirements}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Acceptance Criteria</span>
            <span className="text-teal-400">{data.coverage.featuresWithAcceptanceCriteria}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Traceability</span>
            <span className="text-teal-400">{data.coverage.requirementsTraceability}%</span>
          </div>
        </div>

        {/* Dependencies */}
        {data.sections.integrations.externalDependencies.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <GitBranch className="w-3 h-3" />
            <span>{data.sections.integrations.externalDependencies.length} external dependencies</span>
          </div>
        )}
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default FunctionalRequirementsNode;