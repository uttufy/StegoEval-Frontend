import {
  formatBer,
  formatLastEvaluated,
  formatPayload,
  formatPsnr,
  formatRuntime
} from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardTableDesktopProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
}

export function LeaderboardTableDesktop({ entries, rankById }: LeaderboardTableDesktopProps) {
  return (
    <section className="desktop-table" aria-label="Steganography ranking table">
      <table>
        <caption className="sr-only">Steganography leaderboard table</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Algorithm</th>
            <th scope="col">Dataset Profile</th>
            <th scope="col">Composite</th>
            <th scope="col">PSNR (dB)</th>
            <th scope="col">BER</th>
            <th scope="col">Payload</th>
            <th scope="col">Runtime</th>
            <th scope="col">Last Evaluated</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>#{rankById.get(entry.id) ?? "-"}</td>
              <td>{entry.algorithmName}</td>
              <td>{entry.datasetProfile}</td>
              <td>{entry.compositeScore.toFixed(1)}</td>
              <td>{formatPsnr(entry.psnrDb)}</td>
              <td>{formatBer(entry.ber)}</td>
              <td>{formatPayload(entry.payloadBpp)}</td>
              <td>{formatRuntime(entry.runtimeMs)}</td>
              <td>{formatLastEvaluated(entry.lastEvaluatedIso)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
