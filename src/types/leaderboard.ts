export type SortDirection = "asc" | "desc";

export type SortKey =
  | "rank"
  | "compositeScore"
  | "qualityScore"
  | "costPer1MInput"
  | "latencyMs"
  | "lastEvaluated";

export interface LeaderboardEntry {
  id: string;
  modelName: string;
  provider: string;
  compositeScore: number;
  qualityScore: number;
  costPer1MInput: number;
  costPer1MOutput: number;
  latencyMs: number;
  contextWindow: number;
  lastEvaluatedIso: string;
}
