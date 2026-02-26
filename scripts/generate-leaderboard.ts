#!/usr/bin/env tsx
import { generateLeaderboardEntries } from '../src/lib/csv-parser';

// Update these paths to point to your CSV results
const SCORES_PATH = '/Users/utkarshsharma/saas/results/example-lsb/test-run/scores-test-run.csv';
const CATEGORY_SCORES_PATH = '/Users/utkarshsharma/saas/results/example-lsb/test-run/scores-test-run-by-category.csv';
const OUTPUT_PATH = './src/data/leaderboard.json';

console.log('Generating leaderboard from CSV results...');
console.log(`Scores: ${SCORES_PATH}`);
console.log(`Category Scores: ${CATEGORY_SCORES_PATH}`);
console.log(`Output: ${OUTPUT_PATH}`);

try {
  generateLeaderboardEntries(SCORES_PATH, CATEGORY_SCORES_PATH, OUTPUT_PATH);
  console.log('Done!');
} catch (error) {
  console.error('Error generating leaderboard:', error);
  process.exit(1);
}
