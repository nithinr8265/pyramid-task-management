# Pyramid — Task Management System (Frontend)

A frontend-only implementation of the Task Management System assessment,
built from the supplied design screenshots (`1.webp` → `13.webp`).

**This is frontend-only.** There is no backend, no database, and no API
routes. All data lives in React state and is persisted to the browser's
`localStorage`, structured so a real NestJS API could later replace the
mock layer (`src/hooks/useTasks.tsx`, `useProjects.tsx`, `useAuth.tsx`)
without touching any component that consumes those hooks.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS v4** — design tokens as CSS variables (see
  `src/app/globals.css`), no component library
- **lucide-react** for icons
- `localStorage` for persistence (guest session, tasks, projects, theme,
  accent color, sidebar state, per-page view/field preferences)

No Material UI / Bootstrap / Chakra / Ant Design, no Redux, no backend
packages (NestJS, Prisma, TypeORM, Mongoose, etc.) are used.

## Getting started

```bash
npm install
npm run dev      # start the dev server on http://localhost:3000
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
```

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # redirects to /login or /tasks
│   ├── login/page.tsx           # guest / Google entry (screenshot 1)
│   ├── (app)/                   # authenticated shell (sidebar + guard)
│   │   ├── layout.tsx
│   │   ├── tasks/page.tsx       # Board/List views (screenshots 2–5, 7)
│   │   ├── tasks/[id]/page.tsx  # Task detail (screenshots 6, 8)
│   │   ├── projects/page.tsx    # Projects list (screenshots 9–11)
│   │   └── projects/[id]/page.tsx # Project → scoped tasks (screenshot 12)
│   └── settings/                # separate shell (screenshot 13)
│       ├── layout.tsx           # left nav: Back to app / Search / tabs
│       ├── page.tsx             # Profile tab
│       ├── theme/page.tsx       # Theme tab (Light/Dark)
│       └── color/page.tsx       # Color tab (accent palette)
├── components/
│   ├── layout/      # Sidebar, AccountMenu, TopBar
│   ├── navigation/  # ViewFieldsMenu, FilterMenu (multi-level flyouts)
│   ├── tasks/        # TaskBoard, TaskColumn, TaskCard, TaskListView,
│   │                  # PrioritySelect, StatusSelect, DateField,
│   │                  # MembersField, LabelsField, AddTaskModal
│   ├── projects/     # Projects-specific fields/filter menus, AddProjectModal
│   └── ui/           # Popover, Modal, Avatar, Checkbox, Calendar, EmptyState
├── hooks/            # useAuth, useTasks, useProjects, useTheme,
│                      # useLocalStorage, useOnClickOutside, useSidebarCollapsed
├── data/             # mock members, labels/statuses, projects, tasks
├── types/            # shared TypeScript types
└── lib/storage.ts    # SSR-safe localStorage helpers
```

## Implemented features

**Guest login & auth (frontend-only)**
- "Continue as Guest" and "Login with Google" both create a mock session
  object in `localStorage` — there is no real OAuth call.
- Session persists across refresh; unauthenticated visitors are redirected
  to `/login`; authenticated visitors hitting `/login` are redirected to
  `/tasks`. Logging out (via the account menu) clears the session.

**Tasks**
- Board (Kanban) and List (grouped, collapsible table) views, matching the
  two states shown in the screenshots, toggled from the same "Fields" menu.
- The Fields menu also toggles which columns/fields (Priority, Members,
  Due Date, Labels, Status, Reporter) are shown on cards/rows.
- Multi-level Filter menu (Status, Priority, Members, Due Date, Labels),
  each expanding into a checklist flyout.
- Live search (⌘F-style inline field) filters the current view.
- Add Task modal; delete via the row/card "···" menu.
- Task detail page: editable title/description, assignee + due date,
  labels, resources placeholder, subtasks (add/check off), comments
  thread, and a right-hand Details panel (Status, Priority, Members,
  Due date, Labels, Reporter) plus an Updates activity feed. Priority and
  due date both use working dropdown/calendar pickers.

**Projects**
- Projects list (table) with Priority/Lead/Due Date columns, its own
  Fields and Filter menus, search, and Add Project.
- Clicking a project drills into `/projects/[id]`, which reuses the same
  Board/List task views scoped to that project's tasks, with a
  `Projects / <name>` breadcrumb.

**Theme system**
- Centralized in `globals.css` as CSS custom properties, switched via
  `data-theme` (`light`/`dark`) and `data-accent` (`amber` / `blue` /
  `pink` / `rose` / `emerald` / `black`) attributes on `<html>`, set from
  `src/hooks/useTheme.tsx`. Components never hardcode colors — they use
  `bg-accent`, `text-accent`, `bg-surface`, `border-border`, etc.
- Both the account-menu popover (Change Theme / Color Mode submenus) and
  the dedicated Settings → Theme / Color pages read and write the same
  state, and the choice persists across refresh.

**Responsive design**
- Sidebar becomes a backdrop-covered overlay drawer below the `md`
  breakpoint instead of squeezing the page; it auto-closes after
  navigating on small screens.
- Board view scrolls horizontally on narrow viewports; List view and the
  Projects table hide secondary columns (Members/Priority/Due Date) below
  `sm`/`md` and fall back to compact inline chips where needed.
- The Task Detail page's right-hand Details panel stacks below the main
  content on mobile/tablet instead of sitting beside it, and can be
  toggled with the panel icon at any width.
- Settings' left navigation collapses to a horizontal scrollable tab bar
  on small screens.

**Other**
- Empty states for no-results search/filter and empty task/project lists.
- Accessible interactive elements: labeled icon-only buttons, semantic
  table markup, keyboard `Escape` closes popovers/modals, visible focus
  rings via `:focus-visible`.
- No `localStorage` access during server rendering — all persisted state
  hydrates after mount to avoid hydration mismatches.

## Design assumptions & deviations

The screenshots are the source of truth for visual fidelity, but a few
points were necessarily interpreted since this is a frontend-only mock:

- **"Login with Google"** doesn't call real OAuth (there's no backend).
  It signs in a mock account. Since the screenshots show a signed-in user
  named "Dexter" throughout the rest of the flow, that's the mock Google
  identity used here; "Continue as Guest" signs in as a separate "Guest"
  identity.
- **List view's mock data**: screenshots 2 and 4 show different task
  titles for the same Board vs. List views (the Figma mock data isn't
  consistent between them). Both views in this app read from the same
  underlying task store instead, so switching views never "changes" the
  data — this seemed more true to how a real app should behave than
  reproducing the inconsistency.
- **The second "Subtasks" heading** in the task detail screenshot (below
  the subtasks table, containing a comment and a reply box) is labeled
  "Comments" here instead, since its content is clearly a discussion
  thread rather than more subtasks — likely a copy artifact in the
  source design.
- **Date picker** in the task detail sidebar is implemented as a single
  due-date field with a calendar popover; the screenshot's "Start → End"
  range control is simplified to one date since only a single date field
  is used elsewhere in the app (task cards, list view, filters).
- **Resources** ("Add document or link...") is present as an affordance
  in the task detail page but isn't wired to real attachment storage,
  since no attachment UI is shown in the screenshots beyond that single
  row.
- **Color Mode "Black" swatch**: in dark mode, the "Black" accent flips to
  a light foreground so buttons/links stay legible against the dark
  surface, rather than becoming invisible black-on-black.

## Connecting a real backend later

Every piece of "backend" behavior is isolated behind a hook:

- `useAuth()` → replace `loginAsGuest` / `loginWithGoogle` / `logout` with
  real API calls; keep the same `session` shape.
- `useTasks()` / `useProjects()` → replace the `localStorage`-backed state
  with data fetched from a NestJS API; the CRUD method signatures
  (`addTask`, `updateTask`, `deleteTask`, `moveTask`, …) are already
  shaped like typical REST/GraphQL mutations.

No component reaches into `localStorage` or mock data directly — they all
go through these hooks, so the swap is localized.
