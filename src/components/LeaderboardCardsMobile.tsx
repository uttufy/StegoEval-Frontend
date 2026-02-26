"use client";

import { formatBer, formatPayload, formatPsnr, formatRecoveryRate, formatRuntime, formatSsim, formatAttackScore } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useState } from "react";

import type { RankTrend } from "@/components/GlobalRankingTable";

interface LeaderboardCardsMobileProps {
  entries: LeaderboardEntry[];
  rankById: Map<string, number>;
  trendById: Map<string, RankTrend>;
}

function profileInitials(profile: string): string {
  const words = profile.trim().split(/[\s-]+/).filter(Boolean);
  if (!words.length) {
    return "SP";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function LeaderboardCardsMobile({ entries, rankById, trendById }: LeaderboardCardsMobileProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hasAttackScores = entries.some(entry =>
    entry.compressionScore !== undefined ||
    entry.blurScore !== undefined ||
    entry.noiseScore !== undefined ||
    entry.geometricScore !== undefined ||
    entry.capacityScore !== undefined
  );

  return (
    <section className="mobile-cards" aria-label="Global ranking cards">
      {entries.map((entry) => {
        const rank = rankById.get(entry.id) ?? 0;
        const trend = trendById.get(entry.id) ?? "flat";
        const isExpanded = expandedId === entry.id;

        const entryHasAttackScores =
          entry.compressionScore !== undefined ||
          entry.blurScore !== undefined ||
          entry.noiseScore !== undefined ||
          entry.geometricScore !== undefined ||
          entry.capacityScore !== undefined;

        return (
          <article key={entry.id}>
            <header>
              <p>
                <span className={`trend trend-${trend}`}>{trend === "up" ? "↑" : trend === "down" ? "↓" : "•"}</span>
                <strong>{rank}</strong>
              </p>
              <div className="model-cell-head">
                <span className="provider-chip">{profileInitials(entry.datasetProfile)}</span>
                <div>
                  <h4>{entry.algorithmName}</h4>
                  <small>{entry.datasetProfile}</small>
                </div>
              </div>
              <strong>{entry.compositeScore.toFixed(1)}</strong>
            </header>

            <dl>
              <div>
                <dt>PSNR</dt>
                <dd>{formatPsnr(entry.psnrDb)}</dd>
              </div>
              <div>
                <dt>SSIM</dt>
                <dd>{formatSsim(entry.ssim)}</dd>
              </div>
              <div>
                <dt>Payload</dt>
                <dd>{formatPayload(entry.payloadBpp)}</dd>
              </div>
              <div>
                <dt>BER</dt>
                <dd>{formatBer(entry.ber)}</dd>
              </div>
              <div>
                <dt>Rec. Rate</dt>
                <dd>{formatRecoveryRate(entry.recoveryRate)}</dd>
              </div>
              <div>
                <dt>Runtime</dt>
                <dd>{formatRuntime(entry.runtimeMs)}</dd>
              </div>
            </dl>

            {hasAttackScores && entryHasAttackScores && (
              <button
                type="button"
                className="expand-attack-btn"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "▼ Hide Attack Scores" : "▶ Show Attack Scores"}
              </button>
            )}

            {isExpanded && entryHasAttackScores && (
              <div className="attack-scores-mobile">
                <h5>Attack Performance Breakdown</h5>
                <dl>
                  {entry.compressionScore !== undefined && (
                    <div>
                      <dt>Compression</dt>
                      <dd>{formatAttackScore(entry.compressionScore)}</dd>
                    </div>
                  )}
                  {entry.blurScore !== undefined && (
                    <div>
                      <dt>Blur/Filtering</dt>
                      <dd>{formatAttackScore(entry.blurScore)}</dd>
                    </div>
                  )}
                  {entry.noiseScore !== undefined && (
                    <div>
                      <dt>Noise</dt>
                      <dd>{formatAttackScore(entry.noiseScore)}</dd>
                    </div>
                  )}
                  {entry.geometricScore !== undefined && (
                    <div>
                      <dt>Geometric</dt>
                      <dd>{formatAttackScore(entry.geometricScore)}</dd>
                    </div>
                  )}
                  {entry.capacityScore !== undefined && (
                    <div>
                      <dt>Capacity</dt>
                      <dd>{formatAttackScore(entry.capacityScore)}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
