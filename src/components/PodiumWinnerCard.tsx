import { formatBer, formatPayload } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface PodiumWinnerCardProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
}

export function PodiumWinnerCard({ entries, rankById }: PodiumWinnerCardProps) {
  const ranked = [...entries].sort((a, b) => (rankById.get(a.id) ?? 99) - (rankById.get(b.id) ?? 99));
  const byRank = new Map(ranked.map((entry) => [rankById.get(entry.id), entry]));
  const winner = byRank.get(1);
  const ordered = [byRank.get(2), byRank.get(1), byRank.get(3)].filter(
    (entry): entry is LeaderboardEntry => Boolean(entry)
  );
  const trophyByRank: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉"
  };

  return (
    <section className="podium-card" aria-label="Top podium">
      <h2>Leaderboard Winners</h2>
      <div className="podium-layout">
        {ordered.map((entry) => {
          const rank = rankById.get(entry.id) ?? 0;
          return (
            <article key={entry.id} className={`podium-column rank-${rank}`}>
              <div className="provider-badge" aria-hidden>
                {trophyByRank[rank] ?? "🏆"}
              </div>
              <p className="podium-name">{entry.algorithmName}</p>
              <p className="podium-rank">{rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}</p>
              <p className="podium-chip">
                {entry.compositeScore.toFixed(1)} PTS · BER {formatBer(entry.ber)} ·{" "}
                {formatPayload(entry.payloadBpp)}
              </p>
            </article>
          );
        })}
      </div>
      {winner && (
        <p className="podium-summary">
          <strong>{winner.algorithmName}</strong> wins the top spot for steganography performance.
        </p>
      )}
    </section>
  );
}
