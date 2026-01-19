"use client";

import { useState, useCallback } from "react";
import type {
  GridLayout,
  GridCell,
  LayoutPresetId,
  ComponentTemplateId,
  DropZone,
  LayoutPreset,
} from "@/types/glassmorphic";

import { layoutPresets } from "@/lib/layout-presets";

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

interface UseLayoutBuilderReturn {
  // State
  layout: GridLayout;
  selectedCellId: string | null;
  isDragging: boolean;
  dragOverCell: DropZone | null;

  // History state
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;

  // Layout actions
  setLayout: (layout: GridLayout) => void;
  loadPreset: (presetId: LayoutPresetId) => void;
  applyLayout: (layout: GridLayout) => void;
  updateLayoutSettings: (
    settings: Partial<Pick<GridLayout, "name" | "rows" | "cols" | "gap">>,
  ) => void;

  // History actions
  undo: () => void;
  redo: () => void;

  // Cell actions
  selectCell: (cellId: string | null) => void;
  addCell: (cell: Omit<GridCell, "id">) => void;
  updateCell: (cellId: string, updates: Partial<GridCell>) => void;
  removeCell: (cellId: string) => void;
  clearCell: (cellId: string) => void;

  // Component placement
  placeComponent: (
    cellId: string,
    templateId: ComponentTemplateId,
    content?: Record<string, unknown>,
  ) => void;
  moveComponent: (fromCellId: string, toCellId: string) => void;
  swapCells: (id1: string, id2: string) => void;

  // Drag & drop
  startDrag: () => void;
  endDrag: () => void;
  setDragOverCell: (zone: DropZone | null) => void;

  // Cell queries
  getCellAt: (row: number, col: number) => GridCell | undefined;
  isCellOccupied: (row: number, col: number) => boolean;
  getEmptyCells: () => DropZone[];
  findPositionForNewBox: (
    colSpan: number,
    rowSpan: number,
  ) => { row: number; col: number };

  // Utilities
  resetLayout: () => void;
  exportLayout: () => string;
}

