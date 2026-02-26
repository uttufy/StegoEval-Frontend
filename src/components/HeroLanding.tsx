import type { LeaderboardEntry } from "@/types/leaderboard";

interface HeroLandingProps {
  topTenCount: number;
  bestAlgorithm: LeaderboardEntry | undefined;
  onOpenFull: () => void;
}

export function HeroLanding({ topTenCount, bestAlgorithm, onOpenFull }: HeroLandingProps) {
  return (
    <header className="hero-landing" aria-labelledby="stego-leaderboard-title">
      <p className="eyebrow">Steganography Benchmark Index</p>
      <h1 id="stego-leaderboard-title">Rank steganography algorithms with a trusted score.</h1>
      <p className="hero-copy">
        Compare PSNR, BER, payload, and runtime in one clean leaderboard designed for fast
        algorithm selection.
      </p>

      <div className="hero-kpis" role="list" aria-label="Benchmark highlights">
        <p role="listitem">
          <span>Algorithms tracked</span>
          <strong>{topTenCount}+</strong>
        </p>
        <p role="listitem">
          <span>Top algorithm</span>
          <strong>{bestAlgorithm?.algorithmName ?? "-"}</strong>
        </p>
        <p role="listitem">
          <span>Updated</span>
          <strong>{bestAlgorithm ? "Today" : "-"}</strong>
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
