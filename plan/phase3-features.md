# Phase 3: Layout Builder + Component Templates

## Selected Features

- **Feature 3**: Layout Builder (drag & drop grid system, layouts)
- **Feature 6**: Component Templates (login forms, widgets, etc.)

---

## Implementation Plan

### Part A: Layout Builder

#### [ ] Task 1: Create Layout Types & Interfaces

- Add layout grid types to `types/glassmorphic.ts`
- Define: GridLayout, GridCell, LayoutTemplate, LayoutPreset

#### [ ] Task 2: Create Layout Store/Hook

- Create `hooks/useLayoutBuilder.ts`
- Manage grid state, cell placement, drag operations

#### [ ] Task 3: Build Grid Component

- Create `components/glassmorphic/LayoutBuilder.tsx`
- Visual grid with drop zones
- Cell resize handles
- Snap-to-grid functionality

#### [ ] Task 4: Create Layout Presets

- Create `lib/layout-presets.ts`
- 2x2 Grid, 3x1 Row, Masonry, Dashboard, Landing Hero

#### [ ] Task 5: Implement Drag & Drop

- Add draggable card components
- Drop zone detection
- Visual feedback during drag

---

### Part B: Component Templates

#### [ ] Task 6: Create Login/Signup Form Template

- Create `components/glassmorphic/templates/LoginForm.tsx`
- Email/password fields, social buttons, remember me

#### [ ] Task 7: Create Dashboard Widget Templates

- Create `components/glassmorphic/templates/StatsWidget.tsx`
- Create `components/glassmorphic/templates/ChartWidget.tsx`
- Numbers, trends, mini charts

#### [ ] Task 8: Create Notification Toast Template

- Create `components/glassmorphic/templates/NotificationToast.tsx`
- Success, error, warning, info variants

#### [ ] Task 9: Create Sidebar Navigation Template

- Create `components/glassmorphic/templates/SidebarNav.tsx`
- Collapsible sections, icons, badges

#### [ ] Task 10: Create Music Player Card Template

- Create `components/glassmorphic/templates/MusicPlayer.tsx`
- Album art, progress bar, controls

---

### Part C: Integration

#### [ ] Task 11: Add "Layout" Tab to Main Page

- New tab for Layout Builder
- Template selector panel

#### [ ] Task 12: Connect Templates to Layout Builder

- Drag templates into grid cells
- Edit template content in-place

#### [ ] Task 13: Export Combined Layout

- Generate code for full layout with components

---

## File Structure

```
components/glassmorphic/
├── LayoutBuilder.tsx         (Main layout editor)
├── LayoutGrid.tsx            (Grid component)
├── LayoutCell.tsx            (Individual cell)
├── templates/
│   ├── index.ts              (Exports all templates)
│   ├── LoginForm.tsx
│   ├── StatsWidget.tsx
│   ├── ChartWidget.tsx
│   ├── NotificationToast.tsx
│   ├── SidebarNav.tsx
│   └── MusicPlayer.tsx

hooks/
├── useLayoutBuilder.ts       (Layout state management)

lib/
├── layout-presets.ts         (Preset layouts)

types/
├── glassmorphic.ts           (Extended with layout types)
```

---

## Status: Ready for Implementation
