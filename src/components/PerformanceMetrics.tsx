"use client";

import { formatPsnr, formatBer, formatPayload, formatRuntime, formatSsim, formatRecoveryRate } from "@/lib/leaderboard";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useEffect, useState } from "react";

export interface PerformanceMetricsProps {
  entry: LeaderboardEntry;
}

export function PerformanceMetrics({ entry }: PerformanceMetricsProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="performance-metrics-grid">
      <div className={`metric-card psnr-card metric-fade ${isLoaded ? "is-visible" : ""}`}>
        <div className="metric-icon psnr-icon">PS</div>
        <div className="metric-content">
          <span className="metric-value">{formatPsnr(entry.psnrDb)}</span>
          <span className="metric-label">PSNR</span>
        </div>
        <div className="metric-indicator psnr-indicator" style={{ width: `${(entry.psnrDb / 50) * 100}%` }} />
      </div>

      <div className={`metric-card ssim-card metric-fade ${isLoaded ? "is-visible" : ""}`} style={{ animationDelay: "50ms" }}>
        <div className="metric-icon ssim-icon">SS</div>
        <div className="metric-content">
          <span className="metric-value">{formatSsim(entry.ssim)}</span>
          <span className="metric-label">SSIM</span>
        </div>
        <div className="metric-indicator ssim-indicator" style={{ width: `${entry.ssim * 100}%` }} />
      </div>

      <div className={`metric-card ber-card metric-fade ${isLoaded ? "is-visible" : ""}`} style={{ animationDelay: "100ms" }}>
        <div className="metric-icon ber-icon">BE</div>
        <div className="metric-content">
          <span className="metric-value">{formatBer(entry.ber)}</span>
          <span className="metric-label">BER</span>
        </div>
        <div className="metric-indicator ber-indicator" style={{ width: `${(1 - entry.ber) * 100}%` }} />
      </div>

      <div className={`metric-card payload-card metric-fade ${isLoaded ? "is-visible" : ""}`} style={{ animationDelay: "150ms" }}>
        <div className="metric-icon payload-icon">PL</div>
        <div className="metric-content">
          <span className="metric-value">{formatPayload(entry.payloadBpp)}</span>
          <span className="metric-label">Payload</span>
        </div>
        <div className="metric-indicator payload-indicator" style={{ width: `${(entry.payloadBpp / 1) * 100}%` }} />
      </div>

      <div className={`metric-card recovery-card metric-fade ${isLoaded ? "is-visible" : ""}`} style={{ animationDelay: "200ms" }}>
        <div className="metric-icon recovery-icon">RR</div>
        <div className="metric-content">
          <span className="metric-value">{formatRecoveryRate(entry.recoveryRate)}</span>
          <span className="metric-label">Recovery Rate</span>
        </div>
        <div className="metric-indicator recovery-indicator" style={{ width: `${entry.recoveryRate}%` }} />
      </div>

      <div className={`metric-card runtime-card metric-fade ${isLoaded ? "is-visible" : ""}`} style={{ animationDelay: "250ms" }}>
        <div className="metric-icon runtime-icon">RT</div>
        <div className="metric-content">
          <span className="metric-value">{formatRuntime(entry.runtimeMs)}</span>
          <span className="metric-label">Runtime</span>
        </div>
        <div className="metric-indicator runtime-indicator" style={{ width: `${Math.min((300 - entry.runtimeMs) / 300, 1) * 100}%` }} />
      </div>
    </div>
  );
}
