import { useState, useEffect, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { RecentFlow } from './useRecentFlows';

interface UseProjectSearchOptions {
  searchKeys?: string[];
  threshold?: number;
  includeMatches?: boolean;
}

export const useProjectSearch = (
  projects: RecentFlow[],
  searchTerm: string,
  options: UseProjectSearchOptions = {}
) => {
  const {
    searchKeys = ['name', 'description', 'tags'],
    threshold = 0.3,
    includeMatches = true,
  } = options;

  // Configure Fuse.js for fuzzy search
  const fuseOptions = useMemo(() => ({
    keys: searchKeys,
    threshold,
    includeScore: true,
    includeMatches,
    findAllMatches: true,
    minMatchCharLength: 2,
    // Custom scoring for better relevance
    getFn: (obj: any, path: string[]) => {
      const value = path.reduce((obj, key) => obj?.[key], obj);
      if (Array.isArray(value)) {
        return value.join(' ');
      }
      return value || '';
    },
  }), [searchKeys, threshold, includeMatches]);

  const fuse = useMemo(() => {
    return new Fuse(projects, fuseOptions);
  }, [projects, fuseOptions]);

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return projects;
    }

    const results = fuse.search(searchTerm.trim());
    
    // Extract items and optionally include match metadata
    return results.map(result => ({
      ...result.item,
      _score: result.score,
      _matches: result.matches,
    }));
  }, [fuse, projects, searchTerm]);

  // Advanced search with filters
  const searchWithFilters = useCallback((
    term: string,
    filters?: {
      status?: RecentFlow['status'][];
      tags?: string[];
      dateRange?: { start: Date; end: Date };
    }
  ) => {
    let results = term ? fuse.search(term).map(r => r.item) : projects;

    if (filters) {
      // Filter by status
      if (filters.status && filters.status.length > 0) {
        results = results.filter(project => 
          filters.status!.includes(project.status)
        );
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(project =>
          filters.tags!.some(tag => project.tags.includes(tag))
        );
      }

      // Filter by date range
      if (filters.dateRange) {
        results = results.filter(project => {
          const modifiedAt = new Date(project.modifiedAt);
          return modifiedAt >= filters.dateRange!.start && 
                 modifiedAt <= filters.dateRange!.end;
        });
      }
    }

    return results;
  }, [fuse, projects]);

  // Get search suggestions based on partial input
  const getSuggestions = useCallback((partialTerm: string, limit = 5) => {
    if (!partialTerm || partialTerm.length < 2) {
      return [];
    }

    const results = fuse.search(partialTerm, { limit });
    
    // Extract unique suggested terms from matches
    const suggestions = new Set<string>();
    
    results.forEach(result => {
      result.matches?.forEach(match => {
        if (match.value) {
          // Add the matched portion as a suggestion
          const matchedText = match.value.substring(
            match.indices[0][0],
            match.indices[0][1] + 1
          );
          suggestions.add(matchedText);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }, [fuse]);

  // Highlight search terms in text
  const highlightSearchTerm = useCallback((text: string, term: string) => {
    if (!term || !text) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) => {
      if (part.toLowerCase() === term.toLowerCase()) {
        return `<mark key="${index}" class="bg-yellow-500/30 text-yellow-300">${part}</mark>`;
      }
      return part;
    }).join('');
  }, []);

  return {
    searchResults,
    searchWithFilters,
    getSuggestions,
    highlightSearchTerm,
    resultCount: searchResults.length,
    hasResults: searchResults.length > 0,
  };
};