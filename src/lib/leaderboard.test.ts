import {
  baseRankComparator,
  buildRankMap,
  filterEntries,
  formatBer,
  formatPayload,
  formatPsnr,
  formatRuntime,
  paginateEntries,
  sortEntries
} from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

const entries: LeaderboardEntry[] = [
  {
    id: "a",
    algorithmName: "HUGO",
    datasetProfile: "BOSSBase-256",
    algorithmFamily: "Spatial",
    compositeScore: 95,
    psnrDb: 43.1,
    ber: 0.010,
    payloadBpp: 0.40,
    runtimeMs: 130,
    lastEvaluatedIso: "2026-02-24T10:00:00.000Z",
    ssim: 0.98,
    recoveryRate: 95.0
  },
  {
    id: "b",
    algorithmName: "S-UNIWARD",
    datasetProfile: "BOSSBase-512",
    algorithmFamily: "Spatial",
    compositeScore: 95,
    psnrDb: 43.1,
    ber: 0.009,
    payloadBpp: 0.38,
    runtimeMs: 120,
    lastEvaluatedIso: "2026-02-24T11:00:00.000Z",
    ssim: 0.98,
    recoveryRate: 95.5
  },
  {
    id: "c",
    algorithmName: "SteganoGAN",
    datasetProfile: "DIV2K-Color",
    algorithmFamily: "GAN",
    compositeScore: 90,
    psnrDb: 41.0,
    ber: 0.015,
    payloadBpp: 0.72,
    runtimeMs: 240,
    lastEvaluatedIso: "2026-02-20T10:00:00.000Z",
    ssim: 0.96,
    recoveryRate: 88.0
  }
];

describe("baseRankComparator", () => {
  it("applies steganography tie-breakers deterministically", () => {
    const sorted = [...entries].sort(baseRankComparator);
    expect(sorted.map((entry) => entry.id)).toEqual(["b", "a", "c"]);
  });
});

describe("sortEntries", () => {
  it("sorts by each key in descending and ascending order", () => {
    expect(sortEntries(entries, "compositeScore", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "compositeScore", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "psnrDb", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "psnrDb", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "ber", "asc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "ber", "desc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "payloadBpp", "desc")[0]?.id).toBe("c");
    expect(sortEntries(entries, "payloadBpp", "asc")[0]?.id).toBe("b");

    expect(sortEntries(entries, "lastEvaluated", "desc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "lastEvaluated", "asc")[0]?.id).toBe("c");

    expect(sortEntries(entries, "rank", "asc")[0]?.id).toBe("b");
    expect(sortEntries(entries, "rank", "desc")[0]?.id).toBe("c");
  });
});

describe("filterEntries", () => {
  it("matches algorithm name and dataset profile case-insensitively", () => {
    expect(filterEntries(entries, "hugo").map((entry) => entry.id)).toEqual(["a"]);
    expect(filterEntries(entries, "bossbase").map((entry) => entry.id)).toEqual(["a", "b"]);
    expect(filterEntries(entries, "gan").map((entry) => entry.id)).toEqual(["c"]);
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
  it("formats psnr, ber, payload, and runtime", () => {
    expect(formatPsnr(43.14)).toBe("43.1 dB");
    expect(formatBer(0.0124)).toBe("0.012");
    expect(formatPayload(0.418)).toBe("0.42 bpp");
    expect(formatRuntime(534.7)).toBe("535 ms");
  });
});
