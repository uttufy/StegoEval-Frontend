"use client";

import { formatAttackScore } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useState, useMemo } from "react";

export interface AttackRadarChartProps {
  entry: LeaderboardEntry;
}

interface AttackPoint {
  key: keyof LeaderboardEntry;
  label: string;
  score?: number;
  angle: number;
}

export function AttackRadarChart({ entry }: AttackRadarChartProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const attacks: AttackPoint[] = useMemo(() => [
    { key: "compressionScore", label: "Compression", score: entry.compressionScore, angle: -90 },
    { key: "blurScore", label: "Blur", score: entry.blurScore, angle: -18 },
    { key: "noiseScore", label: "Noise", score: entry.noiseScore, angle: 54 },
    { key: "geometricScore", label: "Geometric", score: entry.geometricScore, angle: 126 },
    { key: "capacityScore", label: "Capacity", score: entry.capacityScore, angle: 198 },
  ].filter((attack) => attack.score !== undefined) as AttackPoint[], [entry]);

  const getScoreColor = (score: number): string => {
    if (score >= 95) return "#31c99d";
    if (score >= 90) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 95) return "Excellent";
    if (score >= 90) return "Good";
    return "Needs Improvement";
  };

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;

  const polarToCartesian = (angle: number, radius: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  const getPoints = () => {
    return attacks.map((attack) => {
      const radius = (attack.score! / 100) * maxRadius;
      const point = polarToCartesian(attack.angle, radius);
      return `${point.x},${point.y}`;
    }).join(" ");
  };

  const getBackgroundRings = () => {
    const levels = [0.25, 0.5, 0.75, 1];
    return levels.map((level, i) => {
      const points = attacks.map((attack) => {
        const radius = level * maxRadius;
        const point = polarToCartesian(attack.angle, radius);
        return `${point.x},${point.y}`;
      }).join(" ");
      return <polygon key={i} points={points} fill="none" stroke="var(--slate-2)" strokeWidth="0.5" opacity="0.5" />;
    });
  };

  const getAxisLines = () => {
    return attacks.map((attack) => {
      const point = polarToCartesian(attack.angle, maxRadius);
      return <line key={attack.key} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="var(--slate-2)" strokeWidth="0.5" opacity="0.5" />;
    });
  };

  const getDataPoints = () => {
    return attacks.map((attack) => {
      const radius = (attack.score! / 100) * maxRadius;
      const point = polarToCartesian(attack.angle, radius);
      return (
        <circle
          key={attack.key}
          cx={point.x}
          cy={point.y}
          r="6"
          fill={getScoreColor(attack.score!)}
          className="radar-point"
          onMouseEnter={() => setHoveredPoint(attack.key)}
          onMouseLeave={() => setHoveredPoint(null)}
        />
      );
    });
  };

  const getLabels = () => {
    return attacks.map((attack) => {
      const labelRadius = maxRadius + 25;
      const point = polarToCartesian(attack.angle, labelRadius);
      const isHovered = hoveredPoint === attack.key;
      return (
        <g key={attack.key}>
          <text
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`radar-label ${isHovered ? "is-hovered" : ""}`}
            fill={isHovered ? getScoreColor(attack.score!) : "var(--muted)"}
          >
            {attack.label}
          </text>
        </g>
      );
    });
  };

  const avgScore = attacks.reduce((sum, a) => sum + a.score!, 0) / attacks.length;
  const overallColor = getScoreColor(avgScore);

  return (
    <div ref={ref} className="attack-radar-container">
      <svg
        className="radar-chart"
        viewBox="0 0 300 300"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
      >
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={overallColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={overallColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={overallColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={overallColor} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <circle cx={centerX} cy={centerY} r={maxRadius + 40} fill="url(#radarGlow)" className="radar-glow" />

        {getBackgroundRings()}
        {getAxisLines()}

        <polygon
          points={getPoints()}
          fill={`url(#radarFill)`}
          stroke={overallColor}
          strokeWidth="2"
          className={`radar-polygon ${isVisible ? "is-visible" : ""}`}
          style={{
            opacity: isVisible ? 0.4 : 0,
            transition: isVisible ? "opacity 800ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
          }}
        />

        {getDataPoints()}
        {getLabels()}
      </svg>

      <div className="radar-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#31c99d" }} />
          <span>Excellent (95+)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#f59e0b" }} />
          <span>Good (90+)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#ef4444" }} />
          <span>Improvement (&lt;90)</span>
        </div>
      </div>

      {hoveredPoint && (
        <div
          className="radar-tooltip"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
          }}
        >
          <div className="tooltip-title">
            {attacks.find((a) => a.key === hoveredPoint)?.label}
          </div>
          <div className="tooltip-score" style={{ color: getScoreColor(attacks.find((a) => a.key === hoveredPoint)?.score || 0) }}>
            {formatAttackScore(attacks.find((a) => a.key === hoveredPoint)?.score || 0)}
          </div>
          <div className="tooltip-status">
            {getScoreLabel(attacks.find((a) => a.key === hoveredPoint)?.score || 0)}
          </div>
        </div>
      )}
    </div>
  );
}
