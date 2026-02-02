# CLAUDE.md

> **This is a living document.** Update this file whenever we learn something new, add new skills, or integrate new services. Always check this file before starting any task.

---

## Project Overview

**Video Studio** - A web application for creating videos using AI chat and Remotion.

- **Stack**: Next.js 14, Remotion 4, React, TypeScript, Supabase, Google Gemini
- **Web app**: `npm run dev` → http://localhost:3000
- **Remotion Studio**: `npm run remotion:dev` → http://localhost:3001
- **Render**: `npx remotion render <CompositionId> out/video.mp4`

---

## Architecture

### Web App (`app/` directory)
- **Next.js 14 App Router** with server and client components
- **Authentication**: Supabase Auth (email/password + Google OAuth)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage for video files
- **AI Chat**: Google Gemini for video creation conversations

### Remotion (`src/` directory)
- Video compositions remain in `src/`
- Compositions: HelloWorld, BookedInDemo, BhagavataPradipika

### Key Directories
```
app/                  # Next.js web application
├── (auth)/          # Login, signup pages
├── (dashboard)/     # Protected dashboard, chat, library
└── api/             # API routes (chat, render, sessions)

components/          # React components
lib/                 # Utilities (supabase, gemini, remotion)
types/               # TypeScript types
src/                 # Remotion compositions
supabase/            # Database schema
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `GOOGLE_GEMINI_API_KEY` - Google AI API key

---

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Run `supabase/schema.sql` in the SQL editor
3. Enable Google OAuth in Authentication > Providers (optional)
4. Create a storage bucket named "videos"

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

| Service | Purpose | Notes |
|---------|---------|-------|
| GitHub | Version control | Push with descriptive commits |
| Supabase | Auth, DB, Storage | PostgreSQL + Row Level Security |
| Google Gemini | AI Chat | Video creation assistant |
| Vercel | Deployment | Next.js hosting (planned) |
| AWS Lambda | Video Rendering | Remotion Lambda (planned) |

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
| Feb 2026 | Added Video Studio web app with Next.js 14, Supabase Auth, Gemini chat |
| Feb 2026 | Created dashboard, chat interface, video library pages |
| Feb 2026 | Added composition registry for AI-powered video creation |
