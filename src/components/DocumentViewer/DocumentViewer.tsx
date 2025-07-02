import React, { useState, useEffect } from 'react';
import { DocumentToolbar } from './DocumentToolbar';
import { TableOfContents } from './TableOfContents';
import { MarkdownRenderer } from './MarkdownRenderer';
import { extractTableOfContents, DocumentMetadata } from '../../utils/documentFormatters';
import { useDocumentExport } from '../../hooks/useDocumentExport';

interface DocumentViewerProps {
  content: string;
  metadata: DocumentMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  content,
  metadata,
  isOpen,
  onClose,
}) => {
  const [showToc, setShowToc] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [tableOfContents, setTableOfContents] = useState<ReturnType<typeof extractTableOfContents>>([]);
  
  const { exportDocument } = useDocumentExport();

  useEffect(() => {
    if (content) {
      const toc = extractTableOfContents(content);
      setTableOfContents(toc);
    }
  }, [content]);

  const handleExport = async (format: 'markdown' | 'pdf' | 'html') => {
    await exportDocument({ format, content, metadata });
  };

  const handleTocItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Toolbar */}
      <DocumentToolbar
        metadata={metadata}
        onExport={handleExport}
        onClose={onClose}
        onToggleToc={() => setShowToc(!showToc)}
        showToc={showToc}
      />

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents */}
        <div
          className={`transition-all duration-300 ${
            showToc ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          {showToc && (
            <TableOfContents
              items={tableOfContents}
              activeId={activeHeadingId}
              onItemClick={handleTocItemClick}
            />
          )}
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <MarkdownRenderer
              content={content}
              onHeadingInView={setActiveHeadingId}
            />
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .fixed {
            position: static;
          }
          
          nav, button, .print\\:hidden {
            display: none !important;
          }
          
          .bg-gray-900 {
            background: white !important;
          }
          
          .text-white {
            color: black !important;
          }
          
          .text-gray-300, .text-gray-400 {
            color: #4b5563 !important;
          }
          
          code {
            background: #f3f4f6 !important;
            color: #1f2937 !important;
          }
          
          .bg-gray-800 {
            background: #f3f4f6 !important;
          }
        }
      `}</style>
    </div>
  );
};