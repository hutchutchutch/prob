// Document formatting utilities

export interface DocumentMetadata {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  type: 'product-vision' | 'functional-requirements' | 'system-architecture' | 'data-flow' | 'design-system' | 'database-schema';
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children: TableOfContentsItem[];
}

/**
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(markdown: string): TableOfContentsItem[] {
  const lines = markdown.split('\n');
  const toc: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];
  let idCounter = 0;

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = `heading-${++idCounter}`;

      const item: TableOfContentsItem = {
        id,
        title,
        level,
        children: [],
      };

      // Find parent based on level
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        toc.push(item);
      } else {
        stack[stack.length - 1].children.push(item);
      }

      stack.push(item);
    }
  });

  return toc;
}

/**
 * Format markdown for export
 */
export function formatMarkdownForExport(markdown: string, metadata: DocumentMetadata): string {
  const header = `---
title: ${metadata.title}
type: ${metadata.type}
version: ${metadata.version}
created: ${metadata.createdAt.toISOString()}
updated: ${metadata.updatedAt.toISOString()}
---

`;

  return header + markdown;
}

/**
 * Convert markdown to HTML for PDF export
 */
export function markdownToHtml(markdown: string): string {
  // This is a simplified version - in production, use a proper markdown parser
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  return html;
}

/**
 * Generate PDF-ready HTML with styling
 */
export function generatePdfHtml(content: string, metadata: DocumentMetadata): string {
  const html = markdownToHtml(content);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${metadata.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { font-size: 2.5em; margin-bottom: 0.5em; color: #111; }
    h2 { font-size: 2em; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
    h3 { font-size: 1.5em; margin-top: 1em; margin-bottom: 0.5em; color: #111; }
    code {
      background: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
    }
    pre {
      background: #f4f4f4;
      padding: 16px;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 0;
      padding-left: 16px;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f4f4f4;
      font-weight: bold;
    }
    @media print {
      body { margin: 0; padding: 20px; }
      pre { white-space: pre-wrap; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${metadata.title}</h1>
    <p><small>Version: ${metadata.version} | Updated: ${metadata.updatedAt.toLocaleDateString()}</small></p>
  </header>
  ${html}
</body>
</html>
  `;
}

/**
 * Get file extension for document type
 */
export function getDocumentExtension(type: DocumentMetadata['type']): string {
  switch (type) {
    case 'database-schema':
      return 'sql';
    default:
      return 'md';
  }
}

/**
 * Get formatted filename for document
 */
export function getDocumentFilename(metadata: DocumentMetadata): string {
  const date = metadata.updatedAt.toISOString().split('T')[0];
  const extension = getDocumentExtension(metadata.type);
  return `${metadata.type}-${date}.${extension}`;
}