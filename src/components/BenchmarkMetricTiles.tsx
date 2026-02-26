import { formatBer, formatLastEvaluated, formatPayload, formatPsnr } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface BenchmarkMetricTilesProps {
  entries: LeaderboardEntry[];
}

export function BenchmarkMetricTiles({ entries }: BenchmarkMetricTilesProps) {
  const algorithmCount = entries.length;
  const avgComposite = algorithmCount
    ? entries.reduce((sum, item) => sum + item.compositeScore, 0) / algorithmCount
    : 0;
  const avgPsnr = algorithmCount ? entries.reduce((sum, item) => sum + item.psnrDb, 0) / algorithmCount : 0;
  const avgBer = algorithmCount ? entries.reduce((sum, item) => sum + item.ber, 0) / algorithmCount : 0;
  const avgPayload = algorithmCount
    ? entries.reduce((sum, item) => sum + item.payloadBpp, 0) / algorithmCount
    : 0;

  const bestOverall = [...entries].sort((a, b) => b.compositeScore - a.compositeScore)[0];

  const latest = [...entries].sort((a, b) => {
    return new Date(b.lastEvaluatedIso).getTime() - new Date(a.lastEvaluatedIso).getTime();
  })[0];

  return (
    <section className="metric-strip" aria-label="Your metrics">
      <h2>Your Metrics</h2>
      <div className="metric-grid">
        <article className="metric-card card-slate">
          <strong>{algorithmCount}</strong>
          <p>Algorithms Tracked</p>
        </article>
        <article className="metric-card card-sand">
          <strong>{avgComposite.toFixed(1)}</strong>
          <p>Avg Composite</p>
        </article>
        <article className="metric-card card-sand">
          <strong>{formatPsnr(avgPsnr)}</strong>
          <p>Avg PSNR</p>
        </article>
        <article className="metric-card card-blue">
          <strong>{formatBer(avgBer)}</strong>
          <p>Avg BER</p>
        </article>
        <article className="metric-card card-slate">
          <strong>{formatPayload(avgPayload)}</strong>
          <p>Avg Payload</p>
        </article>
        <article className="metric-card card-mint">
          <strong>{bestOverall?.algorithmName ?? "-"}</strong>
          <p>Best Overall Algorithm</p>
        </article>
        <article className="metric-card card-mint">
          <strong>{latest ? formatLastEvaluated(latest.lastEvaluatedIso) : "-"}</strong>
          <p>Freshest Evaluation</p>
        </article>
      </div>
    </section>
  );
}
