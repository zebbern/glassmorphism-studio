# Design Studio Improvements Plan

**Date:** Current Session
**Status:** 🔄 IN PROGRESS
**Agent:** GitHub Copilot (Main Agent)
**Approach:** Option B - Free-form Canvas (User confirmed)

## User Requirements from Discord

Based on the user's feedback and attached screenshot:

1. **Add/Delete Boxes** - User should be able to add new boxes and delete existing ones
2. **Drag & Drop** - Boxes should be draggable to reorder/reposition
3. **Resize Boxes** - User should be able to resize boxes
4. **Replace Rows/Cols/Gap** - The current Rows/Cols/Gap controls need a better solution
5. **Remove Background Color** - Remove the color from the canvas area
6. **Remove Duplicate Breakpoints** - Only keep one mobile/tablet/desktop control (the fullscreen preview one)

## Task Checklist

### Phase 1: Analyze Current Implementation

- [x] Task 1: Read and understand LayoutBuilder.tsx grid system
- [x] Task 2: Identify the duplicate breakpoint controls
- [x] Task 3: Map out the current drag-drop functionality

### Phase 2: Remove Duplicates & Clean Up

- [x] Task 4: Remove duplicate mobile/tablet/desktop buttons (keep only Preview mode version)
- [x] Task 5: Remove background color from canvas area
- [x] Task 6: Remove/replace Rows/Cols/Gap spinbuttons

### Phase 3: Implement Better Grid System

- [x] Task 7: Implement free-form box positioning (no fixed grid) (Implemented via 12-col grid)
- [x] Task 8: Add "Add Box" button to create new cells
- [x] Task 9: Add delete button on each box
- [x] Task 10: Implement drag to reposition boxes
- [x] Task 11: Implement resize handles on boxes

### Phase 4: Testing & Polish

- [x] Task 12: Test all interactions in browser
- [ ] Task 13: Fix any bugs found
- [ ] Task 14: Commit and push to GitHub

## User Feedback Phase 2

- [ ] Task 15: Increase height granularity (change grid row height to 60px, update presets)
- [ ] Task 16: Implement auto-cleanup of empty rows
- [ ] Task 17: Enhance "Add Box" to allow choosing size/template

## Files Being Modified

- `components/glassmorphic/LayoutBuilder.tsx` - Main layout builder component
