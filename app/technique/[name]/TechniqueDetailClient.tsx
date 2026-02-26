"use client";

import Link from "next/link";
import { formatLastEvaluated } from "@/lib/leaderboard";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { AttackScoresVisualization } from "@/components/AttackScoresVisualization";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useEffect, useState } from "react";

export interface TechniqueDetailClientProps {
  entry: LeaderboardEntry;
  rank: number;
}

function profileInitials(profile: string): string {
  const words = profile.trim().split(/[\s-]+/).filter(Boolean);
  if (!words.length) {
    return "SP";
  }
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function TechniqueDetailClient({ entry, rank }: TechniqueDetailClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const hasAttackScores =
    entry.compressionScore !== undefined ||
    entry.blurScore !== undefined ||
    entry.noiseScore !== undefined ||
    entry.geometricScore !== undefined ||
    entry.capacityScore !== undefined;

  return (
    <div className="technique-detail-page">
      <nav className="back-nav">
        <Link href="/" className="back-link">
          <span className="back-icon">&larr;</span>
          <span>Back to Leaderboard</span>
        </Link>
      </nav>

      <header className="technique-header">
        <div className="header-left">
          <Link href="/" className="rank-badge">
            <span className="rank-label">Rank</span>
            <span className="rank-number">{rank}</span>
          </Link>
          <div className="algorithm-info">
            <h1 className="algorithm-name">{entry.algorithmName}</h1>
            <div className="algorithm-meta">
              <span className="provider-chip">{profileInitials(entry.datasetProfile)}</span>
              <span className="dataset-name">{entry.datasetProfile}</span>
              {entry.algorithmFamily && (
                <>
                  <span className="separator">&middot;</span>
                  <span className="family-name">{entry.algorithmFamily}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`metric-hero ${isLoaded ? "is-loaded" : ""}`}>
          <div className="hero-score">
            <span className="score-value">{entry.compositeScore.toFixed(1)}</span>
            <span className="score-label">Composite Score</span>
          </div>
          <div className="hero-meta">
            <div className="meta-item">
              <span className="meta-label">Last Evaluated</span>
              <span className="meta-value">{formatLastEvaluated(entry.lastEvaluatedIso)}</span>
            </div>
          </div>
        </div>
      </header>

      {entry.description && (
        <section className="info-section">
          <h2 className="section-title">About This Algorithm</h2>
          <div className="info-card">
            <p className="info-description">{entry.description}</p>
          </div>
        </section>
      )}

      <section className="metrics-section">
        <h2 className="section-title">Performance Metrics</h2>
        <PerformanceMetrics entry={entry} />
      </section>

      {hasAttackScores && (
        <section className="attack-scores-section">
          <h2 className="section-title">Attack Performance Breakdown</h2>
          <AttackScoresVisualization entry={entry} />
        </section>
      )}

      <section className="details-section">
        <h2 className="section-title">Technique Details</h2>
        <div className="details-card">
          <div className="detail-row">
            <span className="detail-label">Algorithm ID</span>
            <span className="detail-value">{entry.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dataset Profile</span>
            <span className="detail-value">{entry.datasetProfile}</span>
          </div>
          {entry.algorithmFamily && (
            <div className="detail-row">
              <span className="detail-label">Algorithm Family</span>
              <span className="detail-value">{entry.algorithmFamily}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Runtime</span>
            <span className="detail-value">{Math.round(entry.runtimeMs)} ms</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Evaluated</span>
            <span className="detail-value">{formatLastEvaluated(entry.lastEvaluatedIso)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
