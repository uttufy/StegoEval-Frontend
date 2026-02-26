# Downloads Feature Implementation

## Overview

Added download functionality to the technique detail page, allowing users to download algorithm-specific evaluation files.

## Implementation

### 1. Technique Detail Page Enhancement

Updated `app/technique/[name]/TechniqueDetailClient.tsx` to include:
- New "Download Files" section at the bottom of the page
- Categorized download links:
  - **Evaluation Results**: Algorithm scores and category scores
  - **Detailed Results**: Full results and summary markdown
- Styled with glass morphism design consistent with the rest of the site
- Responsive design for mobile devices

### 2. Download API Route

Created `app/api/download/route.ts` to handle file downloads:
- Secure file access with path validation
- Support for CSV and Markdown files
- Automatic filename generation with algorithm name
- Proper content types and headers
- Environment variables for flexible path configuration

### 3. CSS Styles

Added comprehensive styles in `app/globals.css`:
- Glass morphism design for download cards
- Hover effects and animations
- Mobile responsive layout
- Consistent with existing design system

## Available Downloads

For each algorithm, users can download:

### Evaluation Results
- `Algorithm Scores (CSV)` - Aggregated performance scores
- `Attack Category Scores (CSV)` - Scores broken down by attack type

### Detailed Results
- `Full Results (CSV)` - Complete evaluation data
- `Evaluation Summary (Markdown)` - Text summary of results

## File Structure

```
results/
└── example-lsb/test-run/
    ├── scores-test-run.csv
    ├── scores-test-run-by-category.csv
    ├── results-test-run.csv
    └── summary-test-run.md
```

## API Endpoint

`GET /api/download?file=<filename>&algorithm=<algorithm-name>`

### Parameters
- `file` (required): Name of the file to download
- `algorithm` (optional): Algorithm name for custom filename

### Security
- Prevents directory traversal attacks
- Validates file paths
- Uses environment variables for base path

## Environment Variables

Optional configuration:
```bash
export RESULTS_DIR="/custom/path/to/results"
export TEST_RUN_DIR="test-run-name"
```

## Testing

- ✅ Build successful
- ✅ All tests pass (12 tests)
- ✅ ESLint clean (no warnings or errors)

## Example Workflow

1. User navigates to technique detail page
2. Scrolls to "Download Files" section
3. Clicks desired download link
4. File downloads with algorithm-specific name
5. Browser shows download progress

## File Naming Convention

Downloaded files are automatically renamed with the algorithm name:
- `scores-example_lsb.csv` instead of `scores-test-run.csv`
- `results-example_lsb.csv` instead of `results-test-run.csv`
- `summary-example_lsb.md` instead of `summary-test-run.md`