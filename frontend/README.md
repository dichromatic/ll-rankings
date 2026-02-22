# LL-Rankings Frontend

A themed dashboard for Love Live! song rankings and analysis. Built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

## Project Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router (Routes & Layouts)
│   │   ├── analysis/           # Route: /analysis (Statistics)
│   │   ├── divergence/         # Route: /divergence (User compatibility matrix)
│   │   ├── spice/              # Route: /spice (Ranking uniqueness score)
│   │   ├── submit/             # Route: /submit (User ranking submission form)
│   │   ├── contexts.tsx        # React Context definitions (Franchise, Subgroup)
│   │   ├── globals.css         # Global Tailwind directives
│   │   ├── layout.tsx          # Root layout wrapping the app with Providers and Shell
│   │   ├── page.tsx            # Home page (Leaderboard)
│   │   └── providers.tsx       # QueryClientProvider setup (TanStack Query)
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── analysis/           # Charts & Stats (DivergenceGrid, SpiceRow)
│   │   ├── layout/             # Shell.tsx (Main Navigation & Layout Wrapper)
│   │   ├── ranking/            # Leaderboard displays
│   │   └── submission/         # Form elements for the ranking process
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAnalysisData.ts  # Fetches stats from API
│   │   ├── useFranchiseTheme.ts# Manages dynamic theming based on franchise
│   │   ├── useRankings.ts      # Fetches leaderboard data
│   │   └── useSubgroups.ts     # Fetches list of subgroups (units/albums)
│   │
│   ├── lib/                    # Shared libraries (if any)
│   └── utils/                  # Helper functions
│       ├── api.ts              # Axios instance & API method wrappers
│       └── boilerplate.ts      # Tailwind class merging (clsx/tailwind-merge)
│
├── public/                     # Static assets (images, icons)
├── tailwind.config.ts          # Tailwind configuration
└── next.config.ts              # Next.js configuration
```

## Key Concepts

### 1. Theming System (`hooks/useFranchiseTheme.ts`)
The application features a dynamic theming engine that adapts the UI colors based on the selected franchise (e.g., Liella!, Aqours).
- **Mechanism**: The `useFranchiseTheme` hook maps a franchise key (e.g., `'liella'`) to a set of Tailwind utility classes for borders, text, backgrounds, and hover states.
- **Usage**: Components consume this hook to apply consistent branding without hardcoding colors.

### 2. Global State & Shell
The `Shell.tsx` component (`src/components/layout/Shell.tsx`) acts as the main application wrapper.
- **Responsibility**: It manages the global state for the currently selected **Franchise** and **Subgroup**.
- **Context**: This state is broadcast to the rest of the app via `FranchiseContext` and `SubgroupContext` (defined in `app/contexts.tsx`), allowing any component to react to filter changes.
- **Navigation**: The Shell also handles the responsive top navigation bar and route transitions.

### 3. Data Fetching
We use **TanStack Query (React Query)** for efficient server state management.
- **Configuration**: The `QueryClient` is initialized in `src/app/providers.tsx` with a default stale time (e.g., 60 seconds).
- **Hooks**: Custom hooks in `src/hooks/` (like `useRankings`, `useAnalysisData`) wrap Axios calls, providing loading states, error handling, and caching out of the box.

## Development

### Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:8000` (default)

### Setup
1. Create a `.env.local` file in the `frontend` directory:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Commands
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```
