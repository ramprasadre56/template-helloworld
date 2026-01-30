# CLAUDE.md

> **This is a living document.** Update this file whenever we learn something new, add new skills, or integrate new services. Always check this file before starting any task.

---

## Project Overview

**Remotion** project for creating programmatic videos using React.

- **Stack**: Remotion, React 19, TypeScript, Zod
- **Dev server**: `npm run dev` → http://localhost:3000
- **Render**: `npx remotion render <CompositionId> out/video.mp4`

---

## How to Create Videos

1. Create a new `.tsx` file in `src/`
2. Export your component and its zod schema
3. Register it in `src/Root.tsx` as a `<Composition>`
4. Preview in Remotion Studio, then render

**Key imports:**
```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
```

**Standard specs:** 1920x1080, 30fps, MP4

---

## Installed Skills

| Skill | Purpose | Installed |
|-------|---------|-----------|
| `remotion-best-practices` | Best practices for Remotion video creation | Jan 2026 |

Skills location: `.agents/skills/`

---

## Learned Patterns

### Product Demo Videos
When creating product demos (like BookedIn.ai):
- Use **white background**, brand colors as accents
- Break into scenes: Intro → Tagline → Features → Stats → CTA
- Each scene: 2-4 seconds
- Use `spring()` for natural animations
- Stagger items with delay: `frame - (index * 5)`

### Magazine/Educational Videos
When creating magazine explainer videos (like BhagavataPradipika):
- Create separate scene components in a subfolder
- Use `<Sequence>` for scene timing with crossfade transitions
- Theme-appropriate colors (saffron/gold for spiritual content)
- Scene structure: Title → Message → Content → Verse → Analogies → Closing
- Use gradients and decorative elements for visual interest

### Animation Snippets
```tsx
// Fade in
const opacity = spring({ frame, fps, config: { damping: 20 } });

// Slide up
const y = interpolate(spring({ frame, fps }), [0, 1], [100, 0]);

// Scale in
const scale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
```

---

## Services & Integrations

*Add new services here as we integrate them.*

| Service | Purpose | Notes |
|---------|---------|-------|
| GitHub | Version control | Push with descriptive commits |

---

## Project-Specific Notes

- Compositions are defined in `src/Root.tsx`
- Each composition appears in the Remotion Studio sidebar
- Use zod schemas for type-safe props

---

## Changelog

| Date | What Changed |
|------|--------------|
| Jan 2026 | Created project, added BookedInDemo composition |
| Jan 2026 | Installed remotion-best-practices skill |
| Jan 2026 | Created this CLAUDE.md file |
| Jan 2026 | Added BhagavataPradipika video (90s, 7 scenes, spiritual magazine explainer) |
