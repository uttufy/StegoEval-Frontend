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
          <p>LLM Leaderboards</p>
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
          <p className="hero-kicker">Frontier Evaluation Surface</p>
          <h1 id="hero-title">LLM Leaderboards</h1>
          <p className="hero-copy">
            Discover, compare, and track leading models with one clean view of quality, latency,
            and cost.
          </p>
          <button type="button" className="button button-primary hero-cta" onClick={onExploreRanking}>
            Start Exploring →
          </button>
        </div>

        <aside>
          <p>
            SEAL-inspired ranking cards evaluate agentic, frontier, and safety model performance
            using clear benchmark criteria and practical cost-speed tradeoffs.
          </p>
        </aside>
      </div>
    </section>
  );
}
