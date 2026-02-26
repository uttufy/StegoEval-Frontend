"use client";

import React from "react";
import {
  formatBer,
  formatLastEvaluated,
  formatPayload,
  formatPsnr,
  formatRecoveryRate,
  formatRuntime,
  formatSsim
} from "@/lib/leaderboard";
import Link from "next/link";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useState } from "react";
import { AttackScoresDetailRow } from "@/components/AttackScoresDetailRow";

export type RankTrend = "up" | "down" | "flat";

interface GlobalRankingTableProps {
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

function trendGlyph(trend: RankTrend): string {
  if (trend === "up") {
    return "↑";
  }

  if (trend === "down") {
    return "↓";
  }

  return "•";
}

export function GlobalRankingTable({ entries, rankById, trendById }: GlobalRankingTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const hasAttackScores = entries.some(entry =>
    entry.compressionScore !== undefined ||
    entry.blurScore !== undefined ||
    entry.noiseScore !== undefined ||
    entry.geometricScore !== undefined ||
    entry.capacityScore !== undefined
  );

  return (
    <section className="ranking-table-wrap" aria-label="Global ranking table">
      <table>
        <caption className="sr-only">Global ranking table for steganography algorithms</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Algorithm</th>
            <th scope="col">PSNR (dB)</th>
            <th scope="col">SSIM</th>
            <th scope="col">Payload (bpp)</th>
            <th scope="col">BER</th>
            <th scope="col">Recovery Rate</th>
            <th scope="col">Runtime</th>
            <th scope="col">Composite</th>
            {hasAttackScores && <th scope="col" className="toggle-col"></th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const rank = rankById.get(entry.id) ?? 0;
            const trend = trendById.get(entry.id) ?? "flat";
            const isExpanded = expandedRowId === entry.id;

            const entryHasAttackScores =
              entry.compressionScore !== undefined ||
              entry.blurScore !== undefined ||
              entry.noiseScore !== undefined ||
              entry.geometricScore !== undefined ||
              entry.capacityScore !== undefined;

            return (
              <React.Fragment key={entry.id}>
                <tr className={rank === 1 ? "is-top" : ""}>
                  <td>
                    <div className="rank-cell">
                      <span className={`trend trend-${trend}`} aria-label={`Trend ${trend}`}>
                        {trendGlyph(trend)}
                      </span>
                      <span>{rank}</span>
                    </div>
                  </td>
                  <td>
                    <div className="model-cell">
                      <span className="provider-chip">{profileInitials(entry.datasetProfile)}</span>
                      <div>
                        <Link href={`/technique/${encodeURIComponent(entry.algorithmName)}`} className="algorithm-link">
                          <strong>{entry.algorithmName}</strong>
                        </Link>
                        <small>
                          {entry.datasetProfile} · Last eval {formatLastEvaluated(entry.lastEvaluatedIso)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{formatPsnr(entry.psnrDb)}</td>
                  <td>{formatSsim(entry.ssim)}</td>
                  <td>{formatPayload(entry.payloadBpp)}</td>
                  <td>{formatBer(entry.ber)}</td>
                  <td>{formatRecoveryRate(entry.recoveryRate)}</td>
                  <td>{formatRuntime(entry.runtimeMs)}</td>
                  <td className="emphasis">{entry.compositeScore.toFixed(1)}</td>
                  {hasAttackScores && (
                    <td className="toggle-col">
                      {entryHasAttackScores && (
                        <button
                          type="button"
                          className="toggle-details-btn"
                          onClick={() => toggleRow(entry.id)}
                          aria-label={isExpanded ? "Hide attack scores" : "Show attack scores"}
                        >
                          {isExpanded ? "▼" : "▶"}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
                <AttackScoresDetailRow
                  entry={entry}
                  isExpanded={isExpanded}
                  colSpan={hasAttackScores ? 10 : 9}
                />
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
