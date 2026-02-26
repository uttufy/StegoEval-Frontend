"use client";

import Link from "next/link";
import { formatLastEvaluated } from "@/lib/leaderboard";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { AttackRadarChart } from "@/components/AttackRadarChart";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { useParallax } from "@/hooks/useParallax";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMagneticHover } from "@/hooks/useParallax";
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
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasAttackScores =
    entry.compressionScore !== undefined ||
    entry.blurScore !== undefined ||
    entry.noiseScore !== undefined ||
    entry.geometricScore !== undefined ||
    entry.capacityScore !== undefined;

  const heroParallax = useParallax(8);
  const heroRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const perfRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const attackRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const detailsRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const scoreInfoRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });
  const downloadsRef = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  const downloadMagnetic1 = useMagneticHover<HTMLAnchorElement>(5);
  const downloadMagnetic2 = useMagneticHover<HTMLAnchorElement>(5);
  const downloadMagnetic3 = useMagneticHover<HTMLAnchorElement>(5);
  const downloadMagnetic4 = useMagneticHover<HTMLAnchorElement>(5);

  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="technique-detail-page">
      {/* Floating Header Bar */}
      <nav className={`floating-header ${headerScrolled ? "is-scrolled" : ""}`}>
        <Link href="/" className="floating-back">
          <svg className="back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>
        <div className="floating-nav-links">
          <a href="#about" className="floating-nav-link" onClick={scrollToSection("about")}>
            <span>About</span>
          </a>
          <a href="#metrics" className="floating-nav-link" onClick={scrollToSection("metrics")}>
            <span>Metrics</span>
          </a>
          {hasAttackScores && (
            <a href="#resilience" className="floating-nav-link" onClick={scrollToSection("resilience")}>
              <span>Resilience</span>
            </a>
          )}
          <a href="#specs" className="floating-nav-link" onClick={scrollToSection("specs")}>
            <span>Specs</span>
          </a>
          <a href="#score-info" className="floating-nav-link" onClick={scrollToSection("score-info")}>
            <span>Scoring</span>
          </a>
          <a href="#downloads" className="floating-nav-link" onClick={scrollToSection("downloads")}>
            <span>Downloads</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef.ref}>
        <header
          ref={heroParallax.ref}
          className={`hero-section ${heroRef.isVisible ? "is-visible" : ""}`}
          style={{
            transform: `translate(${heroParallax.transform.x}px, ${heroParallax.transform.y}px) rotateX(${heroParallax.transform.rotateX}deg) rotateY(${heroParallax.transform.rotateY}deg)`,
          }}
        >
          <div className="hero-content">
            <div className="hero-rank-badge">
              <div className="rank-ring">
                <svg viewBox="0 0 80 80" className="rank-ring-svg">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="var(--mint-1)" strokeWidth="2" opacity="0.2" />
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none" stroke="var(--mint-1)" strokeWidth="3"
                    strokeDasharray="226"
                    strokeDashoffset="226"
                    className="rank-ring-animate"
                  />
                </svg>
                <span className="rank-number-hero">#{rank}</span>
              </div>
            </div>

            <div className="hero-main">
              <h1 className="hero-title">{entry.algorithmName}</h1>
              <div className="hero-meta">
                <span className="hero-chip">{profileInitials(entry.datasetProfile)}</span>
                <span className="hero-profile">{entry.datasetProfile}</span>
                {entry.algorithmFamily && (
                  <>
                    <span className="hero-separator">·</span>
                    <span className="hero-family">{entry.algorithmFamily}</span>
                  </>
                )}
              </div>
            </div>

            <div className="hero-score-card">
              <div className="score-glow" />
              <div className="score-content">
                <span className="score-value-hero">{entry.compositeScore.toFixed(1)}</span>
                <span className="score-label-hero">StegoEval Score</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {entry.description && (
        <section id="about" className={`info-section ${heroRef.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title-elegant">About This Algorithm</h2>
          <div className="glass-card-elegant">
            <p className="info-description-elegant">{entry.description}</p>
          </div>
        </section>
      )}

      {/* Performance Rings Section */}
      <section id="metrics" ref={perfRef.ref} className={`performance-section ${perfRef.isVisible ? "is-visible" : ""}`}>
        <h2 className="section-title-elegant">Performance Metrics</h2>
        <PerformanceMetrics entry={entry} />
      </section>

      {/* Attack Radar Section */}
      {hasAttackScores && (
        <section id="resilience" ref={attackRef.ref} className={`attack-section ${attackRef.isVisible ? "is-visible" : ""}`}>
          <h2 className="section-title-elegant">Attack Resilience</h2>
          <div className="radar-wrapper">
            <AttackRadarChart entry={entry} />
          </div>
        </section>
      )}

      {/* Details Section */}
      <section id="specs" ref={detailsRef.ref} className={`details-section-elegant ${detailsRef.isVisible ? "is-visible" : ""}`}>
        <h2 className="section-title-elegant">Technical Specifications</h2>
        <div className="specs-grid">
          <SpecCard label="Algorithm ID" value={entry.id} />
          <SpecCard label="Dataset Profile" value={entry.datasetProfile} />
          {entry.algorithmFamily && <SpecCard label="Algorithm Family" value={entry.algorithmFamily} />}
          <SpecCard label="Runtime" value={`${Math.round(entry.runtimeMs)} ms`} />
          <SpecCard label="Last Evaluated" value={formatLastEvaluated(entry.lastEvaluatedIso)} />
        </div>
      </section>

      {/* Score Calculation Info */}
      <section id="score-info" ref={scoreInfoRef.ref} className={`score-info-section ${scoreInfoRef.isVisible ? "is-visible" : ""}`}>
        <h2 className="section-title-elegant">How the Score is Calculated</h2>
        <div className="score-info-content">
          {/* Main Formula Card */}
          <div className="score-formula-card">
            <div className="formula-glow" />
            <div className="formula-header">
              <IconCalculator />
              <span>Weighted Formula</span>
            </div>
            <div className="formula-main-enhanced">
              <span className="formula-label-text">Overall Score</span>
              <span className="formula-equals">=</span>
              <span className="formula-component distortion">Distortion</span>
              <span className="formula-times">×</span>
              <span className="formula-weight">0.4</span>
              <span className="formula-plus">+</span>
              <span className="formula-component robustness">Robustness</span>
              <span className="formula-times">×</span>
              <span className="formula-weight">0.6</span>
            </div>
            <p className="formula-subtitle">
              Balancing imperceptibility and survivability for optimal steganographic performance
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="score-breakdown-grid">
            <div className="score-breakdown-card">
              <div className="breakdown-header">
                <div className="breakdown-icon distortion-icon">
                  <IconEye />
                </div>
                <div className="breakdown-title-area">
                  <span className="breakdown-label">Distortion</span>
                  <span className="breakdown-weight">40% weight</span>
                </div>
              </div>
              <div className="breakdown-formula">
                <span className="formula-highlight">SSIM × 100 × 0.7</span>
                <span className="formula-plus-mini">+</span>
                <span className="formula-highlight">PSNR × 0.3</span>
              </div>
              <div className="breakdown-metrics">
                <div className="breakdown-metric">
                  <span className="metric-name">SSIM</span>
                  <span className="metric-desc">Structural similarity</span>
                </div>
                <div className="breakdown-metric">
                  <span className="metric-name">PSNR</span>
                  <span className="metric-desc">Signal-to-noise ratio</span>
                </div>
              </div>
            </div>

            <div className="score-breakdown-card">
              <div className="breakdown-header">
                <div className="breakdown-icon robustness-icon">
                  <IconShield />
                </div>
                <div className="breakdown-title-area">
                  <span className="breakdown-label">Robustness</span>
                  <span className="breakdown-weight">60% weight</span>
                </div>
              </div>
              <div className="breakdown-formula">
                <span className="formula-highlight">(1 - BER) × 100</span>
              </div>
              <div className="breakdown-metrics">
                <div className="breakdown-metric">
                  <span className="metric-name">BER</span>
                  <span className="metric-desc">Bit error rate</span>
                </div>
                <div className="breakdown-metric">
                  <span className="metric-name">Recovery</span>
                  <span className="metric-desc">Payload survival</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learn More Card */}
          <a
            href="https://uttufy.github.io/StegoEval/"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-more-card"
          >
            <div className="learn-more-icon">
              <IconBook />
            </div>
            <div className="learn-more-content">
              <span className="learn-more-title">Learn More</span>
              <span className="learn-more-desc">View the complete StegoEval documentation</span>
            </div>
            <div className="learn-more-arrow">
              <IconExternalLink />
            </div>
          </a>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" ref={downloadsRef.ref} className={`downloads-section-elegant ${downloadsRef.isVisible ? "is-visible" : ""}`}>
        <h2 className="section-title-elegant">Downloads</h2>
        <div className="downloads-grid-2x2">
          <DownloadCard
            ref={downloadMagnetic1.ref}
            magnetic={downloadMagnetic1.magnetic}
            icon={<IconFileCSV />}
            label="Algorithm Scores"
            description="Comprehensive score breakdown for this algorithm"
            format="CSV"
            size="12 KB"
            file={`scores-${entry.algorithmName.replace(/\s+/g, '-').toLowerCase()}.csv`}
            url={`/api/download?file=scores-test-run.csv&algorithm=${encodeURIComponent(entry.algorithmName)}`}
          />
          <DownloadCard
            ref={downloadMagnetic2.ref}
            magnetic={downloadMagnetic2.magnetic}
            icon={<IconChartLine />}
            label="Category Scores"
            description="Performance breakdown by attack type"
            format="CSV"
            size="8 KB"
            file={`scores-by-category-${entry.algorithmName.replace(/\s+/g, '-').toLowerCase()}.csv`}
            url={`/api/download?file=scores-test-run-by-category.csv&algorithm=${encodeURIComponent(entry.algorithmName)}`}
          />
          <DownloadCard
            ref={downloadMagnetic3.ref}
            magnetic={downloadMagnetic3.magnetic}
            icon={<IconTable />}
            label="Full Results"
            description="Complete evaluation data with all metrics"
            format="CSV"
            size="45 KB"
            file={`results-${entry.algorithmName.replace(/\s+/g, '-').toLowerCase()}.csv`}
            url={`/api/download?file=results-test-run.csv&algorithm=${encodeURIComponent(entry.algorithmName)}`}
          />
          <DownloadCard
            ref={downloadMagnetic4.ref}
            magnetic={downloadMagnetic4.magnetic}
            icon={<IconFileMD />}
            label="Summary Report"
            description="Human-readable markdown summary"
            format="MD"
            size="3 KB"
            file={`summary-${entry.algorithmName.replace(/\s+/g, '-').toLowerCase()}.md`}
            url={`/api/download?file=summary-test-run.md&algorithm=${encodeURIComponent(entry.algorithmName)}`}
          />
        </div>
      </section>
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-card">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  );
}

function DownloadCard({
  ref,
  magnetic,
  icon,
  label,
  description,
  format,
  size,
  file,
  url,
}: {
  ref: React.RefObject<HTMLAnchorElement | null>;
  magnetic: { x: number; y: number };
  icon: React.ReactNode;
  label: string;
  description: string;
  format: string;
  size: string;
  file: string;
  url: string;
}) {
  return (
    <a
      ref={ref}
      href={url}
      className="download-card-enhanced"
      download={file}
      style={{ transform: `translate(${magnetic.x}px, ${magnetic.y}px)` }}
    >
      <div className="download-card-icon">{icon}</div>
      <div className="download-card-content">
        <span className="download-card-title">{label}</span>
        <span className="download-card-desc">{description}</span>
        <div className="download-card-meta">
          <span className="download-card-badge">{format}</span>
          <span className="download-card-size">{size}</span>
        </div>
      </div>
      <div className="download-card-arrow">
        <IconDownload />
      </div>
    </a>
  );
}

// SVG Icons
function IconChartBar() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4h14a2 2 0 012 0v12a2 2 0 01-2-2H5a2 2 0 01-2-2V6a2 2 0 012-0h12z" />
      <rect x="6" y="10" width="2" height="4" rx="0.5" />
      <rect x="10" y="7" width="2" height="7" rx="0.5" />
      <rect x="14" y="5" width="2" height="9" rx="0.5" />
    </svg>
  );
}

function IconChartLine() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 17h14a1 1 0 011-1v-8H5v8h12z" />
      <path d="M6 5h2v6H6zM9 8h2v3H9zM12 6h2v5h12zM15 4h2v7h15z" />
    </svg>
  );
}

function IconTable() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M3 7h14M3 11h14M7 3v14M11 3v14" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 3h8l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M12 3v4h4M8 10h4M8 13h4" />
    </svg>
  );
}

function IconFileCSV() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h10l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path d="M14 4v6h6" />
      <path d="M8 13v1.5M8 16.5a1.5 1.5 0 003 0v-1.5a1.5 1.5 0 00-3 0M16 15a1.5 1.5 0 01-1.5 1.5h0a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5h0a1.5 1.5 0 011.5 1.5" />
    </svg>
  );
}

function IconFileMD() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h10l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
      <path d="M14 4v6h6" />
      <path d="M8 16V13l1.5 2 1.5-2v3M14 13v3l2-1.5L14 13z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v12M12 16l-4-4M12 16l4-4" />
      <path d="M4 20h16" strokeLinecap="round" />
    </svg>
  );
}

function IconCalculator() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="6" y="4" width="12" height="5" rx="1" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <circle cx="16" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}
