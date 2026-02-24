import { formatCost, formatLatency } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

import type { RankTrend } from "@/components/GlobalRankingTable";

interface LeaderboardCardsMobileProps {
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

export function LeaderboardCardsMobile({ entries, rankById, trendById }: LeaderboardCardsMobileProps) {
  return (
    <section className="mobile-cards" aria-label="Global ranking cards">
      {entries.map((entry) => {
        const rank = rankById.get(entry.id) ?? 0;
        const trend = trendById.get(entry.id) ?? "flat";

        return (
          <article key={entry.id}>
            <header>
              <p>
                <span className={`trend trend-${trend}`}>{trend === "up" ? "↑" : trend === "down" ? "↓" : "•"}</span>
                <strong>{rank}</strong>
              </p>
              <div className="model-cell-head">
                <span className="provider-chip">{providerInitials(entry.provider)}</span>
                <div>
                  <h4>{entry.modelName}</h4>
                  <small>{entry.provider}</small>
                </div>
              </div>
              <strong>{entry.compositeScore.toFixed(1)}</strong>
            </header>

            <dl>
              <div>
                <dt>Quality</dt>
                <dd>{entry.qualityScore.toFixed(1)}</dd>
              </div>
              <div>
                <dt>Latency</dt>
                <dd>{formatLatency(entry.latencyMs)}</dd>
              </div>
              <div>
                <dt>Input</dt>
                <dd>{formatCost(entry.costPer1MInput)}</dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>{formatCost(entry.costPer1MOutput)}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </section>
  );
}
