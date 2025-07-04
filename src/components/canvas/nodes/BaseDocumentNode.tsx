import React from 'react';
import { BaseNode } from './BaseNode';
import { NodeProps } from '@xyflow/react';
import { cn } from '@/utils/cn';
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { BaseDocumentNode } from '@/types/documentNodes.types';

interface BaseDocumentNodeProps extends NodeProps {
  data: BaseDocumentNode & {
    onClick?: () => void;
    onEdit?: () => void;
    onPreview?: () => void;
    onExport?: () => void;
  };
  variant?: 'default' | 'product' | 'technical' | 'design';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const BaseDocumentNodeComponent: React.FC<BaseDocumentNodeProps> = ({ 
  data, 
  selected, 
  variant = 'default',
  icon,
  children 
}) => {
  const getStatusIcon = () => {
    switch (data.metadata.status) {
      case 'published':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-gold-500" />;
      case 'review':
        return <Clock className="w-4 h-4 text-gold-400" />;
      case 'draft':
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'product':
        return 'border-gold-500/50 hover:border-gold-500';
      case 'technical':
        return 'border-teal-500/50 hover:border-teal-500';
      case 'design':
        return 'border-purple-500/50 hover:border-purple-500';
      default:
        return 'border-gray-600/50 hover:border-gray-600';
    }
  };

  const getHealthColor = () => {
    if (!data.validation.isComplete) return 'text-red-500';
    if (data.validation.warnings?.length) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <BaseNode
      variant="default"
      selected={selected}
      showSourceHandle={true}
      showTargetHandle={true}
      className={cn(
        'min-w-[320px] max-w-[400px]',
        getVariantStyles(),
        'transition-all duration-300'
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon || <FileText className="w-5 h-5 text-gray-400" />}
            <div>
              <h3 className="text-sm font-semibold text-gray-200">
                {data.type.replace(/_/g, ' ').toUpperCase()}
              </h3>
              <p className="text-xs text-gray-400">v{data.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertCircle className={cn('w-4 h-4', getHealthColor())} />
          </div>
        </div>

        {/* Content - Custom per document type */}
        {children}

        {/* Footer - Metadata */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Updated: {new Date(data.metadata.updatedAt).toLocaleDateString()}
            </span>
            <div className="flex gap-1">
              {data.validation.missingFields.length > 0 && (
                <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded">
                  {data.validation.missingFields.length} missing
                </span>
              )}
              {data.validation.warnings?.length > 0 && (
                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded">
                  {data.validation.warnings.length} warnings
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {data.onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onEdit?.();
              }}
              className="flex-1 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              Edit
            </button>
          )}
          {data.onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onPreview?.();
              }}
              className="flex-1 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              Preview
            </button>
          )}
          {data.onExport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onExport?.();
              }}
              className="flex-1 px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              Export
            </button>
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default BaseDocumentNodeComponent;