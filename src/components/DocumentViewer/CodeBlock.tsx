import React, { useState } from 'react';
import { highlightCode, getTokenClass } from '../../utils/syntaxHighlighting';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'text',
  showLineNumbers = true 
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code.split('\n');
  const tokens = highlightCode(code, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="relative group bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-gray-600">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors duration-150"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <tbody>
            {lines.map((line, lineIndex) => (
              <tr key={lineIndex} className="hover:bg-gray-700/30">
                {showLineNumbers && (
                  <td className="px-4 py-0 text-right text-gray-500 select-none text-sm font-mono">
                    {lineIndex + 1}
                  </td>
                )}
                <td className="px-4 py-0 w-full">
                  <pre className="font-mono text-sm">
                    <code>
                      {renderLine(line, lineIndex, tokens)}
                    </code>
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function renderLine(line: string, lineIndex: number, tokens: ReturnType<typeof highlightCode>) {
  // This is a simplified version - in production, properly map tokens to lines
  let currentPosition = 0;
  const lineTokens: JSX.Element[] = [];

  tokens.forEach((token, tokenIndex) => {
    const tokenLines = token.value.split('\n');
    tokenLines.forEach((tokenLine, tokenLineIndex) => {
      if (tokenLineIndex > 0) {
        currentPosition++;
      }
      if (currentPosition === lineIndex && tokenLine) {
        lineTokens.push(
          <span key={`${tokenIndex}-${tokenLineIndex}`} className={getTokenClass(token.type)}>
            {tokenLine}
          </span>
        );
      }
    });
  });

  return lineTokens.length > 0 ? lineTokens : <span className="text-gray-300">{line || ' '}</span>;
}