interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Leaderboard pagination" className="pagination">
      <button
        type="button"
        className="button button-light"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Go to previous page"
      >
        Previous
      </button>
      <p>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </p>
      <button
        type="button"
        className="button button-light"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
