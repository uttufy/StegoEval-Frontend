import fs from 'node:fs';

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

export function parseScoresCsv(csvPath: string): ScoreRow[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').slice(1).filter(Boolean);
  return lines.map(line => {
    const values = line.split(',');
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
  });
}

export function parseCategoryScoresCsv(csvPath: string): CategoryScoreRow[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').slice(1).filter(Boolean);
  return lines.map(line => {
    const values = line.split(',');
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
  });
}

export function generateLeaderboardEntries(
  scoresPath: string,
  categoryScoresPath: string,
  outputPath: string
): void {
  const scores = parseScoresCsv(scoresPath);
  const categoryScores = parseCategoryScoresCsv(categoryScoresPath);

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

    return {
      id: `alg-${index + 1}`,
      algorithmName: score.algorithm,
      datasetProfile: "BOSSBase-256", // Default or parse from CSV
      algorithmFamily: "Classical",   // Default or parse from CSV
      compositeScore: score.overall_score,
      psnrDb: avgPsnr,
      ssim: ssim,
      ber: avgBer,
      payloadBpp: 0.4,               // Default or parse from CSV
      recoveryRate: score.overall_recovery_rate * 100,
      runtimeMs: 100,                 // Default or parse from CSV
      lastEvaluatedIso: new Date().toISOString(),
      compressionScore: score.compression_score,
      blurScore: score.blur_score,
      noiseScore: score.noise_score,
      geometricScore: score.geometric_score,
      capacityScore: score.capacity_score,
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Generated ${entries.length} entries in ${outputPath}`);
}
