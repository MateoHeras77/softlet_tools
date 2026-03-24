# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint-config-next with core-web-vitals + typescript)
```

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Supabase + Tiptap

**Path alias:** `@/*` maps to `./src/*`

### Routing & Auth

- `middleware.ts` wraps `src/lib/supabase/middleware.ts` — redirects unauthenticated users from `/dashboard/*` to `/auth/login` and authenticated users away from login
- Auth uses Google OAuth via Supabase (`/auth/login` → `/auth/callback`)
- Two Supabase client factories: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server components/routes)

### Tool Registry System

Tools are registered in `src/lib/tools/registry.ts` as `ToolDefinition` objects (id, name, description, icon, href). The dashboard grid and sidebar both read from this registry. To add a new tool:

1. Add entry to `registry.ts`
2. Add icon mapping in `src/components/sidebar.tsx` and `src/components/tool-card.tsx`
3. Create page at `src/app/dashboard/tools/<tool-name>/page.tsx`
4. Tool-specific components go in `_components/` subdirectory

### Data Layer

- All data access is through custom hooks (`src/hooks/`) that call Supabase directly — no additional API layer or state management library
- `useNotes()` includes Supabase Realtime subscriptions for cross-tab sync (INSERT/UPDATE/DELETE on notes table)
- `useNoteImages()` handles client-side image compression (JPEG, max 1920px, 0.8 quality) before uploading to `note-images` storage bucket
- Notes store rich text as `content_json` (Tiptap JSON) alongside plain `content`

### UI Components

- shadcn/ui (base-nova style) components in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Icons from `lucide-react`
- `cn()` utility in `src/lib/utils.ts` for Tailwind class merging
- Theming uses OKLCH color space CSS variables with dark mode support

### Key Patterns

- All page components are client-side (`"use client"`) for interactivity
- NoteEditor debounces saves (800ms) to reduce database writes
- NoteEditor and NotesSidebar are wrapped with `React.memo()` to prevent unnecessary re-renders
- Toast notifications via `sonner`

## Supabase Schema

**Tables:** `notes` (id, user_id, title, content, content_json, topic, created_at, updated_at)

**Storage:** `note-images` bucket, path: `{user_id}/{note_id}/{filename}`

**Remote images configured in `next.config.ts`:** Google avatars (`lh3.googleusercontent.com`) and Supabase storage (`qzcqwmauraludncymydt.supabase.co`)
