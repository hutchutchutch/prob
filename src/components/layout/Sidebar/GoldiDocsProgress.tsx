import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { GoldiDocsStatus, DocumentStatusInfo, DocumentType } from './types';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface GoldiDocsProgressProps {
  projectId: string;
  status: GoldiDocsStatus;
  className?: string;
}

export const GoldiDocsProgress: React.FC<GoldiDocsProgressProps> = ({
  projectId,
  status,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentStatusInfo | null>(null);

  const getStatusIcon = (docStatus: DocumentStatusInfo['status']) => {
    switch (docStatus) {
      case 'complete':
        return <CheckCircle className="w-3 h-3" />;
      case 'processing':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'error':
        return <XCircle className="w-3 h-3" />;
      case 'drift':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-600" />;
    }
  };

  const getStatusColor = (docStatus: DocumentStatusInfo['status']) => {
    switch (docStatus) {
      case 'complete':
        return 'goldidoc-slot--complete';
      case 'processing':
        return 'goldidoc-slot--processing';
      case 'error':
        return 'goldidoc-slot--error';
      case 'drift':
        return 'goldidoc-slot--drift';
      default:
        return '';
    }
  };

  const progressPercentage = (status.completedCount / status.totalCount) * 100;

  return (
    <>
      <div 
        className={cn('goldidocs-progress', className)}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="goldidocs-header">
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3" />
            <span>GoldiDocs ({status.completedCount}/{status.totalCount})</span>
          </div>
          {!isExpanded && (
            <div className="goldidocs-progress-bar">
              <div 
                className="goldidocs-progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="goldidocs-slots">
            {status.documents.map((doc) => (
              <button
                key={doc.type}
                onClick={() => setSelectedDocument(doc)}
                className={cn(
                  'goldidoc-slot',
                  getStatusColor(doc.status)
                )}
                title={doc.type}
              >
                {getStatusIcon(doc.status)}
              </button>
            ))}
          </div>
        )}

        {isExpanded && (
          <div className="goldidocs-hint">
            Click any document to preview
          </div>
        )}
      </div>

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          projectId={projectId}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
}; 