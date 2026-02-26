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
    id: String(entry.id ?? `alg-${index + 1}`),
    algorithmName: String(entry.algorithmName ?? "Unknown algorithm"),
    datasetProfile: String(entry.datasetProfile ?? "Unknown profile"),
    compositeScore: toNumber(entry.compositeScore),
    psnrDb: toNumber(entry.psnrDb),
    ber: toNumber(entry.ber),
    payloadBpp: toNumber(entry.payloadBpp),
    runtimeMs: toNumber(entry.runtimeMs),
    lastEvaluatedIso: toIso(entry.lastEvaluatedIso),
    algorithmFamily: entry.algorithmFamily ? String(entry.algorithmFamily) : undefined,
    // NEW FIELDS
    ssim: toNumber(entry.ssim, 1),
    recoveryRate: toNumber(entry.recoveryRate, 0),
    compressionScore: entry.compressionScore !== undefined ? toNumber(entry.compressionScore) : undefined,
    blurScore: entry.blurScore !== undefined ? toNumber(entry.blurScore) : undefined,
    noiseScore: entry.noiseScore !== undefined ? toNumber(entry.noiseScore) : undefined,
    geometricScore: entry.geometricScore !== undefined ? toNumber(entry.geometricScore) : undefined,
    capacityScore: entry.capacityScore !== undefined ? toNumber(entry.capacityScore) : undefined
  };
}

export function baseRankComparator(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (b.compositeScore !== a.compositeScore) {
    return b.compositeScore - a.compositeScore;
  }

  if (b.psnrDb !== a.psnrDb) {
    return b.psnrDb - a.psnrDb;
  }

  if (a.ber !== b.ber) {
    return a.ber - b.ber;
  }

  if (b.payloadBpp !== a.payloadBpp) {
    return b.payloadBpp - a.payloadBpp;
  }

  const nameCompare = a.algorithmName.localeCompare(b.algorithmName, undefined, {
    sensitivity: "base"
  });
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

    if (key === "psnrDb") {
      return b.psnrDb - a.psnrDb || baseRankComparator(a, b);
    }

    if (key === "ber") {
      return a.ber - b.ber || baseRankComparator(a, b);
    }

    if (key === "payloadBpp") {
      return b.payloadBpp - a.payloadBpp || baseRankComparator(a, b);
    }

    if (key === "ssim") {
      return b.ssim - a.ssim || baseRankComparator(a, b);
    }

    if (key === "recoveryRate") {
      return b.recoveryRate - a.recoveryRate || baseRankComparator(a, b);
    }

    const aTime = new Date(a.lastEvaluatedIso).getTime();
    const bTime = new Date(b.lastEvaluatedIso).getTime();
    return bTime - aTime || baseRankComparator(a, b);
  });

  if (key === "rank") {
    return direction === "asc" ? sorted : sorted.reverse();
  }

  if (key === "ber") {
    return direction === "desc" ? sorted.reverse() : sorted;
  }

  if (key === "ssim") {
    return direction === "desc" ? sorted.reverse() : sorted;
  }

  if (key === "recoveryRate") {
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
      entry.algorithmName.toLowerCase().includes(normalizedQuery) ||
      entry.datasetProfile.toLowerCase().includes(normalizedQuery) ||
      (entry.algorithmFamily ?? "").toLowerCase().includes(normalizedQuery)
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

export function formatPsnr(value: number): string {
  return `${value.toFixed(1)} dB`;
}

export function formatBer(value: number): string {
  return value.toFixed(3);
}

export function formatPayload(value: number): string {
  return `${value.toFixed(2)} bpp`;
}

export function formatRuntime(value: number): string {
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

export function formatSsim(value: number): string {
  return value.toFixed(3);
}

export function formatRecoveryRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatAttackScore(value: number | undefined): string {
  if (value === undefined) return "-";
  return value.toFixed(1);
}

export function getAlgorithmByName(name: string): LeaderboardEntry | undefined {
  const entries = getLeaderboardEntriesSync();
  return entries.find(
    (entry) =>
      entry.algorithmName.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );
}
