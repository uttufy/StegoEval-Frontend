# StegoEval Frontend

A polished, responsive Next.js leaderboard site for StegoEval with an elegant glassmorphism visual style.

## Stack

- Next.js 15 (App Router)
- TypeScript
- CSS (global theme variables)
- Vitest + Testing Library
- Prisma (ORM)

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start development server
- `npm run lint`: run ESLint
- `npm run test`: run unit and component tests
- `npm run build`: build production bundle
- `npm run start`: run production server

## Project Structure

```
StegoEval-Frontend/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Authentication routes
│   │   └── login/              # Login page
│   ├── api/                    # API routes
│   │   ├── export/             # Export endpoints
│   │   │   └── leaderboard/    # Leaderboard export API
│   │   ├── results/            # Results endpoints
│   │   │   └── meta/           # Results metadata API
│   │   └── upload/             # Upload endpoints
│   ├── compare/                # Compare submissions page
│   ├── leaderboard/            # Main leaderboard page
│   ├── technique/              # Technique pages
│   │   └── [name]/             # Dynamic technique detail page
│   ├── upload/                 # Upload submission page
│   ├── globals.css             # Global styles and theme variables
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                 # Reusable UI components
│   ├── charts/                 # Chart components
│   ├── filters/                # Filter components
│   ├── layout/                 # Layout components
│   ├── tables/                 # Table components
│   └── ui/                     # UI primitives
├── src/
│   ├── components/             # Feature-specific components
│   │   ├── BenchmarkMetricTiles.tsx
│   │   ├── EvaluationPathRail.tsx
│   │   ├── GlobalRankingTable.tsx
│   │   ├── HeroLanding.tsx
│   │   ├── LeaderboardCardsMobile.tsx
│   │   ├── LeaderboardControls.tsx
│   │   ├── LeaderboardHero.tsx
│   │   ├── LeaderboardPage.tsx
│   │   ├── LeaderboardTableDesktop.tsx
│   │   ├── Pagination.tsx
│   │   ├── PodiumStrip.tsx
│   │   ├── PodiumWinnerCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── TopTenSnapshot.tsx
│   ├── data/                   # Static data
│   │   └── leaderboard.json    # Leaderboard data
│   ├── lib/                    # Utility functions
│   │   ├── leaderboard.ts      # Leaderboard utilities
│   │   └── leaderboard.test.ts # Leaderboard tests
│   ├── test/                   # Test setup
│   └── types/                  # TypeScript types
│       └── leaderboard.ts      # Leaderboard types
├── prisma/                     # Prisma database schema
├── public/                     # Static assets
│   ├── avatars/                # User avatars
│   └── mock/                   # Mock data
└── store/                      # State management
```

## Pages & Features

### Landing Page (`/`)
- Hero section with glassmorphism design
- Top performers snapshot
- Call-to-action buttons

### Leaderboard (`/leaderboard`)
- Top-3 highlighted cards with podium display
- Sortable leaderboard table (rank, score, accuracy, solved, last active)
- Search by player and country
- Pagination with page size controls (10/25/50)
- Mobile-responsive leaderboard cards
- Accessible controls and focus states
- Loading, error, and empty-result states

### Technique Details (`/technique/[name]`)
- Detailed technique information
- Evaluation metrics and benchmarks

### Compare (`/compare`)
- Compare multiple submissions side-by-side
- Visual difference highlighting

### Upload (`/upload`)
- Submit new entries for evaluation

### Login (`/login`)
- Authentication for users

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/results/meta` | Get results metadata |
| `GET /api/export/leaderboard` | Export leaderboard data |
| `POST /api/upload` | Upload submission |

## Leaderboard Data Model

Source: `/src/data/leaderboard.json`

Each entry uses this shape:

- `id: string`
- `name: string`
- `country: string`
- `score: number`
- `accuracy: number`
- `challengesSolved: number`
- `avatarUrl: string`
- `lastActiveIso: string`

Utilities in `/src/lib/leaderboard.ts` provide:

- typed loading and normalization
- deterministic ranking tie-breakers
- sorting/filtering
- pagination helpers
