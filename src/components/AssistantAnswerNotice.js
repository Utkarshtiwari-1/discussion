import React from "react";

const notices = {
  general_knowledge_fallback: {
    title: "⚠️ No relevant community information found",
    fallback: "This answer is generated from the AI model’s general knowledge, not from discussions on this platform. It may be inaccurate or incomplete; please verify important information.",
  },
  retrieval_unavailable_fallback: {
    title: "⚠️ Community search unavailable",
    fallback: "We couldn’t retrieve community discussions right now. This answer uses the AI model’s general knowledge and may be inaccurate.",
  },
};

export default function AssistantAnswerNotice({ answerMode, retrieval, warning, sources = [] }) {
  const mode = answerMode || (retrieval?.retrievalStatus === "retrieval_failed"
    ? "retrieval_unavailable_fallback"
    : retrieval?.fallbackToModelKnowledge
      ? "general_knowledge_fallback"
      : sources.length
        ? "community_grounded"
        : null);

  if (mode === "community_grounded") {
    return <>
      <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Based on community discussions</p>
      {warning && <div role="status" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        <strong className="block">Community evidence only partly answers this question</strong>
        <span className="mt-1 block">{warning}</span>
      </div>}
    </>;
  }
  const notice = notices[mode];
  if (!notice) return null;
  return <div role="status" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
    <strong className="block">{notice.title}</strong>
    <span className="mt-1 block">{warning || notice.fallback}</span>
  </div>;
}
