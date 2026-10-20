import Items from "./Items";

function PaginatedItems({ items, loading, onRetry, page, onPageChange, hasMore, total, itemsPerPage = 10, searchTerm = "", onClearSearch }) {
  const pageNumber = page + 1;
  const pageCount = !searchTerm && Number.isFinite(total) ? Math.max(1, Math.ceil(total / itemsPerPage)) : null;
  const canGoNext = hasMore && (!pageCount || pageNumber < pageCount);

  return (
    <div>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center py-24" role="status" aria-label="Loading discussions"><div className="spinner" /></div>
      ) : (
        <Items currentItems={items} onRetry={onRetry} searchTerm={searchTerm} onClearSearch={onClearSearch} />
      )}
      {!loading && (pageNumber > 1 || canGoNext) && (
        <nav className="server-pagination" aria-label="Discussion pages">
          <button type="button" className="btn-secondary btn-sm" onClick={() => onPageChange(page - 1)} disabled={page === 0 || loading}>Previous</button>
          <span>{pageCount ? `Page ${pageNumber} of ${pageCount}` : `Page ${pageNumber}`}{!searchTerm && Number.isFinite(total) ? ` · ${total} discussions` : ""}</span>
          <button type="button" className="btn-secondary btn-sm" onClick={() => onPageChange(page + 1)} disabled={!canGoNext || loading}>Next</button>
        </nav>
      )}
    </div>
  );
}

export default PaginatedItems;
