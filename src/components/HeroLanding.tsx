import type { LeaderboardEntry } from "@/types/leaderboard";

interface HeroLandingProps {
  topTenCount: number;
  bestModel: LeaderboardEntry | undefined;
  onOpenFull: () => void;
}

export function HeroLanding({ topTenCount, bestModel, onOpenFull }: HeroLandingProps) {
  return (
    <header className="hero-landing" aria-labelledby="llm-leaderboard-title">
      <p className="eyebrow">LLM Benchmark Index</p>
      <h1 id="llm-leaderboard-title">Rank LLMs with a simple, trusted score.</h1>
      <p className="hero-copy">
        Compare model quality, cost, and latency in one clean leaderboard designed for fast model
        selection.
      </p>

      <div className="hero-kpis" role="list" aria-label="Benchmark highlights">
        <p role="listitem">
          <span>Models tracked</span>
          <strong>{topTenCount}+</strong>
        </p>
        <p role="listitem">
          <span>Top model</span>
          <strong>{bestModel?.modelName ?? "-"}</strong>
        </p>
        <p role="listitem">
          <span>Updated</span>
          <strong>{bestModel ? "Today" : "-"}</strong>
        </p>
      </div>

      <div className="hero-actions">
        <button type="button" className="button button-primary" onClick={onOpenFull}>
          View Full Rankings
        </button>
      </div>
    </header>
  );
}
