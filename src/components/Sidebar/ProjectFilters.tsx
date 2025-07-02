import React, { useState, useRef, useEffect } from 'react';
import { Filter, Calendar, Tag, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FilterOptions {
  status: ('draft' | 'in-progress' | 'completed' | 'archived')[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  tags: string[];
  sortBy: 'recent' | 'name' | 'progress' | 'modified';
}

interface ProjectFiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  availableTags?: string[];
  className?: string;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onChange,
  availableTags = [],
  className = '',
}) => {
  const [showDropdown, setShowDropdown] = useState<'status' | 'date' | 'tags' | 'sort' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(null);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const toggleStatus = (status: FilterOptions['status'][number]) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatuses });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: newTags });
  };

  const activeFiltersCount = 
    filters.status.length + 
    (filters.dateRange !== 'all' ? 1 : 0) + 
    filters.tags.length +
    (filters.sortBy !== 'recent' ? 1 : 0);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div className="flex items-center gap-2 mb-3">
        {/* Main filter button */}
        <button
          onClick={() => setShowDropdown(showDropdown ? null : 'status')}
          className={cn(
            'btn-icon btn-icon--small relative',
            activeFiltersCount > 0 && 'border-blue-500'
          )}
        >
          <Filter className="icon-sm" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Quick filters */}
        <div className="flex gap-1 flex-1">
          <button
            onClick={() => {
              onChange({
                ...filters,
                status: filters.status.includes('in-progress') 
                  ? filters.status.filter(s => s !== 'in-progress')
                  : [...filters.status, 'in-progress']
              });
            }}
            className={cn(
              'px-2 py-1 text-xs rounded-md transition-colors',
              filters.status.includes('in-progress')
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            )}
          >
            In Progress
          </button>
          <button
            onClick={() => {
              onChange({
                ...filters,
                status: filters.status.includes('completed')
                  ? filters.status.filter(s => s !== 'completed')
                  : [...filters.status, 'completed']
              });
            }}
            className={cn(
              'px-2 py-1 text-xs rounded-md transition-colors',
              filters.status.includes('completed')
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            )}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute top-10 left-0 z-20 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[240px]">
          {/* Tab navigation */}
          <div className="flex gap-2 mb-3 border-b border-gray-700 pb-2">
            <button
              onClick={() => setShowDropdown('status')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                showDropdown === 'status' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              Status
            </button>
            <button
              onClick={() => setShowDropdown('date')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                showDropdown === 'date' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              Date
            </button>
            <button
              onClick={() => setShowDropdown('tags')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                showDropdown === 'tags' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              Tags
            </button>
            <button
              onClick={() => setShowDropdown('sort')}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                showDropdown === 'sort' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              Sort
            </button>
          </div>

          {/* Status filters */}
          {showDropdown === 'status' && (
            <div className="space-y-2">
              {(['draft', 'in-progress', 'completed', 'archived'] as const).map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="checkbox"
                  />
                  <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          )}

          {/* Date range filters */}
          {showDropdown === 'date' && (
            <div className="space-y-1">
              {(['all', 'today', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => onChange({ ...filters, dateRange: range })}
                  className={cn(
                    'w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-700 flex items-center justify-between',
                    filters.dateRange === range && 'bg-gray-700'
                  )}
                >
                  <span className="capitalize">{range === 'all' ? 'All time' : `This ${range}`}</span>
                  {filters.dateRange === range && <Check className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
          )}

          {/* Tag filters */}
          {showDropdown === 'tags' && (
            <div className="space-y-2">
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="checkbox"
                    />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-400">No tags available</p>
              )}
            </div>
          )}

          {/* Sort options */}
          {showDropdown === 'sort' && (
            <div className="space-y-1">
              {(['recent', 'name', 'progress', 'modified'] as const).map(sortBy => (
                <button
                  key={sortBy}
                  onClick={() => onChange({ ...filters, sortBy })}
                  className={cn(
                    'w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-700 flex items-center justify-between',
                    filters.sortBy === sortBy && 'bg-gray-700'
                  )}
                >
                  <span className="capitalize">
                    {sortBy === 'recent' ? 'Recently opened' : sortBy === 'modified' ? 'Last modified' : sortBy}
                  </span>
                  {filters.sortBy === sortBy && <Check className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
          )}

          {/* Clear filters button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onChange({
                  status: [],
                  dateRange: 'all',
                  tags: [],
                  sortBy: 'recent'
                });
                setShowDropdown(null);
              }}
              className="w-full mt-3 pt-3 border-t border-gray-700 text-sm text-red-400 hover:text-red-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};