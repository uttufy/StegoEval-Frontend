import {
  formatCost,
  formatLastEvaluated,
  formatLatency
} from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

export type RankTrend = "up" | "down" | "flat";

interface GlobalRankingTableProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
  trendById: Map<string, RankTrend>;
}

function providerInitials(provider: string): string {
  const words = provider.trim().split(/\s+/).filter(Boolean);
  if (!words.length) {
    return "AI";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function trendGlyph(trend: RankTrend): string {
  if (trend === "up") {
    return "↑";
  }

  if (trend === "down") {
    return "↓";
  }

  return "•";
}

export function GlobalRankingTable({ entries, rankById, trendById }: GlobalRankingTableProps) {
  return (
    <section className="ranking-table-wrap" aria-label="Global ranking table">
      <table>
        <caption className="sr-only">Global ranking table for LLM models</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Model</th>
            <th scope="col">Quality</th>
            <th scope="col">Latency</th>
            <th scope="col">Input Cost</th>
            <th scope="col">Output Cost</th>
            <th scope="col">Composite</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const rank = rankById.get(entry.id) ?? 0;
            const trend = trendById.get(entry.id) ?? "flat";

            return (
              <tr key={entry.id} className={rank === 1 ? "is-top" : ""}>
                <td>
                  <div className="rank-cell">
                    <span className={`trend trend-${trend}`} aria-label={`Trend ${trend}`}>
                      {trendGlyph(trend)}
                    </span>
                    <span>{rank}</span>
                  </div>
                </td>
                <td>
                  <div className="model-cell">
                    <span className="provider-chip">{providerInitials(entry.provider)}</span>
                    <div>
                      <strong>{entry.modelName}</strong>
                      <small>
                        {entry.provider} · Last eval {formatLastEvaluated(entry.lastEvaluatedIso)}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{entry.qualityScore.toFixed(1)}</td>
                <td>{formatLatency(entry.latencyMs)}</td>
                <td>{formatCost(entry.costPer1MInput)}</td>
                <td>{formatCost(entry.costPer1MOutput)}</td>
                <td className="emphasis">{entry.compositeScore.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
