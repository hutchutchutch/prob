import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { DataFlowDiagramNodeData } from '@/types/documentNodes.types';
import { Network, Circle, Square, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const DataFlowDiagramNode: React.FC<NodeProps<DataFlowDiagramNodeData>> = ({ data, selected }) => {
  const totalElements = data.summary.entityCount + data.summary.processCount + data.summary.dataStoreCount;
  const hasValidationIssues = !data.validation.noOrphanedProcesses || 
                             !data.validation.allFlowsValid || 
                             !data.validation.balancedAcrossLevels;

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="technical"
      icon={<Network className="w-5 h-5 text-teal-500" />}
    >
      <div className="space-y-3">
        {/* DFD Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-gray-800/50 rounded">
            <Circle className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <p className="text-lg font-bold text-blue-400">{data.summary.entityCount}</p>
            <p className="text-xs text-gray-500">Entities</p>
          </div>
          <div className="p-2 bg-gray-800/50 rounded">
            <Square className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <p className="text-lg font-bold text-green-400">{data.summary.processCount}</p>
            <p className="text-xs text-gray-500">Processes</p>
          </div>
          <div className="p-2 bg-gray-800/50 rounded">
            <div className="w-4 h-4 mx-auto mb-1 border-t-2 border-b-2 border-purple-400" />
            <p className="text-lg font-bold text-purple-400">{data.summary.dataStoreCount}</p>
            <p className="text-xs text-gray-500">Stores</p>
          </div>
          <div className="p-2 bg-gray-800/50 rounded">
            <ArrowRight className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
            <p className="text-lg font-bold text-yellow-400">{data.summary.flowCount}</p>
            <p className="text-xs text-gray-500">Flows</p>
          </div>
        </div>

        {/* Level Status */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Diagram Levels</p>
          <div className="space-y-1">
            <div className={cn(
              "flex items-center justify-between p-2 rounded text-xs",
              data.levels.context.complete ? "bg-green-900/20" : "bg-gray-800/50"
            )}>
              <span className="text-gray-300">Context (Level 0)</span>
              <div className="flex items-center gap-2">
                {data.levels.context.complete ? (
                  <>
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-500">{data.levels.context.externalEntityCount} entities</span>
                  </>
                ) : (
                  <span className="text-gray-600">Incomplete</span>
                )}
              </div>
            </div>
            
            <div className={cn(
              "flex items-center justify-between p-2 rounded text-xs",
              data.levels.level1.complete ? "bg-green-900/20" : "bg-gray-800/50"
            )}>
              <span className="text-gray-300">Level 1</span>
              <div className="flex items-center gap-2">
                {data.levels.level1.complete ? (
                  <>
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-500">{data.levels.level1.processCount} processes</span>
                    {!data.levels.level1.balanced && (
                      <span className="text-yellow-400" title="Not balanced with context">⚠</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-600">Incomplete</span>
                )}
              </div>
            </div>
            
            {data.levels.level2Plus.exists && (
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded text-xs">
                <span className="text-gray-300">Level 2+</span>
                <span className="text-gray-500">
                  {data.levels.level2Plus.decomposedProcesses.length} decomposed (depth: {data.levels.level2Plus.maxDepth})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {hasValidationIssues && (
          <div className="space-y-1 p-2 bg-red-900/20 rounded">
            <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Validation Issues
            </p>
            {!data.validation.noOrphanedProcesses && (
              <p className="text-xs text-red-300 ml-4">• Orphaned processes detected</p>
            )}
            {!data.validation.allFlowsValid && (
              <p className="text-xs text-red-300 ml-4">• Invalid data flows found</p>
            )}
            {!data.validation.balancedAcrossLevels && (
              <p className="text-xs text-red-300 ml-4">• Diagrams not balanced across levels</p>
            )}
          </div>
        )}

        {/* Complexity Metrics */}
        <div className="space-y-1 pt-2 border-t border-gray-700">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Avg flows per process</span>
            <span className="text-teal-400">{data.complexity.averageFlowsPerProcess.toFixed(1)}</span>
          </div>
          {data.complexity.criticalPaths.length > 0 && (
            <div className="text-xs">
              <span className="text-gray-400">Critical paths: </span>
              <span className="text-teal-400">{data.complexity.criticalPaths.length}</span>
              {data.complexity.criticalPaths[0] && (
                <span className="text-gray-500"> (longest: {data.complexity.criticalPaths[0].length} steps)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default DataFlowDiagramNode;