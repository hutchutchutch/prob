import React from 'react';
import { Layout, FileText, Briefcase, Zap } from 'lucide-react';
import type { ExportFormat } from '../../types/export.types';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  format: ExportFormat;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  formats: ExportFormat[];
}

const templates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard layout with all sections',
    icon: <Layout className="icon" />,
    formats: ['markdown', 'json', 'pdf', 'zip']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and concise, key information only',
    icon: <FileText className="icon" />,
    formats: ['markdown', 'pdf']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive-ready with branding and polish',
    icon: <Briefcase className="icon" />,
    formats: ['pdf', 'markdown']
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Technical focus with code snippets and diagrams',
    icon: <Zap className="icon" />,
    formats: ['markdown', 'json', 'zip']
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
  format
}) => {
  const availableTemplates = templates.filter(template => 
    template.formats.includes(format)
  );

  return (
    <div className="template-selector">
      {availableTemplates.map(template => (
        <button
          key={template.id}
          className={`template-option ${selectedTemplate === template.id ? 'template-option--selected' : ''}`}
          onClick={() => onTemplateChange(template.id)}
        >
          <div className="template-icon">
            {template.icon}
          </div>
          <div className="template-content">
            <h4 className="template-name">{template.name}</h4>
            <p className="template-description body-sm">{template.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};