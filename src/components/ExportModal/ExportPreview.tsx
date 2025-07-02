import React, { useEffect, useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import type { ExportFormat, ExportSection } from '../../types/export.types';

interface ExportPreviewProps {
  format: ExportFormat;
  template: string;
  sections: ExportSection[];
  customBranding: {
    companyName: string;
    logoUrl: string;
    primaryColor: string;
  };
  projectId: string;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({
  format,
  template,
  sections,
  customBranding,
  projectId
}) => {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate preview generation
    const generatePreview = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would call the export generators
      // For now, we'll create a simple preview
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let preview = '';
      
      if (format === 'markdown') {
        preview = `# ${customBranding.companyName || 'Project'} Documentation\n\n`;
        preview += `## Table of Contents\n\n`;
        sections.forEach((section, index) => {
          preview += `${index + 1}. [${section.name}](#${section.id})\n`;
        });
        preview += `\n---\n\n`;
        
        sections.forEach(section => {
          preview += `## ${section.name}\n\n`;
          preview += `*Content for ${section.name} will be generated here...*\n\n`;
        });
      } else if (format === 'json') {
        const jsonPreview = {
          project: {
            id: projectId,
            exportDate: new Date().toISOString(),
            template: template,
            sections: sections.map(s => ({
              id: s.id,
              name: s.name,
              content: `Content for ${s.name}`
            }))
          }
        };
        preview = JSON.stringify(jsonPreview, null, 2);
      } else if (format === 'pdf') {
        preview = 'PDF preview will be displayed here with proper formatting and layout.';
      } else if (format === 'zip') {
        preview = `ZIP Bundle Contents:\n\n`;
        preview += `- README.md\n`;
        sections.forEach(section => {
          preview += `- ${section.id}.md\n`;
        });
        preview += `- assets/\n`;
        preview += `  - diagrams/\n`;
        preview += `  - images/\n`;
      }
      
      setPreviewContent(preview);
      setIsLoading(false);
    };

    generatePreview();
  }, [format, template, sections, customBranding, projectId]);

  if (isLoading) {
    return (
      <div className="preview-loading">
        <Loader className="icon animate-spin" />
        <p className="body-sm">Generating preview...</p>
      </div>
    );
  }

  return (
    <div className="export-preview">
      <div className="preview-header">
        <FileText className="icon" />
        <h4 className="preview-title">Export Preview</h4>
        <span className="preview-format badge badge-info">{format.toUpperCase()}</span>
      </div>
      
      <div className="preview-content">
        {format === 'pdf' ? (
          <div className="pdf-preview">
            <div className="pdf-page">
              <div className="pdf-header" style={{ borderColor: customBranding.primaryColor }}>
                {customBranding.logoUrl && (
                  <img src={customBranding.logoUrl} alt="Logo" className="pdf-logo" />
                )}
                <h1>{customBranding.companyName || 'Project Documentation'}</h1>
              </div>
              <div className="pdf-body">
                <p>PDF content preview with professional layout...</p>
              </div>
            </div>
          </div>
        ) : (
          <pre className="preview-code">
            <code>{previewContent}</code>
          </pre>
        )}
      </div>
      
      <div className="preview-info">
        <p className="body-sm">
          {sections.length} sections included • {template} template
        </p>
      </div>
    </div>
  );
};