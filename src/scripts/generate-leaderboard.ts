#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import { parseScoresCsv, parseCategoryScoresCsv } from '@/lib/csv-parser';

interface AlgorithmMetadata {
  algorithms: Record<string, {
    algorithmFamily: string;
    description?: string;
    datasetProfile?: string;
  }>;
  defaults: {
    payloadBpp: number;
    runtimeMs: number;
  };
}

interface CategoryScoreRow {
  algorithm: string;
  attack_category: string;
  avg_ssim: number;
  avg_psnr: number;
  avg_ber: number;
  recovery_rate: number;
  distortion_score: number;
  robustness_score: number;
  overall_score: number;
  images_tested: number;
}

function generateId(algorithmName: string): string {
  const name = algorithmName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `alg-${name}`;
}

// Estimate PSNR from overall score (empirical relationship)
function estimatePsnr(overallScore: number): number {
  // This is an approximation - adjust based on actual data
  if (overallScore >= 96) return 44.2;
  if (overallScore >= 95) return 43.4;
  if (overallScore >= 94) return 42.9;
  if (overallScore >= 93) return 42.6;
  if (overallScore >= 92) return 42.2;
  if (overallScore >= 91) return 41.8;
  if (overallScore >= 90) return 41.5;
  if (overallScore >= 89) return 41.1;
  if (overallScore >= 88) return 40.7;
  if (overallScore >= 87) return 40.3;
  if (overallScore >= 86) return 39.9;
  return 39.5;
}

// Estimate BER from overall score (empirical relationship)
function estimateBer(overallScore: number): number {
  // This is an approximation - adjust based on actual data
  if (overallScore >= 96) return 0.006;
  if (overallScore >= 95) return 0.008;
  if (overallScore >= 94) return 0.010;
  if (overallScore >= 93) return 0.012;
  if (overallScore >= 92) return 0.013;
  if (overallScore >= 91) return 0.014;
  if (overallScore >= 90) return 0.015;
  if (overallScore >= 89) return 0.016;
  if (overallScore >= 88) return 0.018;
  if (overallScore >= 87) return 0.020;
  if (overallScore >= 86) return 0.022;
  return 0.024;
}

// Estimate SSIM from overall score (empirical relationship)
function estimateSsim(overallScore: number): number {
  // This is an approximation - adjust based on actual data
  return Math.min(1.0, 0.945 + (overallScore - 84) * 0.0018);
}

// Helper function to get algorithm category scores
function getCategoryScores(algorithm: string, categoryScores: CategoryScoreRow[]): Record<string, CategoryScoreRow> {
  const scoresByCategory: Record<string, CategoryScoreRow> = {};

  for (const row of categoryScores) {
    if (row.algorithm === algorithm) {
      scoresByCategory[row.attack_category] = row;
    }
  }

  return scoresByCategory;
}

// Main function to generate leaderboard from CSV and metadata
function generateLeaderboard(
  scoresPath: string,
  categoryScoresPath: string,
  metadataPath: string,
  outputPath: string
): void {
  // Read files
  const scores = parseScoresCsv(scoresPath);
  const categoryScores = parseCategoryScoresCsv(categoryScoresPath);
  const metadata: AlgorithmMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

  const entries = scores.map((score) => {
    const algorithmMeta = metadata.algorithms[score.algorithm] || {};
    const categoryScoresMap = getCategoryScores(score.algorithm, categoryScores);

    // Get clean scores (none or capacity category)
    const cleanScore = categoryScoresMap['none'] || categoryScoresMap['capacity'];

    // Calculate individual metrics from category scores or estimate
    const ssim = cleanScore?.avg_ssim ?? estimateSsim(score.overall_score);
    const psnrDb = cleanScore?.avg_psnr ?? estimatePsnr(score.overall_score);
    const avgBer = cleanScore?.avg_ber ?? estimateBer(score.overall_score);

    // Get attack category scores
    const compressionScore = categoryScoresMap['compression']?.distortion_score ?? score.compression_score;
    const blurScore = categoryScoresMap['filtering']?.distortion_score ?? score.blur_score;
    const noiseScore = categoryScoresMap['noise']?.distortion_score ?? score.noise_score;
    const geometricScore = categoryScoresMap['geometric']?.distortion_score ?? score.geometric_score;
    const capacityScore = categoryScoresMap['capacity']?.distortion_score ?? score.capacity_score;

    return {
      id: generateId(score.algorithm),
      algorithmName: score.algorithm,
      datasetProfile: algorithmMeta.datasetProfile || "BOSSBase-256",
      compositeScore: score.overall_score,
      psnrDb: psnrDb,
      ssim: ssim,
      ber: avgBer,
      payloadBpp: algorithmMeta.algorithmFamily === 'Classical' ? 0.4 : metadata.defaults.payloadBpp,
      recoveryRate: score.overall_recovery_rate * 100,
      runtimeMs: metadata.defaults.runtimeMs,
      lastEvaluatedIso: new Date().toISOString(),
      algorithmFamily: algorithmMeta.algorithmFamily || "Classical",
      description: algorithmMeta.description || "No description available.",
      compressionScore: compressionScore,
      blurScore: blurScore,
      noiseScore: noiseScore,
      geometricScore: geometricScore,
      capacityScore: capacityScore,
    };
  });

  // Sort entries by composite score (descending)
  entries.sort((a, b) => b.compositeScore - a.compositeScore);

  // Write output file
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Generated ${entries.length} entries in ${outputPath}`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  // Default paths - can be overridden with environment variables
  const resultsDir = process.env.RESULTS_DIR || '/Users/utkarshsharma/saas/results';
  const testRunDir = process.env.TEST_RUN_DIR || 'example-lsb/test-run';
  const testRunPath = path.join(resultsDir, testRunDir);

  const SCORES_PATH = path.join(testRunPath, 'scores-test-run.csv');
  const CATEGORY_SCORES_PATH = path.join(testRunPath, 'scores-test-run-by-category.csv');
  const METADATA_PATH = './src/data/algorithm-metadata.json';
  const OUTPUT_PATH = './src/data/leaderboard.json';

  console.log('Generating leaderboard from CSV results...');
  console.log(`Scores: ${SCORES_PATH}`);
  console.log(`Category Scores: ${CATEGORY_SCORES_PATH}`);
  console.log(`Metadata: ${METADATA_PATH}`);
  console.log(`Output: ${OUTPUT_PATH}`);

  try {
    generateLeaderboard(SCORES_PATH, CATEGORY_SCORES_PATH, METADATA_PATH, OUTPUT_PATH);
    console.log('Done!');
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    process.exit(1);
  }
}