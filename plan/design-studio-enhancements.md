# Design Studio Enhancements Plan

## Selected Features

- [x] Task 1: Undo/Redo - Add history for layout changes
- [ ] Task 2: Cell Resize Handles - Drag to resize row/col spans visually
- [ ] Task 3: Grid Snap - Visual snap guides while editing (combined with #8)
- [ ] Task 4: Component Library - More templates (hero, footer, nav, charts)
- [ ] Task 5: Better Export - Include component imports correctly

---

## Task 1: Undo/Redo System

**Files to modify:**

- `hooks/useLayoutBuilder.ts` - Add history state management
- `components/glassmorphic/LayoutBuilder.tsx` - Add undo/redo buttons

**Implementation:**

1. Add `history` array to track layout states
2. Add `historyIndex` to track current position
3. Create `undo()` and `redo()` functions
4. Push to history on every layout change
5. Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)
6. Add UI buttons for undo/redo

---

## Task 2: Cell Resize Handles

**Files to modify:**

- `components/glassmorphic/LayoutBuilder.tsx` - Add resize handles to cells

**Implementation:**

1. Add resize handles to bottom-right corner of cells
2. Track drag state for resizing
3. Update rowSpan/colSpan based on drag distance
4. Show visual feedback during resize
5. Clamp values to valid grid positions

---

## Task 3: Grid Snap Guides

**Files to modify:**

- `components/glassmorphic/LayoutBuilder.tsx` - Add visual guides

**Implementation:**

1. Show grid lines when dragging/resizing
2. Highlight snap points as user drags
3. Add visual indicators for alignment
4. Smooth snapping animation

---

## Task 4: Component Library Expansion

**Files to create:**

- `components/glassmorphic/templates/HeroSection.tsx`
- `components/glassmorphic/templates/FooterSection.tsx`
- `components/glassmorphic/templates/NavBar.tsx`
- `components/glassmorphic/templates/DataTable.tsx`
- `components/glassmorphic/templates/ImageGallery.tsx`
- `components/glassmorphic/templates/ContactForm.tsx`

**Files to modify:**

- `lib/layout-presets.ts` - Add new template definitions
- `types/glassmorphic.ts` - Add new template types
- `components/glassmorphic/LayoutBuilder.tsx` - Import new templates

---

## Task 5: Better Export

**Files to modify:**

- `components/glassmorphic/LayoutBuilder.tsx` - Fix export code generation

**Implementation:**

1. Generate correct import statements for used components
2. Include proper TypeScript types
3. Generate working CSS/Tailwind classes
4. Add option to export as separate files
5. Include glass style utility function

---

## Progress Tracking

- Started: [Current Date]
- Completed: -
