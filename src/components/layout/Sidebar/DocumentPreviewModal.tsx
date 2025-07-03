import React, { useEffect, useState } from 'react';
import { X, FileText, RefreshCw, Eye, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import type { DocumentStatusInfo } from './types';
import { DOCUMENT_NAMES } from './types';
import { goldiDocsAPI } from '@/services/api/goldidocs';

interface DocumentPreviewModalProps {
  document: DocumentStatusInfo;
  projectId: string;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  projectId,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (document.status === 'complete') {
      loadDocumentContent();
    }
  }, [document, projectId]);

  const loadDocumentContent = async () => {
    setIsLoading(true);
    try {
      const data = await goldiDocsAPI.getDocumentContent(projectId, document.type);
      setContent(data);
    } catch (error) {
      console.error('Failed to load document content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      complete: { text: 'Complete', className: 'bg-green-900/50 text-green-400' },
      processing: { text: 'Processing', className: 'bg-blue-900/50 text-blue-400' },
      pending: { text: 'Not Started', className: 'bg-gray-900/50 text-gray-400' },
      error: { text: 'Error', className: 'bg-red-900/50 text-red-400' },
      drift: { text: 'Needs Update', className: 'bg-orange-900/50 text-orange-400' },
    };

    const config = statusConfig[document.status] || statusConfig.pending;

    return (
      <span className={cn('px-2 py-1 rounded-md text-xs font-medium', config.className)}>
        {config.text}
      </span>
    );
  };

  const renderDocumentPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      );
    }

    if (document.status === 'complete' && content) {
      // Render actual content based on document type
      switch (document.type) {
        case 'PV':
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Product Name</h4>
                <p className="text-gray-400">{content.product_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Elevator Pitch</h4>
                <p className="text-gray-400">{content.elevator_pitch}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Vision Statement</h4>
                <p className="text-gray-400">{content.vision_statement}</p>
              </div>
            </div>
          );
        case 'FR':
          return (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Features</h4>
              {content.features?.map((feature: any, index: number) => (
                <div key={index} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-200">{feature.name}</h5>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded',
                      feature.priority === 'Must Have' ? 'bg-red-900/50 text-red-400' :
                      feature.priority === 'Should Have' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-gray-900/50 text-gray-400'
                    )}>
                      {feature.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          );
        case 'SA':
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Architecture Pattern</h4>
                <p className="text-gray-400">{content.architecture_pattern}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Justification</h4>
                <p className="text-gray-400">{content.pattern_justification}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Tech Stack</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Frontend:</span>
                    <span className="ml-2 text-gray-400">{content.tech_stack?.frontend?.framework}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Backend:</span>
                    <span className="ml-2 text-gray-400">{content.tech_stack?.backend?.framework}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="text-gray-400">
              Document preview for {DOCUMENT_NAMES[document.type]} is not yet implemented.
            </div>
          );
      }
    }

    // Default preview for pending/processing documents
    return getDefaultPreview();
  };

  const getDefaultPreview = () => {
    const previews = {
      PV: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Based on your problem statement, personas, pain points, and solutions.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>Executive Summary</li>
            <li>Problem Statement</li>
            <li>Target Personas</li>
            <li>Proposed Solutions</li>
            <li>Key Features</li>
            <li>Success Metrics</li>
          </ul>
        </>
      ),
      FR: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Detailed functional requirements based on your product vision.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>User Stories</li>
            <li>Acceptance Criteria</li>
            <li>System Requirements</li>
            <li>Data Validations</li>
            <li>User Roles & Permissions</li>
            <li>Integration Points</li>
          </ul>
        </>
      ),
      SA: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Technical architecture design for your system.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>System Components</li>
            <li>Technology Stack</li>
            <li>Infrastructure Design</li>
            <li>Security Measures</li>
            <li>Scalability Approach</li>
            <li>Deployment Strategy</li>
          </ul>
        </>
      ),
      DF: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Visual representation of data flow through your system.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>External Entities</li>
            <li>Data Processes</li>
            <li>Data Stores</li>
            <li>Data Flows</li>
            <li>Context Diagrams</li>
            <li>Process Decomposition</li>
          </ul>
        </>
      ),
      ER: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Database schema and entity relationships.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>Entity Definitions</li>
            <li>Relationships</li>
            <li>Attributes & Data Types</li>
            <li>Primary & Foreign Keys</li>
            <li>Business Rules</li>
            <li>Data Classifications</li>
          </ul>
        </>
      ),
      DS: (
        <>
          <h4 className="text-sm font-medium text-gray-300 mb-2">What will be generated:</h4>
          <p className="text-gray-400 mb-4">
            Comprehensive design system for consistent UI/UX.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            <li>Color Palette</li>
            <li>Typography System</li>
            <li>Component Library</li>
            <li>Layout Grid</li>
            <li>UI Patterns</li>
            <li>Accessibility Guidelines</li>
          </ul>
        </>
      ),
    };

    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        {previews[document.type]}
      </div>
    );
  };

  const handleRegenerate = async () => {
    try {
      await goldiDocsAPI.generateDocument(projectId, document.type);
      onClose();
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={DOCUMENT_NAMES[document.type]}
      size="lg"
    >
      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Status:</span>
            {getStatusBadge()}
          </div>
          {document.generatedAt && (
            <span className="text-xs text-gray-500">
              Generated {new Date(document.generatedAt).toLocaleString()}
            </span>
          )}
        </div>

        {/* Document Preview */}
        <div className="min-h-[200px]">
          {renderDocumentPreview()}
        </div>

        {/* Error Message */}
        {document.status === 'error' && document.error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-400">{document.error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          {document.status === 'complete' && (
            <Button
              variant="secondary"
              size="sm"
              icon={Eye}
            >
              View Full Document
            </Button>
          )}
          {(document.status === 'pending' || document.status === 'error') && (
            <Button
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={handleRegenerate}
            >
              Generate
            </Button>
          )}
          {document.status === 'drift' && (
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={handleRegenerate}
            >
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}; 