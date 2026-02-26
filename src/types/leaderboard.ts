export type SortDirection = "asc" | "desc";

export type SortKey =
  | "rank"
  | "compositeScore"
  | "psnrDb"
  | "ssim"
  | "ber"
  | "payloadBpp"
  | "recoveryRate"
  | "lastEvaluated";

export interface LeaderboardEntry {
  id: string;
  algorithmName: string;
  datasetProfile: string;
  compositeScore: number;
  psnrDb: number;
  ber: number;
  payloadBpp: number;
  runtimeMs: number;
  lastEvaluatedIso: string;
  algorithmFamily?: string;
  description?: string;            // Detailed description of the algorithm

  // NEW FIELDS
  ssim: number;                    // Structural Similarity Index (0-1)
  recoveryRate: number;            // Recovery rate percentage (0-100)

  // Attack category scores (0-100 scale)
  compressionScore?: number;
  blurScore?: number;              // aka filteringScore
  noiseScore?: number;
  geometricScore?: number;
  capacityScore?: number;
}
