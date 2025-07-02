import React, { useState, useCallback } from 'react';
import { X, Download, Share2, FileText, Code, FileImage, Archive } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FormatSelector } from './FormatSelector';
import { TemplateSelector } from './TemplateSelector';
import { ExportPreview } from './ExportPreview';
import { useExport } from '../../hooks/useExport';
import type { ExportFormat, ExportOptions, ExportSection } from '../../types/export.types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  markdown: <FileText className="icon" />,
  json: <Code className="icon" />,
  pdf: <FileImage className="icon" />,
  zip: <Archive className="icon" />
};

const defaultSections: ExportSection[] = [
  { id: 'problem', name: 'Problem Statement', included: true },
  { id: 'personas', name: 'User Personas', included: true },
  { id: 'painPoints', name: 'Pain Points', included: true },
  { id: 'solutions', name: 'Solutions', included: true },
  { id: 'userStories', name: 'User Stories', included: true },
  { id: 'productVision', name: 'Product Vision', included: true },
  { id: 'requirements', name: 'Functional Requirements', included: true },
  { id: 'architecture', name: 'System Architecture', included: true },
  { id: 'dataFlow', name: 'Data Flow', included: true },
  { id: 'database', name: 'Database Schema', included: true },
  { id: 'designSystem', name: 'Design System', included: true }
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [sections, setSections] = useState<ExportSection[]>(defaultSections);
  const [customBranding, setCustomBranding] = useState({
    companyName: '',
    logoUrl: '',
    primaryColor: '#2563EB'
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { exportProject, isExporting, exportHistory } = useExport();

  const handleSectionToggle = useCallback((sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId 
        ? { ...section, included: !section.included }
        : section
    ));
  }, []);

  const handleExport = useCallback(async () => {
    const options: ExportOptions = {
      format: selectedFormat,
      template: selectedTemplate,
      sections: sections.filter(s => s.included).map(s => s.id),
      customBranding: customBranding.companyName ? customBranding : undefined
    };

    await exportProject(projectId, projectName, options);
  }, [selectedFormat, selectedTemplate, sections, customBranding, projectId, projectName, exportProject]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="export-modal">
        <div className="export-modal-header">
          <h2 className="heading-2">Export Project</h2>
          <button onClick={onClose} className="btn-icon btn-icon--small">
            <X className="icon" />
          </button>
        </div>

        <div className="export-modal-content">
          {!isPreviewMode ? (
            <>
              <div className="export-section">
                <h3 className="heading-3">Export Format</h3>
                <FormatSelector
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                  formatIcons={formatIcons}
                />
              </div>

              <div className="export-section">
                <h3 className="heading-3">Template</h3>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  format={selectedFormat}
                />
              </div>

              <div className="export-section">
                <h3 className="heading-3">Include Sections</h3>
                <div className="section-list">
                  {sections.map(section => (
                    <label key={section.id} className="section-item">
                      <input
                        type="checkbox"
                        checked={section.included}
                        onChange={() => handleSectionToggle(section.id)}
                        className="checkbox"
                      />
                      <span className="section-name">{section.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedFormat !== 'json' && (
                <div className="export-section">
                  <h3 className="heading-3">Custom Branding</h3>
                  <div className="branding-options">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={customBranding.companyName}
                      onChange={(e) => setCustomBranding(prev => ({ ...prev, companyName: e.target.value }))}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Logo URL"
                      value={customBranding.logoUrl}
                      onChange={(e) => setCustomBranding(prev => ({ ...prev, logoUrl: e.target.value }))}
                      className="input"
                    />
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={customBranding.primaryColor}
                        onChange={(e) => setCustomBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="color-input"
                      />
                      <span className="color-label">Primary Color</span>
                    </div>
                  </div>
                </div>
              )}

              {exportHistory.length > 0 && (
                <div className="export-section">
                  <h3 className="heading-3">Export History</h3>
                  <div className="export-history">
                    {exportHistory.slice(0, 5).map((entry, index) => (
                      <div key={index} className="history-item">
                        <span className="history-format">{formatIcons[entry.format]}</span>
                        <span className="history-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                        <span className="history-template">{entry.template}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <ExportPreview
              format={selectedFormat}
              template={selectedTemplate}
              sections={sections.filter(s => s.included)}
              customBranding={customBranding}
              projectId={projectId}
            />
          )}
        </div>

        <div className="export-modal-footer">
          <div className="footer-left">
            <Button
              variant="secondary"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? 'Back to Options' : 'Preview'}
            </Button>
          </div>
          <div className="footer-right">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={isExporting}
              icon={<Download className="icon-sm" />}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button
              variant="primary"
              onClick={() => {/* Open share dialog */}}
              icon={<Share2 className="icon-sm" />}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};