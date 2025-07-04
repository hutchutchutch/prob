import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseDocumentNodeComponent } from './BaseDocumentNode';
import { DesignSystemNodeData } from '@/types/documentNodes.types';
import { Palette, Type, Grid3x3, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

export const DesignSystemNode: React.FC<NodeProps<DesignSystemNodeData>> = ({ data, selected }) => {
  const totalComponents = data.summary.componentCount;
  const documentedComponents = Math.round((data.components.documentationCoverage / 100) * totalComponents);

  return (
    <BaseDocumentNodeComponent
      data={data}
      selected={selected}
      variant="design"
      icon={<Palette className="w-5 h-5 text-purple-500" />}
    >
      <div className="space-y-3">
        {/* Design System Summary */}
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-purple-400">
            {data.summary.brandName || 'Untitled Design System'}
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded border-2 border-gray-600"
                style={{ backgroundColor: data.summary.primaryColor }}
                title={data.summary.primaryColor}
              />
              <span className="text-xs text-gray-400">{data.summary.primaryColor}</span>
            </div>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">{data.summary.fontFamily}</span>
          </div>
        </div>

        {/* Component Overview */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-purple-400">{totalComponents}</p>
            <p className="text-xs text-gray-400">Components</p>
          </div>
          <div className="text-center p-2 bg-gray-800/50 rounded">
            <p className="text-2xl font-bold text-purple-400">{documentedComponents}</p>
            <p className="text-xs text-gray-400">Documented</p>
          </div>
        </div>

        {/* Foundation Status */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Foundations</p>
          <div className="grid grid-cols-3 gap-2">
            <div className={cn(
              "flex flex-col items-center p-2 rounded text-xs",
              data.foundations.colors.complete ? "bg-purple-900/20" : "bg-gray-800/50"
            )}>
              <Palette className={cn(
                "w-4 h-4 mb-1",
                data.foundations.colors.complete ? "text-purple-500" : "text-gray-600"
              )} />
              <span className={cn(
                data.foundations.colors.complete ? "text-purple-300" : "text-gray-500"
              )}>Colors</span>
              <span className="text-gray-500 text-xs">{data.foundations.colors.paletteSize}</span>
            </div>
            
            <div className={cn(
              "flex flex-col items-center p-2 rounded text-xs",
              data.foundations.typography.complete ? "bg-purple-900/20" : "bg-gray-800/50"
            )}>
              <Type className={cn(
                "w-4 h-4 mb-1",
                data.foundations.typography.complete ? "text-purple-500" : "text-gray-600"
              )} />
              <span className={cn(
                data.foundations.typography.complete ? "text-purple-300" : "text-gray-500"
              )}>Type</span>
              <span className="text-gray-500 text-xs">{data.foundations.typography.scaleSteps} sizes</span>
            </div>
            
            <div className={cn(
              "flex flex-col items-center p-2 rounded text-xs",
              data.foundations.spacing.complete ? "bg-purple-900/20" : "bg-gray-800/50"
            )}>
              <Grid3x3 className={cn(
                "w-4 h-4 mb-1",
                data.foundations.spacing.complete ? "text-purple-500" : "text-gray-600"
              )} />
              <span className={cn(
                data.foundations.spacing.complete ? "text-purple-300" : "text-gray-500"
              )}>Spacing</span>
              {data.foundations.spacing.gridDefined && (
                <span className="text-gray-500 text-xs">✓ Grid</span>
              )}
            </div>
          </div>
        </div>

        {/* Component Details */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Components with variants</span>
            <span className="text-purple-400">{data.components.withVariants}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Components with states</span>
            <span className="text-purple-400">{data.components.withStates}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Documentation coverage</span>
            <span className="text-purple-400">{data.components.documentationCoverage}%</span>
          </div>
        </div>

        {/* Maturity Indicators */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
          {data.maturity.hasDesignPrinciples && (
            <span className="px-2 py-1 text-xs bg-purple-900/30 text-purple-400 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Principles
            </span>
          )}
          {data.maturity.hasAccessibilityGuidelines && (
            <span className="px-2 py-1 text-xs bg-green-900/30 text-green-400 rounded">
              ♿ A11y
            </span>
          )}
          {data.maturity.hasMotionPrinciples && (
            <span className="px-2 py-1 text-xs bg-blue-900/30 text-blue-400 rounded">
              ⚡ Motion
            </span>
          )}
          {data.maturity.patternCount > 0 && (
            <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
              {data.maturity.patternCount} patterns
            </span>
          )}
        </div>

        {/* Accessibility & Compliance */}
        {(data.foundations.colors.accessibilityCompliant || data.foundations.typography.hasResponsiveScale) && (
          <div className="flex items-center gap-2 text-xs">
            {data.foundations.colors.accessibilityCompliant && (
              <span className="text-green-400">✓ WCAG compliant colors</span>
            )}
            {data.foundations.typography.hasResponsiveScale && (
              <span className="text-green-400">✓ Responsive type</span>
            )}
          </div>
        )}

        {/* Assets Summary */}
        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
          <span>{data.assets.logoVariations} logos</span>
          <span>{data.assets.iconCount} icons</span>
          <span>{data.assets.illustrationCount} illustrations</span>
        </div>

        {/* Adoption Metrics */}
        {data.maturity.adoptionMetrics && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Adoption</p>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Components in use</span>
              <span className="text-purple-400">
                {Math.round((data.maturity.adoptionMetrics.componentsInUse / totalComponents) * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Consistency score</span>
              <span className="text-purple-400">{data.maturity.adoptionMetrics.consistencyScore}%</span>
            </div>
          </div>
        )}
      </div>
    </BaseDocumentNodeComponent>
  );
};

export default DesignSystemNode;