import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import '@xterm/xterm/css/xterm.css';
import './Terminal.css';

interface TerminalProps {
  workingDirectory?: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  workingDirectory = '/', 
  isVisible,
  onClose 
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!terminalRef.current || !isVisible) return;

    // Initialize terminal
    const term = new XTerm({
      theme: {
        background: '#1a1a1a',
        foreground: '#e4e4e4',
        cursor: '#e4e4e4',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#d19a66',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#abb2bf',
        brightBlack: '#5c6370',
        brightRed: '#e06c75',
        brightGreen: '#98c379',
        brightYellow: '#d19a66',
        brightBlue: '#61afef',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff',
      },
      fontFamily: 'JetBrains Mono, Monaco, monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      convertEol: true,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    // Open terminal in container
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    // Initialize terminal session
    let cleanupFn: (() => void) | undefined;
    initializeTerminal(term, workingDirectory).then(cleanup => {
      cleanupFn = cleanup;
    });
    setIsReady(true);

    return () => {
      resizeObserver.disconnect();
      if (cleanupFn) cleanupFn();
      term.dispose();
    };
  }, [isVisible, workingDirectory]);

  const initializeTerminal = async (term: XTerm, cwd: string): Promise<(() => void) | undefined> => {
    // Check if we're in Tauri
    if (window.__TAURI__) {
      try {
        // Start PTY session in Tauri backend
        const sessionId = await invoke<string>('start_terminal_session', { cwd });
        setSessionId(sessionId);

        // Set up message handlers
        const unlisten = await window.__TAURI__.event.listen('terminal-output', (event: any) => {
          term.write(event.payload);
        });

        const unlistenClosed = await window.__TAURI__.event.listen('terminal-closed', (event: any) => {
          if (event.payload === sessionId) {
            term.writeln('\r\n[Terminal session closed]');
          }
        });

        const unlistenError = await window.__TAURI__.event.listen('terminal-error', (event: any) => {
          term.writeln(`\r\n[Error: ${event.payload}]`);
        });

        // Handle input
        const onDataDispose = term.onData((data) => {
          invoke('write_to_terminal', { sessionId, data });
        });

        // Clean up on unmount
        return () => {
          unlisten();
          unlistenClosed();
          unlistenError();
          onDataDispose.dispose();
          invoke('close_terminal_session', { sessionId });
          setSessionId(null);
        };
      } catch (error) {
        console.error('Failed to initialize Tauri terminal:', error);
        // Fall back to simulated terminal
        initializeSimulatedTerminal(term, cwd);
      }
    } else {
      // Browser environment - use simulated terminal
      initializeSimulatedTerminal(term, cwd);
    }
  };

  const initializeSimulatedTerminal = (term: XTerm, cwd: string) => {
    // Welcome message
    term.writeln('\x1b[1;32mGauntlet Terminal (Simulated)\x1b[0m');
    term.writeln(`Working directory: ${cwd}`);
    term.writeln('Note: This is a simulated terminal. Use the desktop app for full functionality.');
    term.writeln('');
    term.write('$ ');

    let currentLine = '';
    
    term.onData((data) => {
      switch (data) {
        case '\r': // Enter
          term.writeln('');
          handleSimulatedCommand(term, currentLine.trim(), cwd);
          currentLine = '';
          term.write('$ ');
          break;
        case '\u007F': // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
          break;
        case '\u0003': // Ctrl+C
          term.writeln('^C');
          currentLine = '';
          term.write('$ ');
          break;
        default:
          if (data >= ' ') {
            currentLine += data;
            term.write(data);
          }
      }
    });
  };

  const handleSimulatedCommand = (term: XTerm, command: string, cwd: string) => {
    if (!command) return;

    // Simulate some basic commands
    switch (command) {
      case 'help':
        term.writeln('Available commands:');
        term.writeln('  help     - Show this help message');
        term.writeln('  clear    - Clear the terminal');
        term.writeln('  pwd      - Print working directory');
        term.writeln('  echo     - Echo text');
        term.writeln('  date     - Show current date');
        term.writeln('');
        term.writeln('For full terminal functionality, please use the desktop app.');
        break;
      
      case 'clear':
        term.clear();
        break;
      
      case 'pwd':
        term.writeln(cwd);
        break;
      
      case 'date':
        term.writeln(new Date().toString());
        break;
      
      default:
        if (command.startsWith('echo ')) {
          term.writeln(command.substring(5));
        } else {
          term.writeln(`Command not found: ${command}`);
          term.writeln('Type "help" for available commands.');
        }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span className="terminal-title">Terminal</span>
        <button className="terminal-close" onClick={onClose}>×</button>
      </div>
      <div ref={terminalRef} className="terminal-content" />
    </div>
  );
}; 