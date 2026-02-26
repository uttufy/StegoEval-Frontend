# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StegoEval Frontend is a Next.js 15 application using the App Router that displays a leaderboard for steganography algorithm benchmarks. It's a pure client-side application that loads data from a local JSON file at `/src/data/leaderboard.json`.

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Production build

# Testing
npm run test         # Run tests (vitest)
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # ESLint
```

## Architecture

### Data Flow

1. **Data Source**: `/src/data/leaderboard.json` contains raw benchmark data
2. **Data Processing**: `/src/lib/leaderboard.ts` handles all data operations:
   - `getLeaderboardEntriesSync()` - Loads and normalizes raw JSON data
   - `normalizeEntry()` - Converts partial JSON entries to typed `LeaderboardEntry`
   - `sortEntries()` - Sorts by any column with tie-breaking via `baseRankComparator()`
   - `filterEntries()` - Searches across algorithmName, datasetProfile, algorithmFamily
   - `paginateEntries()` - Handles pagination logic
   - `buildRankMap()` - Creates ID-to-rank mapping for display
   - Formatters: `formatPsnr()`, `formatBer()`, `formatPayload()`, `formatRuntime()`, `formatLastEvaluated()`

3. **State Management**: `/src/components/LeaderboardPage.tsx` is the main client component that:
   - Uses `useState` for entries (loaded once on mount), query, sort, pagination state, and viewMode
   - Uses `useMemo` to compute sorted/filtered/paginated data reactively
   - Uses `useEffect` to sync page number with filtered results
   - `viewMode` toggles between "snapshot" (hero only) and "full" (full rankings visible)
   - Passes props to child components for rendering

### Component Structure

- `LeaderboardPage` (src/components/LeaderboardPage.tsx) - Main container with all state
- `LeaderboardHero` - Hero section with CTA to scroll to rankings
- `BenchmarkMetricTiles` - Displays aggregate metrics
- `PodiumWinnerCard` - Shows top 3 entries (gold/silver/bronze)
- `GlobalRankingTable` - Desktop table view with sortable headers
- `LeaderboardCardsMobile` - Mobile card view
- `LeaderboardControls` - Search, sort, and page size controls
- `Pagination` - Page navigation controls

### Ranking Logic

The primary ranking order (baseRankComparator) is:
1. `compositeScore` desc
2. `psnrDb` desc
3. `ber` asc
4. `payloadBpp` desc
5. `algorithmName` asc (case-insensitive)
6. `id` asc

This comparator is used as a tiebreaker for all other sorts.

## Type System

Types are defined in `/src/types/leaderboard.ts`:
- `LeaderboardEntry` - Core data model with all metric fields
- `SortKey` - Column names that can be sorted: "rank", "compositeScore", "psnrDb", "ber", "payloadBpp", "lastEvaluated"
- `SortDirection` - "asc" | "desc"

Additional types defined in component files:
- `RankTrend` (src/components/GlobalRankingTable.tsx) - "up" | "down" | "flat" for rank change indicators

## Testing

- Tests use Vitest with jsdom environment
- Component tests use Testing Library (@testing-library/react)
- Test setup: `/src/test/setup.ts`
- Test config: `/vitest.config.ts`
- Run a specific test file: `npx vitest run path/to/test.test.tsx`

## Important Implementation Details

- **Timestamp formatting**: `formatLastEvaluated()` uses UTC formatting to avoid hydration mismatches between server and client rendering
- **Client-side only**: The entire app runs client-side (`"use client"` on LeaderboardPage), no API routes
- **Path alias**: `@/*` maps to `./src/*`
- All sorting always falls back to `baseRankComparator()` for deterministic results

## Adding New Metrics

1. Update `LeaderboardEntry` type in `/src/types/leaderboard.ts`
2. Add normalization in `normalizeEntry()` in `/src/lib/leaderboard.ts`
3. Add to `SortKey` union type
4. Update `sortEntries()` with new sorting logic
5. Add formatter function if needed (e.g., `formatXxx()`)
6. Update JSON data structure
7. Update table/card components to display the new field

## Additional Components

The page also includes:
- `LeaderboardHero` - Hero section with CTA to scroll to rankings
- `BenchmarkMetricTiles` - Displays aggregate metrics across all entries
- `EvaluationPathRail` - Visual progress indicator component (appears to be unused in current layout)
- `TopTenSnapshot` - Top 10 list view (appears to be unused in current layout)

## Page Layout

The full page structure in LeaderboardPage:
1. LeaderboardHero (hero with CTA)
2. BenchmarkMetricTiles (aggregate metrics)
3. PodiumWinnerCard (top 3 podium)
4. Full Rankings section (hidden by default, shown when viewMode="full")
   - Ranking header with controls
   - GlobalRankingTable (desktop)
   - LeaderboardCardsMobile (mobile)
   - Pagination
5. About section
6. Contact section
7. Footer
