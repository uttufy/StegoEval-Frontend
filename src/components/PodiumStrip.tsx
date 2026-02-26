import type { LeaderboardEntry } from "@/types/leaderboard";

interface PodiumStripProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
}

export function PodiumStrip({ entries, rankById }: PodiumStripProps) {
  return (
    <section className="podium-strip" aria-label="Top 3 algorithms">
      {entries.map((entry) => {
        const rank = rankById.get(entry.id) ?? "-";
        return (
          <article key={entry.id} className="podium-item">
            <p className="podium-rank">#{rank}</p>
            <h2>{entry.algorithmName}</h2>
            <p>{entry.datasetProfile}</p>
            <strong>{entry.compositeScore.toFixed(1)}</strong>
          </article>
        );
      })}
    </section>
  );
}
