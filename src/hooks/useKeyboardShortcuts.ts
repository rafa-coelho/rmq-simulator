import { useEffect, useCallback } from 'react';
import { useSimulatorStore } from '../store/simulatorStore';
import type { Position } from '../types';

interface UseKeyboardShortcutsOptions {
  getViewportCenter: () => Position;
}

export function useKeyboardShortcuts({ getViewportCenter }: UseKeyboardShortcutsOptions) {
  const {
    selectedNodeIds,
    selectedConnectionId,
    undo,
    redo,
    deleteSelectedNodes,
    deleteConnection,
    selectAll,
    duplicateSelectedNodes,
    clearSelection,
    addProducer,
    addExchange,
    addQueue,
    addConsumer,
  } = useSimulatorStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + Z - Undo
    if (ctrlOrCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
    if ((ctrlOrCmd && e.shiftKey && e.key === 'z') || (ctrlOrCmd && e.key === 'y')) {
      e.preventDefault();
      redo();
      return;
    }

    // Ctrl/Cmd + A - Select All
    if (ctrlOrCmd && e.key === 'a') {
      e.preventDefault();
      selectAll();
      return;
    }

    // Ctrl/Cmd + D - Duplicate
    if (ctrlOrCmd && e.key === 'd') {
      e.preventDefault();
      duplicateSelectedNodes();
      return;
    }

    // Delete or Backspace - Delete selected
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (selectedNodeIds.length > 0) {
        deleteSelectedNodes();
      } else if (selectedConnectionId) {
        deleteConnection(selectedConnectionId);
      }
      return;
    }

    // Escape - Clear selection
    if (e.key === 'Escape') {
      e.preventDefault();
      clearSelection();
      return;
    }

    // Number keys to add nodes (1-4)
    if (!ctrlOrCmd && !e.shiftKey && !e.altKey) {
      const position = getViewportCenter();

      switch (e.key) {
        case '1':
          e.preventDefault();
          addProducer(position);
          break;
        case '2':
          e.preventDefault();
          addExchange(position);
          break;
        case '3':
          e.preventDefault();
          addQueue(position);
          break;
        case '4':
          e.preventDefault();
          addConsumer(position);
          break;
      }
    }
  }, [
    undo,
    redo,
    selectAll,
    duplicateSelectedNodes,
    deleteSelectedNodes,
    deleteConnection,
    clearSelection,
    selectedNodeIds,
    selectedConnectionId,
    getViewportCenter,
    addProducer,
    addExchange,
    addQueue,
    addConsumer,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
