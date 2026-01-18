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

// Import layout presets inline to avoid module resolution issues
const generatePresetId = () => Math.random().toString(36).substring(2, 9);

// Default layout presets defined inline - ALL 6 presets - SYNCED WITH lib/layout-presets.ts
const defaultLayoutPresets: LayoutPreset[] = [
  {
    id: "grid-2x2",
    name: "2×2 Grid",
    description: "Simple 2x2 grid layout for balanced content",
    icon: "⊞",
    layout: {
      id: generatePresetId(),
      name: "2×2 Grid",
      rows: 2,
      cols: 12,
      gap: 16,
      cells: [
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 1, colSpan: 6 },
        { id: generatePresetId(), row: 0, col: 6, rowSpan: 1, colSpan: 6 },
        { id: generatePresetId(), row: 1, col: 0, rowSpan: 1, colSpan: 6 },
        { id: generatePresetId(), row: 1, col: 6, rowSpan: 1, colSpan: 6 },
      ],
    },
  },
  {
    id: "row-3",
    name: "3-Column Row",
    description: "Three equal columns in a single row",
    icon: "☰",
    layout: {
      id: generatePresetId(),
      name: "3-Column Row",
      rows: 1,
      cols: 12,
      gap: 16,
      cells: [
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 0, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 0, col: 8, rowSpan: 1, colSpan: 4 },
      ],
    },
  },
  {
    id: "masonry",
    name: "Masonry",
    description: "Pinterest-style staggered layout",
    icon: "▤",
    layout: {
      id: generatePresetId(),
      name: "Masonry",
      rows: 3,
      cols: 12,
      gap: 16,
      cells: [
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 2, colSpan: 4 },
        { id: generatePresetId(), row: 0, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 0, col: 8, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 1, col: 4, rowSpan: 2, colSpan: 4 },
        { id: generatePresetId(), row: 1, col: 8, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 2, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 2, col: 8, rowSpan: 1, colSpan: 4 },
      ],
    },
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Stats header with content grid below",
    icon: "📊",
    layout: {
      id: generatePresetId(),
      name: "Dashboard",
      rows: 3,
      cols: 12,
      gap: 16,
      cells: [
        // Top row - 4 stat widgets
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 1, colSpan: 3 },
        { id: generatePresetId(), row: 0, col: 3, rowSpan: 1, colSpan: 3 },
        { id: generatePresetId(), row: 0, col: 6, rowSpan: 1, colSpan: 3 },
        { id: generatePresetId(), row: 0, col: 9, rowSpan: 1, colSpan: 3 },
        // Main content - large chart
        { id: generatePresetId(), row: 1, col: 0, rowSpan: 2, colSpan: 9 },
        // Sidebar widgets
        { id: generatePresetId(), row: 1, col: 3, rowSpan: 1, colSpan: 3 },
        { id: generatePresetId(), row: 2, col: 3, rowSpan: 1, colSpan: 3 },
      ],
    },
  },
  {
    id: "landing-hero",
    name: "Landing Hero",
    description: "Hero section with feature cards",
    icon: "🚀",
    layout: {
      id: generatePresetId(),
      name: "Landing Hero",
      rows: 2,
      cols: 12,
      gap: 24,
      cells: [
        // Hero - full width top
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 1, colSpan: 12 },
        // Feature cards below
        { id: generatePresetId(), row: 1, col: 0, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 1, col: 4, rowSpan: 1, colSpan: 4 },
        { id: generatePresetId(), row: 1, col: 8, rowSpan: 1, colSpan: 4 },
      ],
    },
  },
  {
    id: "sidebar-main",
    name: "Sidebar + Main",
    description: "Sidebar navigation with main content area",
    icon: "◧",
    layout: {
      id: generatePresetId(),
      name: "Sidebar + Main",
      rows: 2,
      cols: 12,
      gap: 16,
      cells: [
        // Sidebar - spans full height
        { id: generatePresetId(), row: 0, col: 0, rowSpan: 2, colSpan: 3 },
        // Main content area
        { id: generatePresetId(), row: 0, col: 3, rowSpan: 1, colSpan: 9 },
        // Bottom content
        { id: generatePresetId(), row: 1, col: 3, rowSpan: 1, colSpan: 6 },
        { id: generatePresetId(), row: 1, col: 9, rowSpan: 1, colSpan: 3 },
      ],
    },
  },
];

const getDefaultLayoutInline = (): GridLayout => ({
  id: generatePresetId(),
  name: "2×2 Grid",
  rows: 2,
  cols: 12,
  gap: 16,
  cells: [
    { id: generatePresetId(), row: 0, col: 0, rowSpan: 1, colSpan: 6 },
    { id: generatePresetId(), row: 0, col: 6, rowSpan: 1, colSpan: 6 },
    { id: generatePresetId(), row: 1, col: 0, rowSpan: 1, colSpan: 6 },
    { id: generatePresetId(), row: 1, col: 6, rowSpan: 1, colSpan: 6 },
  ],
});

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

  // Drag & drop
  startDrag: () => void;
  endDrag: () => void;
  setDragOverCell: (zone: DropZone | null) => void;

  // Cell queries
  getCellAt: (row: number, col: number) => GridCell | undefined;
  isCellOccupied: (row: number, col: number) => boolean;
  getEmptyCells: () => DropZone[];

  // Utilities
  resetLayout: () => void;
  exportLayout: () => string;
}

export function useLayoutBuilder(
  initialPreset: LayoutPresetId = "grid-2x2",
): UseLayoutBuilderReturn {
  // Get initial layout from preset
  const getInitialLayout = useCallback((): GridLayout => {
    const preset = defaultLayoutPresets.find(
      (p: LayoutPreset) => p.id === initialPreset,
    );
    return preset?.layout || getDefaultLayoutInline();
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
        const newLayout =
          typeof updater === "function" ? updater(prev) : updater;

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
      const preset = defaultLayoutPresets.find(
        (p: LayoutPreset) => p.id === presetId,
      );
      if (preset) {
        updateLayoutWithHistory({ ...preset.layout, id: generateId() });
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

  // Reset to default layout
  const resetLayout = useCallback(() => {
    setLayout(getDefaultLayoutInline());
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
    startDrag,
    endDrag,
    setDragOverCell,
    getCellAt,
    isCellOccupied,
    getEmptyCells,
    resetLayout,
    exportLayout,
  };
}
