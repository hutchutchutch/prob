import { useCallback } from 'react';
import { 
  DocumentMetadata, 
  formatMarkdownForExport, 
  generatePdfHtml, 
  getDocumentFilename 
} from '../utils/documentFormatters';

export interface ExportOptions {
  format: 'markdown' | 'pdf' | 'html';
  content: string;
  metadata: DocumentMetadata;
}

export function useDocumentExport() {
  const exportDocument = useCallback(async (options: ExportOptions) => {
    const { format, content, metadata } = options;
    const filename = getDocumentFilename(metadata);

    switch (format) {
      case 'markdown':
        await exportAsMarkdown(content, metadata, filename);
        break;
      case 'pdf':
        await exportAsPdf(content, metadata, filename);
        break;
      case 'html':
        await exportAsHtml(content, metadata, filename);
        break;
    }
  }, []);

  const exportAllDocuments = useCallback(async (
    documents: Array<{ content: string; metadata: DocumentMetadata }>,
    format: 'markdown' | 'pdf' | 'html'
  ) => {
    // Create a zip file with all documents
    // In production, use a proper zip library
    for (const doc of documents) {
      await exportDocument({ format, content: doc.content, metadata: doc.metadata });
    }
  }, [exportDocument]);

  const copyToClipboard = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  return {
    exportDocument,
    exportAllDocuments,
    copyToClipboard,
  };
}

async function exportAsMarkdown(content: string, metadata: DocumentMetadata, filename: string) {
  const formattedContent = formatMarkdownForExport(content, metadata);
  const blob = new Blob([formattedContent], { type: 'text/markdown' });
  downloadFile(blob, filename.replace(/\.[^.]+$/, '.md'));
}

async function exportAsPdf(content: string, metadata: DocumentMetadata, filename: string) {
  const html = generatePdfHtml(content, metadata);
  
  // In production, use a proper PDF generation service
  // For now, we'll open the HTML in a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}

async function exportAsHtml(content: string, metadata: DocumentMetadata, filename: string) {
  const html = generatePdfHtml(content, metadata);
  const blob = new Blob([html], { type: 'text/html' });
  downloadFile(blob, filename.replace(/\.[^.]+$/, '.html'));
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}