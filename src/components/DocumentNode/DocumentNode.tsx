import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { DocumentMetadata } from '../../utils/documentFormatters';
import { DocumentPreview } from './DocumentPreview';

interface DocumentNodeProps {
  data: {
    metadata: DocumentMetadata;
    content?: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
    error?: string;
    onView?: () => void;
    onRegenerate?: () => void;
  };
  selected?: boolean;
}

export const DocumentNode: React.FC<DocumentNodeProps> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { metadata, content, status, error, onView, onRegenerate } = data;

  // Get icon based on document type
  const getDocumentIcon = () => {
    switch (metadata.type) {
      case 'product-vision':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'functional-requirements':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'system-architecture':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'data-flow':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'design-system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'database-schema':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // Get status color and animation
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'border-gray-600 bg-gray-800';
      case 'processing':
        return 'border-blue-500 bg-gray-800 animate-pulse';
      case 'complete':
        return 'border-green-500 bg-gray-800';
      case 'error':
        return 'border-red-500 bg-gray-800';
      default:
        return 'border-gray-600 bg-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'complete':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-600 border-2 border-gray-900"
      />
      
      <div
        className={`
          relative min-w-[280px] rounded-lg border-2 transition-all duration-300
          ${getStatusStyles()}
          ${selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}
          ${isHovered ? 'transform scale-105 shadow-xl' : 'shadow-lg'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-gray-400">
                {getDocumentIcon()}
              </div>
              <h3 className="text-sm font-medium text-white">
                {metadata.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {status === 'processing' && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          )}

          {status === 'complete' && content && (
            <DocumentPreview content={content} metadata={metadata} />
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-sm text-red-400">Generation failed</p>
              {error && <p className="text-xs text-gray-500">{error}</p>}
            </div>
          )}

          {status === 'pending' && (
            <p className="text-sm text-gray-500">Waiting to generate...</p>
          )}
        </div>

        {/* Actions */}
        {(status === 'complete' || status === 'error') && (
          <div className="flex gap-2 px-4 pb-3">
            {status === 'complete' && onView && (
              <button
                onClick={onView}
                className="flex-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-150"
              >
                View
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors duration-150"
              >
                Regenerate
              </button>
            )}
          </div>
        )}

        {/* Progress indicator for processing state */}
        {status === 'processing' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
            <div className="h-full bg-blue-500 animate-progress"></div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-600 border-2 border-gray-900"
      />

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};