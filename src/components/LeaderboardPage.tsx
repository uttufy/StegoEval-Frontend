"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BenchmarkMetricTiles } from "@/components/BenchmarkMetricTiles";
import { GlobalRankingTable, type RankTrend } from "@/components/GlobalRankingTable";
import { LeaderboardCardsMobile } from "@/components/LeaderboardCardsMobile";
import { LeaderboardControls } from "@/components/LeaderboardControls";
import { LeaderboardHero } from "@/components/LeaderboardHero";
import { Pagination } from "@/components/Pagination";
import { PodiumWinnerCard } from "@/components/PodiumWinnerCard";
import {
  buildRankMap,
  filterEntries,
  getLeaderboardEntriesSync,
  paginateEntries,
  sortEntries
} from "@/lib/leaderboard";
import type { LeaderboardEntry, SortDirection, SortKey } from "@/types/leaderboard";

type ViewMode = "snapshot" | "full";

const DEFAULT_SORT_KEY: SortKey = "compositeScore";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";
const DEFAULT_PAGE_SIZE = 10;

function buildTrendMap(entries: LeaderboardEntry[]): Map<string, RankTrend> {
  return new Map(
    entries.map((entry, index) => {
      const mod = index % 5;
      if (mod === 0 || mod === 1) {
        return [entry.id, "up"] as const;
      }

      if (mod === 2) {
        return [entry.id, "down"] as const;
      }

      return [entry.id, "flat"] as const;
    })
  );
}

export function LeaderboardPage() {
  const rankingSectionRef = useRef<HTMLElement | null>(null);

  const [entries] = useState<LeaderboardEntry[]>(() => getLeaderboardEntriesSync());
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT_KEY);
  const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const rankSortedEntries = useMemo(() => sortEntries(entries, "rank", "asc"), [entries]);
  const rankById = useMemo(() => buildRankMap(entries), [entries]);
  const trendById = useMemo(() => buildTrendMap(rankSortedEntries), [rankSortedEntries]);

  const topThree = useMemo(() => rankSortedEntries.slice(0, 3), [rankSortedEntries]);

  const filteredEntries = useMemo(() => filterEntries(entries, query), [entries, query]);
  const sortedEntries = useMemo(
    () => sortEntries(filteredEntries, sortKey, sortDirection),
    [filteredEntries, sortDirection, sortKey]
  );

  const { pageItems, totalPages, page: safePage } = useMemo(
    () => paginateEntries(sortedEntries, page, pageSize),
    [sortedEntries, page, pageSize]
  );

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  function openFullRankings() {
    setViewMode("full");
    setTimeout(() => {
      if (rankingSectionRef.current && "scrollIntoView" in rankingSectionRef.current) {
        rankingSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      rankingSectionRef.current?.focus();
    }, 0);
  }

  function handleSortKeyChange(nextKey: SortKey) {
    setSortKey(nextKey);
    setPage(1);
  }

  function handleSortDirectionChange(nextDirection: SortDirection) {
    setSortDirection(nextDirection);
    setPage(1);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  return (
    <main className="page-shell">
      <LeaderboardHero onExploreRanking={openFullRankings} />
      <BenchmarkMetricTiles entries={entries} />
      <PodiumWinnerCard entries={topThree} rankById={rankById} />

      <section
        id="full-rankings"
        ref={rankingSectionRef}
        className={`full-rankings ${viewMode === "full" ? "is-visible" : "is-hidden"}`}
        tabIndex={-1}
        aria-label="Full LLM rankings"
      >
        <header className="ranking-header">
          <h2>Global Ranking</h2>
          <div className="ranking-header-actions">
            <LeaderboardControls
              query={query}
              onQueryChange={handleQueryChange}
              sortKey={sortKey}
              onSortKeyChange={handleSortKeyChange}
              sortDirection={sortDirection}
              onSortDirectionChange={handleSortDirectionChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </header>

        {viewMode === "snapshot" && (
          <div className="ranking-cta-wrap">
            <button type="button" className="button button-primary" onClick={openFullRankings}>
              View Full Rankings
            </button>
          </div>
        )}

        {viewMode === "full" && pageItems.length === 0 ? (
          <section className="status-panel" aria-live="polite">
            No models match your search. Try a provider name or model family.
          </section>
        ) : null}

        {viewMode === "full" && pageItems.length > 0 ? (
          <>
            <GlobalRankingTable entries={pageItems} rankById={rankById} trendById={trendById} />
            <LeaderboardCardsMobile entries={pageItems} rankById={rankById} trendById={trendById} />
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : null}
      </section>

      <section className="about-section" aria-label="About this project">
        <div className="about-card">
          <div className="about-copy">
            <h2>About StegoEval Leaderboard</h2>
            <p>
              This leaderboard presents comparative LLM rankings powered by benchmark results from
              StegoEval.
            </p>
            <ul className="about-list">
              <li>Benchmarking tool: StegoEval (open-source repository)</li>
              <li>Ranking dimensions: quality, cost efficiency, and latency</li>
              <li>Goal: transparent and repeatable model comparison for practical selection</li>
            </ul>
            <p className="about-links">
              Benchmark repository:{" "}
              <a href="https://github.com/uttufy/StegoEval" target="_blank" rel="noreferrer noopener">
                github.com/uttufy/StegoEval
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="contact-section" aria-label="Contact">
        <div className="contact-card">
          <div className="contact-copy">
            <h2>Contact</h2>
            <p>Built by Utkarsh Sharma. Open to collaboration.</p>
          </div>
          <div className="contact-actions">
            <a
              href="https://github.com/uttufy/StegoEval"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-link-cta"
            >
              <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8a8.01 8.01 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.53 7.53 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                />
              </svg>
              <span>View StegoEval Repository</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <p>© 2026 LLM Leaderboards</p>
          <div className="footer-links">
            <a href="https://github.com/uttufy/StegoEval" target="_blank" rel="noreferrer noopener">
              github.com/uttufy/StegoEval
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
