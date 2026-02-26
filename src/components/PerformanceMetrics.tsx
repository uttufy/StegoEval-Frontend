"use client";

import { formatPsnr, formatBer, formatPayload, formatRuntime, formatSsim, formatRecoveryRate } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useStaggeredIntersection } from "@/hooks/useIntersectionObserver";
import { useMemo } from "react";

export interface PerformanceMetricsProps {
  entry: LeaderboardEntry;
}

interface MetricCard {
  key: string;
  label: string;
  value: string;
  color: string;
  delay: number;
}

export function PerformanceMetrics({ entry }: PerformanceMetricsProps) {
  const psnrCard = useStaggeredIntersection<HTMLDivElement>(0);
  const ssimCard = useStaggeredIntersection<HTMLDivElement>(80);
  const berCard = useStaggeredIntersection<HTMLDivElement>(160);
  const payloadCard = useStaggeredIntersection<HTMLDivElement>(240);
  const recoveryCard = useStaggeredIntersection<HTMLDivElement>(320);
  const runtimeCard = useStaggeredIntersection<HTMLDivElement>(400);

  const metrics: MetricCard[] = useMemo(() => [
    {
      key: "psnr",
      label: "PSNR",
      value: formatPsnr(entry.psnrDb),
      color: "#3b82f6",
      delay: 0,
    },
    {
      key: "ssim",
      label: "SSIM",
      value: formatSsim(entry.ssim),
      color: "#31c99d",
      delay: 80,
    },
    {
      key: "ber",
      label: "BER",
      value: formatBer(entry.ber),
      color: "#ef4444",
      delay: 160,
    },
    {
      key: "payload",
      label: "Payload",
      value: formatPayload(entry.payloadBpp),
      color: "#8b5cf6",
      delay: 240,
    },
    {
      key: "recovery",
      label: "Recovery",
      value: formatRecoveryRate(entry.recoveryRate),
      color: "#10b981",
      delay: 320,
    },
    {
      key: "runtime",
      label: "Runtime",
      value: formatRuntime(entry.runtimeMs),
      color: "#f59e0b",
      delay: 400,
    },
  ], [entry]);

  function MetricCard({ metric, ref, show }: { metric: MetricCard; ref: React.RefObject<HTMLDivElement | null>; show: boolean }) {
    return (
      <div
        ref={ref}
        className={`metric-ring-compact ${show ? "is-visible" : ""}`}
        style={{ animationDelay: `${metric.delay}ms` }}
      >
        <div className="metric-ring-content">
          <span className="metric-ring-value" style={{ color: metric.color }}>
            {metric.value}
          </span>
          <span className="metric-ring-label">{metric.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-rings-grid">
      <MetricCard metric={metrics[0]} ref={psnrCard.ref} show={psnrCard.show} />
      <MetricCard metric={metrics[1]} ref={ssimCard.ref} show={ssimCard.show} />
      <MetricCard metric={metrics[2]} ref={berCard.ref} show={berCard.show} />
      <MetricCard metric={metrics[3]} ref={payloadCard.ref} show={payloadCard.show} />
      <MetricCard metric={metrics[4]} ref={recoveryCard.ref} show={recoveryCard.show} />
      <MetricCard metric={metrics[5]} ref={runtimeCard.ref} show={runtimeCard.show} />
    </div>
  );
}
