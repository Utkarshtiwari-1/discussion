import React from "react";
import { FiMessageCircle, FiUsers, FiZap } from "react-icons/fi";

export default function AuthShell({ children }) {
  return (
    <main className="auth-page min-h-screen px-4 pb-10 pt-24">
      <div className="auth-layout mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <aside className="auth-story hidden lg:block">
          <p className="eyebrow">A better way to figure things out</p>
          <h1 className="mt-4 max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-5xl">
            Good ideas get better when we share them.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
            Join thoughtful discussions, learn from real experiences, and find people working through the same questions.
          </p>
          <div className="mt-9 space-y-4">
            <div className="auth-feature"><FiMessageCircle /><span>Ask questions and compare perspectives</span></div>
            <div className="auth-feature"><FiUsers /><span>Build useful connections and group chats</span></div>
            <div className="auth-feature"><FiZap /><span>Get a helpful starting point from AI</span></div>
          </div>
          <div className="auth-story-mark mt-12">Discussion <span>·</span> Learn together</div>
        </aside>
        <section className="card auth-form-card">{children}</section>
      </div>
    </main>
  );
}
