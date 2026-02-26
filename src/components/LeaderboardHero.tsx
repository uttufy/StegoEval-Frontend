interface LeaderboardHeroProps {
  onExploreRanking: () => void;
}

const CATEGORIES = ["All", "Agentic", "Safety", "Frontier"];

export function LeaderboardHero({ onExploreRanking }: LeaderboardHeroProps) {
  return (
    <section className="leaderboard-hero" aria-labelledby="hero-title">
      <div className="hero-topbar">
        <div className="hero-brand">
          <span className="brand-mark" aria-hidden>
            ◉
          </span>
          <p>Steganography Leaderboard</p>
        </div>

        <nav className="hero-tabs" aria-label="Leaderboard categories">
          {CATEGORIES.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`hero-tab ${index === 0 ? "is-active" : ""}`}
              aria-pressed={index === 0}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div className="hero-main">
        <div>
          <p className="hero-kicker">Stego Benchmark Surface</p>
          <h1 id="hero-title">Steganography Algorithm Leaderboard</h1>
          <p className="hero-copy">
            Discover, compare, and track steganography algorithms with one clean view of PSNR, BER,
            payload capacity, and runtime.
          </p>
          <button type="button" className="button button-primary hero-cta" onClick={onExploreRanking}>
            Start Exploring →
          </button>
        </div>

        <aside>
          <p>
            These ranking cards evaluate imperceptibility, extraction reliability, payload capacity,
            and runtime across consistent StegoEval benchmark profiles.
          </p>
        </aside>
      </div>
    </section>
  );
}
