import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";
import { FiArrowRight, FiDatabase, FiMessageCircle, FiSearch, FiUsers } from "react-icons/fi";

const features = [
  { icon: FiSearch, eyebrow: "Explore", title: "Find your next answer", body: "Browse discussions, search by keyword, and filter by topic to find ideas shared by the community.", action: "Explore discussions", href: "/discussions", tone: "bg-indigo-50 text-indigo-700" },
  { icon: FiDatabase, eyebrow: "Community RAG", title: "Answers grounded in real discussions", body: "Ask the assistant to retrieve relevant questions and replies. Get a clear answer with links to its community sources.", action: "Try the knowledge assistant", href: "/ask/gemini", tone: "bg-cyan-50 text-cyan-700" },
  { icon: FiMessageCircle, eyebrow: "Connect", title: "Keep the conversation going", body: "Meet other members, start direct conversations, or collaborate in group chats.", action: "Open chat", href: "/chat", tone: "bg-violet-50 text-violet-700" },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="page">
      <div className="container-app space-y-10 sm:space-y-14">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-slate-950 px-6 py-12 text-white shadow-lift sm:px-12 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="hero-kicker">A place to think out loud</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Good questions spark <span className="hero-highlight">great ideas.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">A community to ask questions, share what you know, and find practical answers together—with AI that can search the knowledge you’ve already built.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn bg-white text-brand-700 shadow-sm hover:bg-brand-50" onClick={() => navigate("/discussions")}>Explore discussions <FiArrowRight /></button>
                <button type="button" className="btn border border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate("/ask/gemini")}><FiDatabase /> Try Community RAG</button>
                <button type="button" className="btn border border-white/25 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate("/chat")}><FaRocketchat /> Chat</button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:col-span-2">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl"><FiDatabase /></span><div><p className="text-sm font-bold">Community Knowledge Assistant</p><p className="mt-0.5 text-xs text-white/65">Retrieve · Ground · Cite</p></div></div>
                <p className="mt-4 text-sm leading-6 text-white/80">Ask about a topic and get an answer based on relevant discussions, with links back to the original posts.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><FiUsers className="text-xl text-cyan-200" /><p className="mt-3 text-sm font-bold">Learn together</p><p className="mt-1 text-xs leading-5 text-white/65">Questions and replies from the community.</p></div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><FaRocketchat className="text-xl text-violet-200" /><p className="mt-3 text-sm font-bold">Stay connected</p><p className="mt-1 text-xs leading-5 text-white/65">Direct and group conversations.</p></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="features-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">What you can do</p><h2 id="features-title" className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">One community, a few ways to move forward</h2></div><p className="max-w-md text-sm leading-6 text-slate-500">Explore, contribute, or get a quick evidence-backed overview of what people have discussed.</p></div>
          <div className="grid gap-4 lg:grid-cols-3">
            {features.map(({ icon: Icon, eyebrow, title, body, action, href, tone }) => <article key={title} className="card flex min-h-[260px] flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tone}`}><Icon /></span>
              <p className="eyebrow mt-5">{eyebrow}</p><h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{body}</p>
              <button type="button" className="mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-brand-700 hover:text-brand-900" onClick={() => navigate(href)}>{action}<FiArrowRight /></button>
            </article>)}
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div><p className="eyebrow">How it works</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">From a question to a useful next step</h2><p className="mt-3 text-sm leading-6 text-slate-600">Whether you need a person’s perspective or a quick synthesis, start with the path that fits.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[{ n: "01", title: "Explore", text: "Search questions and topics." }, { n: "02", title: "Contribute", text: "Ask, answer, and share experience." }, { n: "03", title: "Get context", text: "Use RAG to retrieve and cite related discussions." }].map((step) => <div key={step.n} className="rounded-2xl bg-slate-50 p-4"><span className="text-xs font-extrabold tracking-widest text-brand-600">{step.n}</span><h3 className="mt-2 font-bold text-slate-900">{step.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{step.text}</p></div>)}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl bg-brand-50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div><p className="text-lg font-extrabold text-slate-900">Have something to ask or share?</p><p className="mt-1 text-sm text-slate-600">Jump into the discussions and add your voice.</p></div>
          <button type="button" className="btn-primary shrink-0" onClick={() => navigate("/discussions")}>Go to discussions <FiArrowRight /></button>
        </section>
      </div>
      <footer className="mt-14 border-t border-slate-200 bg-white/80">
        <div className="container-app flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/" className="text-base font-extrabold tracking-tight text-slate-900">Discussion Hub</Link>
            <p className="mt-1 max-w-md text-sm leading-5 text-slate-500">Ask, share, and find useful answers with your community.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
            <Link className="hover:text-brand-700" to="/discussions">Discussions</Link>
            <Link className="hover:text-brand-700" to="/ask/gemini">Community RAG</Link>
            <Link className="hover:text-brand-700" to="/chat">Chat</Link>
            <Link className="hover:text-brand-700" to="/ask-share-ques">Ask / Share</Link>
          </nav>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Discussion Hub</p>
        </div>
      </footer>
    </main>
  );
};
