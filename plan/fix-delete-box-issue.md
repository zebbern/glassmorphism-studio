# Fix "Delete Box" Issue and Code Cleanup

## Goal

Fix the issue where deleting a box prevents new boxes from being placed in that spot, and clean up duplicate/legacy code.

## Plan

- [x] **Refactor `LayoutBuilder.tsx`**
  - [x] Replace manual `layout` manipulation in "Delete Box" button with `removeCell(cell.id)`.
  - [x] Replace manual `layout` manipulation in "Add Box" dropdown with `addCell({...})`.
  - [x] Ensure `useLayoutBuilder` exposes necessary atomic methods.

- [x] **Cleanup `useLayoutBuilder.ts`**
  - [x] Remove inline `defaultLayoutPresets` definition.
  - [x] Import `layoutPresets` from `@/lib/layout-presets`.
  - [x] Implement robust `swapCells` with collision detection.

- [x] **Verification**
  - [x] Create logic verification script (`scripts/test-layout-logic.js`).
  - [x] Verify drag-and-drop collision logic with script.
  - [x] Verify "Delete Box" and "Add Box" UI with Playwright.
