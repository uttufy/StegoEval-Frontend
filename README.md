# StegoEval Frontend

A polished Next.js frontend for a **Steganography Algorithm Leaderboard** powered by local benchmark data.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Global CSS (white glassmorphism theme)
- Vitest + Testing Library

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run start`

## Core Data Model

Source: `/src/data/leaderboard.json`

Each row represents an **algorithm + dataset profile**:

- `id: string`
- `algorithmName: string`
- `datasetProfile: string`
- `compositeScore: number`
- `psnrDb: number`
- `ber: number`
- `payloadBpp: number`
- `runtimeMs: number`
- `lastEvaluatedIso: string`
- `algorithmFamily?: string`

## Ranking Logic

Implemented in `/src/lib/leaderboard.ts`.

Primary ranking order:

1. `compositeScore` desc
2. `psnrDb` desc
3. `ber` asc
4. `payloadBpp` desc
5. `algorithmName` asc
6. `id` asc

## Features

- Hero + metrics + podium + global ranking table/cards
- Search by algorithm/profile/family
- Sort + pagination (10/25/50)
- Responsive desktop/mobile views
- About, contact, and repository footer
- Deterministic timestamp formatting to avoid hydration mismatch
