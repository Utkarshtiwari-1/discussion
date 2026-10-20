import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowRight, FiArrowUpRight, FiMessageSquare, FiPlus, FiTag, FiThumbsUp } from "react-icons/fi";
import { getallposts } from "../service/operations";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function MyQueries() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadQueries() {
      setLoading(true);
      const posts = await getallposts();
      if (!active) return;
      if (!posts) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      const ownQueries = posts.filter((post) => {
        const authorId = post?.asker?._id || post?.asker;
        return authorId && user?._id && String(authorId) === String(user._id);
      });
      setQueries(ownQueries.reverse());
      setLoadError(false);
      setLoading(false);
    }
    loadQueries();
    return () => { active = false; };
  }, [user?._id, retry]);

  const totals = useMemo(() => queries.reduce((counts, query) => ({
    replies: counts.replies + (query?.answers?.length || 0),
    upvotes: counts.upvotes + (query?.upvotes?.length || 0),
  }), { replies: 0, upvotes: 0 }), [queries]);

  return (
    <main className="page my-queries-page">
      <div className="container-app max-w-5xl">
        <PageHeader
          eyebrow="Your contributions"
          title="My queries"
          description="Every question and idea you’ve shared with the community, all in one place."
          actions={<><Link to="/dashboard/my-profile" className="btn-secondary">Dashboard</Link><Link to="/ask-share-ques" className="btn-primary"><FiPlus aria-hidden="true" /> Ask a question</Link></>}
        />

        {loading ? (
          <div className="flex min-h-[340px] items-center justify-center" role="status" aria-label="Loading your queries"><div className="spinner" /></div>
        ) : loadError ? (
          <EmptyState title="Could not load your queries" description="Your discussions are temporarily unavailable. Try again in a moment." actionLabel="Try again" onAction={() => setRetry((value) => value + 1)} />
        ) : (
          <>
            <section className="my-queries-overview" aria-label="Query activity">
              <div className="my-queries-overview-copy"><span className="my-queries-overview-icon"><FiMessageSquare aria-hidden="true" /></span><div><p>Your community footprint</p><h2>{queries.length} {queries.length === 1 ? "query" : "queries"} shared</h2></div></div>
              <div className="my-queries-overview-stats"><span><FiMessageSquare aria-hidden="true" /> {totals.replies} replies</span><span><FiThumbsUp aria-hidden="true" /> {totals.upvotes} upvotes</span></div>
            </section>

            {queries.length === 0 ? (
              <div className="my-queries-empty-wrap"><EmptyState title="Your story starts with a question" description="Ask the community for help or share an idea others can build on." actionLabel="Create your first query" onAction={() => navigate("/ask-share-ques")} /></div>
            ) : (
              <section className="my-queries-list" aria-label="Your queries">
                {queries.map((query, index) => {
                  const title = query?.question?.problem || query?.problem || query?.problemStatement || query?.title || query?.question?.title || "Untitled query";
                  const titleWords = title.trim().split(/\s+/);
                  const displayTitle = titleWords.length > 35 ? `${titleWords.slice(0, 35).join(" ")}…` : title;
                  const description = query?.question?.problemdescription || query?.problemdescription || "No additional details were added.";
                  const tag = query?.question?.tags?.tagname || query?.tags?.tagname;
                  const href = query?._id ? `/discussions/${query._id}` : "/ask-share-ques";
                  return (
                    <Link to={href} className="my-query-card" key={query?._id || `${title}-${index}`} style={{ "--row-delay": `${Math.min(index, 8) * 45}ms` }}>
                      <span className="my-query-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="my-query-body">
                        <span className="my-query-title">{displayTitle}</span>
                        <span className="my-query-description">{description}</span>
                        <span className="my-query-meta">
                          {tag && <span className="my-query-tag"><FiTag aria-hidden="true" />{tag}</span>}
                          <span><FiMessageSquare aria-hidden="true" />{query?.answers?.length || 0} replies</span>
                          <span><FiThumbsUp aria-hidden="true" />{query?.upvotes?.length || 0} upvotes</span>
                        </span>
                      </span>
                      <span className="my-query-open" aria-label="Open query"><FiArrowUpRight aria-hidden="true" /></span>
                    </Link>
                  );
                })}
              </section>
            )}
            {queries.length > 0 && <div className="my-queries-bottom-link"><Link to="/ask-share-ques">Have another question? Start a new query <FiArrowRight aria-hidden="true" /></Link></div>}
          </>
        )}
      </div>
    </main>
  );
}
