import rawEntries from "@/data/leaderboard.json";
import type { LeaderboardEntry, SortDirection, SortKey } from "@/types/leaderboard";

const MIN_PAGE_SIZE = 1;

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toIso(value: unknown): string {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    return new Date(0).toISOString();
  }
  return date.toISOString();
}

function normalizeEntry(entry: Partial<LeaderboardEntry>, index: number): LeaderboardEntry {
  return {
    id: String(entry.id ?? `model-${index + 1}`),
    modelName: String(entry.modelName ?? "Unknown model"),
    provider: String(entry.provider ?? "Unknown provider"),
    compositeScore: toNumber(entry.compositeScore),
    qualityScore: toNumber(entry.qualityScore),
    costPer1MInput: toNumber(entry.costPer1MInput),
    costPer1MOutput: toNumber(entry.costPer1MOutput),
    latencyMs: toNumber(entry.latencyMs),
    contextWindow: toNumber(entry.contextWindow),
    lastEvaluatedIso: toIso(entry.lastEvaluatedIso)
  };
}

export function baseRankComparator(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.compositeScore !== a.compositeScore) {
    return b.compositeScore - a.compositeScore;
  }

  if (b.qualityScore !== a.qualityScore) {
    return b.qualityScore - a.qualityScore;
  }

  if (a.latencyMs !== b.latencyMs) {
    return a.latencyMs - b.latencyMs;
  }

  if (a.costPer1MInput !== b.costPer1MInput) {
    return a.costPer1MInput - b.costPer1MInput;
  }

  const nameCompare = a.modelName.localeCompare(b.modelName, undefined, { sensitivity: "base" });
  if (nameCompare !== 0) {
    return nameCompare;
  }

  return a.id.localeCompare(b.id);
}

export function getLeaderboardEntriesSync(): LeaderboardEntry[] {
  const entries = Array.isArray(rawEntries) ? rawEntries : [];
  return entries.map((entry, index) => normalizeEntry(entry as Partial<LeaderboardEntry>, index));
}

export async function getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  return getLeaderboardEntriesSync();
}

export function sortEntries(
  entries: LeaderboardEntry[],
  key: SortKey,
  direction: SortDirection
): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => {
    if (key === "rank") {
      return baseRankComparator(a, b);
    }

    if (key === "compositeScore") {
      return b.compositeScore - a.compositeScore || baseRankComparator(a, b);
    }

    if (key === "qualityScore") {
      return b.qualityScore - a.qualityScore || baseRankComparator(a, b);
    }

    if (key === "costPer1MInput") {
      return a.costPer1MInput - b.costPer1MInput || baseRankComparator(a, b);
    }

    if (key === "latencyMs") {
      return a.latencyMs - b.latencyMs || baseRankComparator(a, b);
    }

    const aTime = new Date(a.lastEvaluatedIso).getTime();
    const bTime = new Date(b.lastEvaluatedIso).getTime();
    return bTime - aTime || baseRankComparator(a, b);
  });

  if (key === "rank") {
    return direction === "asc" ? sorted : sorted.reverse();
  }

  if (key === "costPer1MInput" || key === "latencyMs") {
    return direction === "desc" ? sorted.reverse() : sorted;
  }

  return direction === "asc" ? sorted.reverse() : sorted;
}

export function filterEntries(entries: LeaderboardEntry[], query: string): LeaderboardEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) => {
    return (
      entry.modelName.toLowerCase().includes(normalizedQuery) ||
      entry.provider.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function paginateEntries(entries: LeaderboardEntry[], page: number, pageSize: number) {
  const safePageSize = Math.max(MIN_PAGE_SIZE, pageSize);
  const totalPages = Math.max(1, Math.ceil(entries.length / safePageSize));
  const normalizedPage = Math.min(Math.max(1, page), totalPages);
  const start = (normalizedPage - 1) * safePageSize;

  return {
    pageItems: entries.slice(start, start + safePageSize),
    totalPages,
    page: normalizedPage
  };
}

export function buildRankMap(entries: LeaderboardEntry[]): Map<string, number> {
  return new Map([...entries].sort(baseRankComparator).map((entry, index) => [entry.id, index + 1]));
}

export function formatCost(value: number): string {
  return `$${value.toFixed(2)}/1M`;
}

export function formatLatency(value: number): string {
  return `${Math.round(value)} ms`;
}

export function formatLastEvaluated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getUTCMonth()] ?? "Jan";
  const day = date.getUTCDate();
  const hour24 = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minutePadded = String(minute).padStart(2, "0");

  return `${month} ${day} at ${hour12}:${minutePadded} ${period}`;
}

export function formatContextWindow(tokens: number): string {
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}k`;
  }
  return String(tokens);
}
