# StegoEval Frontend Workflow

## Backend Design Implementation

This implementation follows the Vercel-friendly static approach for the StegoEval Leaderboard.

## Architecture Overview

The system uses a build-time data generation approach where CSV files are transformed into JSON for the static frontend.

## Directory Structure

```
StegoEval-Frontend/
├── results/                          # CSV files (tracked in git)
│   └── example-lsb/test-run/        # Evaluation run folder
│       ├── scores-test-run.csv       # Aggregated scores
│       ├── scores-test-run-by-category.csv
│       └── algorithms/               # Per-algorithm detailed results
│           ├── HUGO/
│           │   ├── results-HUGO.csv
│           │   └── summary-HUGO.md
│           ├── S-UNIWARD/
│           │   ├── results-S-UNIWARD.csv
│           │   └── summary-S-UNIWARD.md
│           └── ...
├── src/
│   ├── data/
│   │   ├── leaderboard.json          # Generated (tracked)
│   │   └── algorithm-metadata.json   # Manual metadata (tracked)
│   ├── scripts/
│   │   └── generate-leaderboard.ts   # Transform script
│   └── lib/
│       └── csv-parser.ts             # Existing (enhanced as needed)
└── package.json
```

## Files Created/Modified

### 1. Algorithm Metadata (`src/data/algorithm-metadata.json`)
- Stores static metadata for all algorithms
- Includes descriptions, families, and dataset profiles
- Provides fallback defaults

### 2. Generation Script (`src/scripts/generate-leaderboard.ts`)
- Enhanced version with metadata support
- Estimates missing metrics based on overall scores
- Sorts entries by composite score
- Supports environment variables for flexible paths

### 3. Package.json Script
- Added `generate-data` script for easy execution

## Update Workflow

```bash
# 1. After running stegoeval tool:
cd StegoEval-Frontend
npm run generate-data      # Transform CSV → JSON

# 2. Review and commit
git add results/ src/data/leaderboard.json
git commit -m "Update evaluation results"
git push
# → Vercel auto-deploys

# 3. Verify locally
npm run dev
```

## Environment Variables

Optional environment variables to customize paths:

```bash
export RESULTS_DIR="/custom/path/to/results"
export TEST_RUN_DIR="test-run-name"
npm run generate-data
```

## Data Processing

The script performs the following transformations:

1. **Reads** CSV files from `results/test-run/`
2. **Reads** metadata from `src/data/algorithm-metadata.json`
3. **Merges** CSV data with metadata
4. **Estimates** missing metrics (PSNR, BER, SSIM) when needed
5. **Sorts** by composite score (descending)
6. **Writes** to `src/data/leaderboard.json`

## Verification

Run these commands to ensure everything works:

```bash
# Build the application
npm run build

# Run tests
npm run test

# Run linter
npm run lint
```

## Features

- **Zero runtime costs** - Static data, no server
- **Fast page loads** - JSON data pre-processed
- **Simple workflow** - Manual script + git push
- **Vercel compatible** - Free tier friendly
- **TypeScript support** - Full type safety