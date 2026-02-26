import { formatBer, formatPayload, formatRuntime } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface TopTenSnapshotProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
  onOpenFull: () => void;
}

export function TopTenSnapshot({ entries, rankById, onOpenFull }: TopTenSnapshotProps) {
  return (
    <section className="snapshot" aria-label="Top 10 algorithm snapshot">
      <div className="snapshot-head">
        <h3>Top 10 Snapshot</h3>
        <button type="button" className="button button-secondary" onClick={onOpenFull}>
          View Full Rankings
        </button>
      </div>

      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <p>
              <span>#{rankById.get(entry.id) ?? "-"}</span>
              <strong>{entry.algorithmName}</strong>
              <small>{entry.datasetProfile}</small>
            </p>
            <p>
              <span>Score {entry.compositeScore.toFixed(1)}</span>
              <span>BER {formatBer(entry.ber)}</span>
              <span>{formatPayload(entry.payloadBpp)}</span>
              <span>{formatRuntime(entry.runtimeMs)}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
