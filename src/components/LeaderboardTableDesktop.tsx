import {
  formatContextWindow,
  formatCost,
  formatLastEvaluated,
  formatLatency
} from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardTableDesktopProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
}

export function LeaderboardTableDesktop({ entries, rankById }: LeaderboardTableDesktopProps) {
  return (
    <section className="desktop-table" aria-label="LLM ranking table">
      <table>
        <caption className="sr-only">LLM leaderboard table</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Model</th>
            <th scope="col">Provider</th>
            <th scope="col">Composite</th>
            <th scope="col">Quality</th>
            <th scope="col">Input Cost</th>
            <th scope="col">Latency</th>
            <th scope="col">Context</th>
            <th scope="col">Last Evaluated</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>#{rankById.get(entry.id) ?? "-"}</td>
              <td>{entry.modelName}</td>
              <td>{entry.provider}</td>
              <td>{entry.compositeScore.toFixed(1)}</td>
              <td>{entry.qualityScore.toFixed(1)}</td>
              <td>{formatCost(entry.costPer1MInput)}</td>
              <td>{formatLatency(entry.latencyMs)}</td>
              <td>{formatContextWindow(entry.contextWindow)}</td>
              <td>{formatLastEvaluated(entry.lastEvaluatedIso)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
