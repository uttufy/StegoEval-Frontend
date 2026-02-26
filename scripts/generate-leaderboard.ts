#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import { parseScoresCsv, parseCategoryScoresCsv } from '../src/lib/csv-parser';

const RESULTS_DIR = process.env.RESULTS_DIR || path.join(__dirname, '../results');
const OUTPUT_PATH = path.join(__dirname, '../src/data/leaderboard.json');

console.log('Scanning results directory:', RESULTS_DIR);

interface AlgorithmMetadata {
  [key: string]: {
    algorithmFamily: string;
    description: string;
    datasetProfile: string;
  };
}

interface AlgorithmDefaults {
  payloadBpp: number;
  runtimeMs: number;
}

function loadAlgorithmMetadata(): { algorithms: AlgorithmMetadata; defaults?: AlgorithmDefaults } {
  const metadataPath = path.join(__dirname, '../src/data/algorithm-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Algorithm metadata not found at ${metadataPath}`);
    return { algorithms: {} };
  }

  const content = fs.readFileSync(metadataPath, 'utf-8');
  return JSON.parse(content);
}

function findScoreFiles(dir: string): { scores: string | null; categoryScores: string | null } {
  let scores: string | null = null;
  let categoryScores: string | null = null;

  const files = fs.readdirSync(dir);

  // Look for scores*.csv files (not by-category)
  for (const file of files) {
    if (file.startsWith('scores') && file.endsWith('.csv') && !file.includes('by-category')) {
      scores = path.join(dir, file);
      break;
    }
  }

  // Look for scores*by-category*.csv files
  for (const file of files) {
    if (file.startsWith('scores') && file.includes('by-category') && file.endsWith('.csv')) {
      categoryScores = path.join(dir, file);
      break;
    }
  }

  return { scores, categoryScores };
}

function generateLeaderboard(): void {
  const { algorithms: algorithmMetadata, defaults: globalDefaults } = loadAlgorithmMetadata();

  // Collect all scores and category scores from all algorithm subdirectories
  const allScores: any[] = [];
  const allCategoryScores: any[] = [];

  // Scan all subdirectories in results/
  const dirEntries = fs.readdirSync(RESULTS_DIR, { withFileTypes: true });

  for (const entry of dirEntries) {
    if (!entry.isDirectory()) continue;

    const algorithmDir = path.join(RESULTS_DIR, entry.name);
    const { scores, categoryScores } = findScoreFiles(algorithmDir);

    if (scores && fs.existsSync(scores)) {
      console.log(`  Found scores: ${scores}`);
      const scoreData = parseScoresCsv(scores);
      allScores.push(...scoreData);
    }

    if (categoryScores && fs.existsSync(categoryScores)) {
      console.log(`  Found category scores: ${categoryScores}`);
      const categoryData = parseCategoryScoresCsv(categoryScores);
      allCategoryScores.push(...categoryData);
    }
  }

  if (allScores.length === 0) {
    console.error('No score files found in results directory');
    process.exit(1);
  }

  // Map algorithm name to category scores
  const categoryScoresByAlg = new Map<string, Map<string, any>>();
  for (const row of allCategoryScores) {
    if (!categoryScoresByAlg.has(row.algorithm)) {
      categoryScoresByAlg.set(row.algorithm, new Map());
    }
    categoryScoresByAlg.get(row.algorithm)!.set(row.attack_category, row);
  }

  // Generate leaderboard entries
  const entries = allScores.map((score, index) => {
    const algScores = categoryScoresByAlg.get(score.algorithm);
    const cleanScore = algScores?.get('none') || algScores?.get('capacity');
    const ssim = cleanScore?.avg_ssim ?? 1;
    const avgPsnr = cleanScore?.avg_psnr ?? 0;
    const avgBer = cleanScore?.avg_ber ?? 0;

    // Get algorithm metadata or use defaults
    const metadata = algorithmMetadata[score.algorithm] || {
      algorithmFamily: "Classical",
      description: `${score.algorithm} steganography algorithm`,
      datasetProfile: "BOSSBase-256"
    };
    const defaults = globalDefaults || { payloadBpp: 0.4, runtimeMs: 100 };

    return {
      id: `alg-${index + 1}`,
      algorithmName: score.algorithm,
      datasetProfile: metadata.datasetProfile,
      algorithmFamily: metadata.algorithmFamily,
      description: metadata.description,
      compositeScore: score.overall_score,
      psnrDb: avgPsnr,
      ssim: ssim,
      ber: avgBer,
      payloadBpp: defaults.payloadBpp,
      recoveryRate: score.overall_recovery_rate * 100,
      runtimeMs: defaults.runtimeMs,
      lastEvaluatedIso: new Date().toISOString(),
      compressionScore: score.compression_score,
      blurScore: score.blur_score,
      noiseScore: score.noise_score,
      geometricScore: score.geometric_score,
      capacityScore: score.capacity_score,
    };
  });

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
  console.log(`\nGenerated ${entries.length} entries in ${OUTPUT_PATH}`);
}

generateLeaderboard();
