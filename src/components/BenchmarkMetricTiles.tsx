import { formatCost, formatLastEvaluated, formatLatency } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface BenchmarkMetricTilesProps {
  entries: LeaderboardEntry[];
}

export function BenchmarkMetricTiles({ entries }: BenchmarkMetricTilesProps) {
  const modelCount = entries.length;
  const avgComposite = modelCount ? entries.reduce((sum, item) => sum + item.compositeScore, 0) / modelCount : 0;
  const avgQuality = modelCount ? entries.reduce((sum, item) => sum + item.qualityScore, 0) / modelCount : 0;
  const avgInputCost = modelCount
    ? entries.reduce((sum, item) => sum + item.costPer1MInput, 0) / modelCount
    : 0;
  const avgLatency = modelCount ? entries.reduce((sum, item) => sum + item.latencyMs, 0) / modelCount : 0;

  const bestValue = [...entries].sort((a, b) => {
    const left = a.qualityScore / Math.max(a.costPer1MInput, 0.0001);
    const right = b.qualityScore / Math.max(b.costPer1MInput, 0.0001);
    return right - left;
  })[0];

  const latest = [...entries].sort((a, b) => {
    return new Date(b.lastEvaluatedIso).getTime() - new Date(a.lastEvaluatedIso).getTime();
  })[0];

  return (
    <section className="metric-strip" aria-label="Your metrics">
      <h2>Your Metrics</h2>
      <div className="metric-grid">
        <article className="metric-card card-slate">
          <strong>{modelCount}</strong>
          <p>Models Tracked</p>
        </article>
        <article className="metric-card card-sand">
          <strong>{avgComposite.toFixed(1)}</strong>
          <p>Avg Composite</p>
        </article>
        <article className="metric-card card-sand">
          <strong>{avgQuality.toFixed(1)}</strong>
          <p>Avg Quality</p>
        </article>
        <article className="metric-card card-blue">
          <strong>{formatCost(avgInputCost)}</strong>
          <p>Avg Input Cost</p>
        </article>
        <article className="metric-card card-slate">
          <strong>{formatLatency(avgLatency)}</strong>
          <p>Avg Latency</p>
        </article>
        <article className="metric-card card-mint">
          <strong>{bestValue?.modelName ?? "-"}</strong>
          <p>Best Value Model</p>
        </article>
        <article className="metric-card card-mint">
          <strong>{latest ? formatLastEvaluated(latest.lastEvaluatedIso) : "-"}</strong>
          <p>Freshest Evaluation</p>
        </article>
      </div>
    </section>
  );
}
