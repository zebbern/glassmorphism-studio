# Design Studio Refactor (Option C - Hybrid)

## Goal

Transform Layout Builder into "Design Studio" - the main preview/editing canvas, while removing redundant tabs (Gallery, Card Generator).

---

## Implementation Plan

### Part A: Remove Redundant Tabs

#### [x] Task 1: Remove Gallery Tab ✅

- Remove Gallery TabsTrigger from page.tsx
- Remove Gallery TabsContent from page.tsx
- Keep ComponentGallery component (may reuse parts)

#### [x] Task 2: Remove Card Generator Tab ✅

- Remove Card Generator TabsTrigger from page.tsx
- Remove Card Generator TabsContent from page.tsx
- Keep CardGenerator component (will integrate into Design Studio)

---

### Part B: Enhance Layout Builder → Design Studio

#### [x] Task 3: Rename to Design Studio ✅

- Renamed tab from "Layout" to "Design Studio"
- Updated icon to Paintbrush
- Updated header with gradient icon

#### [x] Task 4: Add Inline Content Editor ✅

- Click card in grid → opens Edit panel
- Edit text, images, numbers for selected card
- Dynamic field generation based on content type

#### [x] Task 5: Add Per-Card Glass Style Overrides ✅

- Toggle "Custom Glass Style" per card
- Override blur, opacity with sliders
- "Reset to global" button

#### [x] Task 6: Add Card Type Switcher ✅

- Dropdown to change card template type
- All 10 card types available
- Updates content with template defaults

#### [x] Task 7: Live Glass Preview Integration ✅

- Design Studio responds to Glass Controls tab changes
- All cards update in real-time as user adjusts sliders
- glassStyle passed as prop from parent

#### [x] Task 8: Add Full Page Export ✅

- "Export Code" button opens modal
- 3 formats: React TSX, HTML, JSON
- Copy to clipboard functionality

---

### Part C: UI Polish

#### [x] Task 9: Improve Template Palette ✅

- Better visual hierarchy with arrows
- Tabs/Edit panel toggle
- Category filtering preserved

#### [x] Task 10: Add Quick Actions Bar ✅

- Quick preset buttons in header
- Clear all cells button
- Export Code button with gradient styling

---

## New Tab Structure (After Refactor)

1. Glass Controls
2. Themes
3. Presets
4. Animation
5. Light Source
6. **Design Studio** (formerly Layout)

Total: 6 tabs (down from 8)

---

## Files to Modify

- `app/page.tsx` - Remove tabs, rename Layout → Design Studio
- `components/glassmorphic/LayoutBuilder.tsx` - Major enhancements
- `hooks/useLayoutBuilder.ts` - Add per-card style state

## Status: Awaiting Approval
