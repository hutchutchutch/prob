import { useEffect, useCallback, useState, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  items: any[];
  onSelect: (item: any, index: number) => void;
  onOpen?: (item: any, index: number) => void;
  onDelete?: (item: any, index: number) => void;
  onMultiSelect?: (indices: number[]) => void;
  isEnabled?: boolean;
  wrap?: boolean;
}

export const useKeyboardNavigation = ({
  items,
  onSelect,
  onOpen,
  onDelete,
  onMultiSelect,
  isEnabled = true,
  wrap = true,
}: UseKeyboardNavigationOptions) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const lastSelectedIndex = useRef<number>(-1);

  // Navigate up
  const navigateUp = useCallback(() => {
    setFocusedIndex(prev => {
      if (prev <= 0) {
        return wrap ? items.length - 1 : 0;
      }
      return prev - 1;
    });
  }, [items.length, wrap]);

  // Navigate down
  const navigateDown = useCallback(() => {
    setFocusedIndex(prev => {
      if (prev >= items.length - 1) {
        return wrap ? 0 : items.length - 1;
      }
      return prev + 1;
    });
  }, [items.length, wrap]);

  // Select current item
  const selectCurrent = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      onSelect(items[focusedIndex], focusedIndex);
      lastSelectedIndex.current = focusedIndex;
    }
  }, [focusedIndex, items, onSelect]);

  // Open current item
  const openCurrent = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < items.length && onOpen) {
      onOpen(items[focusedIndex], focusedIndex);
    }
  }, [focusedIndex, items, onOpen]);

  // Toggle selection for multi-select
  const toggleSelection = useCallback((index: number) => {
    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // Select range (Shift+Click behavior)
  const selectRange = useCallback((endIndex: number) => {
    const startIndex = lastSelectedIndex.current;
    if (startIndex === -1) {
      toggleSelection(endIndex);
      return;
    }

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);

    setSelectedIndices(prev => {
      const newSet = new Set(prev);
      for (let i = start; i <= end; i++) {
        newSet.add(i);
      }
      return newSet;
    });
  }, [toggleSelection]);

  // Select all
  const selectAll = useCallback(() => {
    const allIndices = new Set(Array.from({ length: items.length }, (_, i) => i));
    setSelectedIndices(allIndices);
    onMultiSelect?.(Array.from(allIndices));
  }, [items.length, onMultiSelect]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
    setFocusedIndex(-1);
    lastSelectedIndex.current = -1;
  }, []);

  // Delete selected items
  const deleteSelected = useCallback(() => {
    if (selectedIndices.size > 0 && onDelete) {
      const indices = Array.from(selectedIndices).sort((a, b) => b - a);
      indices.forEach(index => {
        if (index < items.length) {
          onDelete(items[index], index);
        }
      });
      clearSelection();
    } else if (focusedIndex >= 0 && focusedIndex < items.length && onDelete) {
      onDelete(items[focusedIndex], focusedIndex);
    }
  }, [selectedIndices, focusedIndex, items, onDelete, clearSelection]);

  // Keyboard event handler
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateUp();
          break;

        case 'ArrowDown':
          e.preventDefault();
          navigateDown();
          break;

        case 'Enter':
          e.preventDefault();
          if (e.metaKey || e.ctrlKey) {
            openCurrent();
          } else {
            selectCurrent();
          }
          break;

        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0) {
            toggleSelection(focusedIndex);
          }
          break;

        case 'a':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            selectAll();
          }
          break;

        case 'Escape':
          e.preventDefault();
          clearSelection();
          break;

        case 'Delete':
        case 'Backspace':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            deleteSelected();
          }
          break;

        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            navigateUp();
          } else {
            navigateDown();
          }
          break;
      }

      // Shift selection
      if (e.shiftKey && focusedIndex >= 0) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          selectRange(focusedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isEnabled,
    navigateUp,
    navigateDown,
    selectCurrent,
    openCurrent,
    toggleSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    selectRange,
    focusedIndex,
  ]);

  // Reset focus when items change
  useEffect(() => {
    if (focusedIndex >= items.length) {
      setFocusedIndex(items.length - 1);
    }
  }, [items.length, focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    selectedIndices: Array.from(selectedIndices),
    isSelected: (index: number) => selectedIndices.has(index),
    toggleSelection,
    selectRange,
    selectAll,
    clearSelection,
    navigateUp,
    navigateDown,
  };
};