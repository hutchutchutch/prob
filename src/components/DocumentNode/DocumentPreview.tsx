import React from 'react';
import { DocumentMetadata } from '../../utils/documentFormatters';

interface DocumentPreviewProps {
  content: string;
  metadata: DocumentMetadata;
  maxLines?: number;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  content, 
  metadata,
  maxLines = 3 
}) => {
  // Extract preview text from markdown content
  const getPreviewText = () => {
    // Remove markdown formatting for preview
    let preview = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/^\s*[-*]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n{2,}/g, ' ') // Replace multiple newlines with space
      .trim();

    // Limit to first few sentences or characters
    const sentences = preview.split(/[.!?]\s+/);
    const limitedSentences = sentences.slice(0, maxLines).join('. ');
    
    if (limitedSentences.length > 200) {
      return limitedSentences.substring(0, 197) + '...';
    }
    
    return limitedSentences + (sentences.length > maxLines ? '...' : '');
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-300">{metadata.title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">
        {getPreviewText()}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span>v{metadata.version}</span>
        <span>•</span>
        <span>{metadata.updatedAt.toLocaleDateString()}</span>
      </div>
    </div>
  );
};