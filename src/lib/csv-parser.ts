import fs from 'node:fs';
import path from 'path';

interface ScoreRow {
  algorithm: string;
  compression_score: number;
  blur_score: number;
  noise_score: number;
  geometric_score: number;
  combo_score?: number;
  capacity_score: number;
  overall_score: number;
  total_images: number;
  total_payloads_recovered: number;
  overall_recovery_rate: number;
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

export function parseScoresCsv(csvPath: string): ScoreRow[] {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Scores CSV file not found: ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').slice(1).filter(Boolean);

  if (lines.length === 0) {
    console.warn(`No data found in scores CSV: ${csvPath}`);
    return [];
  }

  return lines.map((line, index) => {
    const values = line.split(',');
    try {
      return {
        algorithm: values[0]?.trim() || '',
        compression_score: parseFloat(values[1] || '0') || 0,
        blur_score: parseFloat(values[2] || '0') || 0,
        noise_score: parseFloat(values[3] || '0') || 0,
        geometric_score: parseFloat(values[4] || '0') || 0,
        combo_score: values[5] ? parseFloat(values[5]) : undefined,
        capacity_score: parseFloat(values[6] || '0') || 0,
        overall_score: parseFloat(values[7] || '0') || 0,
        total_images: parseInt(values[8] || '0', 10),
        total_payloads_recovered: parseInt(values[9] || '0', 10),
        overall_recovery_rate: parseFloat(values[10] || '0') || 0,
      };
    } catch (error) {
      console.error(`Error parsing line ${index + 2} in scores CSV:`, line, error);
      throw error;
    }
  });
}

export function parseCategoryScoresCsv(csvPath: string): CategoryScoreRow[] {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Category scores CSV file not found: ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').slice(1).filter(Boolean);

  if (lines.length === 0) {
    console.warn(`No data found in category scores CSV: ${csvPath}`);
    return [];
  }

  return lines.map((line, index) => {
    const values = line.split(',');
    try {
      return {
        algorithm: values[0]?.trim() || '',
        attack_category: values[1]?.trim() || '',
        avg_ssim: parseFloat(values[2] || '0') || 0,
        avg_psnr: parseFloat(values[3] || '0') || 0,
        avg_ber: parseFloat(values[4] || '0') || 0,
        recovery_rate: parseFloat(values[5] || '0') || 0,
        distortion_score: parseFloat(values[6] || '0') || 0,
        robustness_score: parseFloat(values[7] || '0') || 0,
        overall_score: parseFloat(values[8] || '0') || 0,
        images_tested: parseInt(values[9] || '0', 10),
      };
    } catch (error) {
      console.error(`Error parsing line ${index + 2} in category scores CSV:`, line, error);
      throw error;
    }
  });
}

function loadAlgorithmMetadata(): { algorithms: AlgorithmMetadata; defaults?: AlgorithmDefaults } {
  const metadataPath = path.join(__dirname, '../data/algorithm-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.warn(`Algorithm metadata not found at ${metadataPath}`);
    return { algorithms: {} };
  }

  const content = fs.readFileSync(metadataPath, 'utf-8');
  return JSON.parse(content);
}

export function generateLeaderboardEntries(
  scoresPath: string,
  categoryScoresPath: string,
  outputPath: string
): void {
  const scores = parseScoresCsv(scoresPath);
  const categoryScores = parseCategoryScoresCsv(categoryScoresPath);
  const { algorithms: algorithmMetadata, defaults: globalDefaults } = loadAlgorithmMetadata();

  // Map algorithm name to category scores
  const categoryScoresByAlg = new Map<string, Map<string, CategoryScoreRow>>();
  for (const row of categoryScores) {
    if (!categoryScoresByAlg.has(row.algorithm)) {
      categoryScoresByAlg.set(row.algorithm, new Map());
    }
    categoryScoresByAlg.get(row.algorithm)!.set(row.attack_category, row);
  }

  const entries = scores.map((score, index) => {
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
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Generated ${entries.length} entries in ${outputPath}`);
}