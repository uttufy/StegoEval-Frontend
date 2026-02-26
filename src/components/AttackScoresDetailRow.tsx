"use client";

import { useState } from "react";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { formatAttackScore } from "@/lib/leaderboard";

interface AttackScoresDetailRowProps {
  entry: LeaderboardEntry;
  isExpanded: boolean;
  colSpan: number;
}

interface ScoreCardProps {
  label: string;
  value: number | undefined;
  index: number;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  onMouseLeave: () => void;
}

function ScoreCard({ label, value, index, onMouseMove, onMouseLeave }: ScoreCardProps) {
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
    onMouseMove(e, index);
  };

  const handleMouseLeave = () => {
    setMousePos({ x: '50%', y: '50%' });
    onMouseLeave();
  };

  return (
    <div
      className="attack-score-item"
      style={{ '--mouse-x': mousePos.x, '--mouse-y': mousePos.y } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <dt>{label}</dt>
      <dd>{formatAttackScore(value)}</dd>
    </div>
  );
}

export function AttackScoresDetailRow({ entry, isExpanded, colSpan }: AttackScoresDetailRowProps) {
  const hasAttackScores =
    entry.compressionScore !== undefined ||
    entry.blurScore !== undefined ||
    entry.noiseScore !== undefined ||
    entry.geometricScore !== undefined ||
    entry.capacityScore !== undefined;

  if (!isExpanded || !hasAttackScores) return null;

  const scores = [
    { label: "Compression", value: entry.compressionScore },
    { label: "Blur/Filtering", value: entry.blurScore },
    { label: "Noise", value: entry.noiseScore },
    { label: "Geometric", value: entry.geometricScore },
    { label: "Capacity", value: entry.capacityScore }
  ];

  return (
    <tr className="attack-detail-row">
      <td colSpan={colSpan}>
        <div className="attack-detail-content">
          <h4>Attack Performance Breakdown</h4>
          <dl className="attack-scores-grid">
            {scores.map((score, index) => (
              <ScoreCard
                key={score.label}
                label={score.label}
                value={score.value}
                index={index}
                onMouseMove={() => {}}
                onMouseLeave={() => {}}
              />
            ))}
          </dl>
        </div>
      </td>
    </tr>
  );
}