export function useLayoutBuilder(
  initialPreset: LayoutPresetId = "grid-2x2",
): UseLayoutBuilderReturn {
  // Get initial layout from preset
  const getInitialLayout = useCallback((): GridLayout => {
    const preset = layoutPresets.find(
      (p: LayoutPreset) => p.id === initialPreset,
    );
    const layout = preset?.layout || layoutPresets[0].layout;
    return {
      ...layout,
      id: generateId(),
      cells: layout.cells.map((c) => ({ ...c, id: generateId() })),
    };
  }, [initialPreset]);

  const [layout, setLayoutInternal] = useState<GridLayout>(getInitialLayout);

  // History management
  const [history, setHistory] = useState<GridLayout[]>(() => [
    getInitialLayout(),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const MAX_HISTORY = 50;

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Apply layout update and record to history
  const updateLayoutWithHistory = useCallback(
    (updater: GridLayout | ((prev: GridLayout) => GridLayout)) => {
      setLayoutInternal((prev) => {
        let newLayout = typeof updater === "function" ? updater(prev) : updater;

        // Auto-cleanup: Adjust rows to fit content
        // This satisfies "if a line has no boxes then the page should adjust accordingly"
        if (newLayout.cells.length > 0) {
          const maxUsedRow = Math.max(
            ...newLayout.cells.map((c) => c.row + c.rowSpan),
          );
          // Ensure at least 4 rows (equivalent to 2 "logical" rows in new standard)
          // to maintain a decent canvas size, but shrink if huge empty space exists.
          // Note: If user creates a huge gap, this will still respect the bottom-most cell.
          const targetRows = Math.max(4, maxUsedRow);

          if (newLayout.rows !== targetRows) {
            newLayout = { ...newLayout, rows: targetRows };
          }
        } else {
          // Reset to default min rows if empty
          if (newLayout.rows !== 4) {
            newLayout = { ...newLayout, rows: 4 };
          }
        }

        // Push to history
        setHistory((prevHistory) => {
          const newHistory = prevHistory.slice(0, historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(newLayout)));
          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
          }
          return newHistory;
        });
        setHistoryIndex((idx) => Math.min(idx + 1, MAX_HISTORY - 1));

        return newLayout;
      });
    },
    [historyIndex],
  );

  // Public setLayout that tracks history
  const setLayout = useCallback(
    (newLayout: GridLayout) => {
      updateLayoutWithHistory(newLayout);
    },
    [updateLayoutWithHistory],
  );

  // Undo action
  const undo = useCallback(() => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setLayoutInternal(JSON.parse(JSON.stringify(history[newIndex])));
  }, [canUndo, historyIndex, history]);

  // Redo action
  const redo = useCallback(() => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setLayoutInternal(JSON.parse(JSON.stringify(history[newIndex])));
  }, [canRedo, historyIndex, history]);

  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverCell, setDragOverCell] = useState<DropZone | null>(null);

  // Load a preset layout
  const loadPreset = useCallback(
    (presetId: LayoutPresetId) => {
      const preset = layoutPresets.find((p: LayoutPreset) => p.id === presetId);
      if (preset) {
        updateLayoutWithHistory({
          ...preset.layout,
          id: generateId(),
          cells: preset.layout.cells.map((c) => ({ ...c, id: generateId() })),
        });
        setSelectedCellId(null);
      }
    },
    [updateLayoutWithHistory],
  );

  // Update layout settings (rows, cols, gap, name)
  const updateLayoutSettings = useCallback(
    (settings: Partial<Pick<GridLayout, "name" | "rows" | "cols" | "gap">>) => {
      updateLayoutWithHistory((prev: GridLayout) => {
        const updated = { ...prev, ...settings };

        // If rows/cols changed, we may need to adjust cells
        if (settings.rows !== undefined || settings.cols !== undefined) {
          const newRows = settings.rows ?? prev.rows;
          const newCols = settings.cols ?? prev.cols;

          // Filter out cells that are now outside the grid
          updated.cells = prev.cells.filter(
            (cell: GridCell) => cell.row < newRows && cell.col < newCols,
          );

          // Adjust cells that span outside
          updated.cells = updated.cells.map((cell: GridCell) => ({
            ...cell,
            rowSpan: Math.min(cell.rowSpan, newRows - cell.row),
            colSpan: Math.min(cell.colSpan, newCols - cell.col),
          }));
        }

        return updated;
      });
    },
    [updateLayoutWithHistory],
  );

  // Select a cell
  const selectCell = useCallback((cellId: string | null) => {
    setSelectedCellId(cellId);
  }, []);

  // Add a new cell
  const addCell = useCallback(
    (cell: Omit<GridCell, "id">) => {
      const newCell: GridCell = {
        ...cell,
        id: generateId(),
      };
      updateLayoutWithHistory((prev: GridLayout) => ({
        ...prev,
        cells: [...prev.cells, newCell],
      }));
    },
    [updateLayoutWithHistory],
  );

  // Update an existing cell
  const updateCell = useCallback(
    (cellId: string, updates: Partial<GridCell>) => {
      updateLayoutWithHistory((prev: GridLayout) => ({
        ...prev,
        cells: prev.cells.map((cell: GridCell) =>
          cell.id === cellId ? { ...cell, ...updates } : cell,
        ),
      }));
    },
    [updateLayoutWithHistory],
  );

  // Remove a cell entirely
  const removeCell = useCallback(
    (cellId: string) => {
      updateLayoutWithHistory((prev: GridLayout) => ({
        ...prev,
        cells: prev.cells.filter((cell: GridCell) => cell.id !== cellId),
      }));
      if (selectedCellId === cellId) {
        setSelectedCellId(null);
      }
    },
    [selectedCellId, updateLayoutWithHistory],
  );

  // Clear a cell's component (keep the cell)
  const clearCell = useCallback(
    (cellId: string) => {
      updateLayoutWithHistory((prev: GridLayout) => ({
        ...prev,
        cells: prev.cells.map((cell: GridCell) =>
          cell.id === cellId
            ? { ...cell, componentId: undefined, content: undefined }
            : cell,
        ),
      }));
    },
    [updateLayoutWithHistory],
  );

  // Place a component in a cell
  const placeComponent = useCallback(
    (
      cellId: string,
      templateId: ComponentTemplateId,
      content?: Record<string, unknown>,
    ) => {
      updateLayoutWithHistory((prev: GridLayout) => ({
        ...prev,
        cells: prev.cells.map((cell: GridCell) =>
          cell.id === cellId
            ? { ...cell, componentId: templateId, content }
            : cell,
        ),
      }));
    },
    [updateLayoutWithHistory],
  );

  // Move a component from one cell to another
  const moveComponent = useCallback(
    (fromCellId: string, toCellId: string) => {
      updateLayoutWithHistory((prev: GridLayout) => {
        const fromCell = prev.cells.find((c: GridCell) => c.id === fromCellId);
        if (!fromCell?.componentId) return prev;

        return {
          ...prev,
          cells: prev.cells.map((cell: GridCell) => {
            if (cell.id === fromCellId) {
              return { ...cell, componentId: undefined, content: undefined };
            }
            if (cell.id === toCellId) {
              return {
                ...cell,
                componentId: fromCell.componentId,
                content: fromCell.content,
              };
            }
            return cell;
          }),
        };
      });
    },
    [updateLayoutWithHistory],
  );

  // Swap position of two cells safely
  const swapCells = useCallback(
    (id1: string, id2: string) => {
      updateLayoutWithHistory((prev: GridLayout) => {
        const cell1 = prev.cells.find((c) => c.id === id1);
        const cell2 = prev.cells.find((c) => c.id === id2);

        // If one is missing (shouldn't happen), abort
        if (!cell1 || !cell2) return prev;

        const newCells = prev.cells.map((c) => {
          if (c.id === id1) {
            return { ...c, row: cell2.row, col: cell2.col };
          }
          if (c.id === id2) {
            return { ...c, row: cell1.row, col: cell1.col };
          }
          return c;
        });

        // Validate no overlaps
        const hasCollision = newCells.some((c1, i) => {
          return newCells.some((c2, j) => {
            if (i === j) return false;
            // AABB collision
            return (
              c1.row < c2.row + c2.rowSpan &&
              c1.row + c1.rowSpan > c2.row &&
              c1.col < c2.col + c2.colSpan &&
              c1.col + c1.colSpan > c2.col
            );
          });
        });

        if (hasCollision) {
          console.warn("Swap prevented due to collision");
          return prev;
        }

        return {
          ...prev,
          cells: newCells,
        };
      });
    },
    [updateLayoutWithHistory],
  );

  // Drag & drop handlers
  const startDrag = useCallback(() => setIsDragging(true), []);
  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDragOverCell(null);
  }, []);

  // Get cell at specific position
  const getCellAt = useCallback(
    (row: number, col: number): GridCell | undefined => {
      return layout.cells.find((cell) => {
        const rowEnd = cell.row + cell.rowSpan;
        const colEnd = cell.col + cell.colSpan;
        return (
          row >= cell.row && row < rowEnd && col >= cell.col && col < colEnd
        );
      });
    },
    [layout.cells],
  );

  // Check if a position is occupied
  const isCellOccupied = useCallback(
    (row: number, col: number): boolean => {
      return getCellAt(row, col) !== undefined;
    },
    [getCellAt],
  );

  // Get all empty positions
  const getEmptyCells = useCallback((): DropZone[] => {
    const empty: DropZone[] = [];
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        if (!isCellOccupied(row, col)) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  }, [layout.rows, layout.cols, isCellOccupied]);

  // Find first available position for a box of given size
  const findPositionForNewBox = useCallback(
    (colSpan: number, rowSpan: number) => {
      const currentMaxRow =
        layout.cells.length > 0
          ? Math.max(...layout.cells.map((c) => c.row + c.rowSpan))
          : 0;
      // Allow searching past current rows to find space or append
      const scanLimit = Math.max(layout.rows, currentMaxRow) + rowSpan + 1;

      for (let r = 0; r < scanLimit; r++) {
        for (let c = 0; c <= layout.cols - colSpan; c++) {
          let fits = true;
          for (let ir = 0; ir < rowSpan; ir++) {
            for (let ic = 0; ic < colSpan; ic++) {
              if (isCellOccupied(r + ir, c + ic)) {
                fits = false;
                break;
              }
            }
            if (!fits) break;
          }

          if (fits) {
            return { row: r, col: c };
          }
        }
      }
      return { row: currentMaxRow, col: 0 };
    },
    [layout.rows, layout.cols, layout.cells, isCellOccupied],
  );

  // Reset to default layout
  const resetLayout = useCallback(() => {
    const layout = layoutPresets[0].layout;
    setLayout({
      ...layout,
      id: generateId(),
      cells: layout.cells.map((c) => ({ ...c, id: generateId() })),
    });
    setSelectedCellId(null);
  }, []);

  // Apply a complete layout (from templates gallery)
  const applyLayout = useCallback(
    (newLayout: GridLayout) => {
      updateLayoutWithHistory({ ...newLayout, id: generateId() });
      setSelectedCellId(null);
    },
    [updateLayoutWithHistory],
  );

  // Export layout as JSON
  const exportLayout = useCallback((): string => {
    return JSON.stringify(layout, null, 2);
  }, [layout]);

  return {
    layout,
    selectedCellId,
    isDragging,
    dragOverCell,
    canUndo,
    canRedo,
    historyIndex,
    historyLength: history.length,
    setLayout,
    loadPreset,
    applyLayout,
    updateLayoutSettings,
    undo,
    redo,
    selectCell,
    addCell,
    updateCell,
    removeCell,
    clearCell,
    placeComponent,
    moveComponent,
    swapCells,
    startDrag,
    endDrag,
    setDragOverCell,
    getCellAt,
    isCellOccupied,
    getEmptyCells,
    findPositionForNewBox,
    resetLayout,
    exportLayout,
  };
}
