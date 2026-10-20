import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiSearch, FiX } from "react-icons/fi";
import { getTags } from "../service/operations";
import RenderQuestions from "../components/RenderQuestions";

export const Discussions = () => {
  const [tagid, setTagid] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [alltags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getTags().then((result) => {
      if (!active) return;
      if (result) setAllTags(result);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      <div className="container-app">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 px-6 py-8 text-white shadow-lift sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="hero-kicker">Learn from each other</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Community discussions</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/75">Search questions, explore topics, and share what you’ve learned.</p></div>
            <button type="button" className="btn bg-white text-brand-700 shadow-sm hover:bg-brand-50" onClick={() => navigate("/ask-share-ques")}>Ask / Share <FiArrowUpRight /></button>
          </div>
        </section>

        <div className="discussion-toolbar mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Explore the community</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{searchTerm.trim() ? "Search discussions" : "Top discussions"}</h2></div>
          <div className="discussion-controls">
            <form className="discussion-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <FiSearch aria-hidden="true" />
              <label htmlFor="discussion-search-input" className="sr-only">Search discussions by topic or keyword</label>
              <input id="discussion-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search topics, questions…" />
              {searchTerm && <button type="button" aria-label="Clear search" onClick={() => setSearchTerm("")}><FiX aria-hidden="true" /></button>}
            </form>
            <div className="topic-filter-control">
              <label htmlFor="topic-filter" className="text-sm font-medium text-slate-600">Topic</label>
              {loading ? <p className="badge-neutral">Loading...</p> : <select id="topic-filter" className="select !w-auto min-w-[140px]" value={tagid} onChange={(event) => setTagid(event.target.value)}>
                <option value="all">All</option>
                {alltags.map((tag) => <option key={tag._id} value={tag._id}>{tag.tagname}</option>)}
              </select>}
            </div>
          </div>
        </div>
        <div className="pt-4"><RenderQuestions key={tagid} tagid={tagid} searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} /></div>
      </div>
    </div>
  );
};
