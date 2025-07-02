import React from 'react';
import { Globe, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  status?: number;
  size?: number;
}

interface NetworkMonitorProps {
  network: {
    activeRequests: number;
    completedRequests: number;
    failedRequests: number;
    averageLatency: number;
    requestQueue: NetworkRequest[];
  };
  showRequests?: boolean;
  className?: string;
}

export const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  network,
  showRequests = true,
  className = '',
}) => {
  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-400';
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status?: number) => {
    if (!status) return <AlertCircle className="w-3 h-3" />;
    if (status >= 200 && status < 300) return <CheckCircle className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
  };

  const formatDuration = (request: NetworkRequest) => {
    if (!request.endTime) return '...';
    const duration = request.endTime - request.startTime;
    return `${Math.round(duration)}ms`;
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url.slice(0, 50) + (url.length > 50 ? '...' : '');
    }
  };

  const totalRequests = network.completedRequests + network.failedRequests;
  const successRate = totalRequests > 0 
    ? ((network.completedRequests / totalRequests) * 100).toFixed(1)
    : '100.0';

  return (
    <div className={cn('bg-gray-800 rounded-lg p-3', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">Network</span>
          {network.activeRequests > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/30 rounded">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-xs text-blue-400">{network.activeRequests} active</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Success Rate</div>
          <div className={cn(
            'font-mono',
            Number(successRate) >= 95 ? 'text-green-400' :
            Number(successRate) >= 80 ? 'text-yellow-400' :
            'text-red-400'
          )}>
            {successRate}%
          </div>
        </div>
        <div className="bg-gray-900 rounded p-2">
          <div className="text-gray-500">Avg Latency</div>
          <div className={cn(
            'font-mono',
            network.averageLatency < 200 ? 'text-green-400' :
            network.averageLatency < 500 ? 'text-yellow-400' :
            'text-red-400'
          )}>
            {Math.round(network.averageLatency)}ms
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-gray-400">{network.completedRequests}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span className="text-gray-400">{network.failedRequests}</span>
          </div>
        </div>
        <div className="text-gray-500">
          Total: {totalRequests}
        </div>
      </div>

      {showRequests && network.requestQueue.length > 0 && (
        <div className="border-t border-gray-700 pt-2">
          <div className="text-xs text-gray-400 mb-1">Recent Requests</div>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {network.requestQueue.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-2 text-xs bg-gray-900 rounded p-1.5"
              >
                <div className={getStatusColor(request.status)}>
                  {getStatusIcon(request.status)}
                </div>
                <span className="text-gray-500 font-mono">
                  {request.method}
                </span>
                <span className="text-gray-400 truncate flex-1" title={request.url}>
                  {formatUrl(request.url)}
                </span>
                <span className={cn(
                  'font-mono',
                  !request.endTime ? 'text-blue-400' :
                  request.endTime - request.startTime < 200 ? 'text-green-400' :
                  request.endTime - request.startTime < 500 ? 'text-yellow-400' :
                  'text-red-400'
                )}>
                  {formatDuration(request)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};