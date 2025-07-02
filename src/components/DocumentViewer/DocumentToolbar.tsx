import React from 'react';
import { DocumentMetadata } from '../../utils/documentFormatters';

interface DocumentToolbarProps {
  metadata: DocumentMetadata;
  onExport: (format: 'markdown' | 'pdf' | 'html') => void;
  onClose: () => void;
  onToggleToc: () => void;
  showToc: boolean;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  metadata,
  onExport,
  onClose,
  onToggleToc,
  showToc,
}) => {
  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleToc}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150"
          title={showToc ? 'Hide table of contents' : 'Show table of contents'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-semibold text-white">{metadata.title}</h1>
          <p className="text-xs text-gray-400">
            Version {metadata.version} • Updated {metadata.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Export dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors duration-150">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-10">
            <button
              onClick={() => onExport('markdown')}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150"
            >
              Export as Markdown
            </button>
            <button
              onClick={() => onExport('html')}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150"
            >
              Export as HTML
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-150"
            >
              Export as PDF
            </button>
          </div>
        </div>

        {/* Print button */}
        <button
          onClick={() => window.print()}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150"
          title="Print document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150"
          title="Close document viewer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};