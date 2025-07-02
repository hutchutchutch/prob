import React from 'react';
import { Layers, Zap, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RenderMetricsProps {
  react: {
    renderCount: number;
    renderDuration: number;
    componentCount: number;
    updateFrequency: number;
  };
  canvas: {
    nodeCount: number;
    edgeCount: number;
    viewportNodes: number;
    culledNodes: number;
  };
  animations: {
    activeAnimations: number;
    frameTime: number;
    droppedFrames: number;
  };
  className?: string;
}

export const RenderMetrics: React.FC<RenderMetricsProps> = ({
  react,
  canvas,
  animations,
  className = '',
}) => {
  const getPerformanceColor = (value: number, threshold: number, inverse = false) => {
    if (inverse) {
      return value > threshold ? 'text-red-400' : 'text-green-400';
    }
    return value < threshold ? 'text-green-400' : 'text-red-400';
  };

  const cullingEfficiency = canvas.nodeCount > 0 
    ? ((canvas.culledNodes / canvas.nodeCount) * 100).toFixed(1)
    : '0.0';

  return (
    <div className={cn('bg-gray-800 rounded-lg p-3 space-y-3', className)}>
      {/* React Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">React Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Renders</div>
            <div className="font-mono text-gray-300">{react.renderCount}</div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Avg Duration</div>
            <div className={cn(
              'font-mono',
              getPerformanceColor(react.renderDuration, 16, true)
            )}>
              {react.renderDuration.toFixed(1)}ms
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Components</div>
            <div className="font-mono text-gray-300">{react.componentCount}</div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Update Rate</div>
            <div className="font-mono text-gray-300">
              {react.updateFrequency.toFixed(1)}/s
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Canvas Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Nodes</div>
            <div className="font-mono text-gray-300">{canvas.nodeCount}</div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Edges</div>
            <div className="font-mono text-gray-300">{canvas.edgeCount}</div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Visible</div>
            <div className={cn(
              'font-mono',
              canvas.viewportNodes < 50 ? 'text-green-400' : 
              canvas.viewportNodes < 100 ? 'text-yellow-400' : 
              'text-red-400'
            )}>
              {canvas.viewportNodes}
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Culled</div>
            <div className="font-mono text-gray-300">
              {canvas.culledNodes} ({cullingEfficiency}%)
            </div>
          </div>
        </div>
      </div>

      {/* Animation Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Animation Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Active</div>
            <div className="font-mono text-gray-300">{animations.activeAnimations}</div>
          </div>
          <div className="bg-gray-900 rounded p-2">
            <div className="text-gray-500">Frame Time</div>
            <div className={cn(
              'font-mono',
              getPerformanceColor(animations.frameTime, 16.67, true)
            )}>
              {animations.frameTime.toFixed(1)}ms
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2 col-span-2">
            <div className="text-gray-500">Dropped Frames</div>
            <div className={cn(
              'font-mono',
              animations.droppedFrames === 0 ? 'text-green-400' :
              animations.droppedFrames < 10 ? 'text-yellow-400' :
              'text-red-400'
            )}>
              {animations.droppedFrames}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      {(react.renderDuration > 16 || canvas.viewportNodes > 100 || animations.droppedFrames > 10) && (
        <div className="border-t border-gray-700 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400">Performance Tips</span>
          </div>
          <ul className="text-xs text-gray-400 space-y-0.5">
            {react.renderDuration > 16 && (
              <li>• Consider memoizing expensive components</li>
            )}
            {canvas.viewportNodes > 100 && (
              <li>• Too many visible nodes, zoom in or filter</li>
            )}
            {animations.droppedFrames > 10 && (
              <li>• Reduce concurrent animations</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};