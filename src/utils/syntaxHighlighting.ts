// Syntax highlighting utilities for code blocks

export interface HighlightToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'operator' | 'function' | 'variable' | 'plain';
  value: string;
}

/**
 * Simple syntax highlighter for common languages
 */
export function highlightCode(code: string, language: string): HighlightToken[] {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
      return highlightJavaScript(code);
    case 'sql':
      return highlightSQL(code);
    case 'json':
      return highlightJSON(code);
    case 'css':
      return highlightCSS(code);
    case 'html':
    case 'xml':
      return highlightHTML(code);
    default:
      return [{ type: 'plain', value: code }];
  }
}

function highlightJavaScript(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const keywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|new|this|super|import|export|default|from|async|await|try|catch|finally|throw|typeof|instanceof|void|delete|in|of)\b/g;
  const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
  const numbers = /\b\d+(\.\d+)?\b/g;
  const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;

  // Create a map of all matches
  const matches: Array<{ start: number; end: number; type: HighlightToken['type']; value: string }> = [];

  // Find all matches
  let match;
  while ((match = comments.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'comment', value: match[0] });
  }
  while ((match = strings.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'string', value: match[0] });
  }
  while ((match = keywords.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', value: match[0] });
  }
  while ((match = numbers.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'number', value: match[0] });
  }
  while ((match = functions.exec(code)) !== null) {
    const funcName = match[1];
    matches.push({ start: match.index, end: match.index + funcName.length, type: 'function', value: funcName });
  }

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Build tokens
  let lastEnd = 0;
  for (const match of matches) {
    // Skip overlapping matches
    if (match.start < lastEnd) continue;

    // Add plain text before this match
    if (match.start > lastEnd) {
      tokens.push({ type: 'plain', value: code.slice(lastEnd, match.start) });
    }

    // Add the matched token
    tokens.push({ type: match.type, value: match.value });
    lastEnd = match.end;
  }

  // Add remaining plain text
  if (lastEnd < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastEnd) });
  }

  return tokens;
}

function highlightSQL(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const keywords = /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|DROP|ALTER|ADD|COLUMN|PRIMARY KEY|FOREIGN KEY|REFERENCES|INDEX|UNIQUE|NOT NULL|DEFAULT|AUTO_INCREMENT|IF EXISTS|AS|DISTINCT|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|CASE|WHEN|THEN|ELSE|END)\b/gi;
  const strings = /'([^']*)'/g;
  const comments = /(--.*$|\/\*[\s\S]*?\*\/)/gm;
  const numbers = /\b\d+(\.\d+)?\b/g;

  const matches: Array<{ start: number; end: number; type: HighlightToken['type']; value: string }> = [];

  let match;
  while ((match = comments.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'comment', value: match[0] });
  }
  while ((match = strings.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'string', value: match[0] });
  }
  while ((match = keywords.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', value: match[0] });
  }
  while ((match = numbers.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'number', value: match[0] });
  }

  matches.sort((a, b) => a.start - b.start);

  let lastEnd = 0;
  for (const match of matches) {
    if (match.start < lastEnd) continue;
    if (match.start > lastEnd) {
      tokens.push({ type: 'plain', value: code.slice(lastEnd, match.start) });
    }
    tokens.push({ type: match.type, value: match.value });
    lastEnd = match.end;
  }

  if (lastEnd < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastEnd) });
  }

  return tokens;
}

function highlightJSON(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const strings = /"([^"]*)"/g;
  const numbers = /\b\d+(\.\d+)?\b/g;
  const booleans = /\b(true|false|null)\b/g;

  const matches: Array<{ start: number; end: number; type: HighlightToken['type']; value: string }> = [];

  let match;
  while ((match = strings.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'string', value: match[0] });
  }
  while ((match = numbers.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'number', value: match[0] });
  }
  while ((match = booleans.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', value: match[0] });
  }

  matches.sort((a, b) => a.start - b.start);

  let lastEnd = 0;
  for (const match of matches) {
    if (match.start < lastEnd) continue;
    if (match.start > lastEnd) {
      tokens.push({ type: 'plain', value: code.slice(lastEnd, match.start) });
    }
    tokens.push({ type: match.type, value: match.value });
    lastEnd = match.end;
  }

  if (lastEnd < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastEnd) });
  }

  return tokens;
}

function highlightCSS(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const selectors = /([.#]?[a-zA-Z][a-zA-Z0-9-_]*|:[a-zA-Z-]+|\[[^\]]+\])/g;
  const properties = /([a-zA-Z-]+)(?=\s*:)/g;
  const values = /:\s*([^;]+)/g;
  const comments = /\/\*[\s\S]*?\*\//g;

  const matches: Array<{ start: number; end: number; type: HighlightToken['type']; value: string }> = [];

  let match;
  while ((match = comments.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'comment', value: match[0] });
  }

  matches.sort((a, b) => a.start - b.start);

  let lastEnd = 0;
  for (const match of matches) {
    if (match.start < lastEnd) continue;
    if (match.start > lastEnd) {
      tokens.push({ type: 'plain', value: code.slice(lastEnd, match.start) });
    }
    tokens.push({ type: match.type, value: match.value });
    lastEnd = match.end;
  }

  if (lastEnd < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastEnd) });
  }

  return tokens;
}

function highlightHTML(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const tags = /<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g;
  const attributes = /\s([a-zA-Z-]+)(?==)/g;
  const strings = /=["']([^"']*)/g;
  const comments = /<!--[\s\S]*?-->/g;

  const matches: Array<{ start: number; end: number; type: HighlightToken['type']; value: string }> = [];

  let match;
  while ((match = comments.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'comment', value: match[0] });
  }
  while ((match = tags.exec(code)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', value: match[0] });
  }

  matches.sort((a, b) => a.start - b.start);

  let lastEnd = 0;
  for (const match of matches) {
    if (match.start < lastEnd) continue;
    if (match.start > lastEnd) {
      tokens.push({ type: 'plain', value: code.slice(lastEnd, match.start) });
    }
    tokens.push({ type: match.type, value: match.value });
    lastEnd = match.end;
  }

  if (lastEnd < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastEnd) });
  }

  return tokens;
}

/**
 * Get CSS class for token type
 */
export function getTokenClass(type: HighlightToken['type']): string {
  const classMap: Record<HighlightToken['type'], string> = {
    keyword: 'text-blue-400',
    string: 'text-green-500',
    comment: 'text-gray-500 italic',
    number: 'text-yellow-500',
    operator: 'text-gray-300',
    function: 'text-purple-400',
    variable: 'text-orange-400',
    plain: 'text-gray-300',
  };

  return classMap[type] || 'text-gray-300';
}