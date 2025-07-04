import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { SystemArchitectureNodeData } from '@/types/documentNodes.types';
import { Cpu, Layers, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SystemArchitectureNode: React.FC<NodeProps<SystemArchitectureNodeData>> = ({ data, selected }) => {
  const totalComponents = Object.values(data.sections.components.breakdown).reduce((a, b) => a + b, 0);
  const hasIssues = data.healthMetrics.circularDependencies.length > 0 || 
                   data.healthMetrics.componentsWithoutDependencies > 0;

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="technical"
      icon={<Cpu className="w-5 h-5 text-teal-500" />}
    >
      <div className="space-y-3">
        {/* Architecture Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h4 className="text-sm font-semibold text-teal-300">
              {data.summary.architecturePattern || 'No Pattern Defined'}
            </h4>
          </div>
          <p className="text-xs text-gray-400">
            {data.summary.technologySummary || 'Technology stack not defined'}
          </p>
        </div>

        {/* Component Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Components</p>
            <span className="text-sm font-bold text-teal-400">{totalComponents}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <p className="text-lg font-bold text-blue-400">{data.sections.components.breakdown.frontend}</p>
              <p className="text-xs text-gray-500">Frontend</p>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <p className="text-lg font-bold text-green-400">{data.sections.components.breakdown.backend}</p>
              <p className="text-xs text-gray-500">Backend</p>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <p className="text-lg font-bold text-purple-400">{data.sections.components.breakdown.database}</p>
              <p className="text-xs text-gray-500">Database</p>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <p className="text-lg font-bold text-yellow-400">{data.sections.components.breakdown.infrastructure}</p>
              <p className="text-xs text-gray-500">Infra</p>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Health Check</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Security Coverage</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${data.healthMetrics.securityMeasuresCoverage}%` }}
                  />
                </div>
                <span className="text-gray-400 w-10 text-right">
                  {data.healthMetrics.securityMeasuresCoverage}%
                </span>
              </div>
            </div>
            
            {hasIssues && (
              <div className="space-y-1 pt-1">
                {data.healthMetrics.circularDependencies.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{data.healthMetrics.circularDependencies.length} circular dependencies</span>
                  </div>
                )}
                {data.healthMetrics.componentsWithoutDependencies > 0 && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{data.healthMetrics.componentsWithoutDependencies} isolated components</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-xs">
              <Shield className={cn(
                "w-3 h-3",
                data.healthMetrics.performanceTargetsDefined ? "text-green-500" : "text-gray-600"
              )} />
              <span className={cn(
                data.healthMetrics.performanceTargetsDefined ? "text-green-400" : "text-gray-500"
              )}>
                Performance targets {data.healthMetrics.performanceTargetsDefined ? 'defined' : 'missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Deployment Info */}
        {data.sections.deployment.environments.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
            <div className="flex gap-1">
              {data.sections.deployment.environments.map((env, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-gray-800 rounded">
                  {env}
                </span>
              ))}
            </div>
            {data.sections.deployment.hasProductionConfig && (
              <span className="text-xs text-green-400">✓ Prod ready</span>
            )}
          </div>
        )}

        {/* Critical Decisions */}
        {data.sections.decisions.criticalDecisions.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-semibold">{data.sections.decisions.documentedDecisions}</span> architectural decisions documented
          </div>
        )}
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default SystemArchitectureNode;