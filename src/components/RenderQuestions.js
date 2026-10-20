import { useEffect, useState } from "react";
import PaginatedItems from "../Paginationcomponents/PaginatedItems";
import { getallposts, getpostusingtagid } from "../service/operations";

const PAGE_SIZE = 10;

function RenderQuestions({ tagid, searchTerm = "", onClearSearch }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, search: searchTerm.trim() });
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSearch = searchTerm.trim();
      setPagination((current) => current.search === nextSearch ? current : { page: 0, search: nextSearch });
    }, 320);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    let active = true;
    async function loadPage() {
      setLoading(true);
      const offset = pagination.page * PAGE_SIZE;
      const result = tagid === "all"
        ? await getallposts(PAGE_SIZE, offset, pagination.search)
        : await getpostusingtagid(tagid, PAGE_SIZE, offset, pagination.search);
      if (!active) return;

      if (!result) {
        setItems([tagid === "all" ? "Could not load discussions" : "Could not load discussions for this topic"]);
        setHasMore(false);
        setTotal(null);
      } else {
        setItems(Array.isArray(result.items) ? result.items.slice(0, PAGE_SIZE) : []);
        setHasMore(Boolean(result.hasMore));
        setTotal(result.total != null && Number.isFinite(Number(result.total)) ? Number(result.total) : null);
      }
      setLoading(false);
    }
    loadPage();
    return () => { active = false; };
  }, [tagid, pagination, retry]);

  return (
    <div>
      <PaginatedItems
        items={items}
        searchTerm={pagination.search}
        onClearSearch={onClearSearch}
        itemsPerPage={PAGE_SIZE}
        loading={loading}
        page={pagination.page}
        hasMore={hasMore}
        total={total}
        onPageChange={(page) => setPagination((current) => ({ ...current, page }))}
        onRetry={() => setRetry((value) => value + 1)}
      />
    </div>
  );
}

export default RenderQuestions;
