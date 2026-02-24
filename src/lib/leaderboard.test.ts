import {
  baseRankComparator,
  buildRankMap,
  filterEntries,
  formatContextWindow,
  formatCost,
  formatLatency,
  paginateEntries,
  sortEntries
} from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

const entries: LeaderboardEntry[] = [
  {
    id: "a",
    modelName: "Model A",
    provider: "OpenAI",
    compositeScore: 95,
    qualityScore: 96,
    costPer1MInput: 2,
    costPer1MOutput: 8,
    latencyMs: 700,
    contextWindow: 128000,
    lastEvaluatedIso: "2026-02-24T10:00:00.000Z"
  },
  {
    id: "b",
    modelName: "Model B",
    provider: "Anthropic",
    compositeScore: 95,
    qualityScore: 96,
    costPer1MInput: 1,
    costPer1MOutput: 4,
    latencyMs: 600,
    contextWindow: 200000,
    lastEvaluatedIso: "2026-02-24T11:00:00.000Z"
  },
  {
    id: "c",
    modelName: "Model C",
    provider: "Google",
    compositeScore: 90,
    qualityScore: 93,
    costPer1MInput: 0.5,
    costPer1MOutput: 2,
    latencyMs: 400,
    contextWindow: 1000000,
    lastEvaluatedIso: "2026-02-20T10:00:00.000Z"
  }
];

describe("baseRankComparator", () => {
  it("applies composite tie-breakers deterministically", () => {
    const sorted = [...entries].sort(baseRankComparator);
    expect(sorted.map((entry) => entry.id)).toEqual(["b", "a", "c"]);
  });
});

describe("sortEntries", () => {
  it("sorts by each key in descending and ascending order", () => {
    expect(sortEntries(entries, "compositeScore", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "compositeScore", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "qualityScore", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "qualityScore", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "costPer1MInput", "asc")[0]?.id).toBe("c");
    expect(sortEntries(entries, "costPer1MInput", "desc")[0]?.id).toBe("a");

    expect(sortEntries(entries, "latencyMs", "asc")[0]?.id).toBe("c");
    expect(sortEntries(entries, "latencyMs", "desc")[0]?.id).toBe("a");

    expect(sortEntries(entries, "lastEvaluated", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "lastEvaluated", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "rank", "asc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "rank", "desc")[0]?.id).toBe("c");
  });
});

describe("filterEntries", () => {
  it("matches model name and provider case-insensitively", () => {
    expect(filterEntries(entries, "model a").map((entry) => entry.id)).toEqual(["a"]);
    expect(filterEntries(entries, "ANTHROPIC").map((entry) => entry.id)).toEqual(["b"]);
    expect(filterEntries(entries, "")).toHaveLength(3);
  });
});

describe("paginateEntries", () => {
  it("returns total pages and clamps page out of range", () => {
    const result = paginateEntries(entries, 7, 2);

    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(2);
    expect(result.pageItems.map((entry) => entry.id)).toEqual(["c"]);
  });
});

describe("buildRankMap", () => {
  it("does not mutate source array and returns rank map", () => {
    const copy = [...entries];
    const map = buildRankMap(copy);

    expect(copy.map((entry) => entry.id)).toEqual(entries.map((entry) => entry.id));
    expect(map.get("b")).toBe(1);
    expect(map.get("a")).toBe(2);
  });
});

describe("format helpers", () => {
  it("formats cost, latency, and context", () => {
    expect(formatCost(1.25)).toBe("$1.25/1M");
    expect(formatLatency(534.7)).toBe("535 ms");
    expect(formatContextWindow(128000)).toBe("128k");
  });
});
