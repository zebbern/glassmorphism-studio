# Glassmorphism Studio - Phase 2 Features

## Selected Features

- [x] 1️⃣ Animation System
- [x] 2️⃣ Light Source Simulator
- [x] 3️⃣ Dark/Light Mode Toggle
- [x] 5️⃣ Glass Card Generator

---

## Implementation Plan

### Phase 1: Types & Infrastructure

- [ ] Task 1.1: Extend `types/glassmorphic.ts` with animation, lighting, and card types
- [ ] Task 1.2: Create `lib/animations.ts` with CSS keyframe generators

### Phase 2: Dark/Light Mode (Quick Win)

- [ ] Task 2.1: Create `hooks/useTheme.ts` for theme persistence
- [ ] Task 2.2: Create `components/glassmorphic/ThemeToggle.tsx`
- [ ] Task 2.3: Update preview backgrounds to respond to theme

### Phase 3: Animation System

- [ ] Task 3.1: Create `components/glassmorphic/AnimationControls.tsx`
  - Animation type selector (hover glow, pulse, shimmer, float)
  - Duration slider (0.1s - 3s)
  - Easing dropdown (ease, ease-in-out, linear, spring)
  - Intensity slider
- [ ] Task 3.2: Create CSS keyframes for each animation type
- [ ] Task 3.3: Apply animations to preview with toggle

### Phase 4: Light Source Simulator

- [ ] Task 4.1: Create `components/glassmorphic/LightSource.tsx`
  - Draggable light indicator
  - Light color picker
  - Light intensity slider
- [ ] Task 4.2: Create `lib/light-effects.ts` for gradient calculations
- [ ] Task 4.3: Update glass style generator to incorporate light position

### Phase 5: Glass Card Generator

- [ ] Task 5.1: Create `types/glass-cards.ts` with card template types
- [ ] Task 5.2: Create card templates:
  - ProfileCard
  - PricingCard
  - FeatureCard
  - TestimonialCard
- [ ] Task 5.3: Create `components/glassmorphic/CardGenerator.tsx`
  - Template selector
  - Content editor (title, description, image, etc.)
  - Layout options (padding, border-radius, alignment)
- [ ] Task 5.4: Export card as React component or HTML

### Phase 6: Integration

- [ ] Task 6.1: Add new tabs to main navigation (Animations, Lighting, Cards)
- [ ] Task 6.2: Wire up all new components to main page
- [ ] Task 6.3: Update export modal to include animations in output

---

## Technical Details

### Animation Types

```typescript
type AnimationType =
  | "none"
  | "hover-glow"
  | "pulse"
  | "shimmer"
  | "float"
  | "breathe";

interface AnimationSettings {
  type: AnimationType;
  duration: number; // 0.1 - 3 seconds
  easing: string; // CSS easing function
  intensity: number; // 0 - 100
  enabled: boolean;
}
```

### Light Source

```typescript
interface LightSource {
  position: { x: number; y: number }; // 0-100 percentage
  color: string;
  intensity: number; // 0-100
  radius: number; // spread of light
}
```

### Card Templates

```typescript
interface CardTemplate {
  id: string;
  name: string;
  fields: CardField[];
  defaultLayout: CardLayout;
}

interface CardField {
  name: string;
  type: "text" | "image" | "icon" | "list" | "price";
  required: boolean;
  placeholder?: string;
}
```

---

## File Structure (New Files)

```
glassmorphic/
├── types/
│   └── glass-cards.ts           # Card template types
├── hooks/
│   └── useTheme.ts              # Dark/Light mode hook
├── lib/
│   ├── animations.ts            # CSS keyframe generators
│   └── light-effects.ts         # Light position calculations
└── components/glassmorphic/
    ├── ThemeToggle.tsx          # Dark/Light switch
    ├── AnimationControls.tsx    # Animation settings panel
    ├── LightSource.tsx          # Draggable light controller
    ├── CardGenerator.tsx        # Card template builder
    └── cards/
        ├── ProfileCard.tsx
        ├── PricingCard.tsx
        ├── FeatureCard.tsx
        └── TestimonialCard.tsx
```

---

## Estimated Effort

- **Phase 1**: ~15 min (types + utils)
- **Phase 2**: ~20 min (theme toggle - quick win!)
- **Phase 3**: ~30 min (animations)
- **Phase 4**: ~30 min (light source)
- **Phase 5**: ~45 min (card generator)
- **Phase 6**: ~20 min (integration)

**Total**: ~2.5 hours

---

## Status: PENDING APPROVAL
