import React from 'react';
import type { ExportFormat } from '../../types/export.types';

interface FormatSelectorProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  formatIcons: Record<ExportFormat, React.ReactNode>;
}

const formats: Array<{
  id: ExportFormat;
  name: string;
  description: string;
}> = [
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Clean, readable format with table of contents'
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'Structured data for re-import or API integration'
  },
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Professional layout with diagrams and branding'
  },
  {
    id: 'zip',
    name: 'ZIP Bundle',
    description: 'All documents and assets in one package'
  }
];

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
  formatIcons
}) => {
  return (
    <div className="format-selector">
      {formats.map(format => (
        <button
          key={format.id}
          className={`format-option ${selectedFormat === format.id ? 'format-option--selected' : ''}`}
          onClick={() => onFormatChange(format.id)}
        >
          <div className="format-icon">
            {formatIcons[format.id]}
          </div>
          <div className="format-info">
            <h4 className="format-name">{format.name}</h4>
            <p className="format-description body-sm">{format.description}</p>
          </div>
          {selectedFormat === format.id && (
            <div className="format-check">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="var(--color-accent-500)" />
                <path d="M14.5 7L8.5 13L5.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};