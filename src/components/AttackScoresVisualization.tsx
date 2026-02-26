"use client";

import { formatAttackScore } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useEffect, useState } from "react";

export interface AttackScoresVisualizationProps {
  entry: LeaderboardEntry;
}

interface AttackScoreItem {
  key: keyof LeaderboardEntry;
  label: string;
  score?: number;
}

export function AttackScoresVisualization({ entry }: AttackScoresVisualizationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const attacks: AttackScoreItem[] = [
    { key: "compressionScore", label: "Compression", score: entry.compressionScore },
    { key: "blurScore", label: "Blur / Filtering", score: entry.blurScore },
    { key: "noiseScore", label: "Noise", score: entry.noiseScore },
    { key: "geometricScore", label: "Geometric", score: entry.geometricScore },
    { key: "capacityScore", label: "Capacity", score: entry.capacityScore },
  ].filter((attack) => attack.score !== undefined) as AttackScoreItem[];

  const getScoreColor = (score: number): string => {
    if (score >= 95) return "var(--mint-1)";
    if (score >= 90) return "#f5a623";
    return "#ef4444";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 95) return "Excellent";
    if (score >= 90) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="attack-scores-visualization">
      {attacks.map((attack, index) => (
        <div
          key={attack.key}
          className={`attack-score-row metric-fade ${isLoaded ? "is-visible" : ""}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="attack-header">
            <span className="attack-label">{attack.label}</span>
            <span className="attack-score" style={{ color: getScoreColor(attack.score!) }}>
              {formatAttackScore(attack.score)}
            </span>
          </div>
          <div className="attack-bar-container">
            <div
              className={`attack-bar-fill ${isLoaded ? "is-filled" : ""}`}
              style={{
                width: `${attack.score}%`,
                backgroundColor: getScoreColor(attack.score!),
              }}
            />
          </div>
          <div className="attack-footer">
            <span className="attack-status" style={{ color: getScoreColor(attack.score!) }}>
              {getScoreLabel(attack.score!)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
