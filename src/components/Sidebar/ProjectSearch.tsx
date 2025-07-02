import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const ProjectSearch: React.FC<ProjectSearchProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search projects...',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'relative group',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-gray-800 border-2 transition-all duration-200',
          isFocused ? 'border-blue-500' : 'border-transparent',
          'hover:border-gray-600'
        )}
      >
        <Search className={cn(
          'icon-sm flex-shrink-0 transition-colors',
          isFocused ? 'text-blue-400' : 'text-gray-400'
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
        />

        {/* Keyboard shortcut hint */}
        {!value && !isFocused && (
          <div className="absolute right-3 flex items-center gap-1 text-xs text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">K</kbd>
          </div>
        )}

        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title="Clear search"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search results count */}
      {value && (
        <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">↵</kbd> to search
        </div>
      )}
    </div>
  );
};