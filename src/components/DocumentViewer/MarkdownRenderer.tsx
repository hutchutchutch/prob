import React, { useEffect, useRef } from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  onHeadingInView?: (id: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content,
  onHeadingInView 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onHeadingInView || !contentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) onHeadingInView(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [content, onHeadingInView]);

  const renderMarkdown = () => {
    // Split content into blocks
    const blocks = content.split(/\n\n+/);
    let headingCounter = 0;

    return blocks.map((block, index) => {
      // Code blocks
      if (block.startsWith('```')) {
        const match = block.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
        if (match) {
          const [, language, code] = match;
          return <CodeBlock key={index} code={code} language={language} />;
        }
      }

      // Headings
      const headingMatch = block.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const id = `heading-${++headingCounter}`;
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        
        const headingClasses = {
          1: 'text-3xl font-bold text-white mb-4 mt-8',
          2: 'text-2xl font-semibold text-white mb-3 mt-6',
          3: 'text-xl font-semibold text-white mb-2 mt-4',
          4: 'text-lg font-medium text-white mb-2 mt-3',
          5: 'text-base font-medium text-white mb-1 mt-2',
          6: 'text-sm font-medium text-gray-300 mb-1 mt-2',
        };

        return (
          <HeadingTag 
            key={index} 
            id={id}
            className={headingClasses[level as keyof typeof headingClasses]}
          >
            {text}
          </HeadingTag>
        );
      }

      // Lists
      if (block.match(/^[-*]\s+/m)) {
        const items = block.split('\n').filter(line => line.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-1 text-gray-300 mb-4">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s+/, '')}</li>
            ))}
          </ul>
        );
      }

      // Numbered lists
      if (block.match(/^\d+\.\s+/m)) {
        const items = block.split('\n').filter(line => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-1 text-gray-300 mb-4">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s+/, '')}</li>
            ))}
          </ol>
        );
      }

      // Blockquotes
      if (block.startsWith('>')) {
        const text = block.split('\n').map(line => line.replace(/^>\s*/, '')).join(' ');
        return (
          <blockquote key={index} className="border-l-4 border-gray-600 pl-4 italic text-gray-400 mb-4">
            {text}
          </blockquote>
        );
      }

      // Tables (simple support)
      if (block.includes('|') && block.split('\n').length > 2) {
        const lines = block.split('\n').filter(line => line.trim());
        const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = lines.slice(2).map(line => 
          line.split('|').map(cell => cell.trim()).filter(cell => cell)
        );

        return (
          <div key={index} className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-gray-400">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-300 mb-4 leading-relaxed">
          {renderInlineElements(block)}
        </p>
      );
    });
  };

  const renderInlineElements = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-700 text-blue-400 rounded text-sm font-mono">$1</code>');
    
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div ref={contentRef} className="prose prose-invert max-w-none">
      {renderMarkdown()}
    </div>
  );
};