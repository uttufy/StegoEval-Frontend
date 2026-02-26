import type { SortDirection, SortKey } from "@/types/leaderboard";

interface LeaderboardControlsProps {
  query: string;
  onQueryChange: (value: string) => void;
  sortKey: SortKey;
  onSortKeyChange: (value: SortKey) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (value: SortDirection) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function LeaderboardControls({
  query,
  onQueryChange,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onSortDirectionChange,
  pageSize,
  onPageSizeChange
}: LeaderboardControlsProps) {
  return (
    <section className="ranking-head-controls" aria-label="Ranking controls">
      <label className="mini-field" htmlFor="sort-key">
        <span>Sort by</span>
        <select
          id="sort-key"
          value={sortKey}
          onChange={(event) => onSortKeyChange(event.target.value as SortKey)}
          aria-label="Sort key"
        >
          <option value="rank">Rank</option>
          <option value="compositeScore">Composite</option>
          <option value="psnrDb">PSNR (dB)</option>
          <option value="ssim">SSIM</option>
          <option value="ber">BER</option>
          <option value="payloadBpp">Payload (bpp)</option>
          <option value="recoveryRate">Recovery Rate</option>
          <option value="lastEvaluated">Last Evaluated</option>
        </select>
      </label>

      <label className="mini-field" htmlFor="sort-direction">
        <span>Direction</span>
        <select
          id="sort-direction"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value as SortDirection)}
          aria-label="Sort direction"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </label>

      <label className="mini-field" htmlFor="page-size">
        <span>Rows</span>
        <select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Rows per page"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </label>

      <label className="mini-field search-field" htmlFor="algorithm-search">
        <span className="sr-only">Search by algorithm or profile</span>
        <input
          id="algorithm-search"
          type="search"
          placeholder="Search by algorithm or profile"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="Search algorithms"
        />
      </label>
    </section>
  );
}
